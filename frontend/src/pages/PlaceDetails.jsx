import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { addPlaceReviewApi, deleteSavedTripApi, getPlaceByIdApi, getSavedTripsApi, saveTripApi } from "../services/api";
import ImageCarousel from "../components/ImageCarousel";
import { AuthContext } from "../context/AuthContext";
import TransportCard from "../components/TransportCard";
import FoodCard from "../components/FoodCard";

const infoCard = (title, value) => (
  <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur">
    <div className="text-xs uppercase tracking-[0.2em] text-gray-500">{title}</div>
    <div className="mt-2 text-lg font-semibold text-gray-900">{value}</div>
  </div>
);

export default function PlaceDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    const loadPlace = async () => {
      try {
        setLoading(true);
        const res = await getPlaceByIdApi(id);
        setPlace(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load place");
      } finally {
        setLoading(false);
      }
    };

    loadPlace();
  }, [id]);

  useEffect(() => {
    const loadSavedState = async () => {
      if (!user) {
        setSaved(false);
        return;
      }

      try {
        const response = await getSavedTripsApi();
        const savedPlace = response.data?.some((item) => item.place?._id === id);
        setSaved(Boolean(savedPlace));
      } catch {
        setSaved(false);
      }
    };

    loadSavedState();
  }, [id, user]);

  const handleSaveTrip = async () => {
    if (!place || !user) return;

    setSaveMessage(null);
    try {
      if (saved) {
        await deleteSavedTripApi(place._id);
        setSaved(false);
        setSaveMessage("Removed from saved trips");
      } else {
        await saveTripApi(place._id);
        setSaved(true);
        setSaveMessage("Added to saved trips");
      }
    } catch (err) {
      setSaveMessage(err?.response?.data?.message || "Could not update saved trip");
    }
  };

  const foods = useMemo(() => place?.nearbyFoods || [], [place]);
  const transport = useMemo(() => place?.transportOptions || [], [place]);
  const reviews = useMemo(() => place?.reviews || [], [place]);

  const foodCatalog = useMemo(
    () => ({
      "Dal Baati Churma": { price: 180, rating: 4.9, famousFor: "Rajasthani feast", category: "Traditional", warning: "Best from local thalis, avoid overpriced tourist menus." },
      Ghewar: { price: 120, rating: 4.8, famousFor: "Sweet dessert", category: "Sweet", warning: "Fresh packs sell fast during season." },
      Lassi: { price: 60, rating: 4.7, famousFor: "Cooling drink", category: "Drink", warning: "Ask for a fixed price before ordering." },
      "Pyaz Kachori": { price: 40, rating: 4.8, famousFor: "Street snack", category: "Snack", warning: "Popular at busy stalls, compare before paying." },
      Kulfi: { price: 50, rating: 4.6, famousFor: "Dessert", category: "Sweet", warning: "Check portion size for tourist carts." },
      "Mawa Kachori": { price: 70, rating: 4.7, famousFor: "Sweet kachori", category: "Snack", warning: "Good when freshly made; avoid pre-packed items." },
      "Rajasthani Thali": { price: 250, rating: 4.9, famousFor: "Full meal", category: "Meal", warning: "Best in fixed-price family restaurants." },
      Chaat: { price: 35, rating: 4.5, famousFor: "Street food", category: "Snack", warning: "Pick hygienic stalls with steady crowd." },
      Rabri: { price: 80, rating: 4.7, famousFor: "Rich dessert", category: "Sweet", warning: "Cold storage matters, buy from trusted sellers." },
      Samosa: { price: 25, rating: 4.4, famousFor: "Quick bite", category: "Snack", warning: "Tourist areas may charge more, ask first." },
      Coffee: { price: 90, rating: 4.5, famousFor: "Quick stop", category: "Drink", warning: "Cafe pricing can be premium near forts." },
      Noodles: { price: 120, rating: 4.1, famousFor: "Fast meal", category: "Fusion", warning: "Look for hot fresh preparation." },
      Tea: { price: 20, rating: 4.5, famousFor: "Everyday stop", category: "Drink", warning: "Street tea should be boiling hot." },
      "Ice Cream": { price: 60, rating: 4.6, famousFor: "Cool treat", category: "Dessert", warning: "Check freezer hygiene." },
      Pakora: { price: 30, rating: 4.4, famousFor: "Rainy-time snack", category: "Snack", warning: "Fresh oil matters more than price." },
    }),
    []
  );

  const transportCatalog = useMemo(
    () => ({
      Bus: { fare: 10, time: "25 mins", badge: "cheapest", note: "Budget-friendly if your pickup point is on a main route." },
      Auto: { fare: 80, time: "10 mins", badge: "best", note: "Balanced choice for quick hops and short city rides." },
      Cab: { fare: 120, time: "8 mins", badge: "fastest", note: "Best when you are traveling with family or carrying bags." },
      "Metro + walk": { fare: 35, time: "20 mins", badge: "cheapest", note: "Useful when the destination is near a metro line." },
      Walk: { fare: 0, time: "15 mins", badge: "best", note: "Ideal for central market and palace clusters." },
      Scooter: { fare: 60, time: "12 mins", badge: "best", note: "Good for independent travelers with driving comfort." },
      Jeep: { fare: 150, time: "12 mins", badge: "fastest", note: "Often used for hill-top access and shared groups." },
      "RSRTC bus": { fare: 15, time: "30 mins", badge: "cheapest", note: "Good on fixed city and intercity routes." },
    }),
    []
  );

  const foodCards = foods.map((item) => ({
    name: item,
    category: foodCatalog[item]?.category || "Local",
    price: foodCatalog[item]?.price || 80,
    rating: foodCatalog[item]?.rating || 4.2,
    famousFor: foodCatalog[item]?.famousFor || "Popular local option",
    warning: foodCatalog[item]?.warning || "Compare prices before ordering in tourist-heavy areas.",
  }));

  const transportCards = transport.map((item) => ({
    mode: item,
    fare: transportCatalog[item]?.fare ?? (item.toLowerCase().includes("cab") ? 120 : item.toLowerCase().includes("auto") ? 80 : 10),
    time: transportCatalog[item]?.time || "10-25 mins",
    badge: transportCatalog[item]?.badge || "best",
    note: transportCatalog[item]?.note || "Choose based on time, crowd size and distance.",
  }));

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setReviewLoading(true);
    setReviewMessage(null);

    try {
      const response = await addPlaceReviewApi(place._id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setPlace(response.data);
      setReviewComment("");
      setReviewRating(5);
      setReviewMessage(response.message || "Review saved");
    } catch (err) {
      setReviewMessage(err?.response?.data?.message || "Could not save review");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 px-4 py-12"><div className="mx-auto h-[60vh] max-w-6xl animate-pulse rounded-3xl bg-white shadow-xl" /></div>;
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900">Place not found</h1>
          <p className="mt-3 text-gray-600">{error || "The place you opened is unavailable."}</p>
          <Link to="/places" className="mt-6 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-white">Back to Explore</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#eef2ff_100%)] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.45fr_0.95fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-4 shadow-2xl backdrop-blur">
              <ImageCarousel images={place.images} />
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">{place.category}</span>
                  <h1 className="mt-3 text-4xl font-black text-gray-900">{place.name}</h1>
                  <p className="mt-2 text-gray-600">{place.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-indigo-600">{place.rating?.toFixed(1) || "0.0"}</div>
                  <div className="text-sm text-gray-500">Average rating</div>
                  <div className="text-xs text-gray-400">{place.reviewCount || reviews.length || 0} reviews</div>
                </div>
              </div>

              <p className="mt-6 leading-7 text-gray-700">{place.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Ticket price</p>
                  <p className="text-3xl font-black text-gray-900">₹{place.ticketPrice || 0}</p>
                </div>
                <button onClick={handleSaveTrip} className={`rounded-full px-4 py-2 text-sm font-semibold ${saved ? "bg-green-600 text-white" : "bg-gray-900 text-white"}`}>
                  {saved ? "Saved Trip" : "Save Trip"}
                </button>
              </div>
              {saveMessage && <p className="mt-3 text-sm text-gray-600">{saveMessage}</p>}
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {infoCard("Timings", place.timings)}
                {infoCard("Best visit time", place.bestVisitTime)}
                {infoCard("Location", place.location)}
                {infoCard("Logged in", user ? "Yes" : "No")}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                <h2 className="text-xl font-bold text-gray-900">Nearby Foods</h2>
                <p className="mt-2 text-sm text-gray-500">Local dishes, rough tourist prices and a quick caution for each spot.</p>
                <div className="mt-4 grid gap-4">
                  {foodCards.length ? foodCards.map((food) => <FoodCard key={food.name} {...food} />) : <span className="text-sm text-gray-500">No recommendations yet.</span>}
                </div>
              </section>

              <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                <h2 className="text-xl font-bold text-gray-900">Transport Recommendations</h2>
                <p className="mt-2 text-sm text-gray-500">Cheapest, best-balance and fastest options for this route.</p>
                <div className="mt-4 grid gap-4">
                  {transportCards.length ? transportCards.map((transportItem) => <TransportCard key={transportItem.mode} {...transportItem} />) : <span className="text-sm text-gray-500">No transport recommendations yet.</span>}
                </div>
              </section>

              <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
                <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
                <p className="mt-2 text-sm text-gray-500">Share your travel experience for other visitors.</p>

                <form onSubmit={handleReviewSubmit} className="mt-4 space-y-3">
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>{value} stars</option>
                    ))}
                  </select>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows="4"
                    placeholder={user ? "Write a short review" : "Login to write a review"}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3"
                    disabled={!user || reviewLoading}
                  />
                  <button
                    type="submit"
                    disabled={!user || reviewLoading}
                    className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reviewLoading ? "Saving..." : "Submit Review"}
                  </button>
                </form>

                {reviewMessage && <p className="mt-3 text-sm text-gray-600">{reviewMessage}</p>}

                <div className="mt-6 space-y-4">
                  {reviews.length ? reviews.map((review) => (
                    <div key={review._id || `${review.user?._id}-${review.rating}`} className="rounded-2xl bg-gray-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-gray-900">{review.user?.fullName || "Traveler"}</div>
                        <div className="text-sm font-semibold text-indigo-600">{review.rating} ★</div>
                      </div>
                      {review.comment && <p className="mt-2 text-sm leading-6 text-gray-600">{review.comment}</p>}
                    </div>
                  )) : <div className="mt-4 text-sm text-gray-500">No reviews yet.</div>}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
