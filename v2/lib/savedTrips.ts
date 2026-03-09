import type { ItineraryDay } from './parseItinerary';
import type { Location } from './types';

export interface SavedTrip {
  id: string;
  name: string;
  cities: string[];
  days: number;
  itinerary: ItineraryDay[];
  locations: Location[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'tototrip_saved_trips';

function generateId(): string {
  // Use crypto.randomUUID if available, else fallback
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Extract city names from itinerary day titles.
 * AI typically uses titles like "Arrival in Beijing", "Beijing → Shanghai", etc.
 */
export function extractCities(days: ItineraryDay[]): string[] {
  const citySet = new Set<string>();
  const knownCities = [
    'Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou',
    'Nanjing', 'Wuhan', 'Xi\'an', 'Xian', 'Chongqing', 'Suzhou', 'Guilin',
    'Kunming', 'Harbin', 'Qingdao', 'Dalian', 'Xiamen', 'Lhasa', 'Lijiang',
    'Dali', 'Zhangjiajie', 'Hong Kong', 'Macau', 'Taipei', 'Tianjin',
    'Sanya', 'Luoyang', 'Pingyao', 'Zhangye', 'Dunhuang', 'Urumqi',
    'Kashgar', 'Yangshuo', 'Huangshan', 'Jiuzhaigou', 'Chengde', 'Datong',
    'Kaifeng', 'Lanzhou', 'Fuzhou', 'Changsha', 'Guiyang', 'Nanning',
    'Zhuhai', 'Dongguan', 'Foshan', 'Hefei', 'Ningbo', 'Wenzhou',
  ];

  for (const day of days) {
    const text = day.title;
    for (const city of knownCities) {
      if (text.toLowerCase().includes(city.toLowerCase())) {
        // Normalize Xi'an / Xian
        const normalized = city === 'Xian' ? "Xi'an" : city;
        citySet.add(normalized);
      }
    }
    // Also check items for city context
    for (const item of day.items) {
      for (const city of knownCities) {
        if (item.name.toLowerCase().includes(city.toLowerCase())) {
          const normalized = city === 'Xian' ? "Xi'an" : city;
          citySet.add(normalized);
        }
      }
    }
  }

  return Array.from(citySet);
}

/**
 * Auto-generate a trip name from cities and days.
 */
export function generateTripName(cities: string[], days: number): string {
  const dayStr = `${days}-Day`;
  if (cities.length === 0) {
    return `China ${dayStr} Adventure`;
  }
  if (cities.length === 1) {
    return `${cities[0]} ${dayStr} Adventure`;
  }
  if (cities.length === 2) {
    return `${cities[0]} & ${cities[1]} ${dayStr} Trip`;
  }
  return `${cities[0]}, ${cities[1]} & More — ${dayStr} Trip`;
}

/**
 * Get all saved trips from localStorage.
 */
export function getSavedTrips(): SavedTrip[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const trips = JSON.parse(raw);
    if (!Array.isArray(trips)) return [];
    return trips.sort((a: SavedTrip, b: SavedTrip) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

/**
 * Get a single saved trip by ID.
 */
export function getSavedTrip(id: string): SavedTrip | null {
  const trips = getSavedTrips();
  return trips.find(t => t.id === id) || null;
}

/**
 * Save a new trip to localStorage.
 */
export function saveTrip(
  itinerary: ItineraryDay[],
  locations: Location[]
): SavedTrip {
  const now = Date.now();
  const cities = extractCities(itinerary);
  const days = itinerary.length;
  const name = generateTripName(cities, days);

  const trip: SavedTrip = {
    id: generateId(),
    name,
    cities,
    days,
    itinerary,
    locations,
    createdAt: now,
    updatedAt: now,
  };

  const existing = getSavedTrips();
  existing.unshift(trip);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    // localStorage might be full — try removing oldest trips to make room
    if (existing.length > 1) {
      const trimmed = existing.slice(0, Math.max(1, Math.ceil(existing.length / 2)));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      } catch {
        // Still can't save — storage is critically full
        throw new Error('Storage is full. Please clear some browser data and try again.');
      }
    } else {
      throw new Error('Storage is full. Please clear some browser data and try again.');
    }
  }

  return trip;
}

/**
 * Delete a saved trip by ID.
 */
export function deleteSavedTrip(id: string): boolean {
  const trips = getSavedTrips();
  const filtered = trips.filter(t => t.id !== id);
  if (filtered.length === trips.length) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // If we can't even write the smaller list, clear entirely
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    return false;
  }
  return true;
}

/**
 * Encode a trip as a base64 string for sharing.
 */
export function encodeTripForSharing(trip: SavedTrip): string {
  const shareData = {
    n: trip.name,
    c: trip.cities,
    d: trip.days,
    i: trip.itinerary,
    l: trip.locations,
  };
  const json = JSON.stringify(shareData);
  // Use encodeURIComponent to handle unicode, then btoa
  const encoded = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  ));
  return encoded;
}

/**
 * Decode a shared trip from a base64 string.
 */
export function decodeTripFromSharing(encoded: string): SavedTrip | null {
  try {
    const json = decodeURIComponent(
      Array.from(atob(encoded), (c) =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    const data = JSON.parse(json);

    return {
      id: 'shared',
      name: data.n || 'Shared Trip',
      cities: data.c || [],
      days: data.d || 0,
      itinerary: data.i || [],
      locations: data.l || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  } catch (e) {
    console.error('Failed to decode shared trip:', e);
    return null;
  }
}
