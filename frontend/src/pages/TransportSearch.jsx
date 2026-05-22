import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getPlacesApi, getMetroStationsApi, getTouristLocationsApi, searchTransportApi, default as apiClient } from "../services/api";
import TransportCard from "../components/TransportCard";
import RouteTimeline from "../components/RouteTimeline";

export default function TransportSearch() {
  const [source, setSource] = useState("Jaipur Railway Station");
  const [destination, setDestination] = useState("Badi Chopar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [placeOptions, setPlaceOptions] = useState([]);
  const [metroStationOptions, setMetroStationOptions] = useState([]);
  const [touristLocationOptions, setTouristLocationOptions] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [activeField, setActiveField] = useState("source");

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const [placesResponse, metroResponse, touristResponse] = await Promise.all([
          getPlacesApi({ sort: "rating" }),
          getMetroStationsApi(),
          getTouristLocationsApi(),
        ]);
        setPlaceOptions(placesResponse.data || []);
        setMetroStationOptions(metroResponse.data || []);
        setTouristLocationOptions(touristResponse.data || []);
      } catch {
        setPlaceOptions([]);
        setMetroStationOptions([]);
        setTouristLocationOptions([]);
      }
    };

    loadLocations();
  }, []);

  const suggestions = useMemo(() => {
    const query = (activeField === "destination" ? destination : source).trim().toLowerCase();
    const combined = [
      ...placeOptions.map((place) => ({ id: `place-${place._id}`, name: place.name, subtitle: place.location || place.category || "Famous place", kind: "place" })),
      ...metroStationOptions.map((station) => ({ id: `metro-${station._id}`, name: station.name, subtitle: `${station.line || "Pink Line"} metro`, kind: "metro" })),
      ...touristLocationOptions.map((location) => ({ id: `tourist-${location._id}`, name: location.name, subtitle: location.nearestStation ? `Near ${location.nearestStation}` : location.category || "Transit", kind: "tourist" })),
    ];

    const seen = new Set();
    return combined
      .map((item) => {
        const name = item.name.toLowerCase();
        const subtitle = item.subtitle.toLowerCase();
        const exactMatch = query && name === query ? 4 : 0;
        const startsWithMatch = query && name.startsWith(query) ? 3 : 0;
        const includesMatch = query && (name.includes(query) || subtitle.includes(query)) ? 2 : 0;
        return { ...item, score: exactMatch + startsWithMatch + includesMatch };
      })
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .filter((item) => {
        if (seen.has(item.name.toLowerCase())) return false;
        seen.add(item.name.toLowerCase());
        return true;
      })
      .slice(0, 12);
  }, [activeField, destination, metroStationOptions, placeOptions, source, touristLocationOptions]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await searchTransportApi({ source, destination });
      setResult(response.data);
    } catch (err) {
      // Try fallback demo endpoint so UI doesn't stay empty while backend/DB has issues
      try {
        const demoRes = await apiClient.get('/transport/demo');
        const payload = demoRes.data?.data || demoRes.data || null;
        if (payload) {
          // Map demo payload to expected result shape
          const mapped = {
            route: { distanceKm: payload.distanceKm },
            metroRoute: payload.metroPath ? { stationSequence: (payload.metroPath || []).map(name => ({ name })) } : null,
            recommendations: (payload.candidates || []).map(c => ({ mode: c.mode, fare: c.fare, time: `${c.timeMinutes || c.time} mins`, badge: c.isRecommended ? 'best' : c.isCheapest ? 'cheapest' : c.isFastest ? 'fastest' : 'default', note: '' })),
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

  const destinationMap = useMemo(() => {
    if (!result?.route?.metroRoute?.stationSequence?.length) return "";
    const stations = result.route.metroRoute.stationSequence.map((station) => station.name).join(" -> ");
    return `https://www.google.com/maps?q=${encodeURIComponent(`${source} to ${destination} via ${stations}`)}`;
  }, [result]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_36%),linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Smart Transport Assistant</p>
          <h1 className="mt-2 text-4xl font-black text-gray-900">Jaipur metro, auto, cab, bus and shared ride comparison</h1>
          <p className="mt-3 max-w-2xl text-gray-600">Search a source and destination to see realistic fares, travel times, metro routing and recommendation badges.</p>

          <form onSubmit={handleSearch} className="mt-6 grid gap-3 lg:grid-cols-[1.1fr_1.1fr_0.7fr]">
            <input value={source} onChange={(e) => setSource(e.target.value)} onFocus={() => { setSuggestionsVisible(true); setActiveField("source"); }} placeholder="Source e.g. Jaipur Railway Station" className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-blue-500" />
            <input value={destination} onChange={(e) => setDestination(e.target.value)} onFocus={() => { setSuggestionsVisible(true); setActiveField("destination"); }} placeholder="Destination e.g. Badi Chopar" className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:border-blue-500" />
            <button type="submit" className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white">Find route</button>
          </form>

          {suggestionsVisible && suggestions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
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
                  }}
                  className="rounded-full bg-blue-50 px-3 py-2 text-sm text-blue-700 transition hover:bg-blue-100"
                  title={location.subtitle}
                >
                  {location.name}
                </button>
              ))}
            </div>
          )}
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
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">Distance {result.route.distanceKm} km</span>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">Cheapest: {result.route.cheapestMode}</span>
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-pink-700">Fastest: {result.route.fastestMode}</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Recommended: {result.route.recommendedMode}</span>
                  {result.route.walkingAllowed ? (
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-gray-700">Walking available</span>
                  ) : (
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-gray-700">Walking hidden over 2 km</span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {result.recommendations.map((item) => (
                  <TransportCard
                    key={item.mode}
                    mode={item.mode}
                    fare={item.fare}
                    time={item.time}
                    badge={item.isRecommended ? "best" : item.isCheapest ? "cheapest" : item.isFastest ? "fastest" : item.badge}
                    note={item.note}
                    source={source}
                    destination={destination}
                  />
                ))}
              </div>

              <RouteTimeline stations={result.metroRoute?.stationSequence || []} />
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                <h2 className="text-xl font-bold text-gray-900">Metro route</h2>
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <div><span className="font-semibold text-gray-900">Source:</span> {result.metroRoute?.sourceStation?.name}</div>
                  <div><span className="font-semibold text-gray-900">Destination:</span> {result.metroRoute?.destinationStation?.name}</div>
                  <div><span className="font-semibold text-gray-900">Fare:</span> ₹{result.metroRoute?.fare}</div>
                  <div><span className="font-semibold text-gray-900">Travel time:</span> {result.metroRoute?.travelTimeMinutes} mins</div>
                  <div><span className="font-semibold text-gray-900">Waiting time:</span> {result.metroRoute?.waitingTimeMinutes} mins</div>
                  <div><span className="font-semibold text-gray-900">Next train:</span> {result.metroRoute?.nextTrainMinutes} mins</div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                <h2 className="text-xl font-bold text-gray-900">Shared cab</h2>
                <div className="mt-4 grid gap-3 text-sm text-gray-600">
                  <div><span className="font-semibold text-gray-900">Riders:</span> {result.sharedRide?.riderCount}</div>
                  <div><span className="font-semibold text-gray-900">Split fare:</span> ₹{result.sharedRide?.splitFare}</div>
                  <div><span className="font-semibold text-gray-900">Match chance:</span> {result.sharedRide?.sharedProbability}%</div>
                  <div><span className="font-semibold text-gray-900">Time window:</span> {result.sharedRide?.timeWindowMinutes} mins</div>
                  <div className="mt-3">
                    <button onClick={() => navigate('/shared-rides', { state: { source, destination } })} className="rounded-lg bg-blue-600 px-3 py-2 text-white text-sm">Open shared rides</button>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-xl backdrop-blur">
                <div className="border-b border-gray-100 px-6 py-4">
                  <h2 className="text-xl font-bold text-gray-900">Route map</h2>
                </div>
                <div className="aspect-[4/3] w-full">
                  {destinationMap ? (
                    <iframe
                      title="Transport route map"
                      src={destinationMap}
                      className="h-full w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">Route map will appear after search</div>
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
