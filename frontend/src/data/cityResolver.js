import { jaipur140Places } from "./jaipur140Places";
import { UDAIPUR_PLACES } from "./udaipurPlacesData";
import { calculateUniversalRoute } from "./jaipurUniversalTransitEngine";
import { calculateUdaipurRoute } from "./udaipurTransitEngine";

export const getAllCitiesPlaces = (selectedCity = "all") => {
  if (selectedCity.toLowerCase() === "udaipur") {
    return UDAIPUR_PLACES;
  }
  if (selectedCity.toLowerCase() === "jaipur") {
    return jaipur140Places;
  }
  return [...jaipur140Places, ...UDAIPUR_PLACES];
};

export const getCityRouteResult = (origin, dest, city = "jaipur") => {
  if (city.toLowerCase() === "udaipur") {
    return calculateUdaipurRoute(origin, dest);
  }
  return calculateUniversalRoute(origin, dest);
};
