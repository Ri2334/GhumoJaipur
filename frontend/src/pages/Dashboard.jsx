import React, { useContext, useState, useEffect } from "react";
import SmartSearch from "../components/SmartSearch";
import TransportResults from "../components/TransportResults";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [loadingActive, setLoadingActive] = useState(false);

  useEffect(() => {
    if (!user || user.role === 'driver') return;

    const checkActiveRide = async () => {
      try {
        const res = await apiClient.get('/bookings/my');
        const bookings = res.data.data || res.data || [];
        const active = bookings.find(r => 
          ['requested', 'accepted', 'waiting_approval', 'approved', 'started'].includes(r.status)
        );
        setActiveRide(active);
      } catch (err) {
        console.error("Dashboard: Failed to check active ride", err);
      }
    };

    checkActiveRide();
    const interval = setInterval(checkActiveRide, 10000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_36%),linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {activeRide && (
          <div className="mb-8 p-6 rounded-[2rem] bg-indigo-600 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🚖</div>
              <div>
                <h3 className="text-xl font-black">You have an active ride!</h3>
                <p className="text-indigo-100 font-medium">Heading from <strong>{activeRide.pickup}</strong> to <strong>{activeRide.destination}</strong></p>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/book/success/${activeRide._id}`)}
              className="w-full md:w-auto px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-50 transition shadow-lg"
            >
              View Ride Details
            </button>
          </div>
        )}

        <div className="mb-8 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
          <h1 className="text-3xl font-black text-gray-900">Where do you want to go next?</h1>
          <p className="mt-2 text-gray-600">Smart city transport, metro routes and tourism recommendations — all in one place.</p>
        </div>

        <SmartSearch onResult={setResult} />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {result ? (
              <TransportResults result={result} />
            ) : (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white/70 p-8 text-center text-gray-600 shadow-xl">Search a source and destination to see recommendations.</div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl"> 
              <h3 className="font-bold text-lg">Metro quick access</h3>
              <p className="mt-2 text-sm text-gray-600">Jump to common metro stations and timelines.</p>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl"> 
              <h3 className="font-bold text-lg">Travel tips</h3>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                <li>Carry a refillable water bottle.</li>
                <li>Peak hours: 8–10 AM and 6–8 PM.</li>
                <li>Prefer metro for predictable timings.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
