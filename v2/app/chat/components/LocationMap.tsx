"use client";

import { useEffect, useState, useRef } from 'react';
import { Location } from '@/lib/types';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface LocationMapProps {
  locations: Location[];
  height?: string;
}

export function LocationMap({ locations, height = '400px' }: LocationMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.9042, 116.4074]);
  const [mapZoom, setMapZoom] = useState(10);
  const [isClient, setIsClient] = useState(false);
  const mapId = useRef(`map-${Math.random().toString(36).substr(2, 9)}`);

  // Ensure component only renders on client
  useEffect(() => {
    setIsClient(true);

    // Fix Leaflet default icon paths for Next.js
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    }
  }, []);

  // Calculate center point from locations
  useEffect(() => {
    if (locations.length > 0) {
      const validLocations = locations.filter(l => l.latitude && l.longitude);
      if (validLocations.length > 0) {
        const avgLat = validLocations.reduce((sum, l) => sum + (l.latitude || 0), 0) / validLocations.length;
        const avgLng = validLocations.reduce((sum, l) => sum + (l.longitude || 0), 0) / validLocations.length;

        setMapCenter([avgLat, avgLng]);
        setMapZoom(validLocations.length === 1 ? 14 : 12);
      }
    }
  }, [locations]);

  const validLocations = locations.filter(l => l.latitude && l.longitude);

  if (validLocations.length === 0 || !isClient) {
    return null;
  }

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-md border border-gray-200" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validLocations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude!, location.longitude!]}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-1">{location.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{location.category}</p>
                {location.address && (
                  <p className="text-xs text-gray-500">{location.address}</p>
                )}
                {location.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs">⭐</span>
                    <span className="text-xs font-medium">{location.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
