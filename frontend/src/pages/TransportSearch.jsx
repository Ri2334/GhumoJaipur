import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { searchTransportApi, default as apiClient } from "../services/api";
import { jaipurPlaces } from "../data/jaipurPlaces";
import { jaipurMetroLines } from "../data/jaipurMetroData";
import TransportCard from "../components/TransportCard";
import RouteTimeline from "../components/RouteTimeline";
import TransportRouteMap from "../components/TransportRouteMap";

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Map Error caught by boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-6 text-center">
          <div className="text-gray-500 font-medium">Map failed to load</div>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function TransportSearch() {
  const [source, setSource] = useState("Jaipur Railway Station");
  const [destination, setDestination] = useState("Badi Chaupar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [activeField, setActiveField] = useState("source");

  const metroStations = jaipurMetroLines[0].stations;

  const suggestions = useMemo(() => {
    const query = (activeField === "destination" ? destination : source || "").trim().toLowerCase();
    
    const combined = [
      ...jaipurPlaces.map(p => ({ 
        id: `place-${p.id}`, 
        name: p.name, 
        subtitle: p.category, 
        nearest: p.nearestMetro, 
        kind: "place", 
        searchStr: `${p.name} ${p.category} ${(p.tags || []).join(' ')}`.toLowerCase() 
      })),
      ...metroStations.map(s => ({ 
        id: `metro-${s.id}`, 
        name: s.name, 
        subtitle: `Pink Line Metro`, 
        nearest: null, 
        kind: "metro", 
        searchStr: (s.name || "").toLowerCase() 
      })),
    ];

    if (!query) {
       return combined.filter(c => c.kind === "place").slice(0, 8);
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
      .slice(0, 12);
  }, [activeField, destination, source, metroStations]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!source || !destination) return;

    // Validation: Check if places exist in our data
    const allValidNames = [
      ...jaipurPlaces.map(p => p.name.toLowerCase()),
      ...metroStations.map(s => s.name.toLowerCase())
    ];

    if (!allValidNames.includes(source.toLowerCase()) || !allValidNames.includes(destination.toLowerCase())) {
      setError("No routes found for the provided places in Jaipur. Please select from the suggestions.");
      setResult(null);
      return;
    }

    setLoading(true);
    setSuggestionsVisible(false);
    setError(null);
    try {
      const response = await searchTransportApi({ source, destination });
      if (response && response.success) {
        setResult(response.data);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Search error:", err);
      // Try fallback demo endpoint
      try {
        const demoRes = await apiClient.get('/transport/demo');
        const payload = demoRes.data?.data || demoRes.data || null;
        if (payload) {
          const mapped = {
            route: { distanceKm: payload.distanceKm || 0 },
            metroRoute: payload.metroPath ? { 
              stationSequence: (payload.metroPath || []).map(name => ({ name, lat: 26.92, lng: 75.8 })),
              sourceStation: { name: payload.metroPath[0] },
              destinationStation: { name: payload.metroPath[payload.metroPath.length - 1] },
              fare: 20,
              travelTimeMinutes: 15,
              waitingTimeMinutes: 5,
              nextTrainMinutes: 5
            } : null,
            recommendations: (payload.candidates || []).map(c => ({ 
              mode: c.mode, 
              fare: c.fare, 
              time: `${c.timeMinutes || c.time} mins`, 
              badge: c.isRecommended ? 'best' : c.isCheapest ? 'cheapest' : c.isFastest ? 'fastest' : 'default', 
              note: '' 
            })),
            map: {
              source: { latitude: 26.9196, longitude: 75.7878, name: source },
              destination: { latitude: 26.9265, longitude: 75.8242, name: destination }
            }
          };
          setResult(mapped);
          setError('Showing demo recommendations due to backend search error');
        } else {
          setError(err?.response?.data?.message || "Transport search failed");
        }
      } catch (demoErr) {
        setError(err?.response?.data?.message || "Transport search failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_36%),linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-[50] mb-8 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Smart Transport Assistant</p>
          <h1 className="mt-2 text-4xl font-black text-gray-900">Jaipur metro, auto, cab, bus and shared ride comparison</h1>
          <p className="mt-3 max-w-2xl text-gray-600">Search a source and destination to see realistic fares, travel times, metro routing and recommendation badges.</p>

          <form onSubmit={handleSearch} className="mt-6 grid gap-3 lg:grid-cols-[1.1fr_1.1fr_0.7fr]">
            <input value={source} onChange={(e) => setSource(e.target.value)} onFocus={() => { setSuggestionsVisible(true); setActiveField("source"); }} placeholder="Source e.g. Jaipur Railway Station" className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-blue-500" />
            <input value={destination} onChange={(e) => setDestination(e.target.value)} onFocus={() => { setSuggestionsVisible(true); setActiveField("destination"); }} placeholder="Destination e.g. Badi Chaupar" className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-blue-500" />
            <button type="submit" className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white">{loading ? 'Searching...' : 'Find route'}</button>
          </form>

          {suggestionsVisible && suggestions.length > 0 && (
            <div className="absolute z-[100] mt-2 max-w-xl w-full bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 flex flex-col gap-1 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
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
                  className="flex justify-between items-center text-left hover:bg-indigo-50 px-4 py-3 rounded-xl transition group"
                >
                  <div>
                    <div className="font-semibold text-gray-800 group-hover:text-indigo-700">{location.name}</div>
                    <div className="text-xs text-gray-500">{location.subtitle}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {location.kind === 'place' && (
                       <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                         {location.subtitle === 'Area' ? 'Neighborhood' : 'Tourist Spot'}
                       </span>
                    )}
                    {location.nearest && (
                      <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-1 rounded-full whitespace-nowrap font-bold">
                        🚇 Near {location.nearest}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Popular Areas:</span>
            {jaipurPlaces.filter(p => p.category === 'Area').slice(0, 6).map(area => (
              <button 
                key={area.id}
                onClick={() => setSource(area.name)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600 shadow-sm"
              >
                📍 {area.name}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="h-[520px] animate-pulse rounded-3xl bg-white/80 shadow-xl" />
            <div className="h-[520px] animate-pulse rounded-3xl bg-white/80 shadow-xl" />
          </div>
        ) : result ? (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Route summary</h2>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{result.route?.distanceKm || 0} km total</span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1 rounded-2xl bg-blue-50/50 p-4 text-center overflow-hidden">
                    <div className="text-xs font-semibold uppercase text-blue-600">From</div>
                    <div className="mt-1 font-medium text-gray-900 truncate">{source}</div>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex-1 rounded-2xl bg-blue-50/50 p-4 text-center overflow-hidden">
                    <div className="text-xs font-semibold uppercase text-blue-600">To</div>
                    <div className="mt-1 font-medium text-gray-900 truncate">{destination}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {(result.recommendations || []).map((item) => {
                  const driverInfo = item.mode === 'Cab' ? result.cabDriver : item.mode === 'Auto' ? result.autoDriver : null;
                  return (
                    <TransportCard
                      key={item.mode}
                      mode={item.mode}
                      fare={item.fare}
                      time={item.time}
                      badge={item.isRecommended ? "best" : item.isCheapest ? "cheapest" : item.isFastest ? "fastest" : item.badge}
                      note={item.note}
                      source={source}
                      destination={destination}
                      driver={driverInfo}
                    />
                  );
                })}
              </div>

              <RouteTimeline stations={result.metroRoute?.stationSequence || []} />
            </div>

            <div className="space-y-6">
              {result.metroRoute && (
                <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                  <h2 className="text-xl font-bold text-gray-900">Metro details</h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <div><span className="font-semibold text-gray-900">Board at:</span> {result.metroRoute?.sourceStation?.name || "Nearest Station"}</div>
                    <div><span className="font-semibold text-gray-900">Alight at:</span> {result.metroRoute?.destinationStation?.name || "Nearest Station"}</div>
                    <div><span className="font-semibold text-gray-900">Metro Fare:</span> ₹{result.metroRoute?.fare || 0}</div>
                    <div><span className="font-semibold text-gray-900">Travel time:</span> {result.metroRoute?.travelTimeMinutes || 0} mins</div>
                    <div><span className="font-semibold text-gray-900">Wait time:</span> {result.metroRoute?.waitingTimeMinutes || 0} mins</div>
                    <div><span className="font-semibold text-gray-900 text-pink-600">Next train in:</span> {result.metroRoute?.nextTrainMinutes || 0} mins</div>
                  </div>
                </div>
              )}

              <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl backdrop-blur h-[400px] flex flex-col">
                <div className="border-b border-gray-100 px-6 py-4 bg-white/90">
                  <h2 className="text-xl font-bold text-gray-900">Route map</h2>
                </div>
                <div className="flex-1 w-full z-0 relative min-h-0">
                  {result && (
                    <MapErrorBoundary>
                      <TransportRouteMap routeData={result} />
                    </MapErrorBoundary>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white/70 p-12 text-center text-gray-600 shadow-xl backdrop-blur">
            Search a source and destination to get metro, cab, bus, auto and shared ride recommendations.
          </div>
        )}
      </div>
    </div>
  );
}
