import { jaipur140Places } from "./jaipur140Places";
import { UDAIPUR_PLACES } from "./udaipurPlacesData";
import { DELHI_PLACES } from "./delhiPlacesData";
import { resolveJaipurRealRoute, resolveUdaipurRealRoute } from "./universalRealTransitResolver";
import { resolveDelhiRealRoute, resolveDelhiRealRouteAsync } from "./delhiTransitResolver";

export const getAllCitiesPlaces = (selectedCity = "all") => {
  const cityLow = (selectedCity || "").toLowerCase();
  if (cityLow === "delhi") {
    return DELHI_PLACES;
  }
  if (cityLow === "udaipur") {
    return UDAIPUR_PLACES;
  }
  if (cityLow === "jaipur") {
    return jaipur140Places;
  }
  return [...jaipur140Places, ...UDAIPUR_PLACES, ...DELHI_PLACES];
};

export const getCityRouteResult = (origin, dest, city = "jaipur") => {
  const cityLow = (city || "").toLowerCase();
  if (cityLow === "delhi") {
    return resolveDelhiRealRoute(origin, dest);
  }
  if (cityLow === "udaipur") {
    return resolveUdaipurRealRoute(origin, dest);
  }
  return resolveJaipurRealRoute(origin, dest);
};

export const getCityRouteResultAsync = async (origin, dest, city = "jaipur") => {
  const cityLow = (city || "").toLowerCase();
  if (cityLow === "delhi") {
    return await resolveDelhiRealRouteAsync(origin, dest);
  }
  return getCityRouteResult(origin, dest, city);
};
