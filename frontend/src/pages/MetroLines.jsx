import React, { useContext } from "react";
import { DELHI_METRO_LINES } from "../data/delhiMetroData";
import { jaipurMetroLines } from "../data/jaipurMetroData";
import { CityContext } from "../context/CityContext";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

export default function MetroLines() {
  const { currentCity, cityDetails } = useContext(CityContext);

  const isDelhi = currentCity === "delhi";
  const isUdaipur = currentCity === "udaipur";

  if (isUdaipur) {
    return (
      <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-16 px-4 sm:px-6 lg:px-8">
        <SEOHead
          title="Udaipur Transit Guide — City Buses & Lake Ferries | Sheher Saathi"
          description="Udaipur is a UNESCO Heritage Lake City with zero metro railway lines."
        />
        <div className="max-w-3xl mx-auto text-center space-y-8 bg-white p-10 sm:p-14 rounded-[2.5rem] border border-[#E6D6C3] shadow-2xl">
          <div className="text-6xl">🌅</div>
          <h1 className="text-4xl sm:text-5xl font-marcellus text-[#2C1E18]">
            Udaipur Transit Lines
          </h1>
          <p className="text-base text-[#543C32] font-medium leading-relaxed">
            Udaipur is a preserved UNESCO Heritage Lake City with zero metro railway lines. 
            Urban public transport is operated by high-frequency <strong>UCTSL Electric Buses</strong>, <strong>Lake Pichola &amp; Fatehsagar Ferries</strong>, and the <strong>Karni Mata Cable Car Ropeway</strong>.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              to="/bus-routes"
              className="bg-[#B35D38] hover:bg-[#964B2A] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl transition"
            >
              View Udaipur City Bus Lines →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const networkTitle = isDelhi ? "DMRC TRANSIT NETWORK 🕌" : "JMRC TRANSIT NETWORK 🏰";
  const headerTitle = isDelhi ? "Delhi Metro (DMRC) Lines" : "Jaipur Metro Lines";
  const headerDescription = isDelhi 
    ? "Explore DMRC's rapid transit network connecting Delhi NCR with Yellow Line, Blue Line, Violet Line, & Airport Express." 
    : "Explore JMRC's rapid transit network connecting the Pink City with active operational corridors.";

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${cityDetails.name} Metro Lines — Active & Operational Corridors | Sheher Saathi`}
        description={`Detailed guide to ${cityDetails.name} Metro lines, station sequences, operating hours, and frequencies.`}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-[#B35D38]/10 text-[#B35D38] border border-[#B35D38]/20 text-xs font-black uppercase tracking-widest">
            {networkTitle}
          </span>
          <h1 className="text-4xl sm:text-5xl font-marcellus text-[#2C1E18]">
            {headerTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#543C32] font-medium leading-relaxed">
            {headerDescription}
          </p>
        </div>

        {/* Delhi Lines */}
        {isDelhi && (
          <div className="space-y-6">
            {DELHI_METRO_LINES.map((line, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-[#E6D6C3] p-8 shadow-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: line.color }} />
                    <div>
                      <h3 className="text-2xl font-bold text-[#2C1E18]">{line.name}</h3>
                      <span className="text-xs font-bold text-[#543C32]">Operational Rapid Transit</span>
                    </div>
                  </div>
                  <Link
                    to="/metro-directory"
                    className="px-5 py-2.5 rounded-xl bg-[#FAF5EF] hover:bg-[#FAF1EC] border border-[#E6D6C3] text-[#B35D38] font-bold text-xs transition"
                  >
                    View All Stations →
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#FAF5EF] p-4 rounded-2xl border border-[#E6D6C3] text-center">
                  <div>
                    <div className="text-xl font-black text-[#B35D38]">{line.stations.length}</div>
                    <div className="text-[10px] font-bold uppercase text-[#A37B66]">Key Stations</div>
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#B35D38]">{line.averageWaitTime} min</div>
                    <div className="text-[10px] font-bold uppercase text-[#A37B66]">Wait Time</div>
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#B35D38]">{line.firstTrain} AM</div>
                    <div className="text-[10px] font-bold uppercase text-[#A37B66]">First Train</div>
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#B35D38]">{line.lastTrain} PM</div>
                    <div className="text-[10px] font-bold uppercase text-[#A37B66]">Last Train</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A37B66] mb-3">Key Station Sequence &amp; Interchanges:</h4>
                  <div className="flex flex-wrap gap-2">
                    {line.stations.map((st, sIdx) => (
                      <span key={sIdx} className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${st.interchange ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-[#FAF5EF] text-[#2C1E18] border-[#E6D6C3]'}`}>
                        {sIdx + 1}. {st.name} {st.interchange && '🔄'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Jaipur Lines */}
        {!isDelhi && (
          <div className="space-y-6">
            {jaipurMetroLines.map((line, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-[#E6D6C3] p-8 shadow-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: line.color }} />
                    <div>
                      <h3 className="text-2xl font-bold text-[#2C1E18]">{line.name}</h3>
                      <span className="text-xs font-bold text-[#543C32]">East-West Heritage Corridor</span>
                    </div>
                  </div>
                  <Link
                    to="/metro-directory"
                    className="px-5 py-2.5 rounded-xl bg-[#FAF5EF] hover:bg-[#FAF1EC] border border-[#E6D6C3] text-[#B35D38] font-bold text-xs transition"
                  >
                    View All 11 Stations →
                  </Link>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A37B66] mb-3">Stations Sequence:</h4>
                  <div className="flex flex-wrap gap-2">
                    {line.stations.map((st, sIdx) => (
                      <span key={sIdx} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FAF5EF] text-[#2C1E18] border border-[#E6D6C3]">
                        {st.order}. {st.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
