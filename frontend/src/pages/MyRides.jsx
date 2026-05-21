import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../services/api';

export default function MyRides(){
  const { user } = useContext(AuthContext);
  const [rides, setRides] = useState([]);

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await apiClient.get('/bookings/my');
        setRides(res.data || []);
      }catch(e){}
    })();
  },[]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold">My Rides</h2>
      <div className="mt-4 space-y-4">
        {rides.length === 0 && <div>No rides yet</div>}
        {rides.map(r => (
          <div key={r._id} className="border rounded p-4 bg-white/80">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{(r.type || '').toUpperCase()} · ₹{r.fare}</div>
                <div className="text-sm text-gray-600">{r.pickup} → {r.destination}</div>
              </div>
              <div className="text-sm">{r.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
