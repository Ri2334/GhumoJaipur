import React from "react";
import { useNavigate } from 'react-router-dom';
import { FaBus, FaTrain, FaCar, FaWalking, FaMotorcycle, FaLeaf } from 'react-icons/fa';

const toneClass = {
  best: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cheapest: "border-sky-200 bg-sky-50 text-sky-700",
  fastest: "border-amber-200 bg-amber-50 text-amber-700",
  recommended: "border-purple-200 bg-purple-50 text-purple-700",
  default: "border-gray-200 bg-white text-gray-700",
};

const iconFor = (mode) => {
  const m = String(mode).toLowerCase();
  if (m.includes('metro') || m.includes('train')) return <FaTrain className="w-6 h-6 text-indigo-600" />;
  if (m.includes('bus')) return <FaBus className="w-6 h-6 text-sky-600" />;
  if (m.includes('cab') || m.includes('car')) return <FaCar className="w-6 h-6 text-amber-600" />;
  if (m.includes('auto')) return <FaMotorcycle className="w-6 h-6 text-pink-600" />;
  if (m.includes('walk')) return <FaWalking className="w-6 h-6 text-gray-600" />;
  return <FaCar className="w-6 h-6 text-gray-600" />;
};

export default function TransportCard({ mode, fare, time, badge, note, source, destination, driver, cabFare, onSelect }) {
  const navigate = useNavigate();

  const isShared = mode.toLowerCase().includes('shared');
  const noSharedAvailable = isShared && note?.includes('No shared');

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }

    if (!noSharedAvailable && fare <= 0 && (mode === 'Cab' || mode === 'Auto')) return;

    const m = String(mode).toLowerCase();
    if (m.includes('shared')) {
      navigate('/shared-rides', { state: { source, destination, driver, initialFare: cabFare || fare } });
      return;
    }
    if (m.includes('auto')) {
      navigate('/book/auto', { state: { source, destination, driver, fare, time } });
      return;
    }
    if (m.includes('cab') || m.includes('car')) {
      navigate('/book/cab', { state: { source, destination, driver, fare, time } });
      return;
    }
  };

  const formattedFare = typeof fare === 'number' ? `₹${fare}` : (String(fare).startsWith('₹') ? fare : `₹${fare}`);

  return (
    <div role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleClick()} onClick={handleClick} data-transport-card className={`cursor-pointer rounded-3xl border p-5 shadow-sm transition transform hover:-translate-y-1 ${!noSharedAvailable && fare <= 0 && (mode === 'Cab' || mode === 'Auto') ? 'opacity-60 grayscale cursor-not-allowed' : ''} ${toneClass[badge] || toneClass.default}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/60 p-3 shadow-inner">{iconFor(mode)}</div>
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] opacity-80">
              {isShared ? 'Shared Cab' : mode}
            </div>
            <div className="mt-1 text-2xl font-black">
              {formattedFare}
            </div>
          </div>
        </div>
        <div className="text-right">
          {badge && <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold capitalize shadow-sm">{badge}</span>}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-3">
         <div className="text-sm font-bold">{noSharedAvailable ? 'None Active' : time}</div>
      </div>

      {note && (
        <div className="mt-3 border-t border-black/5 pt-3">
          <p className={`text-[13px] leading-5 opacity-90 font-medium ${noSharedAvailable ? 'text-indigo-600' : ''}`}>
            {note}
          </p>
          {noSharedAvailable && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleClick(); }}
              className="mt-3 w-full py-3 bg-[#B35D38] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:bg-[#964B2A] transition"
            >
              Create Shared Ride →
            </button>
          )}
        </div>
      )}

      {source && destination && (
        <div className="mt-3 border-t border-black/5 pt-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&travelmode=${mode.toLowerCase().includes('cab') || mode.toLowerCase().includes('auto') ? 'driving' : 'transit'}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-white/90 border border-black/10 hover:bg-white text-[#B35D38] rounded-xl text-[11px] font-bold transition shadow-xs"
          >
            🗺️ Live Google Maps Directions ↗
          </a>
        </div>
      )}
    </div>
  );
}
