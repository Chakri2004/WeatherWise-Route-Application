const { getRoutesFromMaps } = require("../services/maps.service");
const { sampleRoutePoints } = require("../services/routeSampling.service");
const { getWeatherData } = require("../services/weather.service");
const { calculateRisk } = require("../utils/riskCalculator.util");
const { formatRoutesResponse } = require("../utils/responseFormatter.util");
const { getCache, setCache } = require("../utils/cache.util");

exports.getOptimizedRoutes = async (req, res, next) => {
  try {
    const { source, destination } = req.query;
    const cacheKey = `${source}-${destination}`;

    const cached = getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const routes = await getRoutesFromMaps(source, destination);
    const evaluatedRoutes = [];

    for (const route of routes) {
      const points = sampleRoutePoints(route.polyline);
      const weatherData = await getWeatherData(points);
      const { riskScore, riskBreakdown } = calculateRisk(weatherData);

      evaluatedRoutes.push({
        summary: route.summary,
        distance: route.distance,
        duration: route.duration,
        riskScore,
        riskBreakdown
      });
    }

    const response = formatRoutesResponse(evaluatedRoutes);
    setCache(cacheKey, response);

    res.json(response);
  } catch (error) {
    next(error);
  }
};
