import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Please login to view profile.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded p-8 shadow">
        <h2 className="text-xl font-bold">{user.name}'s Profile</h2>
        <p className="text-gray-600">Email: {user.email}</p>
      </div>
    </div>
  );
}
