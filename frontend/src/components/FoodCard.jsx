import React from "react";

export default function FoodCard({ name, category, price, rating, famousFor, warning }) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">{category}</div>
          <h3 className="mt-1 text-xl font-bold text-gray-900">{name}</h3>
        </div>
        <div className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">₹{price}</div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <span>{rating} ★</span>
        <span>{famousFor}</span>
      </div>
      {warning && <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{warning}</div>}
    </div>
  );
}
