import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MetroLines() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero Header */}
        <div className="text-center space-y-3">
          <span className="inline-block rounded-full bg-pink-100 border border-pink-200 px-4 py-1.5 text-xs font-bold text-pink-700 tracking-widest uppercase">
            JMRC Transit Network
          </span>
          <h1 className="text-3xl sm:text-5xl font-marcellus text-[#2C1E18]">
            Jaipur Metro Lines
          </h1>
          <p className="text-sm sm:text-base text-[#543C32] max-w-2xl mx-auto font-medium">
            Explore JMRC's rapid transit network connecting the Pink City with active operational corridors and upcoming expansion lines.
          </p>
        </div>

        {/* Active Line: Pink Line Card */}
        <div className="rounded-3xl border border-pink-200 bg-white p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F3E8DB] pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-600 text-white text-2xl shadow-lg">
                🚇
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-marcellus text-[#2C1E18]">Pink Line</h2>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 border border-emerald-300">
                    Operational
                  </span>
                </div>
                <p className="text-xs text-[#543C32] font-semibold mt-0.5">East-West Heritage Corridor</p>
              </div>
            </div>

            <Link
              to="/metro-directory"
              className="inline-flex items-center gap-2 rounded-xl bg-pink-50 border border-pink-200 px-5 py-2.5 text-xs font-bold text-pink-700 hover:bg-pink-600 hover:text-white transition shadow-sm"
            >
              View All 11 Stations →
            </Link>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl bg-[#FAF5EF] p-4 text-center border border-[#E6D6C3]">
            <div>
              <span className="block text-[10px] text-gray-500 uppercase font-bold">Stations</span>
              <span className="text-2xl font-black text-pink-600">11</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 uppercase font-bold">Total Length</span>
              <span className="text-2xl font-black text-[#2C1E18]">12.07 km</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 uppercase font-bold">End-to-End Time</span>
              <span className="text-2xl font-black text-[#B35D38]">~28 min</span>
            </div>
            <div>
              <span className="block text-[10px] text-gray-500 uppercase font-bold">Operating Hours</span>
              <span className="text-xl font-black text-[#2C1E18]">5 AM - 11 PM</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#543C32] font-medium leading-relaxed">
            Connecting Mansarovar in the west to Badi Chaupar in the east, the Pink Line is the lifeline of Jaipur's public transport. It passes through key locations including Railway Station, Sindhi Camp Bus Stand, Chandpole, and Chhoti Chaupar—making daily commutes and heritage tourism convenient for lakhs of Jaipurites.
          </p>

          {/* Popular Stations Chips */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#A37B66]">Pink Line Stations Sequence</div>
            <div className="flex flex-wrap gap-2">
              {[
                "Mansarovar", "New Aatish Market", "Vivek Vihar", "Shyam Nagar", "Ram Nagar",
                "Civil Lines", "Railway Station", "Sindhi Camp", "Chandpole", "Chhoti Chaupar", "Badi Chaupar"
              ].map((st, idx) => (
                <span key={idx} className="rounded-xl bg-[#FAF1EC] border border-[#EBC5B2] px-3 py-1 text-xs font-bold text-[#2C1E18]">
                  {idx + 1}. {st}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="rounded-3xl border border-[#E6D6C3] bg-white p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-marcellus text-[#2C1E18]">Coming Soon</h2>
            <p className="text-xs text-[#543C32] font-medium mt-1">Jaipur Metro Phase 2 expansion pipelines:</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-amber-50/60 border border-amber-200 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm">🟠 Orange Line (Phase 2)</span>
                <span className="rounded-md bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase px-2 py-0.5">Under Construction</span>
              </div>
              <p className="text-xs text-amber-800 font-semibold">Ambabari to Sitapura via Chandpole & Airport (23.8 km)</p>
            </div>

            <div className="rounded-2xl bg-sky-50/60 border border-sky-200 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-900 text-sm">🔵 Phase 1C & 1D Extensions</span>
                <span className="rounded-md bg-sky-200 text-sky-900 text-[10px] font-extrabold uppercase px-2 py-0.5">Planned</span>
              </div>
              <p className="text-xs text-sky-800 font-semibold">Badi Chaupar to Transport Nagar & Mansarovar to 200 Ft Bypass</p>
            </div>
          </div>
        </div>

        {/* Ready to Travel CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2C1E18] to-[#3D2B23] p-8 text-center text-white shadow-2xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-marcellus text-white">Ready to Travel?</h2>
          <p className="text-xs sm:text-sm text-[#E6D6C3] max-w-xl mx-auto font-medium">
            Plan your metro journey with live fare comparisons, station timings, and bus connections across Jaipur.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/transport')}
              className="rounded-xl bg-[#B35D38] hover:bg-[#964B2A] px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition"
            >
              🚀 Plan Your Route
            </button>
            <button
              onClick={() => navigate('/metro-directory')}
              className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition"
            >
              🚇 View All 11 Stations
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
