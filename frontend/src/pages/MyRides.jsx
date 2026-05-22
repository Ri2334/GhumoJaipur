import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

export default function MyRides() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await apiClient.get('/bookings/my');
        setRides(res.data.data || []);
      } catch (e) {
        console.error("Failed to fetch rides", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  const activeRides = rides.filter(r => ['requested', 'accepted', 'started'].includes(r.status));
  const pastRides = rides.filter(r => ['completed', 'cancelled'].includes(r.status));

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading your journeys...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900">My Rides</h1>
          <p className="text-gray-500 mt-2 font-medium">Track your active trips and view your travel history in Jaipur.</p>
        </header>

        {activeRides.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
              Active Rides
            </h2>
            <div className="grid gap-4">
              {activeRides.map(r => (
                <div key={r._id} className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-100/50 border-2 border-indigo-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      {r.type === 'auto' ? '🛺' : '🚕'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900 text-lg capitalize">{r.type}</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-full">{r.status}</span>
                      </div>
                      <p className="text-gray-500 text-sm font-medium mt-1">₹{r.fare} • {r.pickup} → {r.destination}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/book/success/${r._id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-2xl transition shadow-lg shadow-indigo-200"
                  >
                    Track Ride
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Ride History</h2>
          {pastRides.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
               <div className="text-4xl mb-4">📍</div>
               <p className="text-gray-500 font-medium">You haven't completed any rides yet.</p>
               <button onClick={() => navigate('/transport')} className="mt-4 text-indigo-600 font-bold hover:underline">Start your first journey →</button>
            </div>
          ) : (
            <div className="grid gap-4">
              {pastRides.map(r => (
                <div key={r._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl grayscale opacity-70">
                      {r.type === 'auto' ? '🛺' : '🚕'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 capitalize">{r.type} <span className="text-[10px] text-gray-400 font-medium ml-2">{new Date(r.createdAt).toLocaleDateString()}</span></div>
                      <p className="text-gray-500 text-xs font-medium">{r.pickup} to {r.destination}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-gray-900">₹{r.fare}</div>
                    <div className={`text-[10px] font-bold uppercase ${r.status === 'completed' ? 'text-green-500' : 'text-red-400'}`}>{r.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
