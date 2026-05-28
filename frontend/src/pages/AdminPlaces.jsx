import React, { useEffect, useMemo, useState } from "react";
import { createPlaceApi, deletePlaceApi, getPlacesApi, updatePlaceApi } from "../services/api";
import { 
  FiMapPin, FiStar, FiClock, FiTag, FiDollarSign, 
  FiImage, FiPlus, FiEdit2, FiTrash2, FiInfo, FiChevronRight,
  FiActivity, FiCalendar, FiCoffee, FiTruck
} from "react-icons/fi";
import Loader from "../components/Loader";

const initialForm = {
  name: "",
  description: "",
  location: "",
  imagesText: "",
  rating: "4.5",
  timings: "",
  ticketPrice: "0",
  category: "Fort",
  bestVisitTime: "",
  nearbyFoodsText: "",
  transportOptionsText: "",
};

const categories = ["Fort", "Palace", "Museum", "Temple", "Market", "Park", "Cafe", "Other"];

const toText = (items = []) => items.join("\n");
const fromText = (text = "") => text.split("\n").map((item) => item.trim()).filter(Boolean);

export default function AdminPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      const res = await getPlacesApi({ sort: "latest" });
      setPlaces(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load places");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleEdit = (place) => {
    setEditingId(place._id);
    setForm({
      name: place.name || "",
      description: place.description || "",
      location: place.location || "",
      imagesText: toText(place.images),
      rating: String(place.rating ?? 0),
      timings: place.timings || "",
      ticketPrice: String(place.ticketPrice ?? 0),
      category: place.category || "Fort",
      bestVisitTime: place.bestVisitTime || "",
      nearbyFoodsText: toText(place.nearbyFoods),
      transportOptionsText: toText(place.transportOptions),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      name: form.name,
      description: form.description,
      location: form.location,
      images: fromText(form.imagesText),
      rating: Number(form.rating),
      timings: form.timings,
      ticketPrice: Number(form.ticketPrice),
      category: form.category,
      bestVisitTime: form.bestVisitTime,
      nearbyFoods: fromText(form.nearbyFoodsText),
      transportOptions: fromText(form.transportOptionsText),
    };

    try {
      if (editingId) {
        await updatePlaceApi(editingId, payload);
        setSuccess("Place updated successfully");
      } else {
        await createPlaceApi(payload);
        setSuccess("Place created successfully");
      }
      resetForm();
      await loadPlaces();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save place");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this place?")) return;
    try {
      await deletePlaceApi(id);
      setSuccess("Place deleted successfully");
      await loadPlaces();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not delete place");
    }
  };

  if (loading && places.length === 0) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-12 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em] mb-2">Heritage Management</p>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manage Tourist Places</h1>
            <p className="text-gray-500 font-medium mt-2 max-w-xl">
              Curate the Jaipur experience. Add historic landmarks, hidden gems, and local hotspots.
            </p>
          </div>
          <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 text-indigo-700 font-bold text-sm">
            {places.length} Locations Cataloged
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 p-4 text-red-600 font-bold text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <FiAlertCircle /> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-2xl bg-green-50 border border-green-100 p-4 text-green-700 font-bold text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <FiCheckCircle /> {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Pane */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900">{editingId ? "Edit Place" : "Add New Place"}</h2>
                {editingId && (
                  <button onClick={resetForm} className="text-xs font-black uppercase text-gray-400 hover:text-gray-600 transition tracking-widest">
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4">
                  <div className="relative">
                    <FiInfo className="absolute left-4 top-4 text-gray-400" />
                    <input 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold transition-all outline-none" 
                      placeholder="Place Name" 
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    />
                  </div>

                  <div className="relative">
                    <textarea 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl px-4 py-3.5 text-sm font-bold transition-all outline-none min-h-[120px]" 
                      placeholder="Tell the story of this place..." 
                      value={form.description} 
                      onChange={(e) => setForm({ ...form, description: e.target.value })} 
                    />
                  </div>

                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-4 text-gray-400" />
                    <input 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold transition-all outline-none" 
                      placeholder="Location Address" 
                      value={form.location} 
                      onChange={(e) => setForm({ ...form, location: e.target.value })} 
                    />
                  </div>

                  <div className="relative">
                    <FiImage className="absolute left-4 top-4 text-gray-400" />
                    <textarea 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-xs font-bold transition-all outline-none min-h-[80px]" 
                      placeholder="Cloudinary Image URLs (one per line)" 
                      value={form.imagesText} 
                      onChange={(e) => setForm({ ...form, imagesText: e.target.value })} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <FiStar className="absolute left-4 top-4 text-gray-400" />
                      <input 
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold outline-none" 
                        placeholder="Rating" type="number" step="0.1" min="0" max="5" value={form.rating} 
                        onChange={(e) => setForm({ ...form, rating: e.target.value })} 
                      />
                    </div>
                    <div className="relative">
                      <FiDollarSign className="absolute left-4 top-4 text-gray-400" />
                      <input 
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold outline-none" 
                        placeholder="Ticket Price" type="number" min="0" value={form.ticketPrice} 
                        onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <FiClock className="absolute left-4 top-4 text-gray-400" />
                    <input 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold outline-none" 
                      placeholder="Opening Hours (e.g. 9:00 AM - 6:00 PM)" 
                      value={form.timings} 
                      onChange={(e) => setForm({ ...form, timings: e.target.value })} 
                    />
                  </div>

                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-4 text-gray-400" />
                    <input 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold outline-none" 
                      placeholder="Best visit month/time" 
                      value={form.bestVisitTime} 
                      onChange={(e) => setForm({ ...form, bestVisitTime: e.target.value })} 
                    />
                  </div>

                  <div className="relative">
                    <FiTag className="absolute left-4 top-4 text-gray-400" />
                    <select 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold outline-none appearance-none" 
                      value={form.category} 
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>

                  <div className="relative">
                    <FiCoffee className="absolute left-4 top-4 text-gray-400" />
                    <textarea 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-xs font-bold outline-none min-h-[60px]" 
                      placeholder="Nearby Foods (one per line)" 
                      value={form.nearbyFoodsText} 
                      onChange={(e) => setForm({ ...form, nearbyFoodsText: e.target.value })} 
                    />
                  </div>

                  <div className="relative">
                    <FiTruck className="absolute left-4 top-4 text-gray-400" />
                    <textarea 
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-xs font-bold outline-none min-h-[60px]" 
                      placeholder="Transport Options (one per line)" 
                      value={form.transportOptionsText} 
                      onChange={(e) => setForm({ ...form, transportOptionsText: e.target.value })} 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full mt-4 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.25rem] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                  >
                    {editingId ? <FiEdit2 /> : <FiPlus />}
                    {editingId ? "Update Heritage Site" : "Catalog New Site"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* List Pane */}
          <div className="lg:col-span-7">
            <div className="space-y-6">
              {places.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-gray-100 border-dashed">
                  <FiMapPin size={48} className="mx-auto text-gray-200 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400">No sites cataloged yet.</h3>
                  <p className="text-sm text-gray-300 font-medium">Use the form to add the first attraction.</p>
                </div>
              ) : (
                places.map((place) => (
                  <div key={place._id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row group hover:shadow-xl transition-all">
                    <div className="md:w-56 h-48 md:h-auto bg-gray-100 relative overflow-hidden flex-shrink-0">
                      {place.images?.[0] ? (
                        <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-600 shadow-sm border border-white">
                        {place.category}
                      </div>
                    </div>

                    <div className="flex-1 p-8">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{place.name}</h3>
                          <div className="flex items-center gap-4 mt-1.5">
                            <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                              <FiMapPin size={10} /> {place.location}
                            </div>
                            <div className="flex items-center gap-1.5 text-amber-500 font-bold text-[10px] uppercase">
                              <FiStar size={10} /> {place.rating?.toFixed(1) || '0.0'}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(place)}
                            className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition shadow-sm"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(place._id)}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition shadow-sm"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2 mb-6">
                        {place.description}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                         <div className="text-[10px] font-bold text-gray-400 flex items-center gap-2">
                            <FiClock className="text-indigo-400" /> {place.timings}
                         </div>
                         <div className="text-[10px] font-bold text-gray-400 flex items-center gap-2">
                            <FiDollarSign className="text-indigo-400" /> ₹{place.ticketPrice}
                         </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
