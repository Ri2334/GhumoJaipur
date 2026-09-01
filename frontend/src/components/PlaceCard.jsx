import React from "react";
import { Link } from "react-router-dom";

const stars = (rating) => {
  const full = Math.round(rating || 0);
  return "★".repeat(full).padEnd(5, "☆");
};

export default function PlaceCard({ place }) {
  const image = place?.images?.[0] || "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="group overflow-hidden rounded-3xl border border-[#E6D6C3] bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between">
      <div>
        <div className="relative h-60 overflow-hidden bg-[#2C1E18]">
          <img 
            src={image} 
            alt={place.name} 
            onError={(e) => { e.target.src = "https://res.cloudinary.com/dtaoqmefw/image/upload/f_auto,q_auto/v1779953024/hawamahal_owadja.jpg"; }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1E18]/80 via-[#2C1E18]/20 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-[#FAF5EF]/90 px-3.5 py-1 text-xs font-bold text-[#2C1E18] uppercase tracking-wider shadow-sm">
            {place.category}
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-marcellus text-white tracking-wide">{place.name}</h3>
              <span className="rounded-full bg-[#B35D38] text-white px-3 py-1 text-xs font-bold shadow-md">{place.rating?.toFixed(1) || "0.0"} ★</span>
            </div>
            <p className="mt-1 text-xs text-[#E6D6C3] line-clamp-1">{place.location}</p>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between text-xs font-bold text-[#793A1F]">
            <span className="text-[#B35D38]">{stars(place.rating)}</span>
            <span className="text-sm font-black text-[#2C1E18]">Ticket ₹{place.ticketPrice || 0}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-[#543C32] font-medium">{place.description}</p>
          <div className="flex items-center justify-between text-[11px] text-[#A37B66] font-semibold pt-2 border-t border-[#F3E8DB]">
            <span>Best time: {place.bestVisitTime || 'Morning/Evening'}</span>
            <span>{place.timings}</span>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <Link to={`/places/${place._id}`} className="block w-full rounded-xl bg-[#B35D38] hover:bg-[#964B2A] py-3.5 text-center text-sm font-bold text-white transition shadow-md hover:shadow-lg">
          View Details →
        </Link>
      </div>
    </div>
  );
}
