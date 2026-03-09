import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// GET - Get all trips for the current user
export async function GET(request: NextRequest) {
  try {
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

    // Get all trips for this user
    const { data: trips, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trips:', error);
      return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
    }

    return NextResponse.json({ trips });
  } catch (error) {
    console.error('Error in GET /api/trips:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new trip
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const {
      title,
      description,
      destinationCity,
      destinationCountry,
      startDate,
      endDate,
      totalBudget,
      currency,
      travelersCount,
      coverImageUrl,
    } = body;

    // Validate required fields
    if (!title || !destinationCountry) {
      return NextResponse.json(
        { error: 'Trip title and destination country are required' },
        { status: 400 }
      );
    }

    // Create trip
    const { data: trip, error } = await supabase
      .from('trips')
      .insert({
        user_id: user.id,
        title,
        description,
        destination_city: destinationCity,
        destination_country: destinationCountry || 'China',
        start_date: startDate,
        end_date: endDate,
        total_budget: totalBudget,
        currency: currency || 'CNY',
        travelers_count: travelersCount || 1,
        status: 'planning',
        is_public: false,
        cover_image_url: coverImageUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating trip:', error);
      return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
    }

    return NextResponse.json({ success: true, trip }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/trips:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
