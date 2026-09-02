import React, { useState, useEffect } from "react";
import { getStoredHotels, saveStoredHotels } from "../data/jaipurHotelsData";

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "Heritage Haveli",
    rating: 4.8,
    reviewsCount: 150,
    startingPrice: 5000,
    location: "",
    nearestSpots: "Hawa Mahal, City Palace",
    amenities: "Free Wi-Fi, Rooftop Pool, Heritage Courtyard",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "",
    bookingUrl: "https://www.booking.com/searchresults.html?ss=Jaipur"
  });

  useEffect(() => {
    setHotels(getStoredHotels());
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    let updated;
    const spotsArray = typeof formData.nearestSpots === "string" 
      ? formData.nearestSpots.split(",").map(s => s.trim()) 
      : formData.nearestSpots;
    const amenitiesArray = typeof formData.amenities === "string" 
      ? formData.amenities.split(",").map(a => a.trim()) 
      : formData.amenities;

    if (editingId) {
      updated = hotels.map((h) =>
        h.id === editingId
          ? { ...h, ...formData, nearestSpots: spotsArray, amenities: amenitiesArray }
          : h
      );
    } else {
      const newHotel = {
        ...formData,
        id: "hotel-" + Date.now(),
        nearestSpots: spotsArray,
        amenities: amenitiesArray
      };
      updated = [newHotel, ...hotels];
    }

    setHotels(updated);
    saveStoredHotels(updated);
    resetForm();
  };

  const handleEdit = (hotel) => {
    setEditingId(hotel.id);
    setFormData({
      ...hotel,
      nearestSpots: Array.isArray(hotel.nearestSpots) ? hotel.nearestSpots.join(", ") : hotel.nearestSpots,
      amenities: Array.isArray(hotel.amenities) ? hotel.amenities.join(", ") : hotel.amenities
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this hotel listing?")) {
      const updated = hotels.filter((h) => h.id !== id);
      setHotels(updated);
      saveStoredHotels(updated);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowModal(false);
    setFormData({
      name: "",
      type: "Heritage Haveli",
      rating: 4.8,
      reviewsCount: 150,
      startingPrice: 5000,
      location: "",
      nearestSpots: "Hawa Mahal, City Palace",
      amenities: "Free Wi-Fi, Rooftop Pool, Heritage Courtyard",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      description: "",
      bookingUrl: "https://www.booking.com/searchresults.html?ss=Jaipur"
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#B35D38] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-[#E6D6C3] shadow-lg">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#B35D38]">
              Admin Monetization Dashboard
            </span>
            <h1 className="text-3xl font-marcellus text-[#2C1E18]">Hotel & Stay Management</h1>
            <p className="text-xs sm:text-sm text-[#543C32] font-semibold mt-1">
              Add, edit, or delete hotel affiliate listings and custom booking URLs for Jaipur stays.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="w-full sm:w-auto bg-[#B35D38] hover:bg-[#964B2A] text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-xl transition flex items-center justify-center gap-2"
          >
            <span>+ Add New Hotel</span>
          </button>
        </div>

        {/* Hotels Table */}
        <div className="bg-white rounded-3xl border border-[#E6D6C3] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-[#2C1E18] text-[#FAF5EF] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Hotel Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Starting Price</th>
                  <th className="p-4">Booking Link</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3E8DB] text-[#2C1E18]">
                {hotels.map((h) => (
                  <tr key={h.id} className="hover:bg-[#FAF1EC] transition">
                    <td className="p-4 font-bold flex items-center gap-3">
                      <img src={h.image} alt={h.name} className="w-10 h-10 rounded-xl object-cover border border-[#E6D6C3]" />
                      <span>{h.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-[#FAF1EC] text-[#B35D38] border border-[#EBC5B2] px-2.5 py-1 rounded-full text-[10px] font-bold">
                        {h.type}
                      </span>
                    </td>
                    <td className="p-4">{h.location}</td>
                    <td className="p-4 font-bold text-amber-600">★ {h.rating} ({h.reviewsCount})</td>
                    <td className="p-4 font-bold text-[#B35D38]">₹{h.startingPrice?.toLocaleString("en-IN")}</td>
                    <td className="p-4">
                      <a href={h.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold text-[11px] truncate max-w-xs block">
                        Affiliate URL →
                      </a>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(h)}
                        className="bg-gray-100 hover:bg-gray-200 text-[#2C1E18] px-3 py-1.5 rounded-xl font-bold text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(h.id)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl font-bold text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-[#E6D6C3] shadow-2xl p-8 max-w-2xl w-full my-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#F3E8DB] pb-4">
                <h2 className="text-2xl font-marcellus text-[#2C1E18]">
                  {editingId ? "Edit Hotel Listing" : "Add New Hotel Listing"}
                </h2>
                <button onClick={resetForm} className="text-xl text-gray-500 font-bold">✕</button>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-[#543C32] mb-1">Hotel Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF5EF] border border-[#E6D6C3] p-3 rounded-xl outline-none focus:border-[#B35D38]"
                  />
                </div>

                <div>
                  <label className="block text-[#543C32] mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#FAF5EF] border border-[#E6D6C3] p-3 rounded-xl outline-none focus:border-[#B35D38]"
                  >
                    <option value="Heritage Haveli">Heritage Haveli</option>
                    <option value="Luxury Resort">Luxury Resort</option>
                    <option value="Boutique Hotel">Boutique Hotel</option>
                    <option value="Budget & Hostel">Budget & Hostel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#543C32] mb-1">Starting Price (₹/night) *</label>
                  <input
                    type="number"
                    required
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                    className="w-full bg-[#FAF5EF] border border-[#E6D6C3] p-3 rounded-xl outline-none focus:border-[#B35D38]"
                  />
                </div>

                <div>
                  <label className="block text-[#543C32] mb-1">Rating (1 to 5) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-[#FAF5EF] border border-[#E6D6C3] p-3 rounded-xl outline-none focus:border-[#B35D38]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#543C32] mb-1">Location / Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#FAF5EF] border border-[#E6D6C3] p-3 rounded-xl outline-none focus:border-[#B35D38]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#543C32] mb-1">Affiliate / Direct Booking URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.bookingUrl}
                    onChange={(e) => setFormData({ ...formData, bookingUrl: e.target.value })}
                    className="w-full bg-[#FAF5EF] border border-[#E6D6C3] p-3 rounded-xl outline-none focus:border-[#B35D38]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#543C32] mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-[#FAF5EF] border border-[#E6D6C3] p-3 rounded-xl outline-none focus:border-[#B35D38]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#543C32] mb-1">Nearest Spots (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.nearestSpots}
                    onChange={(e) => setFormData({ ...formData, nearestSpots: e.target.value })}
                    className="w-full bg-[#FAF5EF] border border-[#E6D6C3] p-3 rounded-xl outline-none focus:border-[#B35D38]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#543C32] mb-1">Amenities (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    className="w-full bg-[#FAF5EF] border border-[#E6D6C3] p-3 rounded-xl outline-none focus:border-[#B35D38]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#543C32] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#FAF5EF] border border-[#E6D6C3] p-3 rounded-xl outline-none focus:border-[#B35D38]"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-[#F3E8DB]">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-100 text-[#2C1E18] px-5 py-3 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#B35D38] hover:bg-[#964B2A] text-white px-8 py-3 rounded-xl font-bold shadow-lg"
                  >
                    Save Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
