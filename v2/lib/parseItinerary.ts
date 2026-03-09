import JSON5 from 'json5';

export interface ItineraryItem {
  time: string; // "Morning", "Afternoon", "Evening"
  name: string;
  duration: string; // "2h", "3h"
  transport?: string; // "Metro Line 2", "Walk 10min", "Taxi ¥30"
  category?: string; // "attraction", "restaurant", "hotel", etc.
  note?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  items: ItineraryItem[];
}

export interface Itinerary {
  days: ItineraryDay[];
}

/**
 * Parse itinerary data from AI response.
 * Looks for <ITINERARY_DATA>{...}</ITINERARY_DATA> tags.
 * During streaming, strips the incomplete block from displayed text.
 */
export function parseItineraryFromMessage(content: string): {
  text: string;
  itinerary: Itinerary | null;
} {
  let cleanedText = content;

  // Strip any partially-typed opening tag at the end of streaming content
  // e.g. "<ITINERA" or "<ITINERARY_" that hasn't completed yet
  const partialTagPattern = /<(?:I(?:T(?:I(?:N(?:E(?:R(?:A(?:R(?:Y(?:_(?:D(?:A(?:T(?:A)?)?)?)?)?)?)?)?)?)?)?)?)?)?$/i;
  cleanedText = cleanedText.replace(partialTagPattern, '').trim();

  // Don't try to parse if content looks incomplete (streaming)
  if (content.includes('<ITINERARY_DATA>') && !content.includes('</ITINERARY_DATA>')) {
    const strippedText = cleanedText.replace(/<ITINERARY_DATA>[\s\S]*$/i, '').trim();
    return { text: strippedText, itinerary: null };
  }

  // Try to parse complete ITINERARY_DATA block
  const itineraryRegex = /<ITINERARY_DATA>\s*([\s\S]*?)\s*<\/ITINERARY_DATA>/gi;
  const matches = [...content.matchAll(itineraryRegex)];

  if (matches.length === 0) {
    return { text: cleanedText, itinerary: null };
  }

  for (const match of matches) {
    try {
      let jsonStr = match[1].trim();
      // Remove comments
      jsonStr = jsonStr.replace(/\/\/.*/g, '');
      jsonStr = jsonStr.replace(/\/\*[\s\S]*?\*\//g, '');

      const data = JSON5.parse(jsonStr);

      if (data.days && Array.isArray(data.days) && data.days.length > 0) {
        // Remove the tag block from displayed text
        cleanedText = cleanedText.replace(match[0], '').trim();
        return {
          text: cleanedText,
          itinerary: { days: data.days },
        };
      }
    } catch (e) {
      // Silently skip incomplete/malformed ITINERARY_DATA during streaming
    }
  }

  return { text: cleanedText, itinerary: null };
}
