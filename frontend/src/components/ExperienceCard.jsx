import React from "react";

export default function ExperienceCard({ title, description, category, price, rating, famousFor, warning, type }) {
  // Themes based on type or category
  const isAttraction = type === "attraction";
  const isFood = type === "food";
  const isShopping = type === "shopping";
  const isTransport = type === "transport";

  let themeClasses = "border-indigo-100 bg-white";
  let tagClasses = "text-indigo-600 bg-indigo-50";
  let icon = "🏛️";

  if (isFood) {
    themeClasses = "border-orange-100 bg-white";
    tagClasses = "text-orange-600 bg-orange-50";
    icon = "🍛";
  } else if (isShopping) {
    themeClasses = "border-emerald-100 bg-white";
    tagClasses = "text-emerald-600 bg-emerald-50";
    icon = "🛍️";
  } else if (isTransport) {
    themeClasses = "border-blue-100 bg-white";
    tagClasses = "text-blue-600 bg-blue-50";
    icon = "🚇";
  }

  return (
    <div className={`group rounded-3xl border ${themeClasses} p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${tagClasses}`}>
              {category || type}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{title}</h3>
        </div>
        {price && (
          <div className="rounded-2xl bg-gray-900 px-3 py-1 text-sm font-bold text-white shadow-lg">
            {typeof price === 'number' ? `₹${price}` : price}
          </div>
        )}
      </div>
      
      <p className="mt-4 text-sm leading-relaxed text-gray-600">
        {description}
      </p>

      {(famousFor || rating) && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4 text-xs font-bold text-gray-400">
          <span className="flex items-center gap-1">
            <span className="text-amber-500">★</span> {rating || "4.5"}
          </span>
          <span className="uppercase tracking-widest">{famousFor}</span>
        </div>
      )}

      {warning && (
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/50 px-4 py-3 text-[13px] text-amber-900 italic leading-snug">
          "{warning}"
        </div>
      )}
    </div>
  );
}
