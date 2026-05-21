import React, { useState } from "react";

export default function ImageCarousel({ images = [] }) {
  const gallery = images.length ? images : ["https://images.unsplash.com/photo-1518639192441-8fce0a0c2e0e?auto=format&fit=crop&w=1200&q=80"];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl shadow-2xl">
        <img src={gallery[active]} alt="Place gallery" className="h-[420px] w-full object-cover" />
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
        {gallery.map((image, index) => (
          <button
            key={image + index}
            type="button"
            onClick={() => setActive(index)}
            className={`overflow-hidden rounded-2xl border-2 transition ${active === index ? "border-indigo-600" : "border-transparent"}`}
          >
            <img src={image} alt={`Gallery ${index + 1}`} className="h-20 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
