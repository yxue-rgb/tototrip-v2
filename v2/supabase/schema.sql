-- TotoTrip V2 Database Schema
-- Created: December 2024
-- Description: Complete database schema for AI Travel Companion

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS TABLE (Extended from Supabase Auth)
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  preferred_language TEXT DEFAULT 'en',
  home_country TEXT,
  currency_preference TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================
-- 2. TRIPS TABLE
-- ============================================================
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  destination_city TEXT,
  destination_country TEXT DEFAULT 'China',
  start_date DATE,
  end_date DATE,
  total_budget DECIMAL(10, 2),
  currency TEXT DEFAULT 'CNY',
  travelers_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'booked', 'ongoing', 'completed', 'cancelled')),
  is_public BOOLEAN DEFAULT false,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trips"
  ON public.trips FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create own trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 3. CHAT SESSIONS TABLE
-- ============================================================
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  title TEXT,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat sessions"
  ON public.chat_sessions FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- 4. CHAT MESSAGES TABLE
-- ============================================================
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  locations JSONB, -- Structured location data
  metadata JSONB, -- Additional data like tokens used, model version, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own sessions"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own sessions"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- ============================================================
-- 5. LOCATIONS TABLE (Saved/Bookmarked Places)
-- ============================================================
CREATE TABLE public.saved_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,

  -- Location details
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('attraction', 'restaurant', 'hotel', 'shopping', 'transport', 'other')),

  -- Address & Coordinates
  address TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Ratings & Pricing
  rating DECIMAL(2, 1),
  review_count INTEGER,
  price_level INTEGER CHECK (price_level BETWEEN 1 AND 4),
  estimated_cost DECIMAL(10, 2),
  currency TEXT DEFAULT 'CNY',

  -- Visit info
  visit_duration TEXT, -- e.g., "2-3 hours"
  best_time_to_visit TEXT,
  opening_hours TEXT,

  -- Media & Links
  image_url TEXT,
  images JSONB, -- Array of image URLs
  website_url TEXT,
  booking_url TEXT,
  phone TEXT,

  -- User data
  tags TEXT[], -- Array of tags
  notes TEXT, -- User's personal notes
  visited BOOLEAN DEFAULT false,
  visit_date DATE,
  user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),

  -- External IDs (for syncing with APIs)
  amap_id TEXT,
  google_place_id TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.saved_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved locations"
  ON public.saved_locations FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- 6. ITINERARY ACTIVITIES TABLE (Day-by-day schedule)
-- ============================================================
CREATE TABLE public.itinerary_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.saved_locations(id) ON DELETE SET NULL,

  -- Scheduling
  day_number INTEGER NOT NULL, -- Day 1, Day 2, etc.
  date DATE,
  start_time TIME,
  end_time TIME,
  order_index INTEGER NOT NULL, -- Order within the day

  -- Activity details
  title TEXT,
  description TEXT,
  activity_type TEXT CHECK (activity_type IN ('visit', 'meal', 'transport', 'accommodation', 'other')),

  -- Logistics
  transport_mode TEXT, -- walking, subway, taxi, etc.
  transport_duration INTEGER, -- minutes
  transport_cost DECIMAL(10, 2),

  -- Budget
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  currency TEXT DEFAULT 'CNY',

  -- Status
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'booked', 'completed', 'cancelled')),

  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.itinerary_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage activities in own trips"
  ON public.itinerary_activities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = itinerary_activities.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- ============================================================
-- 7. EXPENSES TABLE (Budget tracking)
-- ============================================================
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES public.itinerary_activities(id) ON DELETE SET NULL,

  -- Expense details
  category TEXT NOT NULL CHECK (category IN ('accommodation', 'food', 'transport', 'activities', 'shopping', 'other')),
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'CNY',
  amount_usd DECIMAL(10, 2), -- Converted amount for consistency

  -- Date & Payment
  expense_date DATE NOT NULL,
  payment_method TEXT,
  receipt_url TEXT,

  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage expenses in own trips"
  ON public.expenses FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- 8. TRIP SHARES TABLE (Collaborative trips)
