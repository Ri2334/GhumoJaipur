import React, { useState } from "react";

const NEUTRAL_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%232C1E18"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%23E6D6C3" font-family="serif" font-size="26" font-weight="bold">📍 Photo Pending Verification</text><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23A37B66" font-family="sans-serif" font-size="16">SheherSaathi Place System</text></svg>`;

export default function ImageCarousel({ images = [] }) {
  const validImages = images.filter(Boolean);
  const gallery = validImages.length ? validImages : [NEUTRAL_PLACEHOLDER];
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
