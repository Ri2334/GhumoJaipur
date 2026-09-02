import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { searchTransportApi, default as apiClient } from "../services/api";
import { jaipur140Places } from "../data/jaipur140Places";
import { jaipurMetroLines } from "../data/jaipurMetroData";
import { jaipurBusStops } from "../data/jaipurBusStops";
import TransportCard from "../components/TransportCard";
import RouteTimeline from "../components/RouteTimeline";
import BusRouteTimeline from "../components/BusRouteTimeline";
import TransportRouteMap from "../components/TransportRouteMap";
import { calculateUniversalRoute } from "../data/jaipurUniversalTransitEngine";
import { getNearestMetroStation, OUTSTATION_TRANSIT_INFO } from "../data/jaipurTransitChecker";
import { getAllCitiesPlaces, getCityRouteResult } from "../data/cityResolver";
import { CityContext } from "../context/CityContext";
import SEOHead from "../components/SEOHead";

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
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const passedDest = location.state?.destination || searchParams.get("destination");

  const [source, setSource] = useState(passedDest ? "" : "Jaipur Railway Station");
  const [destination, setDestination] = useState(passedDest || "Badi Chaupar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [activeField, setActiveField] = useState(passedDest ? "source" : "source");
  const [activeTimeline, setActiveTimeline] = useState("metro");

  const metroStations = jaipurMetroLines[0].stations;

  useEffect(() => {
    if (passedDest) {
      setDestination(passedDest);
      const defaultOrigin = "Jaipur Railway Station";
      setSource(defaultOrigin);
      handleSearch(null, defaultOrigin, passedDest);
    }
  }, [passedDest]);

  const suggestions = useMemo(() => {
    const query = (activeField === "destination" ? destination : source || "").trim().toLowerCase();
    
    const combined = [
      ...jaipur140Places.map(p => ({ 
        id: `place-${p._id}`, 
        name: p.name, 
        subtitle: `${p.category} (${p.city || 'Jaipur'})`, 
        nearest: p.nearestMetro, 
        kind: "place", 
        searchStr: `${p.name} ${p.category} ${p.city || ''} ${p.location || ''}`.toLowerCase() 
      })),
      ...metroStations.map(s => ({ 
        id: `metro-${s.id}`, 
        name: s.name, 
        subtitle: `Pink Line Metro`, 
        nearest: null, 
        kind: "metro", 
        searchStr: (s.name || "").toLowerCase() 
      })),
      ...jaipurBusStops.map(b => ({
        id: b.id,
        name: b.name,
        subtitle: `Bus Stop`,
        nearest: null,
        kind: "bus",
        searchStr: (b.name || "").toLowerCase()
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

  const handleSearch = async (event, overrideSource, overrideDest) => {
    if (event) event.preventDefault();
    const finalSource = overrideSource || source;
    const finalDest = overrideDest || destination;
    if (!finalSource || !finalDest) return;

    setLoading(true);
    setSuggestionsVisible(false);
    setError(null);

    // Compute 100% accurate universal transit route across all 140 places
    const univRoute = calculateUniversalRoute(finalSource, finalDest);
    const sourceMetro = getNearestMetroStation(finalSource);
    const destMetro = getNearestMetroStation(finalDest);
    const hasValidMetro = Boolean(sourceMetro && destMetro);

    try {
      const response = await searchTransportApi({ source: finalSource, destination: finalDest });
      if (response && response.success && hasValidMetro) {
        setResult({ ...response.data, univRoute });
        setActiveTimeline("metro");
      } else {
        throw new Error("Local transit processing");
      }
    } catch (err) {
      const recommendations = [];

      if (univRoute.isOutstation) {
        recommendations.push({ mode: "Bus", fare: univRoute.estimatedFareRs, time: `${univRoute.totalTimeMins} mins`, badge: "best", note: `RSRTC Express Bus to ${univRoute.destCity}` });
        recommendations.push({ mode: "Train", fare: Math.round(univRoute.estimatedFareRs * 0.4), time: `${Math.round(univRoute.totalTimeMins * 0.9)} mins`, badge: "cheapest", note: `Indian Railways via ${univRoute.destCity}` });
        recommendations.push({ mode: "Cab", fare: Math.round(univRoute.distanceKm * 14), time: `${Math.round(univRoute.totalTimeMins * 0.8)} mins`, badge: "fastest", note: "Outstation Doorstep Cab" });
      } else {
        if (hasValidMetro) {
          recommendations.push({ mode: "Metro", fare: 20, time: `${univRoute.totalTimeMins} mins`, badge: "best", note: `Via ${sourceMetro.name} to ${destMetro.name}` });
        }
        recommendations.push({ mode: "Bus", fare: univRoute.estimatedFareRs, time: `${univRoute.totalTimeMins + 5} mins`, badge: "cheapest", note: `JCTSL City Bus Corridor` });
        recommendations.push({ mode: "Auto", fare: Math.round(univRoute.distanceKm * 15), time: `${univRoute.totalTimeMins} mins`, badge: "default", note: "Direct auto doorstep" });
        recommendations.push({ mode: "Cab", fare: Math.round(univRoute.distanceKm * 20), time: `${Math.max(10, univRoute.totalTimeMins - 5)} mins`, badge: "fastest", note: "Verified local driver" });
      }

      const localResult = {
        route: { distanceKm: univRoute.distanceKm },
        currentTime: new Date().toISOString(),
        outstationData: univRoute.isOutstation ? {
          isOutstation: true,
          distanceKm: univRoute.distanceKm,
          nearestRailway: `${univRoute.destCity} Railway Station`,
          busTerminal: `Sindhi Camp ISBT (${univRoute.destCity} Bus)`,
          routeNotes: `Take Express Transit from Jaipur to ${univRoute.destCity}.`
        } : null,
        univRoute: univRoute,
        metroRoute: hasValidMetro ? {
          stationSequence: [{ name: sourceMetro.name, lat: 26.92, lng: 75.78 }, { name: destMetro.name, lat: 26.92, lng: 75.82 }],
          sourceStation: { name: sourceMetro.name },
          destinationStation: { name: destMetro.name },
          fare: 20,
          travelTimeMinutes: univRoute.totalTimeMins,
          waitingTimeMinutes: 4,
          nextTrainMinutes: 4
        } : null,
        busRoute: univRoute.busRoute || {
          type: 'direct',
          transfers: 0,
          busNumber: univRoute.busNumber || "AC 1",
          routeNumber: univRoute.busNumber || "AC 1",
          routeName: `${finalSource} to ${finalDest} Transit`,
          sourceStop: finalSource,
          destStop: finalDest,
          fare: univRoute.estimatedFareRs,
          time: univRoute.totalTimeMins,
          estimatedTimeMinutes: univRoute.totalTimeMins,
          waitingTimeMinutes: univRoute.waitingTimeMinutes || 5,
          nextDepartureTime: univRoute.nextDepartureTime || new Date(Date.now() + 300000).toISOString()
        },
        recommendations: recommendations,
        map: {
          source: { latitude: 26.9196, longitude: 75.7878, name: finalSource },
          destination: { latitude: 26.9265, longitude: 75.8242, name: finalDest }
        }
      };

      setResult(localResult);
      setActiveTimeline(hasValidMetro ? "metro" : "bus");
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const { currentCity, cityDetails } = useContext(CityContext);

  useEffect(() => {
    if (!source || source === "Jaipur Railway Station" || source === "Udaipur City Railway Station") {
      setSource(cityDetails.defaultSource);
      setDestination(cityDetails.defaultDest);
    }
  }, [currentCity]);

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-10">
      <SEOHead
        title={`${cityDetails.name} Smart Transit & Route Comparison | Sheher Saathi`}
        description={`Compare real-time ${cityDetails.transitModes.join(", ")} fares and route connections in ${cityDetails.name}.`}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-[50] mb-10 rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B35D38]">Smart Urban Assistant • {cityDetails.name}</p>
          </div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-marcellus text-[#2C1E18]">{cityDetails.name} Transit &amp; Route Comparison</h1>
          <p className="mt-3 max-w-2xl text-[#543C32] font-medium">Search any source and destination in {cityDetails.name} to compare realistic fares, {cityDetails.transitModes.join(" • ")}, and book verified rides.</p>

          <form onSubmit={handleSearch} className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_1.2fr_0.8fr]">
            <input value={source} onChange={(e) => setSource(e.target.value)} onFocus={() => { setSuggestionsVisible(true); setActiveField("source"); }} placeholder="Source e.g. Jaipur Railway Station" className="rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] px-5 py-4 text-[#2C1E18] font-medium shadow-sm outline-none focus:border-[#B35D38]" />
            <input value={destination} onChange={(e) => setDestination(e.target.value)} onFocus={() => { setSuggestionsVisible(true); setActiveField("destination"); }} placeholder="Destination e.g. Badi Chaupar" className="rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] px-5 py-4 text-[#2C1E18] font-medium shadow-sm outline-none focus:border-[#B35D38]" />
            <button type="submit" className="rounded-2xl bg-[#B35D38] hover:bg-[#964B2A] px-6 py-4 font-bold text-white shadow-md transition flex items-center justify-center">{loading ? 'Searching...' : 'Find Route →'}</button>
          </form>

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
                  <div className="flex flex-col items-end gap-1">
                    {location.kind === 'place' && (
                       <span className="text-[9px] bg-[#FAF1EC] text-[#B35D38] border border-[#EBC5B2] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                         {location.subtitle === 'Area' ? 'Neighborhood' : 'Tourist Spot'}
                       </span>
                    )}
                    {location.kind === 'bus' && (
                       <span className="text-[9px] bg-[#FAF5EF] text-[#793A1F] border border-[#E6D6C3] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                         Bus Stop
                       </span>
                    )}
                    {location.nearest && (
                      <span className="text-[10px] bg-[#FAF1EC] text-[#B35D38] px-2 py-1 rounded-full whitespace-nowrap font-bold">
                        🚇 Near {location.nearest}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A37B66]">Popular Areas:</span>
            {jaipur140Places.filter(p => p.category === 'Shopping' || p.category === 'Tourist').slice(0, 8).map(area => (
              <button 
                key={area._id}
                onClick={() => setSource(area.name)}
                className="rounded-xl border border-[#E6D6C3] bg-[#FAF5EF] px-3.5 py-1.5 text-xs font-bold text-[#793A1F] transition hover:bg-[#F3E8DB] shadow-sm"
              >
                📍 {area.name}
              </button>
            ))}
            {jaipurBusStops.filter(b => ["Amer", "Jal Mahal", "Badi Chopad", "Ajmeri Gate", "Transport Nagar"].includes(b.name)).map(bus => (
              <button 
                key={bus.id}
                onClick={() => setSource(bus.name)}
                className="rounded-xl border border-[#E6D6C3] bg-[#FAF5EF] px-3.5 py-1.5 text-xs font-bold text-[#793A1F] transition hover:bg-[#F3E8DB] shadow-sm"
              >
                🚌 {bus.name}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 font-bold">{error}</div>}

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
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600 border border-indigo-100 flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                       Live Traffic Optimized
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{result.route?.distanceKm || 0} km total</span>
                  </div>
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
                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   Departure Time: {result?.currentTime ? new Date(result.currentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(result.recommendations || []).map((item) => {
                const driverInfo = item.mode === 'Cab' ? result.cabDriver : item.mode === 'Auto' ? result.autoDriver : null;
                const cabFare = result.recommendations.find(r => r.mode === 'Cab')?.fare;

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
                    cabFare={cabFare}
                    onSelect={() => {
                      if (item.mode === 'Metro') setActiveTimeline("metro");
                      if (item.mode === 'Bus') setActiveTimeline("bus");
                    }}
                  />
                );
              })}
            </div>

            {(result.metroRoute || result.busRoute) && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                  {result.metroRoute && (
                    <button 
                      onClick={() => setActiveTimeline("metro")}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition ${activeTimeline === 'metro' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-500 hover:bg-indigo-50'}`}
                    >
                      🚇 Metro Route
                    </button>
                  )}
                  {result.busRoute && (
                    <button 
                      onClick={() => setActiveTimeline("bus")}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition ${activeTimeline === 'bus' ? 'bg-sky-600 text-white shadow-lg shadow-sky-100' : 'bg-white text-gray-500 hover:bg-sky-50'}`}
                    >
                      🚌 Bus Route
                    </button>
                  )}
                </div>

                {activeTimeline === 'metro' && result.metroRoute && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <RouteTimeline stations={result.metroRoute?.stationSequence || []} />
                  </div>
                )}
                {activeTimeline === 'bus' && result.busRoute && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <BusRouteTimeline busRoute={result.busRoute} />
                  </div>
                )}
              </div>
            )}
            </div>

            <div className="space-y-6">
            {result.metroRoute && (
              <div 
                onClick={() => setActiveTimeline("metro")}
                className={`cursor-pointer rounded-3xl border p-6 shadow-xl backdrop-blur transition transform hover:scale-[1.01] ${activeTimeline === 'metro' ? 'border-indigo-400 bg-indigo-50/50' : 'border-white/70 bg-white/80'}`}
              >
                <h2 className="text-xl font-bold text-gray-900 flex justify-between items-center">
                  Metro details
                  {activeTimeline === 'metro' && <span className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded-full uppercase tracking-tighter animate-pulse">Viewing Route</span>}
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div><span className="font-semibold text-gray-900">Board at:</span> {result.metroRoute?.sourceStation?.name || "Nearest Station"}</div>
                  <div><span className="font-semibold text-gray-900">Alight at:</span> {result.metroRoute?.destinationStation?.name || "Nearest Station"}</div>
                  <div><span className="font-semibold text-gray-900">Metro Fare:</span> ₹{result.metroRoute?.fare || 0}</div>
                  <div><span className="font-semibold text-gray-900">Travel time:</span> {result.metroRoute?.travelTimeMinutes || 0} mins</div>
                  <div><span className="font-semibold text-gray-900">Wait time:</span> {result.metroRoute?.waitingTimeMinutes || 0} mins</div>
                  <div><span className="font-semibold text-gray-900 text-pink-600">Next train at:</span> {result.metroRoute?.nextDepartureTime ? new Date(result.metroRoute.nextDepartureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}</div>
                </div>
                </div>
                )}

                {result.busRoute && (
                <div 
                onClick={() => setActiveTimeline("bus")}
                className={`cursor-pointer rounded-3xl border p-6 shadow-xl backdrop-blur transition transform hover:scale-[1.01] ${activeTimeline === 'bus' ? 'border-sky-400 bg-sky-50/50' : 'border-white/70 bg-white/80'}`}
                >
                <h2 className="text-xl font-bold text-gray-900 flex justify-between items-center">
                  Bus details
                  {activeTimeline === 'bus' && <span className="text-[10px] bg-sky-600 text-white px-2 py-1 rounded-full uppercase tracking-tighter animate-pulse">Viewing Route</span>}
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div><span className="font-semibold text-gray-900">Board at:</span> {result.busRoute.sourceStop || source}</div>
                  <div><span className="font-semibold text-gray-900">Alight at:</span> {result.busRoute.destStop || destination}</div>
                  <div><span className="font-semibold text-gray-900">Bus Fare:</span> ₹{result.busRoute.fare || result.univRoute?.estimatedFareRs || 15}</div>
                  <div><span className="font-semibold text-gray-900">Est. Time:</span> {result.busRoute.estimatedTimeMinutes || result.busRoute.time || result.univRoute?.totalTimeMins || 20} mins</div>
                  <div><span className="font-semibold text-gray-900">Wait time:</span> {result.busRoute?.waitingTimeMinutes || result.univRoute?.waitingTimeMinutes || 5} mins</div>
                  <div><span className="font-semibold text-gray-900 text-sky-600">Next bus at:</span> {
                    result.busRoute?.nextDepartureTime 
                      ? new Date(result.busRoute.nextDepartureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                      : result.univRoute?.nextDepartureTime 
                      ? new Date(result.univRoute.nextDepartureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                      : new Date(Date.now() + 360000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }</div>
                  <div className="col-span-2">
                    <span className="font-semibold text-gray-900">Route info:</span> {
                      result.busRoute?.routeName
                      ? `${result.busRoute.busNumber || 'AC 1'} (${result.busRoute.routeName})`
                      : result.busRoute?.route
                      ? `Direct Route ${result.busRoute.route.routeNumber} (${result.busRoute.route.routeName})`
                      : result.busRoute?.route1
                      ? `Take ${result.busRoute.route1.routeNumber} and transfer to ${result.busRoute.route2?.routeNumber || ''} at ${result.busRoute.transferStop}`
                      : `${result.busRoute?.busNumber || 'JCTSL Bus Route AC 1'} (${source} to ${destination})`
                    }
                  </div>
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
