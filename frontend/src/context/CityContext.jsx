import React, { createContext, useState, useEffect } from "react";

export const CityContext = createContext();

export const CITY_CONFIGS = {
  jaipur: {
    id: "jaipur",
    name: "Jaipur",
    tagline: "The Pink City",
    placesCount: "140+",
    transitModes: ["Metro", "Bus", "Auto", "Cab"],
    hasMetro: true,
    hasBoats: false,
    hasRopeway: false,
    popularSpots: [
      "Hawa Mahal", "Amer Fort", "City Palace", "Nahargarh Fort", 
      "Jal Mahal", "Jantar Mantar", "Albert Hall Museum", "Chokhi Dhani"
    ],
    defaultSource: "Jaipur Railway Station",
    defaultDest: "Hawa Mahal"
  },
  udaipur: {
    id: "udaipur",
    name: "Udaipur",
    tagline: "City of Lakes",
    placesCount: "30+",
    transitModes: ["Electric Bus", "Boat Ferry", "Ropeway", "Auto", "Cab"],
    hasMetro: false,
    hasBoats: true,
    hasRopeway: true,
    popularSpots: [
      "City Palace Udaipur", "Lake Pichola", "Jag Mandir", "Fatehsagar Lake", 
      "Sajjangarh Fort", "Bagore Ki Haveli", "Saheliyon Ki Bari", "Ambrai Ghat"
    ],
    defaultSource: "Udaipur City Railway Station",
    defaultDest: "City Palace Udaipur"
  }
};

export const CityProvider = ({ children }) => {
  const [currentCity, setCurrentCity] = useState(() => {
    try {
      const saved = localStorage.getItem("sheher_saathi_current_city");
      if (saved && CITY_CONFIGS[saved]) return saved;
    } catch (e) {
      console.error("Error reading current city:", e);
    }
    return "jaipur";
  });

  useEffect(() => {
    try {
      localStorage.setItem("sheher_saathi_current_city", currentCity);
    } catch (e) {
      console.error("Error saving current city:", e);
    }
  }, [currentCity]);

  const switchCity = (cityId) => {
    if (CITY_CONFIGS[cityId]) {
      setCurrentCity(cityId);
    }
  };

  return (
    <CityContext.Provider
      value={{
        currentCity,
        switchCity,
        cityDetails: CITY_CONFIGS[currentCity] || CITY_CONFIGS.jaipur,
        isJaipur: currentCity === "jaipur",
        isUdaipur: currentCity === "udaipur"
      }}
    >
      {children}
    </CityContext.Provider>
  );
};
