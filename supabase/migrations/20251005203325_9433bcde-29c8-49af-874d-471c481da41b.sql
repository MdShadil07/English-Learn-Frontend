-- Create voice rooms table
CREATE TABLE public.voice_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN NOT NULL DEFAULT true,
  password TEXT,
  max_participants INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create room participants table
CREATE TABLE public.room_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.voice_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_speaking BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(room_id, user_id)
);

-- Create connection requests table
CREATE TABLE public.connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sender_id, receiver_id)
);

-- Create connections table (for accepted connections)
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CHECK (user1_id < user2_id),
  UNIQUE(user1_id, user2_id)
);

-- Create daily words table
CREATE TABLE public.daily_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  definition TEXT NOT NULL,
  part_of_speech TEXT,
  example_sentences TEXT[] NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(date, word)
);

-- Enable RLS
ALTER TABLE public.voice_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_words ENABLE ROW LEVEL SECURITY;

-- RLS Policies for voice_rooms
CREATE POLICY "Anyone can view public rooms" ON public.voice_rooms
  FOR SELECT USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can create rooms" ON public.voice_rooms
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their rooms" ON public.voice_rooms
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their rooms" ON public.voice_rooms
  FOR DELETE USING (auth.uid() = creator_id);

-- RLS Policies for room_participants
CREATE POLICY "Users can view participants in their rooms" ON public.room_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.voice_rooms
      WHERE id = room_participants.room_id
      AND (is_public = true OR creator_id = auth.uid())
    )
  );

CREATE POLICY "Users can join rooms" ON public.room_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation" ON public.room_participants
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON public.room_participants
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for connection_requests
CREATE POLICY "Users can view their own requests" ON public.connection_requests
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send connection requests" ON public.connection_requests
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received requests" ON public.connection_requests
  FOR UPDATE USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete their sent requests" ON public.connection_requests
  FOR DELETE USING (auth.uid() = sender_id);

-- RLS Policies for connections
CREATE POLICY "Users can view their connections" ON public.connections
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "System can insert connections" ON public.connections
  FOR INSERT WITH CHECK (true);

-- RLS Policies for daily_words
CREATE POLICY "Anyone can view daily words" ON public.daily_words
  FOR SELECT USING (true);

-- Trigger for updating updated_at
CREATE TRIGGER update_voice_rooms_updated_at
  BEFORE UPDATE ON public.voice_rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_connection_requests_updated_at
  BEFORE UPDATE ON public.connection_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for voice rooms
ALTER PUBLICATION supabase_realtime ADD TABLE public.voice_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.connection_requests;