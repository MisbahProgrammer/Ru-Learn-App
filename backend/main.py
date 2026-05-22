import os
import json
import asyncio
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, Header, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Use standard FastAPI & Supabase clients
from supabase import create_client, Client
from google import genai
from google.genai import types

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Russian Scholar API",
    description="FastAPI Backend for Live Language Practice Scenario Chatbot",
    version="1.0.0"
)

# 1. CORE SETUP & SECURITY (CORSMiddleware)
# Configure CORS to allow connection from the Vercel frontend or local environments.
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://russian-scholar.vercel.app",  # Add your deployed Vercel domain here
    "*",  # Wildcard allowed as specified for high accessibility, update in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. CLIENT SEGMENT INITIALIZATION (SUPABASE & GOOGLE GENAI)
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY") or os.getenv("VITE_SUPABASE_ANON_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    print("Warning: Supabase credentials are not fully set in the environment variables.")
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Always initialize Gemini Client with named parameters
if not GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY environment variable is missing.")
    ai_client = None
else:
    # Explicit user-agent 'aistudio-build' is set for proper system tracking
    ai_client = genai.Client(api_key=GEMINI_API_KEY)


# 3. REQUEST SCHEMA MODELS
class ChatMessage(BaseModel):
    role: str = Field(..., description="Role of the sender: 'user' or 'model'")
    text: str = Field(..., description="The textual content of the message")

class ChatRequest(BaseModel):
    user_message: str = Field(..., description="The message sent by the user just now")
    scenario_id: str = Field("supermarket", description="The ID of the practicing scenario")
    jwt_token: str = Field(..., description="The JWT auth token from Supabase frontend client")
    chat_history: List[ChatMessage] = Field(
        default=[], 
        description="List of prior messages in the active chat session"
    )


# 4. BACKGROUND PERSISTENCE TASK
def save_chat_to_supabase(
    user_id: str, 
    scenario_id: str, 
    user_msg: str, 
    ai_response: str
):
    """
    Background Task: Saves final chat record to Supabase without blocking the SSE stream.
    Requires a 'chat_logs' table in Supabase.
    """
    try:
        if not SUPABASE_URL or not SUPABASE_ANON_KEY:
            print("Supabase config missing, skipping database persistence.")
            return

        payload = {
            "user_id": user_id,
            "scenario_id": scenario_id,
            "user_message": user_msg,
            "ai_response": ai_response,
        }
        
        # Save to Supabase using the python client
        print(f"Saving chat log to Supabase for user: {user_id}")
        supabase.table("chat_logs").insert(payload).execute()
        print("Successfully saved chat log to database.")
    except Exception as e:
        print(f"Error saving chat log to database: {str(e)}")


# 5. STREAMING GENERATOR FOR SERVER-SENT EVENTS (SSE)
async def gemini_stream_generator(
    system_prompt: str,
    formatted_contents: List[dict],
    user_id: str,
    scenario_id: str,
    user_message: str,
    background_tasks: BackgroundTasks
):
    """
    Asynchronous generator which calls Gemini API in stream mode and yields
    Server-Sent Events back to the caller in real-time.
    Once finished, registers background task to persist the chat to the DB.
    """
    if not ai_client:
        yield f"data: {json.dumps({'error': 'Gemini API client is not initialized.'})}\n\n"
        return

    full_ai_response = ""
    try:
        # Request content stream from Gemini 3.5 Flash
        response_stream = ai_client.models.generate_content_stream(
            model="gemini-3.5-flash",
            contents=formatted_contents,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.7,
            )
        )

        for chunk in response_stream:
            # Safely grab the chunk text
            chunk_text = chunk.text
            if chunk_text:
                full_ai_response += chunk_text
                # SSE Event Format: data: {"text": "chunk_part"}
                yield f"data: {json.dumps({'text': chunk_text})}\n\n"
                # Keep loop open yielding quickly
                await asyncio.sleep(0.01)

        # SSE Signal indicating the stream is completed
        yield "data: [DONE]\n\n"

        # Register the database save as a background task so client receives the entire stream instantly
        if full_ai_response:
            background_tasks.add_task(
                save_chat_to_supabase,
                user_id=user_id,
                scenario_id=scenario_id,
                user_msg=user_message,
                ai_response=full_ai_response
            )

    except Exception as e:
        print(f"AI Streaming Generation Error: {str(e)}")
        yield f"data: {json.dumps({'error': str(e)})}\n\n"


# 6. SYSTEM PROMPT REGISTRY
SCENARIO_PROMPTS = {
    "supermarket": (
        "You are a tired but polite cashier at a Pyaterochka supermarket in St. Petersburg. "
        "A foreign student is trying to buy groceries. Speak only in simple, everyday Russian. "
        "Keep replies very short (1 to 2 sentences max). Start the conversation by asking if they need a plastic bag."
    ),
    "taxi": (
        "You are an energetic taxi driver in Novosibirsk. A foreign student wants a ride to the university. "
        "Speak in direct, simple Russian with typical Russian taxi demeanor: talkative but warm. "
        "Keep replies short (1 to 2 sentences). Ask them where they are going first."
    ),
    "cafe": (
        "You are a friendly barista at a popular coffee shop in Moscow. A student is ordering breakfast. "
        "Speak in polite, welcoming Russian. Keep replies very short (1 to 2 sentences max) and prompt them for their order."
    )
}


# 7. THE CHAT ENDPOINT (POST /api/chat)
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest, background_tasks: BackgroundTasks):
    # Step 1: Verify the Supabase JWT token received from client
    if not supabase:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase is not initialized on this server."
        )

    try:
        # Call supabase auth to check and extract valid user
        user_response = supabase.auth.get_user(request.jwt_token)
        user = user_response.user
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization token."
            )
        user_id = user.id
    except Exception as err:
        print(f"Token validation failed: {str(err)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Invalid JWT or expired session."
        )

    # Step 2: Select the hidden system prompt according to the scenario
    system_prompt = SCENARIO_PROMPTS.get(request.scenario_id, SCENARIO_PROMPTS["supermarket"])

    # Step 3: Handle Token Memory. Keep only the last 4 messages from history to respect context limits
    recent_history = request.chat_history[-4:] if request.chat_history else []

    # Map our Schema models to the SDK-expected contents array format
    formatted_contents = []
    for msg in recent_history:
        # Convert past message roles: Supabase client uses standard 'user' and 'model' representation
        sdk_role = "user" if msg.role == "user" else "model"
        formatted_contents.append({"role": sdk_role, "parts": [{"text": msg.text}]})

    # Append current incoming user message
    formatted_contents.append({"role": "user", "parts": [{"text": request.user_message}]})

    # Step 4: Stream the Real-Time Generator Response
    return StreamingResponse(
        gemini_stream_generator(
            system_prompt=system_prompt,
            formatted_contents=formatted_contents,
            user_id=user_id,
            scenario_id=request.scenario_id,
            user_message=request.user_message,
            background_tasks=background_tasks
        ),
        media_type="text/event-stream"
    )


# 8. HEALTH CHECK
@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Russian Scholar Python Backend"}


if __name__ == "__main__":
    import uvicorn
    # Start server on standard Node dev-port proxy mappings (configured natively)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
