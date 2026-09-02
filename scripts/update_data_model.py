import json
import os

# Script to add city, state, searchQuery, placeId, imageUrl, imageStatus to every place in jaipur140Places.js

places_file = "/Users/rishijoshi/GhumoJaipur/frontend/src/data/jaipur140Places.js"

with open(places_file, "r") as f:
    content = f.read()

json_str = content.split("export const jaipur140Places = ")[1].strip().rstrip(";")
places = json.loads(json_str)

def determine_city(name, location):
    loc_lower = (name + " " + location).lower()
    if "amer" in loc_lower or "amber" in loc_lower: return "Amer"
    if "sanganer" in loc_lower: return "Sanganer"
    if "alwar" in loc_lower or "sariska" in loc_lower or "siliserh" in loc_lower or "bhartrihari" in loc_lower or "kankwari" in loc_lower: return "Alwar"
    if "ajmer" in loc_lower: return "Ajmer"
    if "pushkar" in loc_lower: return "Pushkar"
    if "sambhar" in loc_lower: return "Sambhar"
    if "tonk" in loc_lower or "bisalpur" in loc_lower: return "Tonk"
    if "neemrana" in loc_lower: return "Neemrana"
    if "abhaneri" in loc_lower or "chand baori" in loc_lower or "dausa" in loc_lower: return "Dausa"
    if "sikar" in loc_lower or "shekhawati" in loc_lower: return "Sikar"
    if "kishangarh" in loc_lower: return "Kishangarh"
    if "bagru" in loc_lower: return "Bagru"
    if "achrol" in loc_lower: return "Achrol"
    if "bhangarh" in loc_lower: return "Bhangarh"
    if "viratnagar" in loc_lower or "bairat" in loc_lower: return "Viratnagar"
    return "Jaipur"

updated_places = []
for p in places:
    city = determine_city(p.get("name", ""), p.get("location", ""))
    state = "Rajasthan"
    search_query = f"{p['name']}, {city}, {state}"
    
    # Extract existing image if available
    existing_img = p.get("images", [None])[0] if p.get("images") else p.get("imageUrl")
    
    updated_p = {
        "_id": p["_id"],
        "name": p["name"],
        "city": city,
        "state": state,
        "searchQuery": search_query,
        "placeId": p.get("placeId", None),
        "imageUrl": existing_img,
        "imageStatus": p.get("imageStatus", "pending"),
        "description": p.get("description", ""),
        "location": p.get("location", f"{p['name']}, {city}, {state}"),
        "rating": p.get("rating", 4.5),
        "timings": p.get("timings", "9:00 AM - 6:00 PM"),
        "ticketPrice": p.get("ticketPrice", 0),
        "category": p.get("category", "Tourist"),
        "nearestMetro": p.get("nearestMetro", "Badi Chaupar"),
        "walkingTime": p.get("walkingTime", "5 min walk"),
        "area": p.get("area", city),
        "famousForFood": p.get("famousForFood", "Local Delicacies"),
        "thingsToDo": p.get("thingsToDo", ["Sightseeing", "Photography"]),
        "dos": p.get("dos", ["Respect local guidelines"]),
        "donts": p.get("donts", ["Do not litter"]),
        "nearbyPlaces": p.get("nearbyPlaces", []),
        "faqs": p.get("faqs", [])
    }
    updated_places.append(updated_p)

out_code = "// 140+ REAL JAIPUR PLACES DATASET (With Automated Place-Specific Image Retrieval Data Model)\n"
out_code += "export const jaipur140Places = " + json.dumps(updated_places, indent=2) + ";\n"

with open(places_file, "w") as f:
    f.write(out_code)

print(f"Updated data model for {len(updated_places)} places successfully!")
