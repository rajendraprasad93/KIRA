import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, onLocationSelect }) {
  const map = useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng);
      }
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
}

const MapComponent = ({ 
  position = { lat: 12.9716, lng: 77.5946 }, 
  zoom = 13, 
  interactive = false,
  onLocationSelect,
  markers = [],
  height = '300px'
}) => {
  const [selectedPosition, setSelectedPosition] = useState(position);

  const handleLocationSelect = (latlng) => {
    setSelectedPosition(latlng);
    if (onLocationSelect) {
      onLocationSelect(latlng);
    }
  };

  return (
    <div style={{ height, width: '100%', borderRadius: '4px', overflow: 'hidden' }}>
      <MapContainer 
        center={[position.lat, position.lng]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {interactive ? (
          <LocationMarker 
            position={selectedPosition} 
            onLocationSelect={handleLocationSelect}
          />
        ) : (
          markers.length > 0 ? (
            markers.map((marker, idx) => (
              <Marker key={idx} position={[marker.lat, marker.lng]}>
                <Popup>
                  <div>
                    <p className="font-semibold">{marker.title}</p>
                    <p className="text-sm">{marker.description}</p>
                  </div>
                </Popup>
              </Marker>
            ))
          ) : (
            <Marker position={[position.lat, position.lng]}>
              <Popup>Issue Location</Popup>
            </Marker>
          )
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;