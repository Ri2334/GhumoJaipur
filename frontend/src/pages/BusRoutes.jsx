import React, { useState, useMemo, useContext } from "react";
import { busRoutes } from "../data/jaipurBusData";
import { UCTSL_BUS_ROUTES } from "../data/udaipurTransitEngine";
import { DTC_BUS_ROUTES } from "../data/delhiDTCBusCatalog";
import { CityContext } from "../context/CityContext";
import SEOHead from "../components/SEOHead";

export default function BusRoutes() {
  const { currentCity, cityDetails } = useContext(CityContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedRoute, setSelectedRoute] = useState(null);

  const isUdaipur = currentCity === "udaipur";
  const isDelhi = currentCity === "delhi";

  // Filter routes based on active city, search query, and category tab
  const filteredRoutes = useMemo(() => {
    if (isDelhi) {
      return DTC_BUS_ROUTES.filter((r) => {
        return (
          searchQuery.trim() === "" ||
          r.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.stops.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
    }

    if (isUdaipur) {
      return UCTSL_BUS_ROUTES.filter((r) => {
        return (
          searchQuery.trim() === "" ||
          r.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.stops.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
    }

    return busRoutes.filter((r) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        r.routeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.stops.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (activeFilter === "regular") return !r.service.includes("AC");
      if (activeFilter === "ac") return r.service.includes("AC");
      if (activeFilter === "urban") return r.type === "Urban";
      if (activeFilter === "suburban") return r.type === "Sub-Urban";

      return true;
    });
  }, [isDelhi, isUdaipur, searchQuery, activeFilter]);

  const networkTitle = isDelhi
    ? "OFFICIAL DTC & DIMTS NETWORK 🕌"
    : isUdaipur
    ? "UCTSL MUNICIPAL NETWORK 🌅"
    : "OFFICIAL JCTSL NETWORK 🏰";

  const networkDescription = isDelhi
    ? "Explore official electric and AC bus routes operated by DTC in Delhi. Inspect stop sequences, fares, and transit transfer points."
    : isUdaipur
    ? "Explore official electric and AC bus corridors operated by UCTSL in Udaipur."
    : "Explore all 27 official bus routes operated by JCTSL in Jaipur. Inspect stop sequences, fares, and transit transfer points.";

  const totalCorridors = isDelhi ? DTC_BUS_ROUTES.length : isUdaipur ? UCTSL_BUS_ROUTES.length : busRoutes.length;
  const fleetCount = isDelhi ? "6,000+" : isUdaipur ? "50+" : "200";
  const fareRange = isDelhi ? "₹5 - ₹25" : isUdaipur ? "₹10 - ₹30" : "₹5 - ₹35";

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${cityDetails.name} City Bus Directory — Routes & Stop Sequences | Sheher Saathi`}
        description={`Official public city bus directory for ${cityDetails.name}. Inspect route maps, stops, frequencies, and fares.`}
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
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66] mt-1">Active Corridors</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-[#D98A5B]">{fleetCount}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66] mt-1">Buses Fleet</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-[#D98A5B]">5:30 AM – 11 PM</div>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search route number or stop (e.g. ${isDelhi ? 'Route 419, Rajiv Chowk, Red Fort' : isUdaipur ? 'Route 1, Chetak Circle, Fatehsagar' : 'AC 1, Hawa Mahal, Sanganer'})...`}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] text-[#2C1E18] font-medium shadow-inner outline-none focus:border-[#B35D38]"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A37B66] text-lg">🔍</span>
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route, idx) => {
            const number = route.busNumber || route.routeNumber || route.routeNo;
            const name = route.routeName || route.name;
            const stopsList = route.stops || [];

            return (
              <div
                key={idx}
                onClick={() => setSelectedRoute(route)}
                className="bg-white rounded-3xl border border-[#E6D6C3] p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-[#B35D38] text-white text-xs font-black">
                      {number}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-[#FAF5EF] text-[#543C32] text-xs font-bold border border-[#E6D6C3]">
                      Fare: {route.fare}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#2C1E18] leading-snug">
                    {name}
                  </h3>

                  <p className="text-xs text-[#543C32] font-semibold">
                    ⏱️ Hours: {route.operatingHours || route.frequency || 'Daily Operations'}
                  </p>

                  <div className="border-t border-[#E6D6C3] pt-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66]">Key Stops ({stopsList.length}):</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {stopsList.slice(0, 4).map((s, i) => (
                        <span key={i} className="text-[11px] font-medium bg-[#FAF5EF] text-[#2C1E18] px-2 py-1 rounded-lg border border-[#E6D6C3]">
                          {s}
                        </span>
                      ))}
                      {stopsList.length > 4 && (
                        <span className="text-[11px] font-bold text-[#B35D38] self-center">
                          +{stopsList.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full py-3 rounded-2xl bg-[#FAF5EF] hover:bg-[#FAF1EC] border border-[#E6D6C3] text-[#B35D38] font-bold text-xs transition text-center"
                >
                  View Full Stop Sequence →
                </button>
              </div>
            );
          })}
        </div>

        {/* Route Details Modal */}
        {selectedRoute && (
          <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-[#E6D6C3] space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="px-4 py-1.5 rounded-full bg-[#B35D38] text-white text-xs font-black">
                  {selectedRoute.busNumber || selectedRoute.routeNumber || selectedRoute.routeNo}
                </span>
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="w-10 h-10 rounded-full bg-[#FAF5EF] text-[#2C1E18] font-bold hover:bg-gray-200 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <h2 className="text-2xl font-marcellus text-[#2C1E18]">
                {selectedRoute.routeName || selectedRoute.name}
              </h2>

              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-[#2C1E18]">
                <div className="bg-[#FAF5EF] p-4 rounded-2xl border border-[#E6D6C3]">
                  ⏱️ Operating Hours: <span className="text-[#B35D38]">{selectedRoute.operatingHours || 'Daily'}</span>
                </div>
                <div className="bg-[#FAF5EF] p-4 rounded-2xl border border-[#E6D6C3]">
                  🎟️ Fare Tariff: <span className="text-[#B35D38]">{selectedRoute.fare}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#A37B66] mb-3">Complete Stop Sequence:</h4>
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
