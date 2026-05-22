import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jaipurPlaces } from "../data/jaipurPlaces";
import { jaipurMetroLines } from "../data/jaipurMetroData";
import { searchTransportApi } from "../services/api";

export default function SmartSearch({ onResult }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [source, setSource] = useState("Jaipur Railway Station");
  const [destination, setDestination] = useState("Badi Chaupar");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeField, setActiveField] = useState(null);

  const metroStations = jaipurMetroLines?.[0]?.stations || [];

  const suggestions = useMemo(() => {
    const query = (activeField === "source" ? source : activeField === "destination" ? destination : "").toLowerCase();
    if (!query) return [];

    const placeMatches = jaipurPlaces.filter(p => 
      (p.name || "").toLowerCase().includes(query) || 
      (p.tags || []).some(t => (t || "").toLowerCase().includes(query))
    ).map(p => ({ ...p, type: 'place' }));
    
    const metroMatches = metroStations.filter(s => 
      (s.name || "").toLowerCase().includes(query)
    ).map(s => ({ ...s, type: 'metro' }));

    return [...metroMatches, ...placeMatches].slice(0, 8);
  }, [source, destination, activeField, metroStations]);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setMessage("");
    if (!user) {
      setMessage("Login required to access smart transport features");
      navigate('/login');
      return;
    }

    // Validation
    const allValidNames = [
      ...jaipurPlaces.map(p => p.name.toLowerCase()),
      ...metroStations.map(s => s.name.toLowerCase())
    ];

    if (!allValidNames.includes(source.toLowerCase()) || !allValidNames.includes(destination.toLowerCase())) {
      setMessage("No routes found for the provided places in Jaipur. Please select from the suggestions.");
      return;
    }

    setLoading(true);
    try {
      const res = await searchTransportApi({ source, destination });
      if (res && res.data) onResult(res.data);
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Transport search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (name) => {
    if (activeField === "source") setSource(name);
    if (activeField === "destination") setDestination(name);
    setActiveField(null);
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur relative z-[50]">
      <form onSubmit={handleSubmit} className="grid gap-3 lg:grid-cols-[1fr_1fr_0.4fr]">
        <div className="relative">
          <input 
            placeholder="Current location" 
            value={source} 
            onChange={(e)=>setSource(e.target.value)} 
            onFocus={() => setActiveField('source')}
            className="w-full rounded-2xl border px-4 py-3" 
          />
        </div>
        <div className="relative">
          <input 
            placeholder="Destination" 
            value={destination} 
            onChange={(e)=>setDestination(e.target.value)} 
            onFocus={() => setActiveField('destination')}
            className="w-full rounded-2xl border px-4 py-3" 
          />
        </div>
        <button type="submit" className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white">{loading? 'Searching...' : 'Find route'}</button>
      </form>

      {message && <div className="mt-3 text-sm text-red-600">{message}</div>}

      {activeField && suggestions.length > 0 && (
        <div className="absolute z-[100] w-full mt-2 left-0 right-0 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 max-h-[280px] overflow-y-auto scrollbar-thin">
          {suggestions.map((s, i) => (
            <div 
              key={i} 
              onClick={() => handleSelectSuggestion(s.name)} 
              className="flex justify-between items-center cursor-pointer hover:bg-indigo-50 px-4 py-3 rounded-xl transition group"
            >
              <div>
                <div className="font-semibold text-gray-800 group-hover:text-indigo-700">{s.name}</div>
                <div className="text-xs text-gray-500">{s.type === 'metro' ? 'Metro Station' : s.category}</div>
              </div>
              {s.type === 'place' && s.nearestMetro && (
                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-1 rounded-full whitespace-nowrap font-bold">
                  🚇 Near {s.nearestMetro}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Default chips when not actively searching */}
      {!activeField && (
        <div className="mt-4 flex flex-wrap gap-2">
          {jaipurPlaces.slice(0, 5).map((p, i) => (
            <button 
              key={i} 
              type="button" 
              onClick={()=>{ setSource(p.name); setDestination(p.name); }} 
              className="rounded-full bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100"
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
