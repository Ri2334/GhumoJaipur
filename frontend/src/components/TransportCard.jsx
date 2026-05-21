import React from "react";
import { useNavigate } from 'react-router-dom';
import { FaBus, FaTrain, FaCar, FaWalking, FaMotorcycle } from 'react-icons/fa';

const toneClass = {
  best: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cheapest: "border-sky-200 bg-sky-50 text-sky-700",
  fastest: "border-amber-200 bg-amber-50 text-amber-700",
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

export default function TransportCard({ mode, fare, time, badge, note, availability = 'Medium', comfort = 'Standard', source, destination }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const m = String(mode).toLowerCase();
    if (m.includes('shared')) {
      navigate('/shared-rides', { state: { source, destination } });
      return;
    }
    if (m.includes('auto')) {
      navigate('/book/auto', { state: { source, destination } });
      return;
    }
    if (m.includes('cab') || m.includes('car')) {
      navigate('/book/cab', { state: { source, destination } });
      return;
    }
    // default: go to transport search details
    navigate('/transport', { state: { source, destination } });
  };

  return (
    <div role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleClick()} onClick={handleClick} data-transport-card className={`cursor-pointer rounded-3xl border p-4 shadow-sm transition transform hover:-translate-y-1 ${toneClass[badge] || toneClass.default}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-white/40 p-2">{iconFor(mode)}</div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] opacity-80">{mode}</div>
            <div className="mt-1 text-2xl font-black">₹{fare}</div>
          </div>
        </div>
        <div className="text-right">
          {badge && <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold capitalize">{badge}</span>}
          <div className="text-sm text-gray-500">{availability} · {comfort}</div>
        </div>
      </div>
      <div className="mt-3 text-sm font-medium">{time}</div>
      {note && <p className="mt-2 text-sm leading-6 opacity-90">{note}</p>}
    </div>
  );
}
