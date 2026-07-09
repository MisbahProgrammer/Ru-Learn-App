-- SUPABASE DATABASE SCHEMA FOR RUSSIAN SCHOLAR
-- Copy & Run this script in your Supabase SQL Editor (https://supabase.com dashboard under SQL Editor)

-- =========================================================================
-- SPECIAL NOTE FOR EXISTING DATABASES:
-- If you ALREADY have the `users` table created from an older version,
-- run these ALTER TABLE statements to add the missing columns immediately:
--
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "country" TEXT;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "phone_number" TEXT;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "learning_reason" TEXT;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "bio" TEXT;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "avatar_url" TEXT;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "streak_count" INTEGER DEFAULT 0;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "last_activity_date" TIMESTAMPTZ;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "longest_streak" INTEGER DEFAULT 0;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "week_activity" JSONB DEFAULT '{}'::jsonb;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "daily_goal_minutes" INTEGER DEFAULT 10;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "lessons_completed" JSONB DEFAULT '{}'::jsonb;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "xp_points" INTEGER DEFAULT 0;
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "is_premium" BOOLEAN DEFAULT FALSE;
-- =========================================================================

-- 1. Create the `users` table to store custom user profiles & memberships
CREATE TABLE IF NOT EXISTS public.users (
    uid UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    "displayName" TEXT,
    "trialStartDate" TIMESTAMPTZ DEFAULT NOW(),
    "isPremium" BOOLEAN DEFAULT FALSE,
    "premiumUntil" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "billingHistory" JSONB DEFAULT '[]'::jsonb,
    country TEXT,
    phone_number TEXT,
    learning_reason TEXT,
    bio TEXT,
    avatar_url TEXT,
    streak_count INTEGER DEFAULT 0,
    last_activity_date TIMESTAMPTZ,
    longest_streak INTEGER DEFAULT 0,
    week_activity JSONB DEFAULT '{}'::jsonb,
    daily_goal_minutes INTEGER DEFAULT 10,
    lessons_completed JSONB DEFAULT '{}'::jsonb,
    xp_points INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Create Security Policies for `users`
-- Allow anyone to read basic user profiles for the community board
CREATE POLICY "Anyone can read user profiles" 
ON public.users 
FOR SELECT 
USING (true);

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


-- 6. Create the `feedback` table to store users feedback submissions
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    feedback TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on `feedback`
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 7. Create Security Policies for `feedback`
-- Allow any user (authenticated or anonymous/guest) to submit feedback
CREATE POLICY "Anyone can submit feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (true);

-- Only Admin can view submitted feedback (Admin email: misbahrehman891@gmail.com)
CREATE POLICY "Only Admin can view feedback" 
ON public.feedback 
FOR SELECT 
USING (
    auth.jwt() ->> 'email' = 'misbahrehman891@gmail.com'
);
