const OVERPASS_URLS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.nchc.org.tw/api/interpreter",
];

const wait = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });


const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371;
  const toRadians = (value) => (value * Math.PI) / 180;

  const latitudeDifference = toRadians(lat2 - lat1);
  const longitudeDifference = toRadians(lon2 - lon1);

  const firstLatitude = toRadians(lat1);
  const secondLatitude = toRadians(lat2);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const getCoordinates = (element) => {
  if (
    Number.isFinite(element.lat) &&
    Number.isFinite(element.lon)
  ) {
    return {
      latitude: element.lat,
      longitude: element.lon,
    };
  }

  if (
    Number.isFinite(element.center?.lat) &&
    Number.isFinite(element.center?.lon)
  ) {
    return {
      latitude: element.center.lat,
      longitude: element.center.lon,
    };
  }

  return null;
};

const buildAddress = (tags = {}) => {
  const addressParts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:place"],
    tags["addr:suburb"],
    tags["addr:city"],
    tags["addr:district"],
    tags["addr:state"],
    tags["addr:postcode"],
  ].filter(Boolean);

  if (addressParts.length > 0) {
    return [...new Set(addressParts)].join(", ");
  }

  return (
    tags.description ||
    tags.operator ||
    "Address not available"
  );
};

const fetchOverpassElements = async (query) => {
  const endpoints = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
  ];

  let lastError = null;

  for (const url of endpoints) {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 12000);

    try {
      console.log(`Trying map provider: ${url}`);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json",
          "User-Agent": "Rakshak-India/1.0",
        },
        body: new URLSearchParams({
          data: query,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Map provider returned ${response.status}`);
      }

      const data = await response.json();

      console.log(
        `Map provider success: ${data.elements?.length || 0} results`
      );

      return data.elements || [];
    } catch (error) {
      lastError = error;

      console.warn("Map provider failed:", {
        url,
        message:
          error.name === "AbortError"
            ? "Request timed out"
            : error.message,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError || new Error("Map providers unavailable.");
};
const formatElements = ({
  elements,
  latitude,
  longitude,
  serviceType,
}) => {
  const formatted = elements
    .map((element) => {
      const coordinates = getCoordinates(element);

      if (!coordinates) {
        return null;
      }

      const tags = element.tags || {};

      const distanceKm = calculateDistance(
        latitude,
        longitude,
        coordinates.latitude,
        coordinates.longitude
      );

      const defaultName =
        serviceType === "police"
          ? "Police Station"
          : "Hospital";

      const phone =
        tags.phone ||
        tags["contact:phone"] ||
        tags["contact:mobile"] ||
        "";

      return {
        id: `${element.type}-${element.id}`,

        name:
          tags.name ||
          tags["name:en"] ||
          tags.operator ||
          defaultName,

        latitude: coordinates.latitude,
        longitude: coordinates.longitude,

        distanceKm,

        distance:
          distanceKm < 1
            ? `${Math.round(distanceKm * 1000)} m`
            : `${distanceKm.toFixed(1)} km`,

        address: buildAddress(tags),

        phone,
        operator: tags.operator || "",
        openingHours: tags.opening_hours || "",

        mapLink:
          `https://www.google.com/maps?q=` +
          `${coordinates.latitude},${coordinates.longitude}`,

        directionsLink:
          `https://www.google.com/maps/dir/?api=1&destination=` +
          `${coordinates.latitude},${coordinates.longitude}`,
      };
    })
    .filter(Boolean)
    .sort(
      (first, second) =>
        first.distanceKm - second.distanceKm
    );

  const uniqueResults = new Map();

  formatted.forEach((item) => {
    const key = `${item.name.toLowerCase()}-${item.latitude.toFixed(
      4
    )}-${item.longitude.toFixed(4)}`;

    if (!uniqueResults.has(key)) {
      uniqueResults.set(key, item);
    }
  });

  return [...uniqueResults.values()];
};

