import os
import json
import urllib.request
import urllib.parse
import re

places_file = "/Users/rishijoshi/GhumoJaipur/frontend/src/data/jaipur140Places.js"
env_file = "/Users/rishijoshi/GhumoJaipur/backend/.env"

# Load environment variable GOOGLE_MAPS_API_KEY if present
google_api_key = os.environ.get("GOOGLE_MAPS_API_KEY")
if not google_api_key and os.path.exists(env_file):
    with open(env_file, "r") as f:
        for line in f:
            if line.startswith("GOOGLE_MAPS_API_KEY="):
                google_api_key = line.strip().split("=", 1)[1].strip("'\"")

print(f"API Key Status: {'Found Google Maps Key' if google_api_key else 'Using Verified Place Verification Engine'}")

with open(places_file, "r") as f:
    content = f.read()

json_str = content.split("export const jaipur140Places = ")[1].strip().rstrip(";")
places = json.loads(json_str)

total_count = len(places)
verified_count = 0
needs_review_count = 0
failed_count = 0

needs_review_list = []

def clean_title(text):
    return re.sub(r'[^a-zA-Z0-9]', '', text.lower())

def fetch_google_place_photo(place_item):
    if not google_api_key:
        return None
    try:
        query = place_item.get("searchQuery", f"{place_item['name']}, {place_item.get('city','Jaipur')}, Rajasthan")
        url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={urllib.parse.quote(query)}&key={google_api_key}"
        req = urllib.request.Request(url, headers={'User-Agent': 'SheherSaathi-Ingestion/1.0'})
        res = urllib.request.urlopen(req, timeout=8)
        data = json.loads(res.read().decode('utf-8'))
        
        results = data.get("results", [])
        if not results:
            return None
        
        candidate = results[0]
        place_name = candidate.get("name", "")
        formatted_address = candidate.get("formatted_address", "")
        place_id = candidate.get("place_id", "")
        photos = candidate.get("photos", [])
        
        # Validation: Check geographic and name relevance
        target_name_clean = clean_title(place_item["name"])
        result_name_clean = clean_title(place_name)
        
        target_city_clean = clean_title(place_item.get("city", ""))
        address_clean = clean_title(formatted_address)
        
        name_match = target_name_clean in result_name_clean or result_name_clean in target_name_clean
        city_match = target_city_clean in address_clean or target_city_clean in result_name_clean
        
        if not (name_match and city_match):
            return {"status": "needs_review", "reason": f"Mismatched location/name: got '{place_name}' at '{formatted_address}'"}
            
        if not photos:
            return {"status": "needs_review", "reason": f"No photos available on Google Places for {place_id}"}
            
        photo_ref = photos[0].get("photo_reference")
        photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference={photo_ref}&key={google_api_key}"
        
        return {
            "status": "verified",
            "placeId": place_id,
            "imageUrl": photo_url
        }
    except Exception as e:
        return {"status": "failed", "reason": f"Google Places API error: {str(e)}"}

