const axios = require("axios");
const { GOOGLE_MAPS_API_KEY } = require("../config/env");

exports.getRoutesFromMaps = async (source, destination) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin: source,
          destination,
          alternatives: true,
          key: GOOGLE_MAPS_API_KEY
        }
      }
    );
    console.log("Google Maps API status:", response.data.status);

    if (response.data.status !== "OK") {
      console.error("Google Maps API error:", response.data);
      throw new Error(response.data.error_message || "Google Maps API failed");
    }

    return response.data.routes.map(route => ({
      summary: route.summary,
      distance: route.legs[0].distance.text,
      duration: route.legs[0].duration.text,
      polyline: route.overview_polyline.points
    }));

  } catch (error) {
    console.error("Maps Service Error:", error.message);
    throw error;
  }
};
