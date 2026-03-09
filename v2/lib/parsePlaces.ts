import JSON5 from 'json5';

export interface PlaceData {
  name: string;
  nameCn?: string;
  rating?: number;
  area?: string;
  price?: string;
  type?: 'restaurant' | 'attraction' | 'hotel' | 'transport';
  desc?: string;
  image?: string;       // 主图
  images?: string[];     // 额外图片（2-3张），用 Unsplash
  address?: string;
  duration?: string;     // "2-3 hours"
  bestTime?: string;     // "Morning"
  tags?: string[];
  latitude?: number;
  longitude?: number;
}

/**
 * Parse place data from AI response.
 * Looks for <PLACE_DATA>[...]</PLACE_DATA> tags.
 * During streaming, strips the incomplete block from displayed text.
 */
export function parsePlacesFromMessage(content: string): {
  text: string;
  places: PlaceData[];
} {
  let cleanedText = content;

  // Strip any partially-typed opening tag at the end of streaming content
  const partialTagPattern = /<(?:P(?:L(?:A(?:C(?:E(?:_(?:D(?:A(?:T(?:A)?)?)?)?)?)?)?)?)?)?$/i;
  cleanedText = cleanedText.replace(partialTagPattern, '').trim();

  // Don't try to parse if content looks incomplete (streaming)
  if (content.includes('<PLACE_DATA>') && !content.includes('</PLACE_DATA>')) {
    const strippedText = cleanedText.replace(/<PLACE_DATA>[\s\S]*$/i, '').trim();
    return { text: strippedText, places: [] };
  }

  // Try to parse complete PLACE_DATA block
  const placeRegex = /<PLACE_DATA>\s*([\s\S]*?)\s*<\/PLACE_DATA>/gi;
  const matches = [...content.matchAll(placeRegex)];

  if (matches.length === 0) {
    return { text: cleanedText, places: [] };
  }

  const allPlaces: PlaceData[] = [];

  for (const match of matches) {
    try {
      let jsonStr = match[1].trim();
      // Remove comments
      jsonStr = jsonStr.replace(/\/\/.*/g, '');
      jsonStr = jsonStr.replace(/\/\*[\s\S]*?\*\//g, '');

      const data = JSON5.parse(jsonStr);

      if (Array.isArray(data) && data.length > 0) {
        allPlaces.push(...data);
        // Remove the tag block from displayed text
        cleanedText = cleanedText.replace(match[0], '').trim();
      }
    } catch (e) {
      // Silently skip incomplete/malformed PLACE_DATA during streaming
    }
  }

  return {
    text: cleanedText,
    places: allPlaces,
  };
}
