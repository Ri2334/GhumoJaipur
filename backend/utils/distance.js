/**
 * Calculates the distance between two points on the Earth in kilometers
 * using the Haversine formula.
 * 
 * @param {Object} a - Point A {lat, lng}
 * @param {Object} b - Point B {lat, lng}
 * @returns {number} Distance in kilometers
 */
export const haversineKm = (a, b) => {
  if (!a || !b || a.lat === undefined || a.lng === undefined || b.lat === undefined || b.lng === undefined) {
    return 0;
  }
  const toRad = v => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2) * Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon), Math.sqrt(1 - (sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon)));
  
  // Note: The formula in sharedController had a small error in the 'c' calculation (duplicate sinDLat + ...)
  // Let's use the standard haversine formula: a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
  const a_val = sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon;
  const c_val = 2 * Math.atan2(Math.sqrt(a_val), Math.sqrt(1 - a_val));
  
  return R * c_val;
};
