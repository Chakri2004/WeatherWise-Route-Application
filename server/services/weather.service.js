const axios = require("axios");
const { OPENWEATHER_API_KEY } = require("../config/env");

exports.getWeatherData = async (points) => {
  const results = [];

  for (const point of points) {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat: point.lat,
          lon: point.lng,
          appid: OPENWEATHER_API_KEY,
          units: "metric"
        }
      }
    );
    results.push(response.data);
  }
  return results;
};
