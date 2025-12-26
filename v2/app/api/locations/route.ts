import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Get user's saved locations
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

    // Get user's saved locations
    const { data: locations, error } = await supabase
      .from('saved_locations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching locations:', error);
      return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
    }

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Error in GET /api/locations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Save a new location
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
      name,
      description,
      category,
      address,
      city,
      latitude,
      longitude,
      rating,
      reviewCount,
      priceLevel,
      estimatedCost,
      currency,
      visitDuration,
      bestTimeToVisit,
      openingHours,
      imageUrl,
      images,
      websiteUrl,
      bookingUrl,
      phone,
      tags,
      amapId,
      googlePlaceId,
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Location name is required' }, { status: 400 });
    }

    // Validate and normalize category
    const validCategories = ['attraction', 'restaurant', 'hotel', 'shopping', 'transport', 'other'];
    let normalizedCategory = category?.toLowerCase() || 'other';

    // Map common variations to valid categories
    const categoryMap: Record<string, string> = {
      'food': 'restaurant',
      'dining': 'restaurant',
      'cafe': 'restaurant',
      'sightseeing': 'attraction',
      'tourist': 'attraction',
      'accommodation': 'hotel',
      'lodging': 'hotel',
      'shop': 'shopping',
      'mall': 'shopping',
      'transportation': 'transport',
    };

    if (categoryMap[normalizedCategory]) {
      normalizedCategory = categoryMap[normalizedCategory];
    }

    if (!validCategories.includes(normalizedCategory)) {
      normalizedCategory = 'other';
    }

    // Check if location already saved
    const { data: existing } = await supabase
      .from('saved_locations')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', name)
      .eq('address', address)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'Location already saved', location: existing },
        { status: 400 }
      );
    }

    // Save location
    const { data: location, error } = await supabase
      .from('saved_locations')
      .insert({
        user_id: user.id,
        name,
        description,
        category: normalizedCategory,
        address,
        city,
        latitude,
        longitude,
        rating,
        review_count: reviewCount,
        price_level: priceLevel,
        estimated_cost: estimatedCost,
        currency: currency || 'CNY',
        visit_duration: visitDuration,
        best_time_to_visit: bestTimeToVisit,
        opening_hours: openingHours,
        image_url: imageUrl,
        images,
        website_url: websiteUrl,
        booking_url: bookingUrl,
        phone,
        tags,
        amap_id: amapId,
        google_place_id: googlePlaceId,
        visited: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving location:', error);
      return NextResponse.json({ error: 'Failed to save location' }, { status: 500 });
    }

    return NextResponse.json({ success: true, location }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/locations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
