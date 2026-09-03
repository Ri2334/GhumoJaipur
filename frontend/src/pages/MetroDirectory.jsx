import React, { useState, useMemo, useContext } from "react";
import { jaipurMetroStations } from "../data/jaipurMetroData";
import { DELHI_METRO_LINES } from "../data/delhiMetroData";
import { CityContext } from "../context/CityContext";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

export default function MetroDirectory() {
  const { currentCity, cityDetails } = useContext(CityContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);

  const isDelhi = currentCity === "delhi";
  const isUdaipur = currentCity === "udaipur";

  if (isUdaipur) {
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
              to="/transport"
              className="w-full sm:w-auto bg-[#FAF1EC] text-[#B35D38] border border-[#EBC5B2] px-8 py-4 rounded-2xl font-bold text-sm hover:bg-[#F3E8DB] transition"
            >
              Search Udaipur Routes →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Delhi Metro DMRC view vs Jaipur Metro JMRC view
  const headerTitle = isDelhi ? "Delhi Metro (DMRC) Directory" : "Jaipur Metro (JMRC) Stations Directory";
  const headerTagline = isDelhi 
    ? "Explore DMRC's world-class rapid transit network: Yellow Line, Blue Line, Violet Line, & Airport Express." 
    : "Find all Jaipur Metro Pink Line stations with real-time facilities, operating hours, and train frequencies.";

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${cityDetails.name} Metro Directory — Stations & Schedules | Sheher Saathi`}
        description={`Complete station directory and schedules for ${cityDetails.name} Metro.`}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="bg-gradient-to-r from-[#2C1E18] via-[#3D2B23] to-[#241712] rounded-[2.5rem] p-8 sm:p-12 text-[#FAF5EF] shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-[#B35D38] text-white text-xs font-black uppercase tracking-widest shadow-md">
              {isDelhi ? "DMRC METRO NETWORK 🕌" : "PINK LINE • 11 ACTIVE STATIONS 🏰"}
            </span>
            <h1 className="text-4xl sm:text-5xl font-marcellus text-[#FAF5EF] leading-tight">
              {headerTitle}
            </h1>
            <p className="text-sm sm:text-base text-[#D4C3B3] font-medium leading-relaxed">
              {headerTagline}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#4A362B]">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-[#D98A5B]">{isDelhi ? "286+" : "11"}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66] mt-1">Active Stations</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-[#D98A5B]">{isDelhi ? "390 km" : "12 km"}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66] mt-1">Corridor Length</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-[#D98A5B]">5:30 AM – 11:30 PM</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66] mt-1">Operating Hours</div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-[#D98A5B]">2–5 min</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66] mt-1">Train Frequency</div>
            </div>
          </div>
        </div>

        {/* Delhi Metro Lines Showcase */}
        {isDelhi && (
          <div className="space-y-6">
            <h2 className="text-2xl font-marcellus text-[#2C1E18]">DMRC Active Corridors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DELHI_METRO_LINES.map((line, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-[#E6D6C3] p-6 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: line.color }} />
                      <h3 className="text-xl font-bold text-[#2C1E18]">{line.name}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-[#FAF5EF] text-xs font-bold text-[#543C32] border border-[#E6D6C3]">
                      Wait: {line.averageWaitTime} min
                    </span>
                  </div>
                  <p className="text-xs text-[#543C32] font-semibold">
                    ⏱️ Hours: {line.firstTrain} AM - {line.lastTrain} PM
                  </p>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A37B66]">Key Interchange Stations:</span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {line.stations.map((st, sIdx) => (
                        <span key={sIdx} className={`text-xs font-bold px-3 py-1 rounded-xl border ${st.interchange ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-[#FAF5EF] text-[#2C1E18] border-[#E6D6C3]'}`}>
                          {st.name} {st.interchange && '🔄'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jaipur Metro Stations Showcase */}
        {!isDelhi && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jaipurMetroStations.map((st, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-[#E6D6C3] p-6 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-[#B35D38] text-white text-xs font-bold">
                    Pink Line
                  </span>
                  <span className="text-xs font-bold text-[#543C32]">{st.zone} Zone</span>
                </div>
                <h3 className="text-xl font-bold text-[#2C1E18]">{st.name}</h3>
                <p className="text-xs text-[#543C32] font-medium">{st.location}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
