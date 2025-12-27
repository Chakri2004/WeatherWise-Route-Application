exports.formatRoutesResponse = (routes) => {
  const sortedRoutes = routes.sort((a, b) => a.riskScore - b.riskScore);
  return {
    bestRoute: sortedRoutes[0],
    allRoutes: sortedRoutes
  };
};
