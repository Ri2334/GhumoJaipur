import React, { useState, useMemo, useContext } from "react";
import { jaipurMetroStations } from "../data/jaipurMetroData";
import { CityContext } from "../context/CityContext";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

export default function MetroDirectory() {
  const { currentCity, cityDetails } = useContext(CityContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeZone, setActiveZone] = useState("all");
  const [selectedStation, setSelectedStation] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  if (currentCity === "udaipur") {
    return (
      <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-16 px-4 sm:px-6 lg:px-8">
        <SEOHead
          title="Udaipur Transit Guide — City Buses, Lake Ferries & Cable Car | Sheher Saathi"
          description="Udaipur is a UNESCO Heritage Lake City with zero metro railway lines. Urban transit is operated by high-frequency UCTSL Electric Buses, Lake Ferries, and Cable Car Ropeway."
        />
        <div className="max-w-3xl mx-auto text-center space-y-8 bg-white p-10 sm:p-14 rounded-[2.5rem] border border-[#E6D6C3] shadow-2xl">
          <div className="text-6xl">🌅</div>
          <h1 className="text-4xl sm:text-5xl font-marcellus text-[#2C1E18]">
            Udaipur Transit Network
          </h1>
          <p className="text-base text-[#543C32] font-medium leading-relaxed">
            Udaipur is a preserved UNESCO Heritage Lake City with zero underground or elevated Metro railway lines. 
            Urban public transport is operated by high-frequency <strong>UCTSL Electric Buses</strong>, <strong>Lake Pichola &amp; Fatehsagar Ferries</strong>, and the <strong>Karni Mata Cable Car Ropeway</strong>.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/bus-routes"
              className="w-full sm:w-auto bg-[#B35D38] hover:bg-[#964B2A] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl transition"
            >
              View Udaipur City Bus Directory →
            </Link>
            <Link
              to="/udaipur-transit"
              className="w-full sm:w-auto bg-[#FAF1EC] text-[#B35D38] border border-[#EBC5B2] px-8 py-4 rounded-2xl font-bold text-sm hover:bg-[#F3E8DB] transition"
            >
              View Lake Ferries &amp; Ropeway →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Journey planner states inside modal
  const [targetStationId, setTargetStationId] = useState("badi_chaupar");

  const filteredStations = useMemo(() => {
    return jaipurMetroStations.filter((st) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.nearbyLandmarks.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (activeZone === "central") return st.zone === "Central";
      if (activeZone === "west") return st.zone === "West";
      if (activeZone === "terminal") return st.terminal || st.facilities.includes("Interchange");

      return true;
    });
  }, [searchQuery, activeZone]);

  // Journey fare & time calculator
  const journeyDetails = useMemo(() => {
    if (!selectedStation) return null;
    const target = jaipurMetroStations.find((s) => s.id === targetStationId) || jaipurMetroStations[10];
    
    // Find index order in Pink Line sequence
    const stationOrder = [
      "mansarovar", "new_aatish_market", "vivek_vihar", "shyam_nagar", "ram_nagar",
      "civil_lines", "railway_station", "sindhi_camp", "chandpole", "chhoti_chaupar", "badi_chaupar"
    ];
    
    const idx1 = stationOrder.indexOf(selectedStation.id);
    const idx2 = stationOrder.indexOf(target.id);
    const count = Math.abs(idx1 - idx2);

    if (count === 0) {
      return { fare: 0, time: 0, stops: 0, targetName: target.name };
    }

    const fare = count <= 2 ? 10 : count <= 5 ? 15 : count <= 8 ? 18 : 20;
    const time = count * 2 + 2;

    return { fare, time, stops: count, targetName: target.name };
  }, [selectedStation, targetStationId]);

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Header */}
        <div className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl relative overflow-hidden text-center sm:text-left">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-[#FAF1EC] border border-[#EBC5B2] opacity-40 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 border border-pink-200 px-4 py-1.5 text-xs font-bold text-pink-700 tracking-wider uppercase">
              <span className="h-2 w-2 rounded-full bg-pink-500 animate-ping" />
              Pink Line • 11 Active Stations
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-marcellus text-[#2C1E18] leading-tight">
              Jaipur Metro Stations Directory
            </h1>
            <p className="text-sm sm:text-base text-[#543C32] font-medium leading-relaxed">
              Find all Jaipur Metro Pink Line stations with real-time facilities, operating hours, train frequencies, first/last train timings, fare guides, and nearby UNESCO heritage places.
            </p>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#F3E8DB] pt-6">
            <div className="rounded-2xl bg-[#FAF5EF] p-4 border border-[#E6D6C3]">
              <div className="text-2xl sm:text-3xl font-black text-pink-600">11</div>
              <div className="text-xs font-bold text-[#793A1F] uppercase tracking-wider mt-1">Active Stations</div>
            </div>
            <div className="rounded-2xl bg-[#FAF5EF] p-4 border border-[#E6D6C3]">
              <div className="text-2xl sm:text-3xl font-black text-[#B35D38]">12 km</div>
              <div className="text-xs font-bold text-[#793A1F] uppercase tracking-wider mt-1">Pink Line Corridor</div>
            </div>
            <div className="rounded-2xl bg-[#FAF5EF] p-4 border border-[#E6D6C3]">
              <div className="text-xl sm:text-2xl font-black text-[#2C1E18]">5 AM - 11 PM</div>
              <div className="text-xs font-bold text-[#793A1F] uppercase tracking-wider mt-1">Operating Hours</div>
            </div>
            <div className="rounded-2xl bg-[#FAF5EF] p-4 border border-[#E6D6C3]">
              <div className="text-2xl sm:text-3xl font-black text-[#B35D38]">3-10 min</div>
              <div className="text-xs font-bold text-[#793A1F] uppercase tracking-wider mt-1">Train Frequency</div>
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
                placeholder="Search stations, areas, or places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] px-4 py-3.5 pl-11 text-sm font-bold text-[#2C1E18] placeholder-[#A37B66] focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition"
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

            {/* Metro Fare Banner */}
            <div className="flex items-center gap-3 bg-pink-50 border border-pink-200 px-4 py-3 rounded-2xl text-xs font-bold text-pink-800">
              <span>🎟️ Fare Range: ₹10 – ₹60</span>
              <span className="h-4 w-px bg-pink-200" />
              <span>💳 Smart Card: 5% Discount</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 border-t border-[#F3E8DB] pt-4">
            {[
              { id: "all", label: `All Stations (${jaipurMetroStations.length})` },
              { id: "central", label: "Central Zone (Underground & Heritage)" },
              { id: "west", label: "West Zone (Elevated Corridor)" },
              { id: "terminal", label: "Terminals & Interchanges" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveZone(tab.id)}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeZone === tab.id
                    ? "bg-pink-600 text-white shadow-md shadow-pink-600/20"
                    : "bg-[#FAF5EF] text-[#543C32] border border-[#E6D6C3] hover:bg-pink-50 hover:text-pink-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stations Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#793A1F]">
            <span>Showing {filteredStations.length} of {jaipurMetroStations.length} Pink Line stations</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStations.map((station) => (
              <div
                key={station.id}
                onClick={() => {
                  setSelectedStation(station);
                  setOpenFaqIndex(null);
                  setTargetStationId(station.id === "badi_chaupar" ? "mansarovar" : "badi_chaupar");
                }}
                className="group cursor-pointer rounded-3xl border border-[#E6D6C3] bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-500 hover:shadow-2xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Station Title & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex items-center gap-1.5 rounded-md bg-pink-100 px-2.5 py-0.5 text-[10px] font-bold text-pink-700 uppercase border border-pink-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                          Pink Line
                        </span>
                        <span className="rounded-md bg-[#FAF5EF] px-2 py-0.5 text-[10px] font-bold text-[#793A1F] uppercase border border-[#E6D6C3]">
                          {station.zone} Zone
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#2C1E18] group-hover:text-pink-600 transition">
                        {station.name}
                      </h3>
                    </div>
                    {station.terminal && (
                      <span className="rounded-xl bg-amber-100 border border-amber-300 px-2.5 py-1 text-[10px] font-extrabold text-amber-800 uppercase">
                        Terminal
                      </span>
                    )}
                  </div>

                  {/* Location Subtitle */}
                  <p className="text-xs font-semibold text-[#543C32] line-clamp-1">
                    📍 {station.location}
                  </p>

                  {/* Facility Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {station.facilities.map((fac, idx) => (
                      <span key={idx} className="rounded-lg bg-[#FAF5EF] border border-[#E6D6C3] px-2.5 py-1 text-[11px] font-medium text-gray-700">
                        {fac}
                      </span>
                    ))}
                  </div>

                  {/* Nearby Landmarks */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#A37B66] mb-1.5">Nearby Landmarks</div>
                    <div className="flex flex-wrap gap-1">
                      {station.nearbyLandmarks.slice(0, 3).map((lm, idx) => (
                        <span key={idx} className="rounded-md bg-[#FAF1EC] px-2 py-0.5 text-[11px] font-semibold text-[#543C32]">
                          • {lm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="mt-6 pt-4 border-t border-[#F3E8DB] flex items-center justify-between text-xs font-bold text-pink-600 group-hover:translate-x-1 transition-transform">
                  <span>Station Info & 10 FAQs</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Station Details & FAQ Inspector Modal */}
        {selectedStation && (
          <div className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex justify-center items-start pt-16 sm:pt-24">
            <div className="relative w-full max-w-4xl rounded-3xl border border-[#E6D6C3] bg-white p-6 sm:p-8 shadow-2xl space-y-6 my-4 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Sticky Top Close Header */}
              <div className="sticky -top-6 -mx-6 -mt-6 sm:-top-8 sm:-mx-8 sm:-mt-8 z-30 flex items-center justify-between border-b border-[#F3E8DB] bg-white/95 backdrop-blur px-6 py-4 rounded-t-3xl shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#B35D38]">Station Inspector & FAQs</span>
                </div>
                <button
                  onClick={() => setSelectedStation(null)}
                  className="flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white hover:bg-pink-700 transition shadow"
                >
                  <span className="text-base font-black">✕</span>
                  <span>Close</span>
                </button>
              </div>

              {/* Station Header */}
              <div className="space-y-2 border-b border-[#F3E8DB] pb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-xl bg-pink-600 px-3 py-1 text-xs font-black text-white">
                    Pink Line Metro
                  </span>
                  <span className="rounded-xl bg-[#FAF5EF] border border-[#E6D6C3] px-3 py-1 text-xs font-bold text-[#793A1F]">
                    {selectedStation.zone} Zone
                  </span>
                  {selectedStation.terminal && (
                    <span className="rounded-xl bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-extrabold text-amber-800">
                      Terminal Station
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-marcellus text-[#2C1E18]">
                  {selectedStation.name} Metro Station
                </h2>
                <p className="text-xs sm:text-sm text-[#543C32] font-semibold">
                  📍 {selectedStation.location}
                </p>
              </div>

              {/* Station Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-[#FAF5EF] p-4 text-center border border-[#E6D6C3]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Operating Hours</span>
                  <span className="block text-sm font-bold text-[#2C1E18] mt-1">{selectedStation.operatingHours}</span>
                </div>
                <div className="rounded-2xl bg-[#FAF5EF] p-4 text-center border border-[#E6D6C3]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">First / Last Train</span>
                  <span className="block text-xs font-bold text-[#2C1E18] mt-1">{selectedStation.firstTrain} / {selectedStation.lastLast || selectedStation.lastTrain}</span>
                </div>
                <div className="rounded-2xl bg-[#FAF5EF] p-4 text-center border border-[#E6D6C3]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Peak Frequency</span>
                  <span className="block text-sm font-bold text-pink-600 mt-1">{selectedStation.peakFrequency}</span>
                </div>
                <div className="rounded-2xl bg-[#FAF5EF] p-4 text-center border border-[#E6D6C3]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Fare Range</span>
                  <span className="block text-sm font-bold text-emerald-700 mt-1">{selectedStation.fareRange}</span>
                </div>
              </div>

              {/* Journey Planner Widget Inside Modal */}
              <div className="rounded-3xl border border-pink-200 bg-pink-50/50 p-6 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-pink-800">
                  <span>🚇 Quick Journey & Fare Calculator from {selectedStation.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <span className="text-xs font-bold text-[#543C32]">Select Destination:</span>
                  <select
                    value={targetStationId}
                    onChange={(e) => setTargetStationId(e.target.value)}
                    className="flex-1 rounded-xl border border-[#E6D6C3] bg-white px-3.5 py-2.5 text-xs font-bold text-[#2C1E18] focus:outline-none"
                  >
                    {jaipurMetroStations
                      .filter((s) => s.id !== selectedStation.id)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.zone} Zone)
                        </option>
                      ))}
                  </select>
                </div>

                {journeyDetails && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-pink-200">
                    <div className="text-xs">
                      <span className="text-gray-500">Route:</span>{" "}
                      <span className="font-bold text-[#2C1E18]">{selectedStation.name} → {journeyDetails.targetName}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div><span className="text-gray-500">Stops:</span> <span className="font-bold text-[#2C1E18]">{journeyDetails.stops}</span></div>
                      <div><span className="text-gray-500">Est. Time:</span> <span className="font-bold text-[#2C1E18]">{journeyDetails.time} mins</span></div>
                      <div><span className="text-gray-500">Token Fare:</span> <span className="font-bold text-emerald-700">₹{journeyDetails.fare}</span></div>
                    </div>
                  </div>
                )}
              </div>

              {/* 10 Frequently Asked Questions Accordion */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#F3E8DB] pb-3">
                  <h3 className="text-xl font-marcellus text-[#2C1E18]">
                    Frequently Asked Questions ({selectedStation.faqs.length} FAQs)
                  </h3>
                  <span className="text-xs font-bold text-[#B35D38]">Online Verified Answers</span>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {selectedStation.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-[#E6D6C3] bg-[#FAF5EF] overflow-hidden transition"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-[#2C1E18] hover:bg-[#FAF1EC]"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-[#B35D38] font-black">Q{idx + 1}.</span>
                          {faq.q}
                        </span>
                        <span className="text-[#B35D38] font-bold text-base ml-2">
                          {openFaqIndex === idx ? "−" : "+"}
                        </span>
                      </button>
                      {openFaqIndex === idx && (
                        <div className="px-4 pb-4 text-xs sm:text-sm font-medium text-[#543C32] bg-white border-t border-[#F3E8DB] pt-3 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Tips Footer */}
              <div className="rounded-2xl bg-[#FAF5EF] border border-[#E6D6C3] p-4 space-y-2">
                <div className="text-xs font-bold text-[#B35D38] uppercase tracking-wider">💡 Jaipur Metro Commuter Tips</div>
                <ul className="text-xs text-[#543C32] font-medium space-y-1 list-disc pl-4">
                  <li>Use a Jaipur Metro Smart Card for an automatic 5% fare discount on all trips.</li>
                  <li>Stand on the right side of escalators to allow passing room on the left.</li>
                  <li>Keep your QR code token or smart card accessible for exit gate scanning.</li>
                </ul>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedStation(null)}
                  className="rounded-xl bg-pink-600 text-white px-6 py-3 text-xs font-bold hover:bg-pink-700 transition shadow-md"
                >
                  Close Station Inspector
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
