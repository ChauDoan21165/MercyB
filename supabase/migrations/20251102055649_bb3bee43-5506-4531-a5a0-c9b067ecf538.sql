-- Fix profiles RLS policies to allow necessary features
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Allow users to view their own profiles
CREATE POLICY "users_view_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "admins_view_all_profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow VIP3 users to view other VIP3 profiles for matchmaking
CREATE POLICY "vip3_mutual_visibility"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_subscriptions us
    JOIN subscription_tiers st ON us.tier_id = st.id
    WHERE us.user_id = auth.uid()
    AND st.name = 'VIP3'
    AND us.status = 'active'
  ) 
  AND 
  EXISTS (
    SELECT 1 FROM user_subscriptions us2
    JOIN subscription_tiers st2 ON us2.tier_id = st2.id
    WHERE us2.user_id = profiles.id
    AND st2.name = 'VIP3'
    AND us2.status = 'active'
  )
);

-- Allow users in accepted private chats to see each other's profiles
CREATE POLICY "chat_participants_view_profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM private_chat_requests pcr
    WHERE pcr.status = 'accepted'
    AND (pcr.sender_id = auth.uid() OR pcr.receiver_id = auth.uid())
    AND (pcr.sender_id = profiles.id OR pcr.receiver_id = profiles.id)
  )
);

-- Allow users to update their own profile
CREATE POLICY "users_update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "users_insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Add RLS policies for payment-proofs storage bucket
-- Allow users to view only their own payment proofs
CREATE POLICY "users_view_own_payment_proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- Allow admins to view all payment proofs
CREATE POLICY "admins_view_all_payment_proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow users to insert only to their own folder
CREATE POLICY "users_insert_own_payment_proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment-proofs'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- Allow users to update their own payment proofs
CREATE POLICY "users_update_own_payment_proofs"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own payment proofs
CREATE POLICY "users_delete_own_payment_proofs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'payment-proofs'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);