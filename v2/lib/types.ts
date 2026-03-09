// Location/Place types for recommendations

export interface Location {
  id: string;
  name: string;
  description: string;
  category: 'attraction' | 'restaurant' | 'hotel' | 'shopping' | 'transport' | 'other';

  // Location details
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;

  // Ratings and reviews
  rating?: number;
  reviewCount?: number;

  // Pricing
  priceLevel?: 1 | 2 | 3 | 4; // 1 = budget, 4 = luxury
  estimatedCost?: number;
  currency?: string;

  // Images
  imageUrl?: string;
  images?: string[];

  // Additional info
  openingHours?: string;
  websiteUrl?: string;
  bookingUrl?: string;
  phone?: string;
  tags?: string[];

  // Travel info
  visitDuration?: string; // e.g., "2-3 hours"
  bestTimeToVisit?: string;

  // External IDs (for syncing with APIs)
  amapId?: string;
  googlePlaceId?: string;
}

export interface TripItinerary {
  id: string;
  tripId: string;
  date: string;
  locations: Location[];
  notes?: string;
  estimatedBudget?: number;
}

export interface ChatMessageWithLocations {
  role: 'user' | 'assistant';
  content: string;
  locations?: Location[];
  metadata?: {
    totalCost?: number;
    dayCount?: number;
  };
}
