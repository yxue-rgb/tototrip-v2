-- Fix: Add INSERT policy for users table
-- This allows users to create their own profile when signing up

CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
