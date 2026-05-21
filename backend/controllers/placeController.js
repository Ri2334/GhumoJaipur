import Place from "../models/Place.js";

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string" && value.trim()) {
    return value.split("\n").map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const recalculateRating = (reviews = []) => {
  if (!reviews.length) return { rating: 0, reviewCount: 0 };
  const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  return {
    rating: Number((total / reviews.length).toFixed(1)),
    reviewCount: reviews.length,
  };
};

export const getAllPlaces = async (req, res) => {
  try {
    const { search = "", category = "", sort = "latest" } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const sortMap = {
      latest: { createdAt: -1 },
      rating: { rating: -1, createdAt: -1 },
      price: { ticketPrice: 1, createdAt: -1 },
      name: { name: 1 },
    };

    const places = await Place.find(filter)
      .populate("createdBy", "fullName email role")
      .sort(sortMap[sort] || sortMap.latest);

    return res.status(200).json({ success: true, data: places });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate("createdBy", "fullName email role")
      .populate("reviews.user", "fullName email role");
    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    return res.status(200).json({ success: true, data: place });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPlace = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      images,
      rating,
      timings,
      ticketPrice,
      category,
      bestVisitTime,
      nearbyFoods,
      transportOptions,
    } = req.body;

    if (!name || !description || !location || !timings || !category || !bestVisitTime) {
      return res.status(400).json({ success: false, message: "Missing required place fields" });
    }

    const place = await Place.create({
      name,
      description,
      location,
      images: normalizeArray(images),
      rating: Number(rating || 0),
      timings,
      ticketPrice: Number(ticketPrice || 0),
      category,
      bestVisitTime,
      nearbyFoods: normalizeArray(nearbyFoods),
      transportOptions: normalizeArray(transportOptions),
      createdBy: req.user._id,
    });

    return res.status(201).json({ success: true, data: place, message: "Place created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.images) updates.images = normalizeArray(updates.images);
    if (updates.nearbyFoods) updates.nearbyFoods = normalizeArray(updates.nearbyFoods);
    if (updates.transportOptions) updates.transportOptions = normalizeArray(updates.transportOptions);
    if (updates.rating !== undefined) updates.rating = Number(updates.rating);
    if (updates.ticketPrice !== undefined) updates.ticketPrice = Number(updates.ticketPrice);

    const place = await Place.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    return res.status(200).json({ success: true, data: place, message: "Place updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    return res.status(200).json({ success: true, message: "Place deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addPlaceReview = async (req, res) => {
  try {
    const { rating, comment = "" } = req.body;
    const ratingValue = Number(rating);

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    const existingIndex = place.reviews.findIndex((review) => review.user.toString() === req.user._id.toString());
    const reviewPayload = {
      user: req.user._id,
      rating: ratingValue,
      comment: String(comment).trim(),
    };

    if (existingIndex >= 0) {
      place.reviews[existingIndex] = reviewPayload;
    } else {
      place.reviews.push(reviewPayload);
    }

    const stats = recalculateRating(place.reviews);
    place.rating = stats.rating;
    place.reviewCount = stats.reviewCount;

    await place.save();

    const updatedPlace = await Place.findById(place._id)
      .populate("createdBy", "fullName email role")
      .populate("reviews.user", "fullName email role");

    return res.status(200).json({ success: true, data: updatedPlace, message: existingIndex >= 0 ? "Review updated successfully" : "Review added successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