const createPoliceQuery = (
  latitude,
  longitude,
  radius
) => `
  [out:json][timeout:20];
  (
    node["amenity"="police"]
      (around:${radius},${latitude},${longitude});

    way["amenity"="police"]
      (around:${radius},${latitude},${longitude});

    relation["amenity"="police"]
      (around:${radius},${latitude},${longitude});

    node["government"="police"]
      (around:${radius},${latitude},${longitude});

    way["government"="police"]
      (around:${radius},${latitude},${longitude});
  );
  out center tags qt;
`;

const createHospitalQuery = (
  latitude,
  longitude,
  radius
) => `
  [out:json][timeout:20];
  (
    node["amenity"="hospital"]
      (around:${radius},${latitude},${longitude});

    way["amenity"="hospital"]
      (around:${radius},${latitude},${longitude});

    relation["amenity"="hospital"]
      (around:${radius},${latitude},${longitude});

    node["healthcare"="hospital"]
      (around:${radius},${latitude},${longitude});

    way["healthcare"="hospital"]
      (around:${radius},${latitude},${longitude});
  );
  out center tags qt;
`;

const validateCoordinates = (
  latitudeValue,
  longitudeValue
) => {
  const latitude = Number(latitudeValue);
  const longitude = Number(longitudeValue);

  const valid =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  return {
    valid,
    latitude,
    longitude,
  };
};

export const getNearbyPolice = async (req, res) => {
  try {
    const coordinateResult = validateCoordinates(
      req.query.latitude,
      req.query.longitude
    );

    if (!coordinateResult.valid) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required.",
      });
    }

    const { latitude, longitude } = coordinateResult;

    const requestedRadius = Number(req.query.radius);

    const initialRadius =
      Number.isFinite(requestedRadius) &&
      requestedRadius >= 1000 &&
      requestedRadius <= 50000
        ? requestedRadius
        : 10000;

    const radii = [
  Math.min(initialRadius, 7000),
  15000,
  25000,
];

    for (const radius of radii) {
      const query = createPoliceQuery(
        latitude,
        longitude,
        radius
      );

      const elements = await fetchOverpassElements(query);

      const stations = formatElements({
        elements,
        latitude,
        longitude,
        serviceType: "police",
      });

      if (stations.length > 0) {
        return res.status(200).json({
          success: true,
          count: stations.length,
          radius,
          stations,
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: 0,
      stations: [],
    });
  } catch (error) {
    console.error("Nearby police controller error:", error);

    return res.status(503).json({
      success: false,
      message:
        "Police-station map provider is temporarily unavailable.",
    });
  }
};

export const getNearbyHospitals = async (req, res) => {
  try {
    const coordinateResult = validateCoordinates(
      req.query.latitude,
      req.query.longitude
    );

    if (!coordinateResult.valid) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required.",
      });
    }

    const { latitude, longitude } = coordinateResult;

    const requestedRadius = Number(req.query.radius);

    const initialRadius =
      Number.isFinite(requestedRadius) &&
      requestedRadius >= 1000 &&
      requestedRadius <= 50000
        ? requestedRadius
        : 10000;

   const radii = [
  Math.min(initialRadius, 7000),
  15000,
  25000,
];
    for (const radius of radii) {
      const query = createHospitalQuery(
        latitude,
        longitude,
        radius
      );

      const elements = await fetchOverpassElements(query);

      const hospitals = formatElements({
        elements,
        latitude,
        longitude,
        serviceType: "hospital",
      });

      if (hospitals.length > 0) {
        return res.status(200).json({
          success: true,
          count: hospitals.length,
          radius,
          hospitals,
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: 0,
      hospitals: [],
    });
  } catch (error) {
    console.error("Nearby hospital controller error:", error);

    return res.status(503).json({
      success: false,
      message:
        "Hospital map provider is temporarily unavailable.",
    });
  }
};