-- TotoTrip V2 - Reset and Create Database Schema
-- This script will drop existing tables and recreate them
-- WARNING: This will delete all data!

-- ============================================================
-- DROP EXISTING TABLES (in reverse dependency order)
-- ============================================================

DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.trip_shares CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.itinerary_activities CASCADE;
DROP TABLE IF EXISTS public.saved_locations CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.trips CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ============================================================
-- ENABLE EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CREATE TABLES
-- ============================================================

-- 1. USERS TABLE
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

-- 2. TRIPS TABLE
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

-- 3. CHAT SESSIONS TABLE
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  title TEXT,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CHAT MESSAGES TABLE
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  locations JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SAVED LOCATIONS TABLE
CREATE TABLE public.saved_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('attraction', 'restaurant', 'hotel', 'shopping', 'transport', 'other')),
  address TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(2, 1),
  review_count INTEGER,
  price_level INTEGER CHECK (price_level BETWEEN 1 AND 4),
  estimated_cost DECIMAL(10, 2),
  currency TEXT DEFAULT 'CNY',
  visit_duration TEXT,
  best_time_to_visit TEXT,
  opening_hours TEXT,
  image_url TEXT,
  images JSONB,
  website_url TEXT,
  booking_url TEXT,
  phone TEXT,
  tags TEXT[],
  notes TEXT,
  visited BOOLEAN DEFAULT false,
  visit_date DATE,
  user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
  amap_id TEXT,
  google_place_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ITINERARY ACTIVITIES TABLE
CREATE TABLE public.itinerary_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.saved_locations(id) ON DELETE SET NULL,
  day_number INTEGER NOT NULL,
  date DATE,
  start_time TIME,
  end_time TIME,
  order_index INTEGER NOT NULL,
  title TEXT,
  description TEXT,
  activity_type TEXT CHECK (activity_type IN ('visit', 'meal', 'transport', 'accommodation', 'other')),
  transport_mode TEXT,
  transport_duration INTEGER,
  transport_cost DECIMAL(10, 2),
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  currency TEXT DEFAULT 'CNY',
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'booked', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. EXPENSES TABLE
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES public.itinerary_activities(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('accommodation', 'food', 'transport', 'activities', 'shopping', 'other')),
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'CNY',
  amount_usd DECIMAL(10, 2),
  expense_date DATE NOT NULL,
  payment_method TEXT,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TRIP SHARES TABLE
CREATE TABLE public.trip_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  shared_with_email TEXT,
  share_token TEXT UNIQUE NOT NULL,
  can_view BOOLEAN DEFAULT true,
  can_edit BOOLEAN DEFAULT false,
  can_comment BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  accessed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. BOOKINGS TABLE
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.saved_locations(id),
  booking_type TEXT NOT NULL CHECK (booking_type IN ('hotel', 'activity', 'transport', 'tour', 'other')),
  provider TEXT,
  booking_reference TEXT,
  booking_date DATE NOT NULL,
  check_in_date DATE,
  check_out_date DATE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'CNY',
  affiliate_link TEXT,
  commission_rate DECIMAL(5, 2),
  commission_earned DECIMAL(10, 2),
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'confirmed', 'paid')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'refunded')),
  confirmation_url TEXT,
  booking_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('trip_reminder', 'booking_confirmation', 'price_alert', 'share_invitation', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  action_text TEXT,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Trips policies
CREATE POLICY "Users can view own trips" ON public.trips FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can create own trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trips" ON public.trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trips" ON public.trips FOR DELETE USING (auth.uid() = user_id);

-- Chat policies
CREATE POLICY "Users can manage own sessions" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view messages in own sessions" ON public.chat_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND chat_sessions.user_id = auth.uid()));
CREATE POLICY "Users can insert messages in own sessions" ON public.chat_messages FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.chat_sessions WHERE chat_sessions.id = chat_messages.session_id AND chat_sessions.user_id = auth.uid()));

-- Locations policies
CREATE POLICY "Users can manage own locations" ON public.saved_locations FOR ALL USING (auth.uid() = user_id);

-- Itinerary policies
CREATE POLICY "Users can manage activities in own trips" ON public.itinerary_activities FOR ALL
  USING (EXISTS (SELECT 1 FROM public.trips WHERE trips.id = itinerary_activities.trip_id AND trips.user_id = auth.uid()));

-- Expenses policies
CREATE POLICY "Users can manage own expenses" ON public.expenses FOR ALL USING (auth.uid() = user_id);

-- Shares policies
CREATE POLICY "Trip owners can manage shares" ON public.trip_shares FOR ALL
  USING (auth.uid() = shared_by OR EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_shares.trip_id AND trips.user_id = auth.uid()));

-- Bookings policies
CREATE POLICY "Users can manage own bookings" ON public.bookings FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_trips_dates ON public.trips(start_date, end_date);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX idx_saved_locations_user_id ON public.saved_locations(user_id);
CREATE INDEX idx_saved_locations_trip_id ON public.saved_locations(trip_id);
CREATE INDEX idx_saved_locations_category ON public.saved_locations(category);
CREATE INDEX idx_saved_locations_coordinates ON public.saved_locations(latitude, longitude);
CREATE INDEX idx_itinerary_trip_id ON public.itinerary_activities(trip_id);
CREATE INDEX idx_itinerary_date ON public.itinerary_activities(date, order_index);
CREATE INDEX idx_expenses_trip_id ON public.expenses(trip_id);
CREATE INDEX idx_expenses_date ON public.expenses(expense_date DESC);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, read) WHERE read = false;

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saved_locations_updated_at BEFORE UPDATE ON public.saved_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_itinerary_activities_updated_at BEFORE UPDATE ON public.itinerary_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
