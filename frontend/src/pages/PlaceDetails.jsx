import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { addPlaceReviewApi, deleteSavedTripApi, getPlaceByIdApi, getSavedTripsApi, saveTripApi } from "../services/api";
import ImageCarousel from "../components/ImageCarousel";
import { AuthContext } from "../context/AuthContext";
import ExperienceCard from "../components/ExperienceCard";
import { fallbackPlaces } from "../data/fallbackPlaces";

const infoCard = (title, value) => (
  <div className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur">
    <div className="text-xs uppercase tracking-[0.2em] text-gray-500">{title}</div>
    <div className="mt-2 text-lg font-semibold text-gray-900">{value}</div>
  </div>
);

export default function PlaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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
        setError(null);
        const res = await getPlaceByIdApi(id);
        if (res?.data) {
          setPlace(res.data);
          setError(null);
        } else {
          const searchStr = String(id || '').toLowerCase().replace(/_/g, ' ');
          const found = fallbackPlaces.find(p => 
            p._id === id || 
            p._id?.toLowerCase() === id?.toLowerCase() || 
            p.name?.toLowerCase().includes(searchStr) || 
            searchStr.includes(p.name?.toLowerCase())
          );
          setPlace(found || fallbackPlaces[1]); // Default Hawa Mahal
          setError(null);
        }
      } catch (err) {
        const searchStr = String(id || '').toLowerCase().replace(/_/g, ' ');
        const found = fallbackPlaces.find(p => 
          p._id === id || 
          p._id?.toLowerCase() === id?.toLowerCase() || 
          p.name?.toLowerCase().includes(searchStr) || 
          searchStr.includes(p.name?.toLowerCase())
        );
        setPlace(found || fallbackPlaces[1]);
        setError(null);
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

  const reviews = useMemo(() => place?.reviews || [], [place]);

  const localGuideCatalog = useMemo(() => ({
    "Amber Fort": {
      attractions: [
        { title: "Sheesh Mahal (Mirror Palace)", description: "Adorned with thousands of tiny mirror mosaics. Legend says a single candle can illuminate the entire hall.", category: "Highlight", rating: 4.9, famousFor: "Royal Craft" },
        { title: "Panna Meena Kund", description: "A 16th-century stepwell famous for its symmetrical criss-cross staircases. A photographer's paradise 1km from the fort.", category: "Photography", rating: 4.8, famousFor: "Architecture" },
        { title: "Anokhi Museum", description: "Located in a restored haveli, dedicated to traditional block printing. Features live demonstrations.", category: "Cultural", rating: 4.7, famousFor: "Hand Printing" },
        { title: "Light & Sound Show", description: "Narrates the history of the Kachwaha rulers at Maota Lake. Best enjoyed after sunset.", category: "Experience", rating: 4.6, famousFor: "History" }
      ],
      food: [
        { title: "1135 AD", description: "Luxury heritage dining inside the fort complex. Offers a private Sheesh Mahal dining experience.", price: 2500, category: "Fine Dining", warning: "Prior booking is highly recommended." },
        { title: "The Stag Rooftop", description: "Directly opposite the fort, offering panoramic views at sunset with North Indian and Italian snacks.", price: 800, category: "Views", warning: "Great for photography, food is average." },
        { title: "Anokhi Cafe", description: "Organic, healthy salads, cakes, and fresh juices using farm-to-table ingredients.", price: 600, category: "Healthy", warning: "Often crowded during lunch hours." }
      ],
      shopping: [
        { title: "Saurashtra Impex", description: "Famous for high-quality vintage textiles, patchwork quilts, and traditional Rajasthani fabrics.", category: "Textiles", famousFor: "Heritage" },
        { title: "Amer Town Market", description: "Explore narrow lanes for local craftsmen working on marble carvings and wooden souvenirs.", category: "Local", famousFor: "Crafts" }
      ]
    },
    "Hawa Mahal": {
      attractions: [
        { title: "Jantar Mantar", description: "UNESCO World Heritage site featuring the world's largest stone sundial. 5-min walk away.", category: "Heritage", rating: 4.8, famousFor: "UNESCO Site" },
        { title: "Tattoo Cafe Viewpoint", description: "A rooftop spot offering the iconic 'straight-on' photo of Hawa Mahal’s facade.", category: "Viewpoint", rating: 4.7, famousFor: "Photography" },
        { title: "Govind Dev Ji Temple", description: "Experience the deeply spiritual Aarti ceremony dedicated to Lord Krishna.", category: "Spiritual", rating: 4.9, famousFor: "Experience" }
      ],
      food: [
        { title: "LMB (Johari Bazaar)", description: "Legendary Paneer Ghewar and Royal Rajasthani Thali. A Jaipur institution since 1954.", price: 1200, category: "Iconic", warning: "Avoid random street guides; enter the main restaurant." },
        { title: "Radhe Kachori", description: "Famous for spicy and fresh Pyaaz Kachori, served with tangy tamarind chutney.", price: 40, category: "Street Food", warning: "Prepare for a long queue during mornings." },
        { title: "Pandit Kulfi", description: "Authentic Pista Kulfi served in traditional clay pots (matkas) in the bazaar lanes.", price: 60, category: "Dessert" }
      ],
      shopping: [
        { title: "Johari Bazaar", description: "The crown jewel of Jaipur markets, primarily known for gemstone jewelry and Kundan work.", category: "Jewelry", famousFor: "Gems" },
        { title: "Maniharon ka Rasta", description: "Watch artisans create traditional Lac Bangles from resin. Perfect for authentic souvenirs.", category: "Bangles", famousFor: "Handmade" },
        { title: "Jaipuri Razai (Quilts)", description: "Visit Kadar Bux for the famous lightweight, ultra-warm Jaipuri quilts.", category: "Textiles" }
      ]
    },
    "City Palace": {
      attractions: [
        { title: "Pritam Niwas Chowk", description: "A stunning courtyard with four gates representing the seasons. Peak photography spot.", category: "Highlight", rating: 4.9, famousFor: "Photography" },
        { title: "Chandra Mahal", description: "The private royal residence. Premium tours allow entry to these grand, lived-in rooms.", category: "Royal", rating: 4.8, famousFor: "Exclusive" },
        { title: "Mubarak Mahal", description: "A 'Welcome Palace' housing royal textiles and weaponry from the Maharaja's collection.", category: "Museum", rating: 4.6 }
      ],
      food: [
        { title: "Baradari", description: "A high-end restaurant blending contemporary design with historic architecture inside the palace.", price: 1500, category: "Fine Dining", warning: "Atmosphere is stunning at night." },
        { title: "Govindam Retreat", description: "Traditional vegetarian Rajasthani thali with live folk music in a heritage setting.", price: 700, category: "Traditional" },
        { title: "Sahu Chai", description: "Famous ginger-cardamom tea brewed over hot coals on Chaura Rasta.", price: 20, category: "Street Food" }
      ],
      shopping: [
        { title: "Tripolia Bazaar", description: "Famous for Lac bangles, brassware, and traditional carpets at fixed government rates.", category: "Crafts", famousFor: "Brassware" },
        { title: "Rana Saree Emporium", description: "High-quality Bandhej (tie-dye) and Gota Patti work on ethnic wear.", category: "Textiles" }
      ]
    },
    "Jantar Mantar": {
      attractions: [
        { title: "Samrat Yantra", description: "The world's largest stone sundial, accurate to within two seconds.", category: "Highlight", rating: 4.9, famousFor: "Science" },
        { title: "City Palace", description: "Explore the royal residence and museum complex right next door.", category: "Heritage", rating: 4.7 },
        { title: "Hawa Mahal", description: "Walk 500m to reach the Palace of Winds for its iconic architecture.", category: "Landmark", rating: 4.8 }
      ],
      food: [
        { title: "Pandit Kulfi", description: "Famous for its Kesar and Badam Kulfi near the Hawa Mahal entrance.", price: 50, category: "Dessert" },
        { title: "Samrat Kachori Wala", description: "Crispy Pyaaz ki Kachori and Samosas with tangy chutney.", price: 40, category: "Street Food" }
      ],
      shopping: [
        { title: "Sireh Deori Bazaar", description: "Best place for Jaipuri quilts, leather shoes, and home decor right beside the monument.", category: "Handicrafts" }
      ]
    },
    "Nahargarh Fort": {
      attractions: [
        { title: "Kali Burj Sunset Point", description: "The official sunset point offering 360-degree views of the city and Aravalli hills.", category: "Viewpoint", rating: 4.9, famousFor: "Sunset" },
        { title: "Madhavendra Bhawan", description: "Explore the identical suites built for the Maharaja's 12 queens with unique internal corridors.", category: "Heritage", rating: 4.7 },
        { title: "Sculpture Park", description: "A contemporary art gallery integrated into the fort's historic architecture.", category: "Art", rating: 4.6 }
      ],
      food: [
        { title: "Padao Restaurant", description: "Open-air restaurant with the best night view of the illuminated city.", price: 400, category: "Views", warning: "Entry fee usually includes one drink." },
        { title: "Once Upon a Time at Bagh", description: "High-end dining with a royal ambiance overlooking the gardens.", price: 2000, category: "Fine Dining" }
      ],
      shopping: [
        { title: "Amer Road Textiles", description: "High-quality vintage textiles and patchwork quilts on the way back to the city.", category: "Shopping" }
      ]
    },
    "Albert Hall Museum": {
      attractions: [
        { title: "Egyptian Mummy", description: "One of the few genuine mummies in India, a star attraction of the museum.", category: "Highlight", rating: 4.7, famousFor: "History" },
        { title: "Night Tourism", description: "The museum building is stunningly illuminated in different colors after 7 PM.", category: "Experience", rating: 4.9, famousFor: "Photography" },
        { title: "Central Park", description: "Lush green space with a musical fountain and Rajasthan's tallest national flag.", category: "Nature", rating: 4.6 }
      ],
      food: [
        { title: "Masala Chowk", description: "An open-air food court with 21 iconic Jaipur street food stalls like Samrat and Gulab Ji.", price: 400, category: "Street Food", warning: "Entry fee of ₹10, best visited after 6 PM." },
        { title: "Tapri Central", description: "Trendy rooftop cafe with great Vada Pav and sunset views over the park.", price: 600, category: "Cafe", famousFor: "Vibe" }
      ],
      shopping: [
        { title: "Bapu Bazaar", description: "Walking distance away, best for Mojris (leather shoes) and Bandhani textiles.", category: "Shopping", famousFor: "Bargaining" }
      ]
    },
    "Jal Mahal": {
      attractions: [
        { title: "Man Sagar Lake Promenade", description: "Perfect for an evening walk with the best reflection views of the palace.", category: "Nature", rating: 4.8, famousFor: "Views" },
        { title: "Bird Watching", description: "Migratory birds like flamingos can be spotted here during winter months.", category: "Experience", rating: 4.5, famousFor: "Nature" },
        { title: "Nahargarh Viewpoint", description: "Drive up the hill for a stunning 'top-down' perspective of the water palace.", category: "Viewpoint", rating: 4.7 }
      ],
      food: [
        { title: "Street Stalls", description: "Roasted corn (Bhutta) and Masala Chai from local vendors along the promenade.", price: 30, category: "Street Food" },
        { title: "Jal Mahal Restaurant", description: "Traditional North Indian and Rajasthani cuisine with lake-themed decor.", price: 800, category: "Restaurant" }
      ],
      shopping: [
        { title: "Indian Crafts Bazaar", description: "Marketplace opposite the lake for puppets, trinkets, and colorful souvenirs.", category: "Shopping" }
      ]
    },
    "Birla Mandir": {
      attractions: [
        { title: "Moti Doongri Temple", description: "Revered Ganesh temple located on a small hill right next to Birla Mandir.", category: "Spiritual", rating: 4.9, famousFor: "Experience" },
        { title: "White Marble Carvings", description: "Admire the intricate carvings depicting mythological and historical figures.", category: "Architecture", rating: 4.7 }
      ],
      food: [
        { title: "Pandit Pav Bhaji", description: "The most famous Pav Bhaji spot in Jaipur, located right outside the temple.", price: 150, category: "Iconic", warning: "Expect a long wait during evening hours." },
        { title: "Bhelpuri Stalls", description: "Spicy and tangy street snacks sold by vendors opposite the temple gates.", price: 50, category: "Street Food" }
      ],
      shopping: [
        { title: "Raja Park", description: "A major local shopping hub for trendy clothes, accessories, and footwear.", category: "Fashion" },
        { title: "World Trade Park", description: "Jaipur's luxury mall is just a 10-minute drive down JLN Marg.", category: "Luxury" }
      ]
    },
    "Patrika Gate": {
      attractions: [
        { title: "9 Painted Arches", description: "Intricate murals on each gate depicting the different regions of Rajasthan.", category: "Highlight", rating: 4.9, famousFor: "Photography" },
        { title: "Jawahar Circle Garden", description: "Asia's largest circular park, great for a morning walk or jogging.", category: "Nature", rating: 4.7 },
        { title: "Musical Fountain", description: "A synchronized light and sound show every evening at the park.", category: "Experience", rating: 4.6 }
      ],
      food: [
        { title: "Zolocrust", description: "A 24/7 chef-run cafe famous for sourdough pizzas and artisan bakery.", price: 1000, category: "Cafe", famousFor: "Pizza" },
        { title: "Saras Parlor", description: "A local favorite for Paneer Pakodas, Jalebis, and soft-serve ice cream.", price: 200, category: "Iconic" }
      ],
      shopping: [
        { title: "World Trade Park (WTP)", description: "Iconic blue building mall with international brands and a massive food court.", category: "Luxury", famousFor: "Architecture" },
        { title: "Gaurav Tower (GT)", description: "The heart of Jaipur's local shopping for electronics and budget fashion.", category: "Local" }
      ]
    },
    "Jaigarh Fort": {
      attractions: [
        { title: "Jaivana Cannon", description: "The world's largest cannon on wheels, a testament to Jaipur's military engineering.", category: "Military", rating: 4.9, famousFor: "World Record" },
        { title: "Armory & Museum", description: "Houses a massive collection of Rajput swords, shields, and historical photographs.", category: "History", rating: 4.6 },
        { title: "Underground Passages", description: "Secret tunnels that historically connected Jaigarh to Amer Fort.", category: "Highlight", rating: 4.7 }
      ],
      food: [
        { title: "The Stag Rooftop", description: "Located at the base, perfect for coffee while viewing the Amer-Jaigarh valley.", price: 400, category: "Views" }
      ],
      shopping: [
        { title: "Heritage Souvenirs", description: "The fort museum shop offers unique brass replicas and historical books.", category: "Specialty" }
      ]
    },
    "Galtaji Temple": {
      attractions: [
        { title: "Sacred Galta Kund", description: "A natural spring-fed tank where pilgrims take holy dips. Surrounded by stunning arches.", category: "Highlight", rating: 4.9, famousFor: "Spiritual" },
        { title: "Sun Temple View", description: "A hike up to the Surya Mandir offers a 360-degree panoramic view of Jaipur city.", category: "Viewpoint", rating: 4.8, famousFor: "Sunset" },
        { title: "Monkey Valley", description: "Famous for its large tribes of Rhesus macaques and Langurs roaming freely.", category: "Nature", warning: "Secure your sunglasses and cameras; avoid carrying food bags." }
      ],
      food: [
        { title: "Local Kulfi", description: "Traditional creamy kulfi sold by local vendors near the temple entrance.", price: 40, category: "Dessert" },
        { title: "MM Khan Hotel", description: "Legendary Mughlai spot near Ramganj for non-veg lovers (10 mins away).", price: 500, category: "Mughlai" }
      ],
      shopping: [
        { title: "Galta Gate Markets", description: "Traditional markets selling spiritual items, bangles, and local trinkets.", category: "Local" }
      ]
    },
    "Sisodia Rani Garden": {
      attractions: [
        { title: "Radha-Krishna Murals", description: "Multi-tiered garden walls decorated with paintings of divine love stories.", category: "Art", rating: 4.8, famousFor: "Heritage" },
        { title: "Ghat Ki Guni Drive", description: "A beautiful heritage corridor with restored havelis and arched gateways.", category: "Experience", rating: 4.7 }
      ],
      food: [
        { title: "Once Upon a Time at Bagh", description: "Dine in the illuminated Vidyadhar Garden for a romantic royal vibe.", price: 1800, category: "Fine Dining", warning: "Perfect for special occasions." },
        { title: "Sethi Barbeque", description: "A short drive to Raja Park for Jaipur's most famous Laal Maas.", price: 600, category: "Traditional" }
      ],
      shopping: [
        { title: "Pink Square Mall", description: "A modern shopping center with brands and a cinema nearby.", category: "Mall" }
      ]
    },
    "Rambagh Palace": {
      attractions: [
        { title: "Central Park", description: "Jaipur's largest park featuring the tallest national flag and jogging tracks.", category: "Nature", rating: 4.8 },
        { title: "MGD School Architecture", description: "Admire the heritage architecture of the adjacent Maharani Gayatri Devi School.", category: "Heritage" }
      ],
      food: [
        { title: "Verandah Rooftop", description: "Experience the ultimate luxury dining within the palace grounds.", price: 4000, category: "Royal", warning: "High-end dress code and prior reservation required." },
        { title: "Tapri Central", description: "A quick drive to C-Scheme for Jaipur's most popular cafe culture.", price: 600, category: "Cafe" }
      ],
      shopping: [
        { title: "Bapu Bazaar", description: "The go-to market for camel leather products and Bandhani textiles.", category: "Shopping" }
      ]
    },
    "Govind Dev Ji Temple": {
      attractions: [
        { title: "Morning Aarti", description: "One of the most powerful spiritual experiences in Jaipur with live devotional songs.", category: "Highlight", rating: 5.0, famousFor: "Spiritual" },
        { title: "City Palace Gates", description: "The temple is located within the royal palace complex; visit the grand gates nearby.", category: "Heritage", rating: 4.8 }
      ],
      food: [
        { title: "Temple Prasad", description: "Try the traditional sweets offered at the temple stall.", price: 50, category: "Traditional" },
        { title: "LMB", description: "Legendary restaurant in Johari Bazaar is a 10-minute walk away.", price: 1000, category: "Iconic" }
      ],
      shopping: [
        { title: "Johari Bazaar", description: "Right outside the temple gates for Jaipur's best jewelry and textiles.", category: "Shopping" }
      ]
    },
    "Chokhi Dhani": {
      attractions: [
        { title: "Cultural Performances", description: "Watch live Kalbelia (snake charmer dance), Ghoomar, and daring fire acts under the stars.", category: "Highlight", rating: 4.8, famousFor: "Experience" },
        { title: "Haldighati Enactment", description: "A live performance depicting the historic battle of Haldighati in a mini-amphitheater.", category: "History", rating: 4.6 },
        { title: "Village Rides", description: "Experience traditional tours on a camel, elephant, bullock cart, or horse within the complex.", category: "Experience", price: 100 }
      ],
      food: [
        { title: "Sangri Dining Hall", description: "Sit on the floor and enjoy a massive, unlimited Rajasthani Thali served on leaf platters.", price: 900, category: "Traditional Thali", warning: "Prepare for a very heavy meal; go on an empty stomach!" },
        { title: "Royal Fine Dining", description: "A more formal dining experience designed like a royal court with food served in silverware.", price: 1200, category: "Royal" }
      ],
      shopping: [
        { title: "Kalagram", description: "An in-house artisan bazaar for authentic pottery, paintings, and textiles directly from local craftsmen.", category: "Handicrafts" }
      ]
    },
    "Bapu Bazaar": {
      attractions: [
        { title: "Heritage Pink Walls", description: "Walk through the bazaar to admire the uniform pink architecture and symmetrical shopfronts.", category: "Heritage", rating: 4.7, famousFor: "Photography" },
        { title: "Achar Wali Gali", description: "A hidden lane dedicated to hundreds of varieties of authentic Rajasthani pickles.", category: "Experience", famousFor: "Foodie Spot" }
      ],
      food: [
        { title: "Laxmi Chat Bhandar (LCB)", description: "Famous for its Aloo Tikki, Dahi Vada, and spicy street snacks.", price: 200, category: "Iconic", warning: "Can get extremely crowded on weekends." },
        { title: "Gulab Ji Chai Wale", description: "Legendary spot for masala tea and Bun Samosa since 1946.", price: 50, category: "Street Food" }
      ],
      shopping: [
        { title: "Mojari Footwear", description: "Bapu Bazaar is the premier destination for traditional camel skin leather shoes.", category: "Footwear", famousFor: "Authentic" },
        { title: "Bandhani Textiles", description: "Best place for tie-dye sarees, suits, and vibrant Jaipuri fabrics.", category: "Textiles" }
      ]
    },
    "Johari Bazaar": {
      attractions: [
        { title: "Maniharon ka Rasta", description: "Watch artisans create traditional Lac Bangles from resin in this historic lane.", category: "Experience", rating: 4.9, famousFor: "Crafts" },
        { title: "Heritage Walk", description: "Explore the oldest part of the Pink City with its interconnected havelis and courtyards.", category: "Heritage" }
      ],
      food: [
        { title: "LMB (Laxmi Misthan Bhandar)", description: "The most famous spot for Paneer Ghewar and Royal Thali in Jaipur.", price: 1200, category: "Iconic", warning: "Avoid guides outside; enter the main restaurant directly." },
        { title: "Radhe Kachori", description: "Serving fresh and spicy Pyaaz Kachoris since decades.", price: 40, category: "Street Food" }
      ],
      shopping: [
        { title: "Jewelry & Gems", description: "World-renowned for Kundan work, Meenakari, and precious gemstones.", category: "Jewelry", famousFor: "Exquisite" },
        { title: "Traditional Bridal Wear", description: "The go-to market for heavy Rajasthani wedding attire and Gota Patti work.", category: "Textiles" }
      ]
    },
    "Jhalana Leopard Safari": {
      attractions: [
        { title: "Leopard Spotting", description: "Thrilling Jeep safari to spot leopards in their natural rocky habitat within city limits.", category: "Wildlife", rating: 4.9, famousFor: "Safari" },
        { title: "Bird Watching", description: "Home to many species of owls, eagles, and migratory birds.", category: "Nature", rating: 4.5 }
      ],
      food: [
        { title: "Townsend Kitchen", description: "A trendy multi-cuisine spot nearby with great outdoor seating and vibes.", price: 800, category: "Modern" },
        { title: "Hanuman Dhaba", description: "Local favorite for affordable and delicious North Indian food.", price: 300, category: "Dhaba" }
      ],
      shopping: [
        { title: "World Trade Park", description: "Jaipur's most futuristic mall is a 5-minute drive away for luxury brands.", category: "Luxury Mall" }
      ]
    },
    "Kanak Vrindavan Garden": {
      attractions: [
        { title: "Marble Fountains", description: "Beautifully carved white marble fountains inspired by Vrindavan's gardens.", category: "Highlight", rating: 4.6 },
        { title: "Jal Mahal View", description: "Offers a serene and unique side-angle view of the Water Palace.", category: "Viewpoint", rating: 4.8 }
      ],
      food: [
        { title: "Jal Mahal Restaurant", description: "Heritage-themed dining with views of the Aravalli hills.", price: 800, category: "Traditional" },
        { title: "Street Stalls", description: "Grab roasted corn or masala chai near the garden entrance.", price: 40, category: "Snacks" }
      ],
      shopping: [
        { title: "Amer Road Crafts", description: "Explore shops along the road for puppets and wooden toys.", category: "Handicrafts" }
      ]
    },
    "Isarlat Sargasuli": {
      attractions: [
        { title: "360-Degree View", description: "Climb the tower for the most comprehensive view of the entire Pink City layout.", category: "Highlight", rating: 4.7, famousFor: "Photography" },
        { title: "Victory Architecture", description: "Learn about the tower's history as a symbol of Maharaja Ishwari Singh's victory.", category: "History" }
      ],
      food: [
        { title: "Sahu Chai", description: "Famous coal-brewed tea located just a few steps away on Chaura Rasta.", price: 20, category: "Iconic" },
        { title: "Samrat Kachori", description: "Jaipur's best kachori spot is within walking distance.", price: 40, category: "Street Food" }
      ],
      shopping: [
        { title: "Tripolia Bazaar", description: "Located right at the base for brassware and traditional carpets.", category: "Shopping" }
      ]
    },
    "Jawahar Kala Kendra": {
      attractions: [
        { title: "Navgraha Architecture", description: "Explore the unique layout based on nine planets designed by Charles Correa.", category: "Architecture", rating: 4.8, famousFor: "Design" },
        { title: "Shilpgram", description: "A rural arts complex within JKK showcasing traditional village life and crafts.", category: "Cultural", rating: 4.6 }
      ],
      food: [
        { title: "Indian Coffee House", description: "A nostalgic hangout spot famous for its filter coffee and South Indian snacks.", price: 150, category: "Nostalgic" },
        { title: "Tapri", description: "A short drive to JLN Marg for trendy tea and fusion snacks.", price: 500, category: "Cafe" }
      ],
      shopping: [
        { title: "Art Bookshop", description: "A curated collection of books on Indian art, culture, and architecture.", category: "Books" }
      ]
    }
  }), []);

  const currentGuide = useMemo(() => {
    if (!place) return null;
    const hardcoded = localGuideCatalog[place.name];
    if (hardcoded) return hardcoded;

    // Fallback to database data if available
    if ((place.nearbyFoods && place.nearbyFoods.length > 0) || (place.transportOptions && place.transportOptions.length > 0)) {
      return {
        attractions: [],
        food: (place.nearbyFoods || []).map(food => ({
          title: food,
          description: `Highly recommended spot near ${place.name} as suggested by our local guides.`,
          category: "Local Favorite",
          type: "food"
        })),
        shopping: [],
        transport: (place.transportOptions || []).map(opt => ({
          title: opt,
          description: `Convenient way to reach or explore around ${place.name}.`,
          category: "Transport",
          type: "transport"
        }))
      };
    }

    return null;
  }, [place, localGuideCatalog]);

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

  if (!place) {
    return (
      <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-[#E6D6C3] bg-white p-10 text-center shadow-xl">
          <h1 className="text-2xl font-marcellus text-[#2C1E18]">Place not found</h1>
          <p className="mt-3 text-[#543C32]">{error || "The place you opened is unavailable."}</p>
          <Link to="/places" className="mt-6 inline-flex rounded-xl bg-[#B35D38] px-6 py-3.5 text-white font-bold">Back to Explore</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#2C1E18] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-start">
          {/* Main Content Column */}
          <div className="space-y-8">
            <div className="overflow-hidden rounded-3xl border border-[#E6D6C3] bg-white p-4 shadow-xl">
              <ImageCarousel images={place.images} />
            </div>

            <div className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="rounded-full bg-[#FAF1EC] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#B35D38] border border-[#EBC5B2]">{place.category}</span>
                  <h1 className="mt-4 text-4xl sm:text-5xl font-marcellus text-[#2C1E18] tracking-tight">{place.name}</h1>
                  <p className="mt-2 text-base text-[#543C32] font-semibold">{place.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-marcellus text-[#B35D38]">{place.rating?.toFixed(1) || "0.0"}</div>
                  <div className="text-xs font-bold text-[#A37B66] uppercase tracking-widest mt-1">Rating</div>
                </div>
              </div>

              <div className="mt-8 text-[#543C32] leading-relaxed">
                <p className="text-lg whitespace-pre-line font-medium">{place.description}</p>
              </div>
            </div>

            {/* Famous Things To Try Section (Deep Local Guide) */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[#E6D6C3]" />
                <h2 className="text-3xl font-marcellus text-[#2C1E18]">Famous Things to Try Nearby</h2>
                <div className="h-px flex-1 bg-[#E6D6C3]" />
              </div>

              {currentGuide ? (
                <>
                  {/* Attractions */}
                  {currentGuide.attractions && currentGuide.attractions.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#B35D38] text-white text-xl shadow-md">🏛️</div>
                        <h3 className="text-2xl font-marcellus text-[#2C1E18]">Must-See Attractions & Experiences</h3>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {currentGuide.attractions.map((item, idx) => (
                          <ExperienceCard key={idx} {...item} type="attraction" />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Food */}
                  {currentGuide.food && currentGuide.food.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D98A5B] text-white text-xl shadow-md">🍛</div>
                        <h3 className="text-2xl font-marcellus text-[#2C1E18]">Iconic Food to Try</h3>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {currentGuide.food.map((item, idx) => (
                          <ExperienceCard key={idx} {...item} type="food" />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Shopping */}
                  {currentGuide.shopping && currentGuide.shopping.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#793A1F] text-white text-xl shadow-md">🛍️</div>
                        <h3 className="text-2xl font-marcellus text-[#2C1E18]">Famous Local Shopping</h3>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {currentGuide.shopping.map((item, idx) => (
                          <ExperienceCard key={idx} {...item} type="shopping" />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Transport */}
                  {currentGuide.transport && currentGuide.transport.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2C1E18] text-white text-xl shadow-md">🚇</div>
                        <h3 className="text-2xl font-marcellus text-[#2C1E18]">Recommended Transport</h3>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {currentGuide.transport.map((item, idx) => (
                          <ExperienceCard key={idx} {...item} type="transport" />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              ) : (
                <div className="py-16 text-center text-[#543C32] border-2 border-dashed border-[#E6D6C3] rounded-3xl bg-white">
                  <div className="text-4xl mb-3">🗺️</div>
                  <p className="text-lg font-bold text-[#2C1E18]">Discovering the best of {place.name}...</p>
                  <p className="mt-1 text-sm text-[#793A1F]">We're curating deep local guides for this spot. Check back soon!</p>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <section className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-marcellus text-[#2C1E18]">Visitor Reviews</h2>
                  <p className="text-[#543C32] mt-1 font-medium text-sm">Real experiences from travelers like you.</p>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-3xl font-marcellus text-[#B35D38]">{reviews.length}</div>
                  <div className="text-xs font-bold text-[#A37B66] uppercase tracking-widest">Total Reviews</div>
                </div>
              </div>

              <form onSubmit={handleReviewSubmit} className="mb-10 space-y-4 bg-[#FAF5EF] p-6 rounded-3xl border border-[#E6D6C3]">
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full sm:w-52 rounded-2xl border border-[#E6D6C3] bg-white px-4 py-3.5 font-bold text-[#2C1E18] focus:border-[#B35D38] transition shadow-sm"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>{value} Stars Rating</option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows="4"
                  placeholder={user ? "Share details about the crowd, food, or best time to visit..." : "Please login to share your travel tips."}
                  className="w-full rounded-2xl border border-[#E6D6C3] bg-white px-5 py-4 text-[#2C1E18] font-medium focus:border-[#B35D38] transition shadow-sm text-base"
                  disabled={!user || reviewLoading}
                />
                <button
                  type="submit"
                  disabled={!user || reviewLoading}
                  className="w-full sm:w-auto rounded-xl bg-[#B35D38] hover:bg-[#964B2A] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reviewLoading ? "Posting Tip..." : "Post Review"}
                </button>
              </form>

              {reviewMessage && <p className="mt-4 text-sm font-bold text-[#B35D38] animate-pulse">{reviewMessage}</p>}

              <div className="space-y-4">
                {reviews.length ? (
                  reviews.map((review) => (
                    <div key={review._id || `${review.user?._id}-${review.rating}`} className="rounded-2xl bg-[#FAF5EF] p-6 border border-[#E6D6C3] shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-xl bg-[#B35D38] flex items-center justify-center text-white text-base font-bold shadow-sm uppercase">
                            {(review.user?.fullName || "T")[0]}
                          </div>
                          <div>
                            <div className="font-bold text-[#2C1E18] text-base">{review.user?.fullName || "Traveler"}</div>
                            <div className="text-[10px] text-[#A37B66] font-bold uppercase tracking-wider">Verified Visit</div>
                          </div>
                        </div>
                        <div className="rounded-xl bg-[#FAF1EC] px-3.5 py-1.5 text-xs font-bold text-[#B35D38] border border-[#EBC5B2]">
                          {review.rating} ★
                        </div>
                      </div>
                      {review.comment && <p className="text-[#543C32] leading-relaxed text-sm font-medium">{review.comment}</p>}
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-[#A37B66] italic font-medium">
                    Be the first to share your experience!
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="rounded-3xl border border-[#E6D6C3] bg-white p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-[#A37B66]">Avg. Entry Fee</p>
                  <p className="text-4xl font-marcellus text-[#2C1E18] mt-1">₹{place.ticketPrice || 0}</p>
                </div>
                <button 
                  onClick={handleSaveTrip} 
                  className={`rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all ${
                    saved 
                      ? "bg-emerald-700 text-white shadow-md" 
                      : "bg-[#2C1E18] hover:bg-[#3D2B23] text-white shadow-md"
                  }`}
                >
                  {saved ? "In My Trips" : "Save Spot"}
                </button>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate('/transport', { state: { destination: place.name } })}
                  className="w-full rounded-2xl bg-[#B35D38] hover:bg-[#964B2A] px-8 py-4.5 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
                >
                  <span className="text-lg">🚀</span>
                  Travel Now
                </button>
              </div>
              
              {saveMessage && <p className="mt-4 text-xs font-bold text-[#B35D38] text-center">{saveMessage}</p>}
              
              <div className="mt-8 space-y-3.5">
                {infoCard("Visiting Hours", place.timings)}
                {infoCard("Best Time to Visit", place.bestVisitTime)}
                {infoCard("Location", place.location)}
                
                <div className="pt-4 border-t border-[#F3E8DB]">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-2.5 w-2.5 rounded-full ${user ? 'bg-emerald-600' : 'bg-gray-400'}`} />
                    <span className="text-xs font-bold text-[#A37B66] uppercase tracking-widest">
                      {user ? `Trip for ${(user.name || 'Traveler').split(' ')[0]}` : 'Guest Access'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Helper CTA */}
            <div className="rounded-3xl bg-[#2C1E18] p-8 text-[#FAF5EF] shadow-xl border border-[#3D2B23] relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-marcellus text-white">Need a custom plan?</h3>
                <p className="mt-3 text-[#E6D6C3] text-sm leading-relaxed font-medium">
                  Save this place to your profile and we'll help you build an optimized route with real-time crowd alerts.
                </p>
                {!user ? (
                  <Link to="/login" className="mt-6 inline-block rounded-xl bg-[#B35D38] hover:bg-[#964B2A] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all shadow-md">
                    Get Started
                  </Link>
                ) : (
                  <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#D98A5B] bg-[#3D2B23] w-fit px-4 py-2 rounded-xl border border-[#543C32]">
                    ✨ Smart Trip Enabled
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
