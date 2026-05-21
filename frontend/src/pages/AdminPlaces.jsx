import React, { useEffect, useMemo, useState } from "react";
import { createPlaceApi, deletePlaceApi, getPlacesApi, updatePlaceApi } from "../services/api";

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

  const stats = useMemo(() => ({ total: places.length }), [places]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-xl backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Admin dashboard</p>
          <h1 className="mt-2 text-4xl font-black text-gray-900">Manage tourist places</h1>
          <p className="mt-3 text-gray-600">Add, edit, and delete Jaipur attractions with images, timings, foods and transport notes.</p>
          <div className="mt-4 rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">Total places: {stats.total}</div>
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
        {success && <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">{success}</div>}

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">{editingId ? "Edit place" : "Add new place"}</h2>
              {editingId && <button type="button" onClick={resetForm} className="rounded-full bg-gray-900 px-4 py-2 text-sm text-white">Cancel edit</button>}
            </div>

            <div className="mt-6 grid gap-4">
              <input className="rounded-2xl border border-gray-200 px-4 py-3" placeholder="Place name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <textarea className="rounded-2xl border border-gray-200 px-4 py-3" placeholder="Description" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input className="rounded-2xl border border-gray-200 px-4 py-3" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <input className="rounded-2xl border border-gray-200 px-4 py-3" placeholder="Image URLs, one per line" value={form.imagesText} onChange={(e) => setForm({ ...form, imagesText: e.target.value })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="rounded-2xl border border-gray-200 px-4 py-3" placeholder="Rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                <input className="rounded-2xl border border-gray-200 px-4 py-3" placeholder="Ticket price" type="number" min="0" value={form.ticketPrice} onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })} />
              </div>
              <input className="rounded-2xl border border-gray-200 px-4 py-3" placeholder="Timings" value={form.timings} onChange={(e) => setForm({ ...form, timings: e.target.value })} />
              <input className="rounded-2xl border border-gray-200 px-4 py-3" placeholder="Best visit time" value={form.bestVisitTime} onChange={(e) => setForm({ ...form, bestVisitTime: e.target.value })} />
              <select className="rounded-2xl border border-gray-200 px-4 py-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <textarea className="rounded-2xl border border-gray-200 px-4 py-3" placeholder="Nearby foods, one per line" rows="3" value={form.nearbyFoodsText} onChange={(e) => setForm({ ...form, nearbyFoodsText: e.target.value })} />
              <textarea className="rounded-2xl border border-gray-200 px-4 py-3" placeholder="Transport options, one per line" rows="3" value={form.transportOptionsText} onChange={(e) => setForm({ ...form, transportOptionsText: e.target.value })} />
              <button type="submit" className="rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 px-4 py-3 font-semibold text-white">{editingId ? "Update Place" : "Create Place"}</button>
            </div>
          </form>

          <div className="space-y-4">
            {loading ? (
              <div className="grid gap-4">
                {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-40 animate-pulse rounded-3xl bg-white/80 shadow-lg" />)}
              </div>
            ) : places.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white/70 p-10 text-center text-gray-600 shadow-xl backdrop-blur">No places yet. Create the first Jaipur attraction from the form.</div>
            ) : (
              places.map((place) => (
                <div key={place._id} className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-indigo-600">{place.category}</div>
                      <h3 className="mt-1 text-2xl font-bold text-gray-900">{place.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{place.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleEdit(place)} className="rounded-full bg-gray-900 px-4 py-2 text-sm text-white">Edit</button>
                      <button type="button" onClick={() => handleDelete(place._id)} className="rounded-full bg-red-600 px-4 py-2 text-sm text-white">Delete</button>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600 line-clamp-3">{place.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
