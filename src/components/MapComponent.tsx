import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { Spot } from '../types';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  spots: Spot[];
  activeSpotId: string | null;
  onSpotClick: (id: string) => void;
  daySpots: Spot[];
  centerTrigger?: number;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    // Ensure map is correctly sized after view changes or container visibility changes
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [center, zoom, map]);
  return null;
}

const MapComponent: React.FC<MapComponentProps> = ({ spots, activeSpotId, onSpotClick, daySpots, centerTrigger }) => {
  const [center, setCenter] = useState<[number, number]>([31.2304, 121.4737]); // Shanghai Center
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (activeSpotId) {
      const spot = spots.find(s => s.id === activeSpotId);
      if (spot) {
        setCenter([spot.lat, spot.lng]);
        setZoom(16); // Zoom in more for active spot
      }
    } else if (daySpots.length > 0) {
      // Center on the first spot of the day
      setCenter([daySpots[0].lat, daySpots[0].lng]);
      setZoom(14);
    }
  }, [activeSpotId, daySpots, spots, centerTrigger]);

  const polylinePositions = daySpots.map(s => [s.lat, s.lng] as [number, number]);

  const createCustomIcon = (index: number, isActive: boolean) => {
    return L.divIcon({
      className: `custom-marker ${isActive ? 'active' : ''}`,
      html: `<span>${index + 1}</span>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <ChangeView center={center} zoom={zoom} />
        
        {daySpots.map((spot, index) => (
          <Marker 
            key={spot.id} 
            position={[spot.lat, spot.lng]}
            icon={createCustomIcon(index, activeSpotId === spot.id)}
            eventHandlers={{
              click: () => onSpotClick(spot.id),
            }}
          />
        ))}

        {polylinePositions.length > 1 && (
          <Polyline 
            positions={polylinePositions} 
            color="#10b981" 
            weight={3} 
            dashArray="5, 10"
            opacity={0.6}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
