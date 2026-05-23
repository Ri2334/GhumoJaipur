import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../services/api';

export default function SharedRides(){
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [coords, setCoords] = useState(null);
  const [destination, setDestination] = useState('Badi Chopar');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ sourceName: '', destinationName: '', totalFare: 80, vehicleType: 'auto' });
  const location = useLocation();

  const normalizeMatches = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.rides)) return payload.rides;
    return [];
  };

  useEffect(()=>{
    if (location?.state?.source || location?.state?.destination) {
      setForm(prev => ({
        ...prev,
        sourceName: location.state.source || prev.sourceName,
        destinationName: location.state.destination || prev.destinationName,
      }));
      if (location.state.destination) setDestination(location.state.destination);
    }
  },[location]);

  useEffect(()=>{
    // try to get user geolocation quickly
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, ()=>{} , { timeout: 2000 });
    }
  },[]);

  useEffect(()=>{
    (async ()=>{
      try{
        const params = coords ? { sourceLat: coords.lat, sourceLng: coords.lng, destination } : { destination };
        const res = await apiClient.get('/shared-rides/matches', { params });
        setMatches(normalizeMatches(res.data));
      }catch(e){ console.error(e); }
    })();
  },[coords,destination]);

  const handleJoin = async (id) => {
    try{
      const res = await apiClient.post('/shared-rides/join', { rideId: id });
      alert('Joined shared ride! Your fare will be dynamically updated as more people join.');
      window.location.href = `/book/success/${res.data.booking._id}`;
    }catch(e){ 
      alert(e.response?.data?.message || 'Failed to join'); 
    }
  };

  const handleCreate = async () => {
    if (user?.role === 'driver' && !user?.isVerified) {
      alert('Your driver account must be verified before you can post rides.');
      return;
    }

    try{
      setCreating(true);
      const payload = { ...form, sourceCoord: coords || { lat: 26.92, lng: 75.8 }, destCoord: coords || { lat: 26.92, lng: 75.8 } };
      const res = await apiClient.post('/shared-rides/create', payload);
      setCreating(false);
      alert('Shared ride created!');
      if (res.data.booking) {
        window.location.href = `/book/success/${res.data.booking._id}`;
      } else {
        // Driver created it
        setMatches(prev => [res.data?.data || res.data, ...(Array.isArray(prev) ? prev : [])]);
      }
    }catch(e){ 
      setCreating(false); 
      alert(e.response?.data?.message || 'Failed to create'); 
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold">Shared Rides</h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="mb-3 flex gap-2">
            <input value={destination} onChange={e=>setDestination(e.target.value)} className="p-2 border rounded flex-1" />
            <button onClick={()=>{}} className="px-3 py-2 bg-indigo-600 text-white rounded">Search</button>
          </div>

          <div className="space-y-4">
            {matches.length === 0 && <div>No shared rides found</div>}
            {matches.map(m => (
              <div key={m._id} className="p-4 border rounded bg-white/80 flex justify-between items-center">
                <div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">To {m.destinationName}</div>
                        <div className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded">Match {m.sharedProbability || 60}%</div>
                      </div>
                      <div className="text-sm text-gray-600">Riders: {m.riderCount} · Split: ₹{m.splitFare}</div>
                      <div className="mt-1 flex gap-2 items-center">
                        <div className="text-sm text-gray-500">Seats: <strong>{m.seatsAvailable ?? 3}</strong></div>
                        {m.timeWindowMinutes && <div className="text-sm text-gray-500">Pickup window: {m.timeWindowMinutes} mins</div>}
                      </div>
                      {m.sourceCoord && coords && (
                        <div className="text-sm text-gray-500">Distance: {(Math.hypot((m.sourceCoord.lat - coords.lat), (m.sourceCoord.lng - coords.lng))*111).toFixed(2)} km</div>
                      )}
                </div>
                <div>
                  <button onClick={()=>handleJoin(m._id)} className="px-3 py-2 bg-indigo-600 text-white rounded">Join</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          <div className="p-4 rounded bg-white/90">
            <h3 className="font-semibold">Create Shared Ride</h3>
            <div className="mt-3 space-y-2">
              <input placeholder="Source" value={form.sourceName} onChange={e=>setForm(f=>({...f, sourceName: e.target.value}))} className="w-full p-2 border rounded" />
              <input placeholder="Destination" value={form.destinationName} onChange={e=>setForm(f=>({...f, destinationName: e.target.value}))} className="w-full p-2 border rounded" />
              <input type="number" placeholder="Fare" value={form.totalFare} onChange={e=>setForm(f=>({...f, totalFare: Number(e.target.value)}))} className="w-full p-2 border rounded" />
              <select value={form.vehicleType} onChange={e=>setForm(f=>({...f, vehicleType: e.target.value}))} className="w-full p-2 border rounded">
                <option value="auto">Auto</option>
                <option value="car">Car</option>
              </select>
              <button onClick={handleCreate} disabled={creating} className="w-full px-3 py-2 bg-green-600 text-white rounded">{creating ? 'Creating...' : 'Create'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
