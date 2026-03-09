import { Location } from './types';
import JSON5 from 'json5';

/**
 * Parse locations from Claude's response
 * Looks for <LOCATION_DATA> tags or JSON code blocks containing location data
 */
export function parseLocationsFromMessage(content: string): {
  text: string;
  locations: Location[];
} {
  const locations: Location[] = [];
  let cleanedText = content;

  // Strip any partially-typed opening tag at the end of streaming content
  // e.g. "<LOCATIO" or "<LOCATION_" that hasn't completed yet
  const partialTagPattern = /<(?:L(?:O(?:C(?:A(?:T(?:I(?:O(?:N(?:_(?:D(?:A(?:T(?:A)?)?)?)?)?)?)?)?)?)?)?)?)?$/i;
  cleanedText = cleanedText.replace(partialTagPattern, '').trim();

  // Don't try to parse if content looks incomplete (ends with incomplete tag)
  if (content.includes('<LOCATION_DATA>') && !content.includes('</LOCATION_DATA>')) {
    // Still streaming — strip the incomplete LOCATION_DATA block from displayed text
    // so user never sees raw JSON during streaming
    const strippedText = cleanedText.replace(/<LOCATION_DATA>[\s\S]*$/i, '').trim();
    return { text: strippedText, locations: [] };
  }

  try {
    // Pattern 1: Look for <LOCATION_DATA> tags (new format)
    const locationDataRegex = /<LOCATION_DATA>\s*([\s\S]*?)\s*<\/LOCATION_DATA>/gi;
    let matches = [...content.matchAll(locationDataRegex)];

    // Pattern 2: Try ```json code blocks
    if (matches.length === 0) {
      const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/g;
      matches = [...content.matchAll(jsonBlockRegex)];
    }

    // Pattern 3: Try plain ``` code blocks
    if (matches.length === 0) {
      const plainBlockRegex = /```\s*([\s\S]*?)\s*```/g;
      matches = [...content.matchAll(plainBlockRegex)];
    }

    // Pattern 4: Try to find standalone JSON objects with "locations" key
    if (matches.length === 0) {
      const standaloneJsonRegex = /(\{\s*"locations"\s*:\s*\[[\s\S]*?\]\s*\})/g;
      matches = [...content.matchAll(standaloneJsonRegex)];
    }

    for (const match of matches) {
      try {
        let jsonStr = match[1].trim();

        // Remove comments
        jsonStr = jsonStr.replace(/\/\/.*/g, '');
        jsonStr = jsonStr.replace(/\/\*[\s\S]*?\*\//g, '');

        // Try parsing with JSON5 first (handles trailing commas, etc.)
        const data = JSON5.parse(jsonStr);

        let locationArray: Location[] = [];

        // Handle both formats:
        // 1. { locations: [...] } format
        // 2. Direct array [...] format
        if (data.locations && Array.isArray(data.locations)) {
          locationArray = data.locations;
        } else if (Array.isArray(data)) {
          locationArray = data;
        }

        if (locationArray.length > 0) {
          // Ensure unique IDs for each location
          const locationsWithUniqueIds = locationArray.map((loc: Location, index: number) => ({
            ...loc,
            id: loc.id || `location-${Date.now()}-${index}`,
          }));
          locations.push(...locationsWithUniqueIds);
          // Remove the JSON block from the text
          cleanedText = cleanedText.replace(match[0], '');
          // Successfully parsed locations
        }
      } catch (e) {
        // Silently skip incomplete or malformed JSON
        // Silently skip incomplete/malformed JSON block during streaming
      }
    }
  } catch (error) {
    // If anything goes wrong, just return original content
    console.error('Error in parseLocationsFromMessage:', error);
    return { text: content, locations: [] };
  }

  return {
    text: cleanedText.trim() || content,
    locations,
  };
}