-- ============================================================
CREATE TABLE public.trip_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  shared_with_email TEXT,
  share_token TEXT UNIQUE NOT NULL,

  -- Permissions
  can_view BOOLEAN DEFAULT true,
  can_edit BOOLEAN DEFAULT false,
  can_comment BOOLEAN DEFAULT true,

  expires_at TIMESTAMP WITH TIME ZONE,
  accessed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.trip_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trip owners can manage shares"
  ON public.trip_shares FOR ALL
  USING (
    auth.uid() = shared_by
    OR
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_shares.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- ============================================================
-- 9. BOOKINGS TABLE (Track affiliate bookings)
-- ============================================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.saved_locations(id),

  -- Booking details
  booking_type TEXT NOT NULL CHECK (booking_type IN ('hotel', 'activity', 'transport', 'tour', 'other')),
  provider TEXT, -- Booking.com, Klook, etc.
  booking_reference TEXT,

  -- Dates
  booking_date DATE NOT NULL,
  check_in_date DATE,
  check_out_date DATE,

  -- Pricing
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'CNY',

  -- Affiliate tracking
  affiliate_link TEXT,
  commission_rate DECIMAL(5, 2),
  commission_earned DECIMAL(10, 2),
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'confirmed', 'paid')),

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'refunded')),

  confirmation_url TEXT,
  booking_data JSONB, -- Full booking details

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bookings"
  ON public.bookings FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- 10. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Notification content
  type TEXT NOT NULL CHECK (type IN ('trip_reminder', 'booking_confirmation', 'price_alert', 'share_invitation', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Links
  link_url TEXT,
  action_text TEXT,

  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  metadata JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES for Performance
-- ============================================================

-- Trips
CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_trips_dates ON public.trips(start_date, end_date);
CREATE INDEX idx_trips_status ON public.trips(status);

-- Chat
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- Locations
CREATE INDEX idx_saved_locations_user_id ON public.saved_locations(user_id);
CREATE INDEX idx_saved_locations_trip_id ON public.saved_locations(trip_id);
CREATE INDEX idx_saved_locations_category ON public.saved_locations(category);
CREATE INDEX idx_saved_locations_coordinates ON public.saved_locations(latitude, longitude);

-- Itinerary
CREATE INDEX idx_itinerary_trip_id ON public.itinerary_activities(trip_id);
CREATE INDEX idx_itinerary_date ON public.itinerary_activities(date, order_index);

-- Expenses
CREATE INDEX idx_expenses_trip_id ON public.expenses(trip_id);
CREATE INDEX idx_expenses_date ON public.expenses(expense_date DESC);

-- Notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, read) WHERE read = false;

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_locations_updated_at BEFORE UPDATE ON public.saved_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itinerary_activities_updated_at BEFORE UPDATE ON public.itinerary_activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- INITIAL DATA (Optional)
-- ============================================================

-- Insert sample categories or reference data if needed
-- (To be added based on requirements)

-- ============================================================
-- COMMENTS for Documentation
-- ============================================================

COMMENT ON TABLE public.users IS 'Extended user profiles linked to Supabase Auth';
COMMENT ON TABLE public.trips IS 'User trip plans and itineraries';
COMMENT ON TABLE public.chat_sessions IS 'AI chat conversation sessions';
COMMENT ON TABLE public.chat_messages IS 'Individual messages in chat sessions';
COMMENT ON TABLE public.saved_locations IS 'Bookmarked places and attractions';
COMMENT ON TABLE public.itinerary_activities IS 'Day-by-day scheduled activities';
COMMENT ON TABLE public.expenses IS 'Trip expenses and budget tracking';
COMMENT ON TABLE public.trip_shares IS 'Shared trips with collaboration permissions';
COMMENT ON TABLE public.bookings IS 'Hotel, activity, and tour bookings with affiliate tracking';
COMMENT ON TABLE public.notifications IS 'User notifications and alerts';

-- ============================================================
-- 11. SECRET SANTA (Gift Exchange) TABLES
-- ============================================================

-- Rooms created by a host; lockable after draw
CREATE TABLE public.secret_santa_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  currency TEXT DEFAULT 'CNY',
  wishlist_prompt TEXT, -- guidance for participants
  is_locked BOOLEAN DEFAULT false,
  locked_at TIMESTAMP WITH TIME ZONE,
  drawn_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.secret_santa_rooms ENABLE ROW LEVEL SECURITY;

-- Host can manage their own rooms
CREATE POLICY "Hosts manage own secret santa rooms"
  ON public.secret_santa_rooms FOR ALL
  USING (auth.uid() = host_id);

-- Participants join a room (optionally linked to an authenticated user)
CREATE TABLE public.secret_santa_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.secret_santa_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  contact TEXT, -- email/phone/handle
  wishlist TEXT, -- free-form wishes (brand/category)
  avoid_participant_id UUID REFERENCES public.secret_santa_participants(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (room_id, display_name)
);

ALTER TABLE public.secret_santa_participants ENABLE ROW LEVEL SECURITY;

-- Host can manage participants in their rooms
CREATE POLICY "Host manages participants in room"
  ON public.secret_santa_participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.secret_santa_rooms r
      WHERE r.id = room_id
      AND r.host_id = auth.uid()
    )
  );

