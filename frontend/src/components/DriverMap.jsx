import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FlyToLocation({ coords }){
  const map = useMap();
  useEffect(()=>{ if(coords) map.flyTo([coords.lat, coords.lng], 14, { duration: 1.2 }); },[coords]);
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
  const ref = useRef();

  // simulate driver movement towards destination
  useEffect(()=>{
    const nd = normalizeCoord(destCoord);
    if(!driver || !nd) return;
    let mounted = true;
    const step = () => {
      setPos(prev => {
        const lat = prev.lat + (nd.lat - prev.lat) * 0.06;
        const lng = prev.lng + (nd.lng - prev.lng) * 0.06;
        return { lat, lng };
      });
    };
    const t = setInterval(()=>{ if(mounted) step(); }, 1500);
    return ()=>{ mounted=false; clearInterval(t); };
  },[driver, destCoord]);

  const center = initialPickup || pos || { lat: 26.92, lng: 75.8 };

  return (
    <div className="h-72 rounded-lg overflow-hidden">
      <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: '100%', width: '100%' }} whenCreated={m=>{ ref.current = m }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FlyToLocation coords={pos} />
        {initialPickup && <Marker position={[initialPickup.lat, initialPickup.lng]} icon={defaultIcon} />}
        {initialDest && <Marker position={[initialDest.lat, initialDest.lng]} icon={defaultIcon} />}
        {pos && <Marker position={[pos.lat, pos.lng]} icon={defaultIcon} />}
        {initialPickup && initialDest && (
          <Polyline positions={[[initialPickup.lat, initialPickup.lng],[initialDest.lat, initialDest.lng]]} color="#3b82f6" />
        )}
      </MapContainer>
    </div>
  );
}
