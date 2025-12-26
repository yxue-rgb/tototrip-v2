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

  // Don't try to parse if content looks incomplete (ends with incomplete tag)
  if (content.includes('<LOCATION_DATA>') && !content.includes('</LOCATION_DATA>')) {
    // Still streaming, return content as-is
    return { text: content, locations: [] };
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
          console.log(`✅ Successfully parsed ${locationArray.length} locations`);
        }
      } catch (e) {
        // Silently skip incomplete or malformed JSON
        console.log('⚠️ Skipping incomplete/malformed JSON block:', e);
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
