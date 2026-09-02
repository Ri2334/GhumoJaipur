import React, { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { searchTransportApi } from "../services/api";
import { jaipur140Places } from "../data/jaipur140Places";
import { jaipurMetroLines } from "../data/jaipurMetroData";
import { jaipurBusStops } from "../data/jaipurBusStops";
import TransportCard from "../components/TransportCard";
import RouteTimeline from "../components/RouteTimeline";
import BusRouteTimeline from "../components/BusRouteTimeline";
import { getNearestMetroStation } from "../data/jaipurTransitChecker";
import { getAllCitiesPlaces, getCityRouteResult } from "../data/cityResolver";
import { CityContext } from "../context/CityContext";
import SEOHead from "../components/SEOHead";

export default function TransportSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentCity, cityDetails } = useContext(CityContext);

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const passedDest = location.state?.destination || searchParams.get("destination");

  const [source, setSource] = useState(cityDetails.defaultSource);
  const [destination, setDestination] = useState(passedDest || cityDetails.defaultDest);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [activeField, setActiveField] = useState("source");
  const [activeTimeline, setActiveTimeline] = useState("bus");

  const isUdaipur = currentCity === "udaipur";

  useEffect(() => {
    setSource(cityDetails.defaultSource);
    setDestination(passedDest || cityDetails.defaultDest);
  }, [currentCity, passedDest]);

  const activePlaces = useMemo(() => {
    return getAllCitiesPlaces(currentCity);
  }, [currentCity]);

  const suggestions = useMemo(() => {
    const query = (activeField === "destination" ? destination : source || "").trim().toLowerCase();
    
    const combined = [
      ...activePlaces.map(p => ({ 
        id: `place-${p._id || p.id}`, 
        name: p.name, 
        subtitle: `${p.category} (${p.city || cityDetails.name})`, 
        nearest: p.nearestMetro, 
        kind: "place", 
        searchStr: `${p.name} ${p.category} ${p.city || ''} ${p.location || ''}`.toLowerCase() 
      }))
    ];

    if (!query) {
       return combined.slice(0, 8);
    }

    const seen = new Set();
    return combined
      .map((item) => {
        const name = (item.name || "").toLowerCase();
        const searchStr = item.searchStr || "";
        const exactMatch = query && name === query ? 4 : 0;
        const startsWithMatch = query && name.startsWith(query) ? 3 : 0;
        const includesMatch = query && searchStr.includes(query) ? 2 : 0;
        return { ...item, score: exactMatch + startsWithMatch + includesMatch };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .filter((item) => {
        if (!item.name || seen.has(item.name.toLowerCase())) return false;
        seen.add(item.name.toLowerCase());
        return true;
      })
      .slice(0, 10);
  }, [activeField, destination, source, activePlaces, cityDetails.name]);

  const handleSearch = async (event, overrideSource, overrideDest) => {
    if (event) event.preventDefault();
    const finalSource = overrideSource || source;
    const finalDest = overrideDest || destination;
    if (!finalSource || !finalDest) return;

    setLoading(true);
    setSuggestionsVisible(false);
    setError(null);

    const routeRes = getCityRouteResult(finalSource, finalDest, currentCity);

    const sourceMetro = isUdaipur ? null : getNearestMetroStation(finalSource);
    const destMetro = isUdaipur ? null : getNearestMetroStation(finalDest);
    const hasValidMetro = Boolean(sourceMetro && destMetro);

    const recommendations = [];

    if (routeRes?.steps) {
      routeRes.steps.forEach(step => {
        recommendations.push({
          mode: step.type === "boat" ? "Boat Ferry" : step.type === "ropeway" ? "Ropeway" : step.type === "bus" ? "Electric Bus" : "Auto / Cab",
          fare: step.cost,
          time: step.duration,
          badge: step.type === "boat" ? "lake ferry" : step.type === "ropeway" ? "aerial cable" : "best",
          note: step.title
        });
      });
    } else {
      recommendations.push({ mode: "Bus", fare: "₹15", time: "20 min", badge: "best", note: `${cityDetails.name} Municipal Transit` });
      recommendations.push({ mode: "Auto", fare: "₹60", time: "15 min", badge: "default", note: "Doorstep Auto Ride" });
      recommendations.push({ mode: "Cab", fare: "₹120", time: "12 min", badge: "fastest", note: "AC Sedan Cab" });
    }

    const localResult = {
      route: { distanceKm: routeRes?.distanceKm || 5 },
      currentTime: new Date().toISOString(),
      univRoute: routeRes,
      metroRoute: hasValidMetro ? {
        stationSequence: [{ name: sourceMetro.name }, { name: destMetro.name }],
        sourceStation: { name: sourceMetro.name },
        destinationStation: { name: destMetro.name },
        fare: 20,
        travelTimeMinutes: 20
      } : null,
      busRoute: {
        type: 'direct',
        transfers: 0,
        busNumber: isUdaipur ? "UCTSL Route 1 / 2" : "AC 1",
        fare: "₹15",
        estimatedTimeMinutes: 20
      },
      recommendations: recommendations
    };

    setResult(localResult);
    setActiveTimeline(hasValidMetro ? "metro" : "bus");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-10">
      <SEOHead
        title={`${cityDetails.name} Smart Transit & Route Comparison | Sheher Saathi`}
        description={`Compare real-time ${cityDetails.transitModes.join(", ")} fares and route connections in ${cityDetails.name}.`}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Search Box */}
        <div className="relative z-[50] mb-10 rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B35D38]">Smart Urban Assistant • {cityDetails.name}</p>
          </div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-marcellus text-[#2C1E18]">{cityDetails.name} Transit &amp; Route Comparison</h1>
          <p className="mt-3 max-w-2xl text-[#543C32] font-medium">Search any source and destination in {cityDetails.name} to compare realistic fares, {cityDetails.transitModes.join(" • ")}, and book verified rides.</p>

          <form onSubmit={handleSearch} className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_1.2fr_0.8fr]">
            <input 
              value={source} 
              onChange={(e) => setSource(e.target.value)} 
              onFocus={() => { setSuggestionsVisible(true); setActiveField("source"); }} 
              placeholder={`Source e.g. ${cityDetails.defaultSource}`} 
              className="rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] px-5 py-4 text-[#2C1E18] font-medium shadow-sm outline-none focus:border-[#B35D38]" 
            />
            <input 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)} 
              onFocus={() => { setSuggestionsVisible(true); setActiveField("destination"); }} 
              placeholder={`Destination e.g. ${cityDetails.defaultDest}`} 
              className="rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] px-5 py-4 text-[#2C1E18] font-medium shadow-sm outline-none focus:border-[#B35D38]" 
            />
            <button type="submit" className="rounded-2xl bg-[#B35D38] hover:bg-[#964B2A] px-6 py-4 font-bold text-white shadow-md transition flex items-center justify-center">
              {loading ? 'Searching...' : 'Find Route →'}
            </button>
          </form>

          {/* Popular Area Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A37B66] mr-1">Popular Areas:</span>
            {cityDetails.popularSpots.map((spot, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDestination(spot);
                  handleSearch(null, source, spot);
                }}
                className="rounded-xl border border-[#E6D6C3] bg-[#FAF5EF] hover:bg-[#FAF1EC] hover:border-[#B35D38] px-3 py-1.5 text-xs font-bold text-[#2C1E18] transition"
              >
                📍 {spot}
              </button>
            ))}
          </div>

          {/* Autocomplete Dropdown */}
          {suggestionsVisible && suggestions.length > 0 && (
            <div className="absolute z-[100] mt-2 max-w-xl w-full bg-white shadow-2xl rounded-2xl border border-[#E6D6C3] p-2 flex flex-col gap-1 max-h-[320px] overflow-y-auto">
              {suggestions.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => {
                    if (activeField === "destination") {
                      setDestination(location.name);
                    } else {
                      setSource(location.name);
                    }
                    setSuggestionsVisible(false);
                  }}
                  className="flex justify-between items-center text-left hover:bg-[#FAF1EC] px-4 py-3 rounded-xl transition group"
                >
                  <div>
                    <div className="font-bold text-[#2C1E18] group-hover:text-[#B35D38]">{location.name}</div>
                    <div className="text-xs text-[#A37B66] font-medium">{location.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.recommendations.map((rec, index) => (
                <TransportCard 
                  key={index}
                  mode={rec.mode}
                  fare={rec.fare}
                  time={rec.time}
                  badge={rec.badge}
                  note={rec.note}
                  source={source}
                  destination={destination}
                />
              ))}
            </div>

            {/* Udaipur Multi-Modal Step Timeline */}
            {result.univRoute?.steps && (
              <div className="bg-white rounded-3xl border border-[#E6D6C3] p-8 shadow-xl space-y-6">
                <h3 className="text-2xl font-marcellus text-[#2C1E18]">
                  {cityDetails.name} Journey Step-by-Step Guide
                </h3>
                <div className="space-y-4">
                  {result.univRoute.steps.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF5EF] border border-[#E6D6C3]">
                      <span className="w-10 h-10 rounded-xl bg-[#B35D38] text-white font-bold flex items-center justify-center text-sm">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-[#2C1E18]">{s.title}</div>
                        <div className="text-xs text-[#543C32] font-semibold">{s.duration} • Cost: {s.cost}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
