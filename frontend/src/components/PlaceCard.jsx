import React from "react";
import { Link } from "react-router-dom";

const stars = (rating) => {
  const full = Math.round(rating || 0);
  return "★".repeat(full).padEnd(5, "☆");
};

export default function PlaceCard({ place }) {
  const image = place?.images?.[0] || "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="group overflow-hidden rounded-3xl border border-white/50 bg-white/80 backdrop-blur shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={image} 
          alt={place.name} 
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"; }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800">
          {place.category}
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold">{place.name}</h3>
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur">{place.rating?.toFixed(1) || "0.0"} ★</span>
          </div>
          <p className="mt-1 text-sm text-white/90 line-clamp-2">{place.location}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{stars(place.rating)}</span>
          <span>Ticket ₹{place.ticketPrice || 0}</span>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-gray-600">{place.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Best time: {place.bestVisitTime}</span>
          <span>{place.timings}</span>
        </div>
        <div className="flex gap-3">
          <Link to={`/places/${place._id}`} className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:opacity-95">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
