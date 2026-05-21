import React from "react";

// Simple centered loader used across the app
export default function Loader({ size = 6 }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-blue-500`}
        aria-hidden="true"
      />
    </div>
  );
}
