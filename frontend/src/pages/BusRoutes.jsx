import React, { useState, useMemo, useContext } from "react";
import { busRoutes } from "../data/jaipurBusData";
import { UCTSL_BUS_ROUTES } from "../data/udaipurTransitEngine";
import { CityContext } from "../context/CityContext";
import SEOHead from "../components/SEOHead";

export default function BusRoutes() {
  const { currentCity, cityDetails } = useContext(CityContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedRoute, setSelectedRoute] = useState(null);

  const isUdaipur = currentCity === "udaipur";

  // Filter routes based on active city, search query, and category tab
  const filteredRoutes = useMemo(() => {
    if (isUdaipur) {
      return UCTSL_BUS_ROUTES.filter((r) => {
        const matchSearch =
          searchQuery.trim() === "" ||
          r.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.stops.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchSearch;
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
  }, [isUdaipur, searchQuery, activeFilter]);

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
              {isUdaipur ? "UCTSL MUNICIPAL NETWORK 🌅" : "OFFICIAL JCTSL NETWORK 🏰"}
            </span>
            <h1 className="text-4xl sm:text-6xl font-marcellus leading-tight">
              {cityDetails.name} City Bus <br />
              <span className="text-[#D98A5B]">Directory &amp; Schedules</span>
            </h1>
            <p className="text-sm sm:text-base text-[#E6D6C3] font-medium leading-relaxed">
              {isUdaipur
                ? "Explore official Udaipur City Transport Services Limited (UCTSL) corridor lines, Airport Express Shuttles, and stop-by-stop sequences."
                : "Explore all 27 official bus routes operated by JCTSL in Jaipur. Inspect stop sequences, fares, and transit transfer points."}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl border border-[#E6D6C3] p-5 shadow-lg">
            <div className="text-3xl font-black text-[#B35D38]">{isUdaipur ? "6" : "27"}</div>
            <div className="text-xs font-bold text-[#543C32] uppercase mt-1">Active Corridors</div>
          </div>
          <div className="bg-white rounded-3xl border border-[#E6D6C3] p-5 shadow-lg">
            <div className="text-3xl font-black text-[#B35D38]">{isUdaipur ? "24" : "200"}</div>
            <div className="text-xs font-bold text-[#543C32] uppercase mt-1">Buses Fleet</div>
          </div>
          <div className="bg-white rounded-3xl border border-[#E6D6C3] p-5 shadow-lg">
            <div className="text-3xl font-black text-[#B35D38]">6:00 AM - 9:00 PM</div>
            <div className="text-xs font-bold text-[#543C32] uppercase mt-1">Operating Hours</div>
          </div>
          <div className="bg-white rounded-3xl border border-[#E6D6C3] p-5 shadow-lg">
            <div className="text-3xl font-black text-[#B35D38]">{isUdaipur ? "₹10 - ₹100" : "₹5 - ₹35"}</div>
            <div className="text-xs font-bold text-[#543C32] uppercase mt-1">Tariff Range</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-3xl border border-[#E6D6C3] shadow-lg">
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-base">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search route number or stop (e.g. ${isUdaipur ? "Cheetak Circle, Surajpole, Badgaon" : "Hawa Mahal, Sanganer"})`}
              className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-[#2C1E18] outline-none focus:border-[#B35D38]"
            />
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRoutes.map((r) => (
            <div key={r.id || r.routeNo} className="bg-white rounded-3xl border border-[#E6D6C3] p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-[#B35D38] text-white text-xs font-black uppercase shadow-md">
                  {r.routeNumber || `Bus ${r.routeNo}`}
                </span>
                <span className="text-xs font-bold text-[#D98A5B] bg-[#FAF1EC] px-3 py-1 rounded-full border border-[#EBC5B2]">
                  {r.fare || `Fare ₹${r.fareMin || 5} - ₹${r.fareMax || 25}`}
                </span>
              </div>

              <h3 className="font-marcellus text-2xl text-[#2C1E18]">
                {r.routeName || r.name}
              </h3>

              <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#543C32]">
                {r.operatingHours && <span>⏰ {r.operatingHours}</span>}
                {r.headway && <span>• ⏱️ {r.headway}</span>}
                {r.busesAssigned && <span>• 🚌 {r.busesAssigned} Buses Fleet</span>}
              </div>

              <div className="pt-3 border-t border-[#E6D6C3] space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#A37B66]">Stop Sequence:</div>
                <div className="flex flex-wrap gap-1.5">
                  {r.stops.map((stop, idx) => (
                    <span key={idx} className="text-[11px] font-semibold bg-[#FAF5EF] text-[#2C1E18] px-2.5 py-1 rounded-lg border border-[#E6D6C3]">
                      {stop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
