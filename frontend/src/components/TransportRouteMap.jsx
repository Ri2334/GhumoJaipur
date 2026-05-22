import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Simplified ChangeView
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && typeof center[0] === 'number') {
      try {
        map.setView(center, map.getZoom());
      } catch (e) {
        console.error("setView failed", e);
      }
    }
  }, [center, map]);
  return null;
}

export default function TransportRouteMap({ routeData }) {
  const [center, setCenter] = useState([26.9124, 75.7873]);

  useEffect(() => {
    if (routeData?.map?.source?.latitude && routeData?.map?.source?.longitude) {
      setCenter([routeData.map.source.latitude, routeData.map.source.longitude]);
    }
  }, [routeData]);

  return (
    <div className="h-full w-full">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <ChangeView center={center} />
      </MapContainer>
    </div>
  );
}