import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Modern styling for markers
const createCustomIcon = (color, isPulse = false) => L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      ${isPulse ? `<div class="absolute w-6 h-6 bg-${color}-400 rounded-full animate-ping opacity-40"></div>` : ''}
      <div style="background-color: ${color}; width: 14px; height: 14px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.3); z-index: 10;"></div>
    </div>
  `,
  className: 'custom-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const pickupIcon = createCustomIcon('#10b981'); // Emerald 500
const destIcon = createCustomIcon('#ef4444');   // Red 500
const driverIcon = createCustomIcon('#6366f1', true); // Indigo 500 pulsing

function MapUpdater({ pickup, destination, currentPos }) {
  const map = useMap();
  
  useEffect(() => {
    const coords = [];
    if (pickup) coords.push([pickup.lat, pickup.lng]);
    if (destination) coords.push([destination.lat, destination.lng]);
    if (currentPos) coords.push([currentPos.lat, currentPos.lng]);

    if (coords.length >= 2) {
      map.fitBounds(L.latLngBounds(coords), { padding: [50, 50], animate: true });
    } else if (coords.length === 1) {
      map.setView(coords[0], 14, { animate: true });
    }
  }, [pickup, destination, currentPos, map]);
  
  return null;
}

function normalizeCoord(coord){
  if(!coord) return null;
  if(coord.lat !== undefined && coord.lng !== undefined) return { lat: coord.lat, lng: coord.lng };
  if(coord.latitude !== undefined && coord.longitude !== undefined) return { lat: coord.latitude, lng: coord.longitude };
  return null;
}

export default function DriverMap({ driver, pickupCoord, destCoord }){
  const initialDriverPos = normalizeCoord(driver?.location);
  const initialPickup = normalizeCoord(pickupCoord);
  const initialDest = normalizeCoord(destCoord);
  const [pos, setPos] = useState(initialDriverPos || initialPickup || { lat: 26.9196, lng: 75.7878 });

  // simulate driver movement towards destination
  useEffect(()=>{
    const nd = normalizeCoord(destCoord);
    if(!driver || !nd) return;
    let mounted = true;
    const step = () => {
      setPos(prev => {
        const distLat = nd.lat - prev.lat;
        const distLng = nd.lng - prev.lng;
        // Move 5% closer each step
        const lat = prev.lat + distLat * 0.05;
        const lng = prev.lng + distLng * 0.05;
        return { lat, lng };
      });
    };
    const t = setInterval(()=>{ if(mounted) step(); }, 2000);
    return ()=>{ mounted=false; clearInterval(t); };
  },[driver, destCoord]);

  const center = initialPickup || pos || { lat: 26.92, lng: 75.8 };

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {initialPickup && <Marker position={[initialPickup.lat, initialPickup.lng]} icon={pickupIcon} />}
        {initialDest && <Marker position={[initialDest.lat, initialDest.lng]} icon={destIcon} />}
        {pos && <Marker position={[pos.lat, pos.lng]} icon={driverIcon} />}
        
        {initialPickup && initialDest && (
          <Polyline 
            positions={[
              [initialPickup.lat, initialPickup.lng],
              [initialDest.lat, initialDest.lng]
            ]} 
            color="#6366f1" 
            weight={4}
            opacity={0.6}
            dashArray="8, 8"
          />
        )}

        <MapUpdater pickup={initialPickup} destination={initialDest} currentPos={pos} />
      </MapContainer>

      <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-xl border border-gray-100 min-w-[120px]">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Live Map</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] font-bold text-gray-700">Pickup</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-gray-700">Driver</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-[10px] font-bold text-gray-700">Destination</span>
          </div>
        </div>
      </div>
    </div>
  );
}
