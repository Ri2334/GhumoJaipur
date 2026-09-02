import React from "react";
import { AFFILIATE_CONFIG } from "../config/affiliateConfig";

export default function HotelBookingCard({ locationName = "Jaipur", cityName = "Jaipur" }) {
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(locationName + ", " + cityName)}&aid=${AFFILIATE_CONFIG.bookingComAid}`;

  return (
    <div className="rounded-3xl border border-[#E6D6C3] bg-gradient-to-br from-white via-[#FAF1EC] to-[#F5EADB] p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#E6D6C3] pb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏨</span>
          <div>
            <h3 className="text-xl font-marcellus text-[#2C1E18]">Hotels & Heritage Stays Nearby</h3>
            <p className="text-xs text-[#543C32] font-semibold">Verified stays near {locationName}</p>
          </div>
        </div>
        <span className="rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/30 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
          Best Rates
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 text-xs font-semibold text-[#543C32]">
        <div className="rounded-2xl bg-white p-3.5 border border-[#E6D6C3] flex items-center justify-between">
          <span>👑 Heritage Haveli Stays</span>
          <span className="font-bold text-[#B35D38]">From ₹1,499/night</span>
        </div>
        <div className="rounded-2xl bg-white p-3.5 border border-[#E6D6C3] flex items-center justify-between">
          <span>✨ Luxury 5-Star Resorts</span>
          <span className="font-bold text-[#B35D38]">From ₹4,999/night</span>
        </div>
      </div>

      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full rounded-2xl bg-gradient-to-r from-[#B35D38] to-[#D98A5B] hover:brightness-110 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-xl transition-all flex items-center justify-center gap-2"
      >
        <span>Search Stays Near {locationName}</span>
        <span>→</span>
      </a>
    </div>
  );
}
