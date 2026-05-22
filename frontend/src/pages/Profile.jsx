import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, refreshUser } = useContext(AuthContext);

  useEffect(() => {
    refreshUser();
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Please login to view profile.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-100/50 border border-gray-100">
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <div className="px-8 pb-10">
            <div className="relative flex justify-center">
              <div className="absolute -top-16 w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center text-5xl border-4 border-white">
                👤
              </div>
            </div>
            
            <div className="mt-20 text-center">
              <h2 className="text-3xl font-black text-gray-900">{user.name}</h2>
              <p className="text-gray-500 font-medium">{user.email}</p>
              <div className="mt-2 inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
                {user.role}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="bg-amber-50 rounded-2xl p-6 text-center border border-amber-100 shadow-sm transition hover:shadow-md">
                <div className="text-3xl mb-1">⭐</div>
                <div className="text-2xl font-black text-amber-900">{user.rating?.toFixed(1) || '5.0'}</div>
                <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">User Rating</div>
              </div>
              {user.role === 'driver' ? (
                <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100 shadow-sm transition hover:shadow-md">
                  <div className="text-3xl mb-1">🚕</div>
                  <div className="text-2xl font-black text-green-900">{user.driverRating?.toFixed(1) || '4.7'}</div>
                  <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Driver Rating</div>
                </div>
              ) : (
                <div className="bg-indigo-50 rounded-2xl p-6 text-center border border-indigo-100 shadow-sm transition hover:shadow-md">
                  <div className="text-3xl mb-1">📱</div>
                  <div className="text-sm font-black text-indigo-900">{user.mobile || 'Not set'}</div>
                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Phone Number</div>
                </div>
              )}
            </div>

            {user.role === 'driver' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Vehicle Details</p>
                 <p className="font-bold text-gray-800">{user.vehicle} • {user.vehicleNumber}</p>
              </div>
            )}

            <div className="mt-8 space-y-3">
              <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition shadow-lg shadow-gray-200">
                Edit Profile
              </button>
              <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                Joined {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
