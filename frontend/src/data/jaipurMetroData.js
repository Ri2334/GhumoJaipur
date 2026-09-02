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

export const jaipurMetroStations = [
  {
    id: "mansarovar",
    name: "Mansarovar",
    line: "Pink Line",
    zone: "West",
    terminal: true,
    operatingHours: "5:00 AM - 11:00 PM",
    firstTrain: "5:15 AM",
    lastTrain: "10:45 PM",
    peakFrequency: "3-5 mins",
    offPeakFrequency: "8-10 mins",
    fareRange: "₹10 - ₹60",
    facilities: ["Parking", "Restroom", "Elevator", "ATM", "Smart Card Counter"],
    location: "Mansarovar Colony, Shipra Path, Jaipur",
    nearbyLandmarks: ["Shipra Path Park", "VT Road Market", "Mansarovar Plaza", "SFS College"],
    faqs: [
      { q: "What are the operating hours of Mansarovar Metro Station?", a: "Mansarovar Metro Station operates daily from 5:00 AM to 11:00 PM." },
      { q: "Is two-wheeler and four-wheeler parking available at Mansarovar?", a: "Yes, Mansarovar station has a dedicated paid parking facility for two-wheelers and cars." },
      { q: "How frequently do trains run from Mansarovar?", a: "Trains arrive every 3 to 5 minutes during peak hours (7-10 AM & 5-8 PM) and 8 to 10 minutes off-peak." },
      { q: "Where can I purchase or recharge a Metro Smart Card?", a: "Smart Cards can be bought and recharged at the Customer Care counter near Gate 1." },
      { q: "Is Mansarovar Metro Station wheelchair accessible?", a: "Yes, the station is equipped with elevators, tactile paths, and ramps for full accessibility." },
      { q: "What is the fare from Mansarovar to Badi Chaupar?", a: "The token fare from Mansarovar to Badi Chaupar is ₹20. Smart Card users get an instant 5% discount." },
      { q: "Can I carry luggage on Jaipur Metro?", a: "Yes, luggage up to 15 kg is allowed free of cost per passenger." },
      { q: "Which gate is closest to Shipra Path Market?", a: "Gate No. 2 opens directly towards Shipra Path and VT Road." },
      { q: "Are restrooms available at Mansarovar station?", a: "Clean public restrooms are available on the concourse level near Gate 1." },
      { q: "Is drinking water available inside the station?", a: "Water ATMs and RO drinking water fountains are installed near the ticket counters." }
    ]
  },
  {
    id: "new_aatish_market",
    name: "New Aatish Market",
    line: "Pink Line",
    zone: "West",
    terminal: false,
    operatingHours: "5:00 AM - 11:00 PM",
    firstTrain: "5:18 AM",
    lastTrain: "10:48 PM",
    peakFrequency: "3-5 mins",
    offPeakFrequency: "8-10 mins",
    fareRange: "₹10 - ₹60",
    facilities: ["ATM", "Restroom", "Elevator", "Escalator"],
    location: "Aatish Market, Shopping Complex, Jaipur",
    nearbyLandmarks: ["New Aatish Market", "Gopalpura Bypass", "Gurjar Ki Thadi"],
    faqs: [
      { q: "What is New Aatish Market station famous for?", a: "It provides direct metro access to Jaipur's major building material, tile, and sanitaryware market." },
      { q: "Is parking available at New Aatish Market Metro Station?", a: "Limited street parking is available; paid designated parking is at adjacent Mansarovar station." },
      { q: "What are the first and last train timings?", a: "First train towards Badi Chaupar departs at 5:18 AM and the last train departs at 10:48 PM." },
      { q: "Is elevator service available for senior citizens?", a: "Yes, dual elevators connect ground level to concourse and platform levels." },
      { q: "How far is Gurjar Ki Thadi from New Aatish Market metro?", a: "Gurjar Ki Thadi is just 1.2 km away and easily reached via e-rickshaw or auto in 4 minutes." },
      { q: "Are digital payments accepted for tokens?", a: "Yes, UPI, debit cards, and Paytm are accepted at ticket vending machines." },
      { q: "Is security screening required before entry?", a: "Yes, baggage scanners and metal detectors are present at all entrance gates." },
      { q: "Is smoking permitted inside the station?", a: "No, smoking and alcohol consumption are strictly prohibited and subject to heavy fines." },
      { q: "Which bus routes pass near New Aatish Market metro?", a: "JCTSL City Bus Route 7 and 9 pass along Gopalpura bypass near the station." },
      { q: "Is drinking water available on concourse?", a: "RO water dispensers are located near the customer care desk." }
    ]
  },
  {
    id: "vivek_vihar",
    name: "Vivek Vihar",
    line: "Pink Line",
    zone: "West",
    terminal: false,
    operatingHours: "5:00 AM - 11:00 PM",
    firstTrain: "5:21 AM",
    lastTrain: "10:51 PM",
    peakFrequency: "3-5 mins",
    offPeakFrequency: "8-10 mins",
    fareRange: "₹10 - ₹60",
    facilities: ["ATM", "Restroom", "Elevator"],
    location: "Vivek Vihar Colony, Schools & Residential Area",
    nearbyLandmarks: ["Vivek Vihar Colony", "Apex Hospital", "New Sanganer Road"],
    faqs: [
      { q: "What areas does Vivek Vihar Metro Station serve?", a: "It serves Vivek Vihar, Shyam Nagar Extension, and residential colonies along New Sanganer Road." },
      { q: "What is the ticket price to Jaipur Railway Station?", a: "Token fare is ₹15; Smart Card fare is ₹14.25." },
      { q: "Does Vivek Vihar have wheelchair facilities?", a: "Yes, ramps and elevators provide barrier-free access for wheelchair users." },
      { q: "Are auto-rickshaws available outside Gate 1?", a: "Yes, shared and private e-rickshaws wait outside Gate 1 continuously." },
      { q: "What are the peak traffic hours at Vivek Vihar?", a: "7:30 AM to 9:30 AM and 5:30 PM to 7:30 PM." },
      { q: "Can I buy a tourist metro day pass here?", a: "Yes, 1-day (₹100) and 3-day (₹200) unlimited travel passes are sold at the ticket counter." },
      { q: "Is food allowed inside the metro coaches?", a: "Eating and drinking inside metro trains are not permitted to maintain cleanliness." },
      { q: "Where is the nearest hospital to Vivek Vihar station?", a: "Apex Hospital is within 800 meters (10 min walk or 2 min auto ride)." },
      { q: "Are emergency contact numbers displayed at the station?", a: "Yes, Metro Helpline 0141-2822222 is posted prominently across platforms." },
      { q: "Is Wi-Fi available at Vivek Vihar station?", a: "Free high-speed public Wi-Fi is available for 30 minutes per day." }
    ]
  },
  {
    id: "shyam_nagar",
    name: "Shyam Nagar",
    line: "Pink Line",
    zone: "West",
    terminal: false,
    operatingHours: "5:00 AM - 11:00 PM",
    firstTrain: "5:24 AM",
    lastTrain: "10:54 PM",
    peakFrequency: "3-5 mins",
    offPeakFrequency: "8-10 mins",
    fareRange: "₹10 - ₹60",
    facilities: ["Parking", "ATM", "Restroom"],
    location: "Shyam Nagar Market, Residential Area, Jaipur",
    nearbyLandmarks: ["Shyam Nagar Main Market", "Janpath", "Kings Road"],
    faqs: [
      { q: "Where is Shyam Nagar Metro Station located?", a: "It is situated on Ajmer Road / New Sanganer Road intersection serving Shyam Nagar." },
      { q: "Is vehicle parking available at Shyam Nagar?", a: "Yes, designated two-wheeler parking is available near Gate 2." },
      { q: "How long does it take to reach Chandpole from Shyam Nagar?", a: "It takes approximately 12 minutes by Pink Line Metro." },
      { q: "Are there ATMs inside the station premises?", a: "Yes, SBI and ICICI Bank ATMs are installed on the concourse level." },
      { q: "What is the fare to Badi Chaupar (Hawa Mahal)?", a: "Token fare is ₹18; Smart Card fare is ₹17.10." },
      { q: "Can I carry a bicycle on the metro?", a: "Foldable bicycles are allowed during off-peak hours." },
      { q: "Is CCTV surveillance active 24/7?", a: "Yes, over 40 HD CCTV cameras monitor the station and platforms continuously." },
      { q: "Which gate leads towards Janpath?", a: "Gate No. 1 opens directly towards Janpath and Shyam Nagar Market." },
      { q: "Are feeder bus services available from Shyam Nagar?", a: "E-rickshaws and local autos connect Shyam Nagar to Kings Road and Nirman Nagar." },
      { q: "What happens if I lose my token?", a: "A penalty of ₹50 plus maximum fare is charged at the exit gate for a lost token." }
    ]
  },
  {
    id: "ram_nagar",
    name: "Ram Nagar",
    line: "Pink Line",
    zone: "Central",
    terminal: false,
    operatingHours: "5:00 AM - 11:00 PM",
    firstTrain: "5:27 AM",
    lastTrain: "10:57 PM",
    peakFrequency: "3-5 mins",
    offPeakFrequency: "8-10 mins",
    fareRange: "₹10 - ₹60",
    facilities: ["ATM", "Restroom", "Elevator"],
    location: "Ram Nagar Colony, Government Offices, Jaipur",
    nearbyLandmarks: ["Ram Nagar Market", "Hawa Sadak", "Sodala Flyover"],
    faqs: [
      { q: "Which areas are near Ram Nagar Metro Station?", a: "Ram Nagar, Hawa Sadak, Sodala flyover area, and Government quarters." },
      { q: "How far is Sodala from Ram Nagar metro?", a: "Sodala is less than 1 km away, reachable in 3 minutes." },
      { q: "Is there an elevator at Gate 1?", a: "Yes, working elevators connect street level to the station concourse." },
      { q: "What is the metro frequency on Sundays?", a: "Trains run every 10 to 12 minutes throughout Sunday." },
      { q: "Can I recharge my Jaipur Metro card online?", a: "Yes, recharges can be done via Paytm or the official JMRC web portal." },
      { q: "Are lost & found services available?", a: "Lost items can be reported at the station master's office at Ram Nagar or Station No. 8 (Sindhi Camp)." },
      { q: "Is drinking water available?", a: "Yes, chilled RO water dispensers operate at the main concourse." },
      { q: "What is the fare to Jaipur Railway Station?", a: "Token fare is ₹10." },
      { q: "Are emergency help buttons available on platforms?", a: "Yes, emergency call points (ECP) link directly to the station controller." },
      { q: "Which gate is best for Hawa Sadak?", a: "Gate No. 2 leads towards Hawa Sadak and Civil Lines flyover." }
    ]
  },
  {
    id: "civil_lines",
    name: "Civil Lines",
    line: "Pink Line",
    zone: "Central",
    terminal: false,
    operatingHours: "5:00 AM - 11:00 PM",
    firstTrain: "5:30 AM",
    lastTrain: "11:00 PM",
    peakFrequency: "3-5 mins",
    offPeakFrequency: "8-10 mins",
    fareRange: "₹10 - ₹60",
    facilities: ["Parking", "WiFi", "ATM", "Restroom"],
    location: "SMS Hospital, Government Offices, Civil Lines, Jaipur",
    nearbyLandmarks: ["Civil Lines VVIP Area", "Governor House (Raj Bhawan)", "Chief Minister Residence", "Railway Officer Colony"],
    faqs: [
      { q: "Why is Civil Lines Metro Station prominent?", a: "It serves Jaipur's high-security VVIP district housing Raj Bhawan and Minister bungalows." },
      { q: "Is public parking available at Civil Lines?", a: "Yes, a spacious paid two-wheeler and four-wheeler parking lot is at Gate 1." },
      { q: "Is free Wi-Fi provided at Civil Lines station?", a: "Yes, high-speed public Wi-Fi is accessible across concourse and platforms." },
      { q: "How far is Jaipur Railway Station from Civil Lines metro?", a: "It is just 1 station away (approx. 2 minutes train travel)." },
      { q: "Which gate leads towards Jacob Road?", a: "Gate No. 1 exits towards Jacob Road and Civil Lines Circle." },
      { q: "Is security strict at Civil Lines?", a: "Yes, enhanced police and security scanning are deployed due to VIP proximity." },
      { q: "What is the fare to Sindhi Camp Bus Stand?", a: "Token fare is ₹10." },
      { q: "Are clean washrooms available?", a: "Yes, well-maintained executive washrooms are open near the exit gates." },
      { q: "Can tourists buy Jaipur Metro Tourist Cards here?", a: "Yes, 1-day and 3-day unlimited passes are available." },
      { q: "How far is Ajmer Road from Civil Lines station?", a: "Ajmer Road flyover is 500 meters from Gate 2." }
    ]
  },
  {
    id: "railway_station",
    name: "Railway Station",
    line: "Pink Line",
    zone: "Central",
    terminal: false,
    operatingHours: "5:00 AM - 11:00 PM",
    firstTrain: "5:33 AM",
    lastTrain: "11:03 PM",
    peakFrequency: "3-5 mins",
    offPeakFrequency: "8-10 mins",
    fareRange: "₹10 - ₹60",
    facilities: ["Parking", "WiFi", "ATM", "Restroom", "Elevator", "Luggage Counter"],
    location: "Jaipur Junction Railway Station, Bus Stand, Jaipur",
    nearbyLandmarks: ["Jaipur Junction Railway Station (JP)", "Hasanpura", "Power House Road", "Ganpati Plaza"],
    faqs: [
      { q: "How close is the Metro Station to Jaipur Junction Railway Station?", a: "It is directly connected via a covered walkway (less than 150 meters from Platform 1)." },
      { q: "Is 24-hour luggage assistance available?", a: "Porters and luggage trolleys are available near the railway station entrance." },
      { q: "What is the fare to Hawa Mahal (Badi Chaupar)?", a: "Token fare is ₹12; Smart Card fare is ₹11.40." },
      { q: "Can I reach Sindhi Camp Bus Stand from Railway Station Metro?", a: "Yes, Sindhi Camp is just 1 metro stop away (2 minutes)." },
      { q: "Is parking available for long travel durations?", a: "Yes, 24-hour multi-level parking is operated at Jaipur Junction Railway Station." },
      { q: "Are pre-paid taxis and auto-rickshaws available outside?", a: "Yes, official pre-paid auto and cab booths operate 24/7 outside the station." },
      { q: "Is escalator and elevator connectivity complete?", a: "Yes, 4 escalators and 2 elevators connect train platforms to the metro station." },
      { q: "What is the train frequency during peak morning arrival times?", a: "Trains arrive every 3 to 5 minutes between 7 AM and 10 AM." },
      { q: "Where can I buy food near the station?", a: "IRCTC food court, Comesum restaurant, and local sweet shops are right outside." },
      { q: "Is Wi-Fi available at Railway Station metro?", a: "Yes, RailTel free Wi-Fi is active across the metro and railway complex." }
    ]
  },
  {
    id: "sindhi_camp",
    name: "Sindhi Camp",
    line: "Pink Line",
    zone: "Central",
    terminal: false,
    operatingHours: "5:00 AM - 11:00 PM",
    firstTrain: "5:36 AM",
    lastTrain: "11:06 PM",
    peakFrequency: "3-5 mins",
    offPeakFrequency: "8-10 mins",
    fareRange: "₹10 - ₹60",
    facilities: ["Parking", "ATM", "Restroom", "Interchange", "Information Kiosk"],
    location: "Central Bus Stand (RSRTC), Station Road, Jaipur",
    nearbyLandmarks: ["Sindhi Camp Central Bus Stand", "Station Road Market", "MI Road", "Kanti Nagar"],
    faqs: [
      { q: "How far is Sindhi Camp Central Bus Stand from the Metro Station?", a: "The metro station exits directly inside the RSRTC Sindhi Camp Bus Stand complex." },
      { q: "Is Sindhi Camp an interchange station?", a: "Yes, it is designed as the main interchange station for future Metro Line 2 (Orange Line)." },
      { q: "Can I catch intercity buses to Delhi, Agra, or Udaipur from here?", a: "Yes, all RSRTC Volvo, Express, and private sleeper buses depart from Sindhi Camp." },
      { q: "What is the fare from Sindhi Camp to Chandpole?", a: "Token fare is ₹10." },
      { q: "Is 24-hour cloakroom / luggage storage available?", a: "Cloakroom facilities are operated by RSRTC inside the main bus stand building." },
      { q: "Which gate leads towards MI Road?", a: "Gate No. 2 opens on Station Road towards MI Road (10 min walk)." },
      { q: "Are ATM machines available inside the station?", a: "Yes, ATMs of PNB, SBI, and HDFC are active near Gate 1." },
      { q: "Is there a Customer Service desk for lost items?", a: "Yes, the Central Metro Lost & Found office is located at Sindhi Camp station." },
      { q: "How long does metro take to reach Mansarovar from Sindhi Camp?", a: "Approx 16 minutes travel time." },
      { q: "Are hotels and lodges available nearby?", a: "Dozens of budget and luxury hotels line Station Road right outside Gate 2." }
    ]
  },
  {
    id: "chandpole",
    name: "Chandpole",
    line: "Pink Line",
    zone: "Central",
    terminal: false,
    operatingHours: "5:00 AM - 11:00 PM",
    firstTrain: "5:39 AM",
    lastTrain: "11:09 PM",
    peakFrequency: "3-5 mins",
    offPeakFrequency: "8-10 mins",
    fareRange: "₹10 - ₹60",
    facilities: ["ATM", "Restroom", "Elevator", "Underground Station"],
    location: "Chandpole Gate, Old City Markets, Jaipur",
    nearbyLandmarks: ["Chandpole Gate", "Chandpole Market", "Nahargarh Fort Base", "Govind Dev Ji Temple Access"],
    faqs: [
      { q: "Is Chandpole an underground metro station?", a: "Yes, Chandpole is the first underground station of the Jaipur Metro network." },
      { q: "What heritage markets are accessible from Chandpole station?", a: "Chandpole Bazaar, Khazane Walon Ka Rasta (marble statues), and Tripolia Bazaar." },
      { q: "How to reach Nahargarh Fort from Chandpole metro?", a: "Taxis, autos, and scooters are available outside Gate 1 to go up Nahargarh Hill." },
      { q: "What is the fare to Badi Chaupar?", a: "Token fare is ₹10." },
      { q: "Are elevators functional for underground platforms?", a: "Yes, dual high-speed elevators link street level to concourse and deep platforms." },
      { q: "Which gate exits towards Chandpole Gate heritage arch?", a: "Gate No. 1 opens directly in front of the historical Chandpole Gate." },
      { q: "Can I walk to City Palace from Chandpole?", a: "Yes, it is a 1.5 km scenic walk through traditional Pink City bazaars." },
      { q: "Is security check required before entering underground area?", a: "Yes, full CISF-style security screening is mandatory at concourse entry." },
      { q: "Are auto-rickshaws available 24/7 outside Chandpole?", a: "Yes, e-rickshaws and cycle rickshaws operate continuously in the old city." },
      { q: "What are the famous foods near Chandpole?", a: "Rawat Kachori (Sindhi Camp side) and Samrat Kachori (Tripolia side)." }
    ]
  },
  {
    id: "chhoti_chaupar",
    name: "Chhoti Chaupar",
    line: "Pink Line",
    zone: "Central",
    terminal: false,
    operatingHours: "5:00 AM - 11:00 PM",
    firstTrain: "5:42 AM",
    lastTrain: "11:12 PM",
    peakFrequency: "3-5 mins",
    offPeakFrequency: "8-10 mins",
    fareRange: "₹10 - ₹60",
    facilities: ["Restroom", "Elevator", "Heritage Architecture Display"],
    location: "Hawa Mahal, Johari Bazaar, Pink City, Jaipur",
    nearbyLandmarks: ["Chhoti Chaupar Square", "Tripolia Bazaar", "Gangaur Bazaar", "Kishpole Bazaar"],
    faqs: [
      { q: "Why is Chhoti Chaupar Metro Station unique?", a: "It is an underground heritage station built beneath the historical Pink City square with traditional Rajasthani artwork." },
      { q: "Which markets surround Chhoti Chaupar?", a: "Kishanpole Bazaar (textiles & lac bangles), Tripolia Bazaar (brassware), and Gangaur Bazaar." },
      { q: "How far is Jantar Mantar from Chhoti Chaupar?", a: "Jantar Mantar is just 600 meters away (approx. 7 minute walk)." },
      { q: "Is photography permitted inside Chhoti Chaupar station?", a: "Photography of station architecture is allowed; flash near tracks is restricted." },
      { q: "What is the fare from Mansarovar to Chhoti Chaupar?", a: "Token fare is ₹18; Smart Card fare is ₹17.10." },
      { q: "Are air-conditioned underground platforms clean?", a: "Yes, full platform screen gates and climate control maintain 24°C temperature." },
      { q: "Which gate leads towards Tripolia Gate?", a: "Gate No. 2 opens on Tripolia Bazaar towards the City Palace private entrance." },
      { q: "Are public washrooms available underground?", a: "Yes, executive clean restrooms are situated at concourse level." },
      { q: "Is wheelchair assistance available from station staff?", a: "Yes, station staff assist wheelchair passengers to train doors free of charge." },
      { q: "What street foods are famous at Chhoti Chaupar?", a: "Sahu Chai, Pandit Kulfi, and LMB Ghewar." }
    ]
  },
  {
    id: "badi_chaupar",
    name: "Badi Chaupar",
    line: "Pink Line",
    zone: "Central",
    terminal: true,
    operatingHours: "5:00 AM - 11:00 PM",
    firstTrain: "5:45 AM",
    lastTrain: "11:15 PM",
    peakFrequency: "3-5 mins",
    offPeakFrequency: "8-10 mins",
    fareRange: "₹10 - ₹60",
    facilities: ["Restroom", "Elevator", "Heritage Museum Display", "Terminal Station"],
    location: "City Palace, Jantar Mantar, Hawa Mahal, Jaipur",
    nearbyLandmarks: ["Hawa Mahal (Palace of Winds)", "City Palace Complex", "Jantar Mantar UNESCO Site", "Johari Bazaar", "Ramganj Bazaar"],
    faqs: [
      { q: "Is Badi Chaupar the closest metro station to Hawa Mahal?", a: "Yes! Badi Chaupar metro station is directly beneath Hawa Mahal (less than 150 meters away)." },
      { q: "What major tourist spots can I walk to from Badi Chaupar?", a: "Hawa Mahal (2 min), City Palace (5 min), Jantar Mantar (5 min), Johari Bazaar (1 min)." },
      { q: "Is Badi Chaupar the current eastern terminal of Pink Line?", a: "Yes, Badi Chaupar is the terminal station on the eastern end of Line 1." },
      { q: "What is the fare from Railway Station to Badi Chaupar?", a: "Token fare is ₹12." },
      { q: "Which exit gate leads straight to Hawa Mahal?", a: "Gate No. 3 opens right opposite the famous honeycomb facade of Hawa Mahal." },
      { q: "Is an art gallery or heritage museum inside Badi Chaupar station?", a: "Yes, historical artifacts excavated during metro tunneling are displayed in concourse showcases." },
      { q: "How to reach Amber Fort from Badi Chaupar metro?", a: "Catch AC Bus Route AC 1 or local auto right outside Gate 3 (6 km up Amer Road)." },
      { q: "Are ATM machines available inside the station?", a: "Yes, ATMs are situated near Gate 1 and Gate 3." },
      { q: "What is the best shopping market near Badi Chaupar?", a: "Johari Bazaar for Kundan & Meenakari jewelry and Bandhani sarees." },
      { q: "Are emergency medical kits kept at the station?", a: "Yes, First Aid kits and trained first responders are present at Customer Care." }
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

  jaipurMetroStations.forEach(station => {
    const stationLat = station.id === 'mansarovar' ? 26.8756 : 26.9262;
    const stationLng = station.id === 'mansarovar' ? 75.7533 : 75.8265;
    const dist = distance(lat, lng, stationLat, stationLng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = { ...station, distance: dist };
    }
  });

  return nearest;
};