-- A signed-in participant can read their own record
CREATE POLICY "Participant can view self"
  ON public.secret_santa_participants FOR SELECT
  USING (user_id IS NOT NULL AND user_id = auth.uid());

-- Pairings created when drawing; each giver has exactly one receiver
CREATE TABLE public.secret_santa_pairings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.secret_santa_rooms(id) ON DELETE CASCADE,
  giver_id UUID NOT NULL REFERENCES public.secret_santa_participants(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.secret_santa_participants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (room_id, giver_id),
  CONSTRAINT secret_santa_no_self CHECK (giver_id <> receiver_id)
);

ALTER TABLE public.secret_santa_pairings ENABLE ROW LEVEL SECURITY;

-- Host can manage pairings for their rooms
CREATE POLICY "Host manages pairings in room"
  ON public.secret_santa_pairings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.secret_santa_rooms r
      WHERE r.id = room_id
      AND r.host_id = auth.uid()
    )
  );

-- Participants can view the pairing where they are the giver
CREATE POLICY "Participant views their assignment"
  ON public.secret_santa_pairings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.secret_santa_participants p
      WHERE p.id = giver_id
      AND p.user_id IS NOT NULL
      AND p.user_id = auth.uid()
    )
  );

-- Triggers to keep updated_at fresh
CREATE TRIGGER update_secret_santa_rooms_updated_at
  BEFORE UPDATE ON public.secret_santa_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_secret_santa_participants_updated_at
  BEFORE UPDATE ON public.secret_santa_participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for faster queries
CREATE INDEX idx_secret_santa_rooms_host ON public.secret_santa_rooms(host_id);
CREATE INDEX idx_secret_santa_participants_room ON public.secret_santa_participants(room_id);
CREATE INDEX idx_secret_santa_participants_user ON public.secret_santa_participants(user_id);
CREATE INDEX idx_secret_santa_pairings_room ON public.secret_santa_pairings(room_id);
CREATE INDEX idx_secret_santa_pairings_giver ON public.secret_santa_pairings(giver_id);
CREATE INDEX idx_secret_santa_pairings_receiver ON public.secret_santa_pairings(receiver_id);

-- Comments
COMMENT ON TABLE public.secret_santa_rooms IS 'Secret Santa rooms hosted by a user';
COMMENT ON TABLE public.secret_santa_participants IS 'Participants of a Secret Santa room';
COMMENT ON TABLE public.secret_santa_pairings IS 'Secret Santa giver/receiver assignments';
