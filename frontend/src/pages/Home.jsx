import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to Ghumo Jaipur</h1>
          <p className="mt-3 text-gray-600">Discover Jaipur's best tourist spots, local food, and smart transport options.</p>

          <div className="mt-6 flex gap-3">
            <Link to="/places" className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded shadow">Explore Places</Link>
            <Link to="/saved-trips" className="bg-white border border-indigo-200 px-4 py-2 rounded">Saved Trips</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
