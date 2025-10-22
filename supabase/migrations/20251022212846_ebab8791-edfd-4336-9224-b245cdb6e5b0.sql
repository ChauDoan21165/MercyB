-- Create private_chat_requests table
CREATE TABLE IF NOT EXISTS public.private_chat_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'ignored')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(sender_id, receiver_id, room_id)
);

-- Enable RLS
ALTER TABLE public.private_chat_requests ENABLE ROW LEVEL SECURITY;

-- Users can create their own requests
CREATE POLICY "Users can create chat requests"
ON public.private_chat_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

-- Users can view requests they're involved in
CREATE POLICY "Users can view their requests"
ON public.private_chat_requests
FOR SELECT
TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Receivers can update request status
CREATE POLICY "Receivers can update request status"
ON public.private_chat_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = receiver_id);

-- Create private_messages table
CREATE TABLE IF NOT EXISTS public.private_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES public.private_chat_requests(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

-- Users can insert messages they send
CREATE POLICY "Users can send messages"
ON public.private_messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

-- Users can view messages they're involved in
CREATE POLICY "Users can view their messages"
ON public.private_messages
FOR SELECT
TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can update read status of messages they receive
CREATE POLICY "Users can mark messages as read"
ON public.private_messages
FOR UPDATE
TO authenticated
USING (auth.uid() = receiver_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_private_chat_request_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_private_chat_requests_timestamp
BEFORE UPDATE ON public.private_chat_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_private_chat_request_timestamp();

-- Enable realtime for private messaging
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_chat_requests;