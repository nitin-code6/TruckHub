import axios from "axios";
import { ApiError } from "./ApiError.js";

export const getDistanceKm = async (origin, destination) => {
  const url = "https://maps.googleapis.com/maps/api/distancematrix/json";

  try {
    const res = await axios.get(url, {
      params: {
        origins: origin,
        destinations: destination,
        units: "metric",
        key: process.env.GOOGLE_MAPS_API_KEY
      },
      timeout: 5000
    });

    if (!res.data) {
      throw new ApiError(502, "No response from distance service");
    }

    // check for top-level status
    if (res.data.status && res.data.status !== "OK") {
      throw new ApiError(502, `Distance API error: ${res.data.status}`);
    }

    const rows = res.data.rows;
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      throw new ApiError(502, "Distance API returned no rows");
    }

    const elements = rows[0].elements;
    if (!elements || !Array.isArray(elements) || elements.length === 0) {
      throw new ApiError(502, "Distance API returned no elements");
    }

    const element = elements[0];

    if (!element || element.status !== "OK") {
      // if Google denies the request, attempt a graceful fallback
      if (res.data.status === "REQUEST_DENIED") {
        // try haversine if origin/destination are lat,lng strings
        const hav = tryHaversine(origin, destination);
        if (hav !== null) {
          console.warn("Distance API REQUEST_DENIED — using haversine fallback");
          return hav;
        }

        const fallbackKm = Number(process.env.FALLBACK_DISTANCE_KM) || 10;
        console.warn(
          `Distance API REQUEST_DENIED — falling back to default ${fallbackKm} km`
        );
        return fallbackKm;
      }

      throw new ApiError(400, "Distance not found for the provided locations");
    }

    // distance.value is in meters
    return element.distance.value / 1000;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    // wrap axios/network errors
    throw new ApiError(502, `Failed to compute distance: ${err.message}`);
  }
};

// simple haversine formula (expects strings like "lat,lng" or arrays)
const tryHaversine = (a, b) => {
  const parse = (v) => {
    if (Array.isArray(v) && v.length >= 2) return [Number(v[0]), Number(v[1])];
    if (typeof v === "string") {
      const m = v.split(/\s*,\s*/).map(Number);
      if (m.length >= 2 && !Number.isNaN(m[0]) && !Number.isNaN(m[1])) return [m[0], m[1]];
    }
    return null;
  };

  const p1 = parse(a);
  const p2 = parse(b);
  if (!p1 || !p2) return null;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(p2[0] - p1[0]);
  const dLon = toRad(p2[1] - p1[1]);
  const lat1 = toRad(p1[0]);
  const lat2 = toRad(p2[0]);

  const aHar = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(aHar), Math.sqrt(1 - aHar));
  return R * c;
};

export default getDistanceKm;
