import React, { useState, useMemo, useContext } from "react";
import { busRoutes } from "../data/jaipurBusData";
import { UCTSL_BUS_ROUTES } from "../data/udaipurTransitEngine";
import { DTC_BUS_ROUTES } from "../data/delhiDTCBusCatalog";
import { CityContext } from "../context/CityContext";
import SEOHead from "../components/SEOHead";

export default function BusRoutes() {
  const { currentCity, cityDetails } = useContext(CityContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeZoneFilter, setActiveZoneFilter] = useState("all");
  const [activeOperatorFilter, setActiveOperatorFilter] = useState("all");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [displayCount, setDisplayCount] = useState(60);

  const isUdaipur = currentCity === "udaipur";
  const isDelhi = currentCity === "delhi";

  // Filter routes based on active city, search query, zonal tab, and operator
  const filteredRoutes = useMemo(() => {
    if (isDelhi) {
      return DTC_BUS_ROUTES.filter((r) => {
        // Zone code filter
        if (activeZoneFilter !== "all" && r.zone_code !== activeZoneFilter) {
          return false;
        }

        // Operator filter (DTC / DIMTS)
        if (activeOperatorFilter !== "all" && r.operator !== activeOperatorFilter) {
          return false;
        }

        if (searchQuery.trim() === "") return true;

        const q = searchQuery.toLowerCase().trim();
        const shortName = (r.route_short_name || r.busNumber || "").toLowerCase();
        const parentRoute = (r.parent_route || "").toLowerCase();
        const orig = (r.origin || "").toLowerCase();
        const dest = (r.destination || "").toLowerCase();
        const name = (r.routeName || "").toLowerCase();
        const stopsList = r.stops || [];

        return (
          shortName.includes(q) ||
          parentRoute.includes(q) ||
          orig.includes(q) ||
          dest.includes(q) ||
          name.includes(q) ||
          stopsList.some((s) => s.toLowerCase().includes(q))
        );
      });
    }

    if (isUdaipur) {
      return UCTSL_BUS_ROUTES.filter((r) => {
        if (searchQuery.trim() === "") return true;
        const q = searchQuery.toLowerCase();
        return (
          r.routeNumber.toLowerCase().includes(q) ||
          r.routeName.toLowerCase().includes(q) ||
          r.stops.some((s) => s.toLowerCase().includes(q))
        );
      });
    }

    return busRoutes.filter((r) => {
      if (searchQuery.trim() === "") return true;
      const q = searchQuery.toLowerCase();
      return (
        r.routeNo.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.stops.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [isDelhi, isUdaipur, searchQuery, activeZoneFilter, activeOperatorFilter]);

  const displayedRoutes = useMemo(() => {
    return filteredRoutes.slice(0, displayCount);
  }, [filteredRoutes, displayCount]);

  const networkTitle = isDelhi
    ? "2,400+ OFFICIAL DTC & DIMTS BUS VARIANTS 🕌"
    : isUdaipur
    ? "UCTSL MUNICIPAL NETWORK 🌅"
    : "OFFICIAL JCTSL NETWORK 🏰";

  const networkDescription = isDelhi
    ? "Indexed directory of Delhi Transport Corporation (DTC) & DIMTS cluster bus network. Search across 600+ parent corridors, 2,400+ active alphanumeric variants (STL, Express, Mudrika), and 4,400+ physical stops."
    : isUdaipur
    ? "Explore official electric and AC bus corridors operated by UCTSL in Udaipur."
    : "Explore all 27 official bus routes operated by JCTSL in Jaipur. Inspect stop sequences, fares, and transit transfer points.";

  const totalCorridors = isDelhi ? "2,400+" : isUdaipur ? UCTSL_BUS_ROUTES.length : busRoutes.length;
  const fleetCount = isDelhi ? "6,000+" : isUdaipur ? "50+" : "200";
  const fareRange = isDelhi ? "₹5 - ₹25" : isUdaipur ? "₹10 - ₹30" : "₹5 - ₹35";

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${cityDetails.name} City Bus Directory — 2,400+ DTC & DIMTS Bus Variants | Sheher Saathi`}
        description={`Official public city bus directory for ${cityDetails.name}. Search all 2,400+ active alphanumeric variants, parent corridors, and stop sequences.`}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="bg-gradient-to-r from-[#2C1E18] via-[#3D2B23] to-[#241712] rounded-[2.5rem] p-8 sm:p-12 text-[#FAF5EF] shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-[#B35D38] text-white text-xs font-black uppercase tracking-widest shadow-md">
              {networkTitle}
            </span>
            <h1 className="text-4xl sm:text-5xl font-marcellus text-[#FAF5EF] leading-tight">
              {cityDetails.name} City Bus Directory &amp; Schedules
            </h1>
            <p className="text-sm sm:text-base text-[#D4C3B3] font-medium leading-relaxed">
              {networkDescription}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#4A362B]">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-[#D98A5B]">{totalCorridors}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66] mt-1">Active Bus Variants</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-[#D98A5B]">{fleetCount}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66] mt-1">Buses Fleet</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-[#D98A5B]">5:00 AM – 11:30 PM</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66] mt-1">Operating Hours</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-[#D98A5B]">{fareRange}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66] mt-1">Tariff Range</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6D6C3] shadow-lg space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(60);
              }}
              placeholder={`Search route variant or stop (e.g. 543A, 764STL, OMS, IIT Delhi, AIIMS, Anand Vihar)...`}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] text-[#2C1E18] font-medium shadow-inner outline-none focus:border-[#B35D38]"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A37B66] text-lg">🔍</span>
          </div>

          {/* Delhi Zonal Series Filters */}
          {isDelhi && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A37B66]">Zonal Series Filters:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: `All Series (${filteredRoutes.length})` },
                  { id: "ZONE_100", label: "100s North" },
                  { id: "ZONE_200", label: "200s East" },
                  { id: "ZONE_300", label: "300s Trans-Yamuna" },
                  { id: "ZONE_400", label: "400s South" },
                  { id: "ZONE_500", label: "500s Express" },
                  { id: "ZONE_600", label: "600s JNU/IIT" },
                  { id: "ZONE_700", label: "700s West" },
                  { id: "ZONE_800", label: "800s Janakpuri" },
                  { id: "ZONE_900", label: "900s Rohini" },
                  { id: "ZONE_MUDRIKA", label: "Mudrika Ring" },
                  { id: "ZONE_AIRPORT", label: "Airport Express" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveZoneFilter(tab.id);
                      setDisplayCount(60);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      activeZoneFilter === tab.id
                        ? "bg-[#B35D38] text-white border-[#B35D38] shadow-md"
                        : "bg-[#FAF5EF] text-[#2C1E18] border-[#E6D6C3] hover:bg-[#FAF1EC]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Operator Filter */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs font-bold uppercase text-[#A37B66]">Operator:</span>
                {["all", "DTC", "DIMTS"].map((op) => (
                  <button
                    key={op}
                    onClick={() => {
                      setActiveOperatorFilter(op);
                      setDisplayCount(60);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      activeOperatorFilter === op
                        ? "bg-[#2C1E18] text-white"
                        : "bg-[#FAF5EF] text-[#543C32] border border-[#E6D6C3]"
                    }`}
                  >
                    {op === "all" ? "All Operators" : op}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Showing Count Indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-[#A37B66] px-2">
          <span>Showing {displayedRoutes.length} of {filteredRoutes.length} active variants</span>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedRoutes.map((route, idx) => {
            const shortName = route.route_short_name || route.busNumber || route.routeNumber || route.routeNo;
            const orig = route.origin || "";
            const dest = route.destination || "";
            const name = route.routeName || (orig && dest ? `${orig} ⇄ ${dest}` : route.name);
            const stopsList = route.stops || [];
            const operator = route.operator || "DTC";
            const isVariant = route.is_variant;
            const totalStops = route.total_stops || stopsList.length;

            return (
              <div
                key={idx}
                onClick={() => setSelectedRoute(route)}
                className="bg-white rounded-3xl border border-[#E6D6C3] p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-[#B35D38] text-white text-xs font-black">
                        {shortName}
                      </span>
                      {isVariant && (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                          Variant
                        </span>
                      )}
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-[#FAF5EF] text-[#543C32] text-xs font-bold border border-[#E6D6C3]">
                      {operator}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#2C1E18] leading-snug">
                    {name}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-[#543C32] font-semibold">
                    <span>⏱️ {route.operatingHours || '05:30 AM - 10:45 PM'}</span>
                    <span>🚏 {totalStops} Stops</span>
                  </div>

                  <div className="border-t border-[#E6D6C3] pt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66]">Key Stops:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {stopsList.slice(0, 4).map((s, i) => (
                        <span key={i} className="text-[11px] font-medium bg-[#FAF5EF] text-[#2C1E18] px-2 py-1 rounded-lg border border-[#E6D6C3]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full py-3 rounded-2xl bg-[#FAF5EF] hover:bg-[#FAF1EC] border border-[#E6D6C3] text-[#B35D38] font-bold text-xs transition text-center"
                >
                  Inspect Full Route Metadata →
                </button>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {displayCount < filteredRoutes.length && (
          <div className="text-center pt-6">
            <button
              onClick={() => setDisplayCount((prev) => prev + 60)}
              className="bg-[#2C1E18] hover:bg-[#3D2B23] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl transition"
            >
              Load More Variants (+60) — {filteredRoutes.length - displayCount} Remaining →
            </button>
          </div>
        )}

        {/* Route Details Modal */}
        {selectedRoute && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-[#E6D6C3] space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 rounded-full bg-[#B35D38] text-white text-xs font-black">
                    {selectedRoute.route_short_name || selectedRoute.busNumber}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#FAF5EF] text-[#2C1E18] text-xs font-bold border border-[#E6D6C3]">
                    Operator: {selectedRoute.operator || 'DTC'}
                  </span>
                  {selectedRoute.parent_route && (
                    <span className="text-xs font-bold text-[#A37B66]">Parent: Route {selectedRoute.parent_route}</span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="w-10 h-10 rounded-full bg-[#FAF5EF] text-[#2C1E18] font-bold hover:bg-gray-200 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <h2 className="text-2xl font-marcellus text-[#2C1E18]">
                {selectedRoute.routeName || `${selectedRoute.origin} ⇄ ${selectedRoute.destination}`}
              </h2>

              <div className="grid grid-cols-3 gap-3 text-xs font-bold text-[#2C1E18]">
                <div className="bg-[#FAF5EF] p-4 rounded-2xl border border-[#E6D6C3]">
                  ⏱️ Operating Hours: <br/><span className="text-[#B35D38]">{selectedRoute.operatingHours || 'Daily'}</span>
                </div>
                <div className="bg-[#FAF5EF] p-4 rounded-2xl border border-[#E6D6C3]">
                  🎟️ Fare Tariff: <br/><span className="text-[#B35D38]">{selectedRoute.fare || '₹5 - ₹25'}</span>
                </div>
                <div className="bg-[#FAF5EF] p-4 rounded-2xl border border-[#E6D6C3]">
                  🚏 Total Corridor Stops: <br/><span className="text-[#B35D38]">{selectedRoute.total_stops || 24} Stops</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#A37B66] mb-3">Key Corridor Sequence:</h4>
                <div className="space-y-2 border-l-2 border-[#B35D38] pl-4">
                  {(selectedRoute.stops || []).map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-medium text-[#2C1E18]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B35D38] -ml-[21px]" />
                      <span>{stop}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
