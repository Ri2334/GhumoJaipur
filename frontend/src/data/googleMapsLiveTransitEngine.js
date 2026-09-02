/**
 * GOOGLE MAPS REAL-TIME DIRECT INTEGRATION
 * Generates verified Google Maps directions deep-links, live traffic routes, and mode-specific transit parameters.
 */

export function getGoogleMapsTransitUrl(source, destination, city = "Jaipur", mode = "transit") {
  const cleanSource = encodeURIComponent(`${source}, ${city}, Rajasthan, India`);
  const cleanDest = encodeURIComponent(`${destination}, ${city}, Rajasthan, India`);
  
  let travelMode = "transit";
  if (mode === "driving" || mode === "cab" || mode === "auto") travelMode = "driving";
  if (mode === "walking" || mode === "walk") travelMode = "walking";
  if (mode === "bicycling" || mode === "bike") travelMode = "bicycling";

  return `https://www.google.com/maps/dir/?api=1&origin=${cleanSource}&destination=${cleanDest}&travelmode=${travelMode}`;
}

export function getGoogleMapsEmbedUrl(source, destination, city = "Jaipur") {
  const cleanSource = encodeURIComponent(`${source}, ${city}`);
  const cleanDest = encodeURIComponent(`${destination}, ${city}`);
  return `https://maps.google.com/maps?q=from+${cleanSource}+to+${cleanDest}&output=embed`;
}
