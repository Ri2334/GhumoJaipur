import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getTouristLocationsApi, getMetroStationsApi, searchTransportApi } from "../services/api";

export default function SmartSearch({ onResult }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [source, setSource] = useState("Jaipur Railway Station");
  const [destination, setDestination] = useState("Badi Chopar");
  const [locations, setLocations] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const locs = await getTouristLocationsApi();
        setLocations(locs.data || []);
      } catch (e) {
        setLocations([]);
      }
      try {
        const st = await getMetroStationsApi();
        setStations(st.data || []);
      } catch (e) {
        setStations([]);
      }
    })();
  }, []);

  const suggestions = useMemo(() => {
    const q1 = source.trim().toLowerCase();
    const q2 = destination.trim().toLowerCase();
    const merged = [...locations, ...stations.map(s => ({ name: s.name, area: s.area }))];
    return merged.filter(l => l.name && (l.name.toLowerCase().includes(q1) || l.name.toLowerCase().includes(q2))).slice(0, 8);
  }, [locations, stations, source, destination]);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    setMessage("");
    if (!user) {
      setMessage("Login required to access smart transport features");
      navigate('/login');
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

  return (
    <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur">
      <form onSubmit={handleSubmit} className="grid gap-3 lg:grid-cols-[1fr_1fr_0.4fr]">
        <input placeholder="Current location" value={source} onChange={(e)=>setSource(e.target.value)} className="rounded-2xl border px-4 py-3" list="gj-locs" />
        <input placeholder="Destination" value={destination} onChange={(e)=>setDestination(e.target.value)} className="rounded-2xl border px-4 py-3" list="gj-locs" />
        <button type="submit" className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white">{loading? 'Searching...' : 'Find route'}</button>
      </form>

      <datalist id="gj-locs">
        {[
          "Jaipur Railway Station",
          "Sindhi Camp",
          "Badi Chopar",
          "Hawa Mahal",
          "Jal Mahal",
          "Amer Fort",
          "City Palace",
          "Chandpole",
          "Civil Lines",
          ...locations.map(l=> l.name)
        ].map((name, idx) => (
          <option key={idx} value={name} />
        ))}
      </datalist>

      {message && <div className="mt-3 text-sm text-red-600">{message}</div>}

      {suggestions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button key={i} type="button" onClick={()=>{ setSource(s.name || s); setDestination(s.name || s); }} className="rounded-full bg-blue-50 px-3 py-2 text-sm text-blue-700">{s.name}</button>
          ))}
        </div>
      )}
    </div>
  );
}
