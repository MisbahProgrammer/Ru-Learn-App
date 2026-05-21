-- SUPABASE DATABASE SCHEMA FOR RUSSIAN SCHOLAR
-- Copy & Run this script in your Supabase SQL Editor (https://supabase.com dashboard under SQL Editor)

-- 1. Create the `users` table to store custom user profiles & memberships
CREATE TABLE IF NOT EXISTS public.users (
    uid UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    "displayName" TEXT,
    "trialStartDate" TIMESTAMPTZ DEFAULT NOW(),
    "isPremium" BOOLEAN DEFAULT FALSE,
    "premiumUntil" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "billingHistory" JSONB DEFAULT '[]'::jsonb
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Create Security Policies for `users`
-- Allow users to read their own profile
CREATE POLICY "Users can read their own profiles" 
ON public.users 
FOR SELECT 
USING (auth.uid() = uid);

-- Allow users to create their own profile during signup
CREATE POLICY "Users can insert their own profiles" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = uid);

-- Allow users to update their own profile (e.g., updates, subscription upgrades)
CREATE POLICY "Users can update their own profiles" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = uid);


-- 3. Create the `lectures` table
CREATE TABLE IF NOT EXISTS public.lectures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    thumbnail TEXT,
    "videoUrl" TEXT,
    type TEXT, -- e.g., 'free' or 'premium'
    category TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on `lectures`
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies for `lectures`
-- Anyone (signed in or anonymous) can view lectures
CREATE POLICY "Anyone can view lectures"
ON public.lectures
FOR SELECT
USING (true);

-- Only Admin can insert/delete lectures (Admin email verified)
CREATE POLICY "Only Admin can insert lectures"
ON public.lectures
FOR INSERT
WITH CHECK (
    auth.jwt() ->> 'email' = 'misbahrehman891@gmail.com'
);

CREATE POLICY "Only Admin can update lectures"
ON public.lectures
FOR UPDATE
USING (
    auth.jwt() ->> 'email' = 'misbahrehman891@gmail.com'
);

CREATE POLICY "Only Admin can delete lectures"
ON public.lectures
FOR DELETE
USING (
    auth.jwt() ->> 'email' = 'misbahrehman891@gmail.com'
);


-- 5. Automate profile creation from Supabase Auth signup (Optional trigger, but highly recommended)
-- This automatically inserts a row in public.users when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (uid, email, "displayName", "trialStartDate", "isPremium", "createdAt", "billingHistory")
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
        NOW(),
        FALSE,
        NOW(),
        '[]'::jsonb
    )
    ON CONFLICT (uid) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
