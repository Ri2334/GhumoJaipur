import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../services/api';

export default function SharedRides(){
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [matches, setMatches] = useState([]);
  const [coords, setCoords] = useState(null);
  const [activePool, setActivePool] = useState(null);
  const [loadingActive, setLoadingActive] = useState(true);
  const [sourceSearch, setSourceSearch] = useState(location?.state?.source || '');
  const [destSearch, setDestSearch] = useState(location?.state?.destination || 'Badi Chopar');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ 
    sourceName: location?.state?.source || '', 
    destinationName: location?.state?.destination || '', 
    totalFare: location?.state?.initialFare || 100, 
    vehicleType: 'car' 
  });

  const fetchActivePool = async () => {
    try {
      setLoadingActive(true);
      const res = await apiClient.get('/bookings/my');
      const active = (res.data.data || res.data || []).find(b => 
        b.type === 'shared' && 
        ['requested', 'accepted', 'waiting_approval', 'approved', 'started'].includes(b.status)
      );
      setActivePool(active);
    } catch (e) {
      console.error("Failed to fetch active pool", e);
    } finally {
      setLoadingActive(false);
    }
  };

  const normalizeMatches = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.rides)) return payload.rides;
    return [];
  };

  useEffect(()=>{
    if (location?.state?.source || location?.state?.destination || location?.state?.initialFare) {
      setForm(prev => ({
        ...prev,
        sourceName: location.state.source || prev.sourceName,
        destinationName: location.state.destination || prev.destinationName,
        totalFare: location.state.initialFare || prev.totalFare,
      }));
      if (location.state.source) setSourceSearch(location.state.source);
      if (location.state.destination) setDestSearch(location.state.destination);
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
        const params = { 
          source: sourceSearch, 
          destination: destSearch,
          ...(coords ? { sourceLat: coords.lat, sourceLng: coords.lng } : {})
        };
        const res = await apiClient.get('/shared-rides/matches', { params });
        setMatches(normalizeMatches(res.data));
        fetchActivePool();
      }catch(e){ console.error(e); }
    })();
  },[coords, sourceSearch, destSearch]);

  const handleJoin = async (id) => {
    try{
      const res = await apiClient.post('/shared-rides/join', { rideId: id });
      alert('Joined shared ride! Your fare will be dynamically updated as more people join.');
      const bookingId = res.data.data?.booking?._id || res.data.booking?._id;
      if (bookingId) {
        window.location.href = `/book/success/${bookingId}`;
      } else {
        fetchActivePool();
      }
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
      
      const bookingId = res.data.data?.booking?._id || res.data.booking?._id;
      if (bookingId) {
        window.location.href = `/book/success/${bookingId}`;
      } else {
        // Driver created it
        setMatches(prev => [res.data?.data?.ride || res.data?.data || res.data, ...(Array.isArray(prev) ? prev : [])]);
      }
    }catch(e){ 
      setCreating(false); 
      const msg = e.response?.data?.message || 'Failed to create';
      alert(msg);
      if (msg.includes('active shared ride')) {
        fetchActivePool(); // Refresh to show the "View My Pool" card
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold">Shared Rides</h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-3 top-3 text-[10px] font-black uppercase text-indigo-300">From</span>
              <input value={sourceSearch} onChange={e=>setSourceSearch(e.target.value)} className="w-full p-2 pl-12 border rounded-xl bg-gray-50 focus:bg-white outline-none focus:border-indigo-600 transition font-bold text-sm text-gray-800" />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3 text-[10px] font-black uppercase text-indigo-300">To</span>
              <input value={destSearch} onChange={e=>setDestSearch(e.target.value)} className="w-full p-2 pl-8 border rounded-xl bg-gray-50 focus:bg-white outline-none focus:border-indigo-600 transition font-bold text-sm text-gray-800" />
            </div>
          </div>

          <div className="space-y-4">
            {matches.filter(m => {
              const isMyActive = activePool && (activePool.sharedRide === m._id || activePool.sharedRide?._id === m._id);
              const isMyCreated = user?._id === m.creator;
              if (activePool || matches.some(match => match.creator === user?._id)) {
                return isMyActive || isMyCreated;
              }
              return true;
            }).length === 0 && <div>No shared rides found</div>}
            {matches
              .filter(m => {
                const isMyActive = activePool && (activePool.sharedRide === m._id || activePool.sharedRide?._id === m._id);
                const isMyCreated = user?._id === m.creator;
                // If I have an active pool (as passenger) or I created a pool (as driver/passenger)
                // only show my own pools
                if (activePool || matches.some(match => match.creator === user?._id)) {
                  return isMyActive || isMyCreated;
                }
                return true;
              })
              .map(m => (
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
                  {(activePool && (activePool.sharedRide === m._id || activePool.sharedRide?._id === m._id)) || (user?._id === m.creator) ? (
                    <span className="px-3 py-2 bg-emerald-100 text-emerald-800 rounded text-sm font-bold">
                      {user?._id === m.creator ? 'My Pool' : 'Joined'}
                    </span>
                  ) : !activePool ? (
                    <button onClick={()=>handleJoin(m._id)} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Join</button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          {loadingActive ? (
            <div className="p-10 text-center bg-white rounded-[2rem] border border-gray-100">
               <div className="animate-spin text-3xl mb-2 text-indigo-600">⌛</div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Checking Status...</p>
            </div>
          ) : activePool ? (
            <div className="p-6 rounded-[2rem] bg-indigo-600 shadow-xl text-white text-center">
               <div className="text-4xl mb-4">🚖</div>
               <h3 className="text-xl font-black mb-2">You have an active pool!</h3>
               <p className="text-indigo-100 text-sm mb-6 font-medium leading-relaxed">You are already waiting for a shared ride from <strong>{activePool.pickup}</strong> to <strong>{activePool.destination}</strong>.</p>
               <button 
                onClick={() => window.location.href = `/book/success/${activePool._id}`}
                className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-indigo-50 transition"
               >
                 View My Pool
               </button>
               <p className="mt-4 text-[10px] font-black text-indigo-300 uppercase tracking-widest">Cancel this ride to start a new pool</p>
            </div>
          ) : (
            <div className="p-6 rounded-[2rem] bg-white shadow-xl border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-4">Create Shared Pool</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pickup</label>
                  <input readOnly placeholder="Source" value={form.sourceName} className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-gray-800 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination</label>
                  <input readOnly placeholder="Destination" value={form.destinationName} className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-gray-800 outline-none" />
                </div>
                
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Base Pool Fare</div>
                      <div className="text-2xl font-black text-indigo-900">₹{form.totalFare}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Vehicle</div>
                      <div className="text-sm font-bold text-indigo-900">Premium Cab</div>
                    </div>
                  </div>
                  <p className="mt-2 text-[9px] font-bold text-indigo-400 leading-tight">
                    This is the standard private fare. Your final cost will decrease automatically as other riders join this pool.
                  </p>
                </div>

                <button 
                  onClick={handleCreate} 
                  disabled={creating || !form.sourceName || !form.destinationName} 
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {creating ? 'Initializing...' : 'Start New Pool'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
