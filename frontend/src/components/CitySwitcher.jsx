import React, { useState, useContext, useRef, useEffect } from "react";
import { CityContext, CITY_CONFIGS } from "../context/CityContext";

export default function CitySwitcher({ className = "" }) {
  const { currentCity, switchCity, cityDetails } = useContext(CityContext);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allCitiesList = [
    { id: "jaipur", name: "Jaipur", icon: "🏰", status: "active", subtitle: "140+ Places • Metro & Bus" },
    { id: "udaipur", name: "Udaipur", icon: "🌅", status: "active", subtitle: "30+ Places • Bus & Ferries" },
    { id: "delhi", name: "Delhi", icon: "🕌", status: "active", subtitle: "40+ Places • DMRC & DTC Buses" },
    { id: "mumbai", name: "Mumbai", icon: "🌆", status: "coming_soon", subtitle: "40+ Planned • Local Train" },
    { id: "varanasi", name: "Varanasi", icon: "🛕", status: "coming_soon", subtitle: "20+ Planned • Ghats" },
    { id: "bengaluru", name: "Bengaluru", icon: "🌳", status: "coming_soon", subtitle: "30+ Planned • Namma Metro" }
  ];

  const filtered = allCitiesList.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      
      {/* Compact Scalable Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 bg-[#3D2B23] hover:bg-[#4A362B] text-[#FAF5EF] px-3.5 py-1.5 rounded-xl border border-[#543C32] shadow-md transition text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#B35D38]"
      >
        <span>📍</span>
        <span className="text-[#D98A5B] font-black">{cityDetails.name}</span>
        <span className="text-[10px] text-[#A37B66]">▼</span>
      </button>

      {/* Scalable City Selection Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 mt-2 w-72 sm:w-80 rounded-3xl bg-[#1C110C] border border-[#3D2B23] shadow-2xl z-[150] p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header & Search */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#FAF5EF] font-marcellus">
              <span className="text-[#D98A5B] font-bold uppercase tracking-wider">Select City</span>
              <span className="text-[10px] text-[#A37B66] font-mono">6 Cities</span>
            </div>
            
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-[#A37B66]">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city... e.g. Delhi, Udaipur"
                className="w-full bg-[#2C1E18] text-[#FAF5EF] placeholder-[#A37B66] text-xs rounded-xl pl-8 pr-3 py-2 border border-[#3D2B23] outline-none focus:border-[#B35D38]"
              />
            </div>
          </div>

          {/* Cities List */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filtered.map((c) => {
              const isActive = c.status === "active";
              const isSelected = currentCity === c.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    if (isActive) {
                      switchCity(c.id);
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition ${
                    isSelected
                      ? "bg-[#B35D38] text-white shadow-lg"
                      : isActive
                      ? "hover:bg-[#2C1E18] text-[#FAF5EF]"
                      : "opacity-50 cursor-not-allowed text-[#A37B66]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{c.icon}</span>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span>{c.name}</span>
                        {isSelected && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-black">ACTIVE</span>}
                      </div>
                      <div className={`text-[10px] ${isSelected ? "text-white/80" : "text-[#A37B66]"}`}>{c.subtitle}</div>
                    </div>
                  </div>

                  {!isActive && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-[#3D2B23] text-[#D98A5B] px-2 py-0.5 rounded-md">
                      SOON
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
