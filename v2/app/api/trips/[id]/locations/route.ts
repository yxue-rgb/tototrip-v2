import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// POST - Add a location to a trip
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Create authenticated Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { locationId, visitDate } = await request.json();

    if (!locationId) {
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    // Verify trip belongs to user
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id')
      .eq('id', tripId)
      .eq('user_id', user.id)
      .single();

    if (tripError || !trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Update location to add it to the trip
    const { data: location, error } = await supabase
      .from('saved_locations')
      .update({
        trip_id: tripId,
        visit_date: visitDate || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', locationId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error adding location to trip:', error);
      return NextResponse.json({ error: 'Failed to add location to trip' }, { status: 500 });
    }

    return NextResponse.json({ success: true, location });
  } catch (error) {
    console.error('Error in POST /api/trips/[id]/locations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove a location from a trip
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Create authenticated Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Verify token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { locationId } = await request.json();

    if (!locationId) {
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    // Remove location from trip (set trip_id to null)
    const { error } = await supabase
      .from('saved_locations')
      .update({
        trip_id: null,
        visit_date: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', locationId)
      .eq('user_id', user.id)
      .eq('trip_id', tripId);

    if (error) {
      console.error('Error removing location from trip:', error);
      return NextResponse.json({ error: 'Failed to remove location from trip' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/trips/[id]/locations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
