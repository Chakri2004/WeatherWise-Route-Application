const { decodePolyline } = require("../utils/polylineDecoder.util");

exports.sampleRoutePoints = (polyline) => {
  const decodedPoints = decodePolyline(polyline);
  return decodedPoints.filter((_, index) => index % 10 === 0);
};
