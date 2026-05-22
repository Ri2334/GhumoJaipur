export const jaipurMetroLines = [
  {
    id: "pink_line",
    name: "Pink Line",
    color: "#ff69b4",
    firstTrain: "06:20",
    lastTrain: "21:49",
    averageWaitTime: 10,
    stations: [
      { id: "mansarovar", name: "Mansarovar", order: 1, lat: 26.8756, lng: 75.7533, interchange: false, nearby: [] },
      { id: "new_aatish_market", name: "New Aatish Market", order: 2, lat: 26.8834, lng: 75.7589, interchange: false, nearby: [] },
      { id: "vivek_vihar", name: "Vivek Vihar", order: 3, lat: 26.8901, lng: 75.7654, interchange: false, nearby: [] },
      { id: "shyam_nagar", name: "Shyam Nagar", order: 4, lat: 26.8978, lng: 75.7721, interchange: false, nearby: [] },
      { id: "ram_nagar", name: "Ram Nagar", order: 5, lat: 26.9045, lng: 75.7798, interchange: false, nearby: [] },
      { id: "civil_lines", name: "Civil Lines", order: 6, lat: 26.9112, lng: 75.7865, interchange: false, nearby: ["Civil Lines"] },
      { id: "railway_station", name: "Railway Station", order: 7, lat: 26.9195, lng: 75.7932, interchange: false, nearby: ["Jaipur Railway Station"] },
      { id: "sindhi_camp", name: "Sindhi Camp", order: 8, lat: 26.9248, lng: 75.7999, interchange: true, nearby: ["Sindhi Camp Bus Stand"] },
      { id: "chandpole", name: "Chandpole", order: 9, lat: 26.9255, lng: 75.8111, interchange: false, nearby: ["Chandpole Bazaar"] },
      { id: "chhoti_chaupar", name: "Chhoti Chaupar", order: 10, lat: 26.9259, lng: 75.8188, interchange: false, nearby: ["City Palace", "Jantar Mantar"] },
      { id: "badi_chaupar", name: "Badi Chaupar", order: 11, lat: 26.9262, lng: 75.8265, interchange: false, nearby: ["Hawa Mahal", "Johari Bazaar"] }
    ]
  }
];

export const getNearestMetroStation = (lat, lng) => {
  const distance = (lat1, lon1, lat2, lon2) => {
    const p = 0.017453292519943295;    
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)); 
  };

  let nearest = null;
  let minDistance = Infinity;

  jaipurMetroLines.forEach(line => {
    line.stations.forEach(station => {
      const dist = distance(lat, lng, station.lat, station.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = { ...station, lineName: line.name, distance: dist };
      }
    });
  });

  return nearest;
};