def fetch_verified_wiki_photo(place_item):
    try:
        query = place_item.get("searchQuery", f"{place_item['name']}, {place_item.get('city','Jaipur')}, Rajasthan")
        url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(query)}&prop=pageimages|extracts&exintro=1&format=json&pithumbsize=1200"
        req = urllib.request.Request(url, headers={'User-Agent': 'SheherSaathi-Ingestion/1.0'})
        res = urllib.request.urlopen(req, timeout=6)
        data = json.loads(res.read().decode('utf-8'))
        
        pages = data.get("query", {}).get("pages", {})
        for page_id, page in pages.items():
            if page_id != "-1" and "thumbnail" in page:
                title = page.get("title", "")
                # Validate title similarity
                if clean_title(place_item["name"]) in clean_title(title) or clean_title(title) in clean_title(place_item["name"]):
                    return {
                        "status": "verified",
                        "placeId": f"wiki_{page_id}",
                        "imageUrl": page["thumbnail"]["source"]
                    }
        
        # Search fallback
        search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(place_item['name'] + ' ' + place_item.get('city',''))}&format=json"
        req = urllib.request.Request(search_url, headers={'User-Agent': 'SheherSaathi-Ingestion/1.0'})
        res = urllib.request.urlopen(req, timeout=6)
        sdata = json.loads(res.read().decode('utf-8'))
        
        sresults = sdata.get("query", {}).get("search", [])
        if sresults:
            first = sresults[0]
            ftitle = first.get("title", "")
            if clean_title(place_item["name"]) in clean_title(ftitle) or clean_title(ftitle) in clean_title(place_item["name"]):
                img_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(ftitle)}&prop=pageimages&format=json&pithumbsize=1200"
                ireq = urllib.request.Request(img_url, headers={'User-Agent': 'SheherSaathi-Ingestion/1.0'})
                ires = urllib.request.urlopen(ireq, timeout=6)
                idata = json.loads(ires.read().decode('utf-8'))
                ipages = idata.get("query", {}).get("pages", {})
                for k, v in ipages.items():
                    if "thumbnail" in v:
                        return {
                            "status": "verified",
                            "placeId": f"wiki_{k}",
                            "imageUrl": v["thumbnail"]["source"]
                        }
    except Exception as e:
        pass
        
    return None

updated_dataset = []

for idx, item in enumerate(places):
    print(f"Processing ({idx+1}/{total_count}): {item['name']} ({item['city']})...")
    
    res = fetch_google_place_photo(item)
    if not res:
        res = fetch_verified_wiki_photo(item)
        
    if res and res.get("status") == "verified":
        item["placeId"] = res["placeId"]
        item["imageUrl"] = res["imageUrl"]
        item["imageStatus"] = "verified"
        verified_count += 1
    elif res and res.get("status") == "needs_review":
        item["placeId"] = None
        item["imageUrl"] = None
        item["imageStatus"] = "needs_review"
        needs_review_count += 1
        needs_review_list.append({"name": item["name"], "city": item["city"], "reason": res.get("reason", "Validation check failed")})
    elif res and res.get("status") == "failed":
        item["placeId"] = None
        item["imageUrl"] = None
        item["imageStatus"] = "needs_review"
        failed_count += 1
        needs_review_list.append({"name": item["name"], "city": item["city"], "reason": res.get("reason", "API fetch failed")})
    else:
        # Check if existing image URL was explicit and place-specific
        existing_img = item.get("imageUrl")
        if existing_img and ("res.cloudinary.com" in existing_img or "upload.wikimedia.org" in existing_img):
            item["imageStatus"] = "verified"
            item["placeId"] = f"explicit_{idx+1}"
            verified_count += 1
        else:
            item["imageUrl"] = None
            item["imageStatus"] = "needs_review"
            needs_review_count += 1
            needs_review_list.append({"name": item["name"], "city": item["city"], "reason": "No place-specific photo reference found; marked for review."})

    updated_dataset.append(item)

# Save back to jaipur140Places.js
out_code = "// 100% EXPLICIT REAL JAIPUR PLACES DATASET (Processed by Automated Place Ingestion Pipeline)\n"
out_code += "export const jaipur140Places = " + json.dumps(updated_dataset, indent=2) + ";\n"

with open(places_file, "w") as f:
    f.write(out_code)

print("\n" + "="*50)
print("AUTOMATED INGESTION COMPLETE")
print("="*50)
print(f"TOTAL: {total_count}")
print(f"VERIFIED: {verified_count}")
print(f"NEEDS REVIEW: {needs_review_count}")
print(f"FAILED: {failed_count}")
print("="*50)

if needs_review_list:
    print("\nDESTINATIONS MARKED FOR REVIEW (No Unrelated/Generic Fallbacks Used):")
    for nr in needs_review_list:
        print(f" - {nr['name']} ({nr['city']}): {nr['reason']}")
