import React, { useContext } from "react";
import { CityContext, CITY_CONFIGS } from "../context/CityContext";

export default function CitySwitcher({ className = "" }) {
  const { currentCity, switchCity } = useContext(CityContext);

  return (
    <div className={`inline-flex items-center bg-[#3D2B23] p-1 rounded-2xl border border-[#543C32] shadow-inner ${className}`}>
      <button
        onClick={() => switchCity("jaipur")}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
          currentCity === "jaipur"
            ? "bg-[#B35D38] text-white shadow-md ring-1 ring-[#D98A5B]"
            : "text-[#E6D6C3] hover:text-white hover:bg-white/5"
        }`}
      >
        <span>🏰</span>
        <span>Jaipur</span>
      </button>

      <button
        onClick={() => switchCity("udaipur")}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
          currentCity === "udaipur"
            ? "bg-[#B35D38] text-white shadow-md ring-1 ring-[#D98A5B]"
            : "text-[#E6D6C3] hover:text-white hover:bg-white/5"
        }`}
      >
        <span>🌅</span>
        <span>Udaipur</span>
      </button>
    </div>
  );
}
