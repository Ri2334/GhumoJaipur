import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Modern styling for markers
const createCustomIcon = (color) => L.divIcon({
  html: `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
  className: 'custom-div-icon',
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

const sourceIcon = createCustomIcon('#10b981'); // Emerald 500
const destIcon = createCustomIcon('#ef4444');   // Red 500

function MapUpdater({ source, destination }) {
  const map = useMap();
  
  useEffect(() => {
    if (source && destination) {
      const bounds = L.latLngBounds(
        [source.latitude, source.longitude],
        [destination.latitude, destination.longitude]
      );
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    } else if (source) {
      map.setView([source.latitude, source.longitude], 14, { animate: true });
    }
  }, [source, destination, map]);
  
  return null;
}

export default function TransportRouteMap({ routeData }) {
  const source = routeData?.map?.source;
  const destination = routeData?.map?.destination;
  const [center, setCenter] = useState([26.9124, 75.7873]);

  useEffect(() => {
    if (source) {
      setCenter([source.latitude, source.longitude]);
    }
  }, [source]);

  return (
    <div className="h-full w-full relative group">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {source && (
          <Marker position={[source.latitude, source.longitude]} icon={sourceIcon} />
        )}
        
        {destination && (
          <Marker position={[destination.latitude, destination.longitude]} icon={destIcon} />
        )}

        {source && destination && (
          <Polyline 
            positions={[
              [source.latitude, source.longitude],
              [destination.latitude, destination.longitude]
            ]} 
            color="#6366f1" 
            weight={4}
            opacity={0.8}
            dashArray="10, 10"
            lineCap="round"
          />
        )}

        <MapUpdater source={source} destination={destination} />
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-500 shadow-sm border border-gray-100 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Start
        <span className="w-2 h-2 rounded-full bg-red-500"></span> End
      </div>
    </div>
  );
}