import React, { useState, useEffect, useContext } from "react";
import SEOHead from "../components/SEOHead";
import { CityContext } from "../context/CityContext";
import { getStoredRentals, saveStoredRentals } from "../data/rentalsData";

export default function Rentals() {
  const { currentCity, cityDetails } = useContext(CityContext);
  const [rentals, setRentals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  // Business Host Modal State
  const [showHostModal, setShowHostModal] = useState(false);
  const [hostForm, setHostForm] = useState({
    title: "",
    category: "Activa & Scooty",
    dailyRate: "",
    hourlyRate: "",
    deposit: "1000",
    pickupLocation: "",
    hostName: "",
    hostPhone: "",
    image: "",
    description: ""
  });
  const [hostSuccess, setHostSuccess] = useState(false);

  useEffect(() => {
    setRentals(getStoredRentals());
  }, []);

  // Filter rentals by current city and category
  const filtered = rentals.filter((item) => {
    const matchCity = (item.city || "Udaipur").toLowerCase() === currentCity.toLowerCase();
    const matchCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch =
      search.trim() === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.pickupLocation.toLowerCase().includes(search.toLowerCase()) ||
      item.hostName.toLowerCase().includes(search.toLowerCase());

    return matchCity && matchCat && matchSearch;
  });

  const handleAddListing = (e) => {
    e.preventDefault();
    if (!hostForm.title || !hostForm.dailyRate || !hostForm.hostPhone) return;

    const newListing = {
      id: `custom-${Date.now()}`,
      title: hostForm.title,
      category: hostForm.category,
      city: cityDetails.name,
      dailyRate: Number(hostForm.dailyRate),
      hourlyRate: Number(hostForm.hourlyRate || Math.round(hostForm.dailyRate / 7)),
      deposit: Number(hostForm.deposit || 1000),
      pickupLocation: hostForm.pickupLocation || `${cityDetails.name} City Center`,
      hostName: hostForm.hostName || "Local Verified Host",
      hostPhone: hostForm.hostPhone,
      rating: 5.0,
      reviewsCount: 1,
      fuelType: "Petrol",
      helmetIncluded: "2 Helmets Included Free",
      image: hostForm.image || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
      description: hostForm.description || "Self-drive rental vehicle available for daily and hourly rental.",
      featured: true
    };

    const updated = [newListing, ...rentals];
    setRentals(updated);
    saveStoredRentals(updated);
    setHostSuccess(true);

    setTimeout(() => {
      setHostSuccess(false);
      setShowHostModal(false);
      setHostForm({
        title: "",
        category: "Activa & Scooty",
        dailyRate: "",
        hourlyRate: "",
        deposit: "1000",
        pickupLocation: "",
        hostName: "",
        hostPhone: "",
        image: "",
        description: ""
      });
    }, 2000);
  };

  const categories = ["All", "Activa & Scooty", "Bikes & Cruisers", "Self-Drive Cars"];

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-8 selection:bg-[#B35D38] selection:text-white">
      <SEOHead
        title={`${cityDetails.name} Self-Drive Vehicle Rentals — Activa, Bikes & Cars | Sheher Saathi`}
        description={`Rent Honda Activas, Royal Enfield bullets, and self-drive cars in ${cityDetails.name}. Transparent daily rates, verified hosts, and instant pickup.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#2C1E18] via-[#3D2B23] to-[#241712] rounded-[2.5rem] p-8 sm:p-12 text-[#FAF5EF] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-[#B35D38] text-white text-xs font-black uppercase tracking-widest shadow-md">
              {cityDetails.name} Self-Drive Fleet 🛵🚗
            </span>
            <h1 className="text-4xl sm:text-6xl font-marcellus leading-tight">
              {cityDetails.name} Activa, Bike <br />
              <span className="text-[#D98A5B]">&amp; Car Rentals</span>
            </h1>
            <p className="text-sm sm:text-base text-[#E6D6C3] font-medium leading-relaxed">
              Explore {cityDetails.name} at your own pace. Rent Activas, Royal Enfield cruisers, or self-drive cars with verified local hosts.
            </p>
          </div>

          <button
            onClick={() => setShowHostModal(true)}
            className="bg-gradient-to-r from-[#B35D38] to-[#D98A5B] hover:brightness-110 text-white px-7 py-4 rounded-2xl font-bold text-sm shadow-xl transition whitespace-nowrap flex items-center gap-2"
          >
            <span>💼 List Your Vehicle / Host Signup</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-6 rounded-3xl border border-[#E6D6C3] shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <span className="absolute left-4 top-3.5 text-base">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${cityDetails.name} vehicle or pickup location...`}
              className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-semibold text-[#2C1E18] outline-none focus:border-[#B35D38]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? "bg-[#B35D38] text-white shadow-md"
                    : "bg-[#FAF5EF] hover:bg-[#F3E8DB] text-[#2C1E18] border border-[#E6D6C3]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Rentals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-[#E6D6C3] overflow-hidden shadow-xl flex flex-col justify-between group hover:shadow-2xl transition duration-300">
              <div>
                <div className="relative h-52 overflow-hidden bg-[#2C1E18]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#B35D38] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-[#1C110C]/80 text-[#D98A5B] font-bold text-xs px-3 py-1 rounded-full backdrop-blur-md border border-[#3D2B23]">
                    ★ {item.rating} ({item.reviewsCount})
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-marcellus text-2xl text-[#2C1E18]">{item.title}</h3>
                    <p className="text-xs text-[#A37B66] font-semibold mt-1">📍 {item.pickupLocation}</p>
                  </div>

                  <p className="text-xs text-[#543C32] leading-relaxed font-medium line-clamp-2">{item.description}</p>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E6D6C3] text-xs">
                    <div className="bg-[#FAF5EF] p-2.5 rounded-xl border border-[#E6D6C3]">
                      <div className="text-[10px] text-[#A37B66] font-bold uppercase">Daily Tariff</div>
                      <div className="font-black text-[#B35D38] text-base">₹{item.dailyRate} <span className="text-xs font-normal text-[#543C32]">/day</span></div>
                    </div>
                    <div className="bg-[#FAF5EF] p-2.5 rounded-xl border border-[#E6D6C3]">
                      <div className="text-[10px] text-[#A37B66] font-bold uppercase">Security Deposit</div>
                      <div className="font-bold text-[#2C1E18] text-sm">₹{item.deposit}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-[#543C32] bg-[#FAF1EC] px-3 py-2 rounded-xl">
                    <span>Host: {item.hostName}</span>
                    <span className="text-[#B35D38]">✔ {item.helmetIncluded}</span>
                  </div>
                </div>
              </div>

              {/* Booking Actions */}
              <div className="p-6 pt-0 grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${item.hostPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I want to book ${item.title} in ${cityDetails.name} via Sheher Saathi.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                >
                  <span>💬 WhatsApp</span>
                </a>
                <a
                  href={`tel:${item.hostPhone}`}
                  className="bg-[#3D2B23] hover:bg-[#4A362B] text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md transition"
                >
                  <span>📞 Call Host</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* BUSINESS HOST SIGNUP MODAL */}
        {showHostModal && (
          <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#E6D6C3] max-w-xl w-full p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowHostModal(false)}
                className="absolute top-6 right-6 text-xl text-[#A37B66] hover:text-[#2C1E18]"
              >
                ✕
              </button>

              <div>
                <span className="px-3.5 py-1 rounded-full bg-[#FAF1EC] text-[#B35D38] text-xs font-black uppercase border border-[#EBC5B2]">
                  Partner Host Signup 💼
                </span>
                <h2 className="text-3xl font-marcellus text-[#2C1E18] mt-2">List Your Vehicle on Sheher Saathi</h2>
                <p className="text-xs text-[#543C32] font-semibold mt-1">Rent out your Activa, Bike, or Car to tourists in {cityDetails.name}.</p>
              </div>

              {hostSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-bold text-center space-y-2">
                  <div className="text-3xl">🎉</div>
                  <div>Vehicle Listed Successfully!</div>
                  <p className="text-xs font-normal">Your rental listing is now live in the {cityDetails.name} marketplace.</p>
                </div>
              ) : (
                <form onSubmit={handleAddListing} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#2C1E18]">Vehicle Title *</label>
                      <input
                        required
                        type="text"
                        value={hostForm.title}
                        onChange={(e) => setHostForm({ ...hostForm, title: e.target.value })}
                        placeholder="e.g. Honda Activa 6G Black"
                        className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#2C1E18]">Category *</label>
                      <select
                        value={hostForm.category}
                        onChange={(e) => setHostForm({ ...hostForm, category: e.target.value })}
                        className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none"
                      >
                        <option value="Activa & Scooty">Activa &amp; Scooty</option>
                        <option value="Bikes & Cruisers">Bikes &amp; Cruisers</option>
                        <option value="Self-Drive Cars">Self-Drive Cars</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#2C1E18]">Daily Rate (₹) *</label>
                      <input
                        required
                        type="number"
                        value={hostForm.dailyRate}
                        onChange={(e) => setHostForm({ ...hostForm, dailyRate: e.target.value })}
                        placeholder="e.g. 400"
                        className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-xl px-3 py-2.5 text-xs font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#2C1E18]">Hourly Rate (₹)</label>
                      <input
                        type="number"
                        value={hostForm.hourlyRate}
                        onChange={(e) => setHostForm({ ...hostForm, hourlyRate: e.target.value })}
                        placeholder="e.g. 60"
                        className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-xl px-3 py-2.5 text-xs font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#2C1E18]">Deposit (₹)</label>
                      <input
                        type="number"
                        value={hostForm.deposit}
                        onChange={(e) => setHostForm({ ...hostForm, deposit: e.target.value })}
                        placeholder="e.g. 1000"
                        className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-xl px-3 py-2.5 text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#2C1E18]">Host / Business Name *</label>
                      <input
                        required
                        type="text"
                        value={hostForm.hostName}
                        onChange={(e) => setHostForm({ ...hostForm, hostName: e.target.value })}
                        placeholder="e.g. Mewar Bike Rentals"
                        className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#2C1E18]">Contact Phone / WhatsApp *</label>
                      <input
                        required
                        type="tel"
                        value={hostForm.hostPhone}
                        onChange={(e) => setHostForm({ ...hostForm, hostPhone: e.target.value })}
                        placeholder="e.g. +91 98290 12345"
                        className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2C1E18]">Pickup Location in {cityDetails.name} *</label>
                    <input
                      required
                      type="text"
                      value={hostForm.pickupLocation}
                      onChange={(e) => setHostForm({ ...hostForm, pickupLocation: e.target.value })}
                      placeholder="e.g. Udaipur City Railway Station & Lal Ghat"
                      className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2C1E18]">Vehicle Image URL (Optional)</label>
                    <input
                      type="url"
                      value={hostForm.image}
                      onChange={(e) => setHostForm({ ...hostForm, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-[#FAF5EF] border border-[#E6D6C3] rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#B35D38] hover:bg-[#964B2A] text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl transition"
                  >
                    Publish Vehicle Listing Live →
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
