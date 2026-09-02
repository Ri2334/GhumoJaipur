import React, { useState, useMemo } from "react";
import { busRoutes } from "../data/jaipurBusData";

export default function BusRoutes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'regular', 'ac', 'urban', 'suburban'
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showFareChart, setShowFareChart] = useState(false);

  // Filter routes based on search query and category tab
  const filteredRoutes = useMemo(() => {
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
  }, [searchQuery, activeFilter]);

  // Statistics
  const totalBuses = 200;
  const urbanCount = busRoutes.filter((r) => r.type === "Urban").length;
  const subUrbanCount = busRoutes.filter((r) => r.type === "Sub-Urban").length;
  const acCount = busRoutes.filter((r) => r.service.includes("AC")).length;

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#FAF1EC] border border-[#EBC5B2] opacity-50 pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-block rounded-full bg-[#FAF1EC] border border-[#EBC5B2] px-4 py-1.5 text-xs font-bold text-[#B35D38] tracking-widest uppercase">
              Official JCTSL Network
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-marcellus text-[#2C1E18] leading-tight">
              Jaipur City Bus Directory
            </h1>
            <p className="text-sm sm:text-base text-[#543C32] font-medium leading-relaxed">
              Explore all 27 official bus routes operated by JCTSL (Jaipur City Transport Services Limited). Inspect stop sequences, fares, schedules, and metro transfer points across the Pink City.
            </p>
          </div>

          {/* Quick Network Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#F3E8DB] pt-6">
            <div className="rounded-2xl bg-[#FAF5EF] p-4 border border-[#E6D6C3]">
              <div className="text-2xl sm:text-3xl font-black text-[#B35D38]">27</div>
              <div className="text-xs font-bold text-[#793A1F] uppercase tracking-wider mt-1">Total Routes</div>
            </div>
            <div className="rounded-2xl bg-[#FAF5EF] p-4 border border-[#E6D6C3]">
              <div className="text-2xl sm:text-3xl font-black text-[#B35D38]">200</div>
              <div className="text-xs font-bold text-[#793A1F] uppercase tracking-wider mt-1">Total Buses</div>
            </div>
            <div className="rounded-2xl bg-[#FAF5EF] p-4 border border-[#E6D6C3]">
              <div className="text-xl sm:text-2xl font-black text-[#2C1E18]">5 AM - 9:30 PM</div>
              <div className="text-xs font-bold text-[#793A1F] uppercase tracking-wider mt-1">Daily Service</div>
            </div>
            <div className="rounded-2xl bg-[#FAF5EF] p-4 border border-[#E6D6C3]">
              <div className="text-2xl sm:text-3xl font-black text-[#B35D38]">1,25,000+</div>
              <div className="text-xs font-bold text-[#793A1F] uppercase tracking-wider mt-1">Daily Riders</div>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="rounded-3xl border border-[#E6D6C3] bg-white p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search route number or stop (e.g. 1, Hawa Mahal, Chandpole)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] px-4 py-3.5 pl-11 text-sm font-bold text-[#2C1E18] placeholder-[#A37B66] focus:border-[#B35D38] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B35D38]/20 transition"
              />
              <svg className="absolute left-4 top-4 h-4 w-4 text-[#A37B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-3.5 text-xs font-bold text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              )}
            </div>

            {/* Fare Chart Button */}
            <button
              onClick={() => setShowFareChart((v) => !v)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FAF1EC] border border-[#EBC5B2] px-5 py-3.5 text-xs font-bold text-[#B35D38] hover:bg-[#B35D38] hover:text-white transition shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              {showFareChart ? "Hide Official Fare Chart" : "View JCTSL Fare Chart"}
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 border-t border-[#F3E8DB] pt-4">
            {[
              { id: "all", label: `All Routes (${busRoutes.length})` },
              { id: "regular", label: `Regular / Non-AC (${busRoutes.length - acCount})` },
              { id: "ac", label: `AC Low Floor (${acCount})` },
              { id: "urban", label: `Urban (${urbanCount})` },
              { id: "suburban", label: `Sub-Urban (${subUrbanCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeFilter === tab.id
                    ? "bg-[#B35D38] text-white shadow-md shadow-[#B35D38]/20"
                    : "bg-[#FAF5EF] text-[#543C32] border border-[#E6D6C3] hover:bg-[#FAF1EC] hover:text-[#B35D38]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Official JCTSL Distance Fare Chart */}
        {showFareChart && (
          <div className="rounded-3xl border border-[#E6D6C3] bg-white p-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-xl font-marcellus text-[#2C1E18] mb-4">Official JCTSL Distance Fare Structure</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#E6D6C3] bg-[#FAF5EF] text-[#B35D38] uppercase font-bold text-[11px] tracking-wider">
                    <th className="py-3 px-4">Distance Slab</th>
                    <th className="py-3 px-4">Regular Fare</th>
                    <th className="py-3 px-4">AC Bus Fare</th>
                    <th className="py-3 px-4">Student Pass Fare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3E8DB] text-[#2C1E18]">
                  <tr><td className="py-3 px-4 font-semibold">0 – 2 km</td><td className="py-3 px-4 font-bold text-emerald-700">₹5</td><td className="py-3 px-4 font-bold text-sky-700">₹10</td><td className="py-3 px-4 text-gray-500">₹3</td></tr>
                  <tr><td className="py-3 px-4 font-semibold">2 – 5 km</td><td className="py-3 px-4 font-bold text-emerald-700">₹10</td><td className="py-3 px-4 font-bold text-sky-700">₹15</td><td className="py-3 px-4 text-gray-500">₹5</td></tr>
                  <tr><td className="py-3 px-4 font-semibold">5 – 10 km</td><td className="py-3 px-4 font-bold text-emerald-700">₹15</td><td className="py-3 px-4 font-bold text-sky-700">₹25</td><td className="py-3 px-4 text-gray-500">₹8</td></tr>
                  <tr><td className="py-3 px-4 font-semibold">10 – 15 km</td><td className="py-3 px-4 font-bold text-emerald-700">₹20</td><td className="py-3 px-4 font-bold text-sky-700">₹35</td><td className="py-3 px-4 text-gray-500">₹10</td></tr>
                  <tr><td className="py-3 px-4 font-semibold">15 – 20 km</td><td className="py-3 px-4 font-bold text-emerald-700">₹25</td><td className="py-3 px-4 font-bold text-sky-700">₹40</td><td className="py-3 px-4 text-gray-500">₹12</td></tr>
                  <tr><td className="py-3 px-4 font-semibold">20 – 30 km</td><td className="py-3 px-4 font-bold text-emerald-700">₹30</td><td className="py-3 px-4 font-bold text-sky-700">₹50</td><td className="py-3 px-4 text-gray-500">₹15</td></tr>
                  <tr><td className="py-3 px-4 font-semibold">30 – 40 km</td><td className="py-3 px-4 font-bold text-emerald-700">₹35</td><td className="py-3 px-4 font-bold text-sky-700">₹60</td><td className="py-3 px-4 text-gray-500">₹18</td></tr>
                  <tr><td className="py-3 px-4 font-semibold">40+ km</td><td className="py-3 px-4 font-bold text-emerald-700">₹40</td><td className="py-3 px-4 font-bold text-sky-700">₹70</td><td className="py-3 px-4 text-gray-500">₹20</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Route Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#793A1F]">
            <span>Showing {filteredRoutes.length} of {busRoutes.length} bus routes</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredRoutes.map((route) => {
              const isAC = route.service.includes("AC");
              const fareRange = isAC ? "₹10 - ₹40" : "₹5 - ₹25";

              return (
                <div
                  key={route.routeNo}
                  onClick={() => setSelectedRoute(route)}
                  className="group cursor-pointer rounded-3xl border border-[#E6D6C3] bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#B35D38] hover:shadow-2xl flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl font-black text-white text-lg shadow-md ${isAC ? "bg-sky-600" : "bg-[#B35D38]"}`}>
                          {route.routeNo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-[#FAF5EF] px-2 py-0.5 text-[10px] font-bold text-[#793A1F] uppercase border border-[#E6D6C3]">
                              {route.type}
                            </span>
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border ${isAC ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                              {route.service}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-[#2C1E18] group-hover:text-[#B35D38] transition mt-1">
                            {route.name}
                          </h3>
                        </div>
                      </div>
                      <span className="rounded-xl bg-[#FAF1EC] border border-[#EBC5B2] px-3 py-1 text-xs font-bold text-[#B35D38] whitespace-nowrap">
                        {fareRange}
                      </span>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-4 gap-2 rounded-2xl bg-[#FAF5EF] p-3 text-center text-xs font-medium border border-[#E6D6C3]">
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase font-bold">Length</span>
                        <span className="font-bold text-[#2C1E18]">{route.distanceKm} km</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase font-bold">Stops</span>
                        <span className="font-bold text-[#2C1E18]">{route.stopsCount} stops</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase font-bold">Freq</span>
                        <span className="font-bold text-[#2C1E18]">{route.frequencyMins} mins</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase font-bold">Fleet</span>
                        <span className="font-bold text-[#2C1E18]">{route.busesCount} buses</span>
                      </div>
                    </div>

                    {/* Key Stops Chips */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#A37B66] mb-2">Key Stop Sequence</div>
                      <div className="flex flex-wrap gap-1.5">
                        {route.stops.slice(0, 5).map((stop, idx) => (
                          <span key={idx} className="rounded-lg bg-[#FAF1EC] px-2.5 py-1 text-[11px] font-semibold text-[#543C32]">
                            {stop} {idx < Math.min(4, route.stops.length - 1) ? "→" : ""}
                          </span>
                        ))}
                        {route.stops.length > 5 && (
                          <span className="rounded-lg bg-gray-100 px-2 py-1 text-[11px] font-bold text-gray-500">
                            +{route.stops.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F3E8DB] flex items-center justify-between text-xs font-bold text-[#B35D38] group-hover:translate-x-1 transition-transform">
                    <span>Inspect Stop Sequence & Timings</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Route Inspector Modal */}
        {selectedRoute && (
          <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex justify-center items-start pt-16 sm:pt-24">
            <div className="relative w-full max-w-3xl rounded-3xl border border-[#E6D6C3] bg-white p-6 sm:p-8 shadow-2xl space-y-6 my-4 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Sticky Top Close Header */}
              <div className="sticky -top-6 -mx-6 -mt-6 sm:-top-8 sm:-mx-8 sm:-mt-8 z-30 flex items-center justify-between border-b border-[#F3E8DB] bg-white/95 backdrop-blur px-6 py-4 rounded-t-3xl shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#B35D38] animate-pulse" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#B35D38]">JCTSL Bus Inspector</span>
                </div>
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="flex items-center gap-2 rounded-xl bg-[#B35D38] px-4 py-2 text-xs font-bold text-white hover:bg-[#964B2A] transition shadow"
                >
                  <span className="text-base font-black">✕</span>
                  <span>Close</span>
                </button>
              </div>

              {/* Header */}
              <div className="space-y-2 border-b border-[#F3E8DB] pb-4">
                <div className="flex items-center gap-2">
                  <span className={`rounded-xl px-3 py-1 text-xs font-black text-white ${selectedRoute.service.includes("AC") ? "bg-sky-600" : "bg-[#B35D38]"}`}>
                    Route {selectedRoute.routeNo}
                  </span>
                  <span className="rounded-xl bg-[#FAF5EF] border border-[#E6D6C3] px-3 py-1 text-xs font-bold text-[#793A1F]">
                    {selectedRoute.type} Service
                  </span>
                </div>
                <h2 className="text-2xl font-marcellus text-[#2C1E18]">{selectedRoute.name}</h2>
              </div>

              {/* Route Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-[#FAF5EF] p-3 text-center border border-[#E6D6C3]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Distance</span>
                  <span className="block text-base font-bold text-[#2C1E18]">{selectedRoute.distanceKm} km</span>
                </div>
                <div className="rounded-2xl bg-[#FAF5EF] p-3 text-center border border-[#E6D6C3]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Total Stops</span>
                  <span className="block text-base font-bold text-[#2C1E18]">{selectedRoute.stopsCount} stops</span>
                </div>
                <div className="rounded-2xl bg-[#FAF5EF] p-3 text-center border border-[#E6D6C3]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Frequency</span>
                  <span className="block text-base font-bold text-[#2C1E18]">Every {selectedRoute.frequencyMins} mins</span>
                </div>
                <div className="rounded-2xl bg-[#FAF5EF] p-3 text-center border border-[#E6D6C3]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Operating Hours</span>
                  <span className="block text-xs font-bold text-[#2C1E18] mt-1">05:00 - 21:30</span>
                </div>
              </div>

              {/* Vertical Stops Sequence Timeline */}
              <div className="space-y-3">
                <h3 className="text-lg font-marcellus text-[#2C1E18]">Complete Stop Sequence</h3>
                <div className="max-h-80 overflow-y-auto rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] p-4 space-y-3">
                  {selectedRoute.stops.map((stop, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 flex flex-col items-center">
                        <div className={`h-3.5 w-3.5 rounded-full ${idx === 0 ? "bg-[#B35D38] ring-4 ring-[#FAF1EC]" : idx === selectedRoute.stops.length - 1 ? "bg-[#2C1E18] ring-4 ring-gray-200" : "bg-[#D98A5B]"}`} />
                        {idx < selectedRoute.stops.length - 1 && <div className="h-6 w-0.5 bg-[#E6D6C3]" />}
                      </div>
                      <div>
                        <span className="font-bold text-[#2C1E18] text-xs sm:text-sm">{stop}</span>
                        {idx === 0 && <span className="ml-2 text-[10px] font-extrabold text-[#B35D38] uppercase">Origin Depot</span>}
                        {idx === selectedRoute.stops.length - 1 && <span className="ml-2 text-[10px] font-extrabold text-[#2C1E18] uppercase">Destination Terminal</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metro Connections Notice */}
              <div className="rounded-2xl bg-[#FAF1EC] border border-[#EBC5B2] p-4 flex items-center gap-3">
                <span className="text-xl">🚇</span>
                <div className="text-xs text-[#543C32]">
                  <span className="font-bold text-[#2C1E18]">Jaipur Metro Interchange Available:</span> Connects with Jaipur Metro Pink Line at Chandpole, Railway Station, Sindhi Camp, and Badi Chopad.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="rounded-xl bg-[#B35D38] text-white px-6 py-3 text-xs font-bold hover:bg-[#964B2A] transition shadow-md"
                >
                  Close Route Inspector
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
