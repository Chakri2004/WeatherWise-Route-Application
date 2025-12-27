let map;
let directionsService;
let directionsRenderers = [];
let allRoutesData = [];
let selectedRouteIndex = 0;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: { lat: 20.5937, lng: 78.9629 }
  });
  directionsService = new google.maps.DirectionsService();
}
window.onload = initMap;
async function getRoutes() {
  const source = document.getElementById("source").value;
  const destination = document.getElementById("destination").value;
  if (!source || !destination) {
    alert("Please enter source and destination");
    return;
  }
  clearRoutes();
  try {
    const response = await fetch(
      `http://localhost:5000/api/route?source=${source}&destination=${destination}`
    );
    const data = await response.json();
    if (!data || !Array.isArray(data.allRoutes)) {
      alert("No routes returned.");
      return;
    }
    allRoutesData = data.allRoutes;
    selectedRouteIndex = 0;
    renderRouteTabs();
    renderRouteDetails(0);
    drawRoutesOnMap(source, destination, allRoutesData);
    updateBestRoute();
  } catch (error) {
    console.error(error);
    alert("Failed to connect to backend");
  }
}
function getRouteColor(riskScore) {
  if (riskScore < 30) return "green";
  if (riskScore < 60) return "orange";
  return "red";
}
function drawRoutesOnMap(source, destination, routes) {
  directionsService.route(
    {
      origin: source,
      destination: destination,
      provideRouteAlternatives: true,
      travelMode: google.maps.TravelMode.DRIVING
    },
    (result, status) => {
      if (status === "OK") {
        result.routes.forEach((route, index) => {
          if (!routes[index]) return;
          const renderer = new google.maps.DirectionsRenderer({
            map,
            directions: result,
            routeIndex: index,
            polylineOptions: {
              strokeColor:
                index === selectedRouteIndex
                  ? getRouteColor(routes[index].riskScore)
                  : "#cccccc",
              strokeWeight: index === selectedRouteIndex ? 6 : 3
            }
          });

          directionsRenderers.push(renderer);
        });
      }
    }
  );
}
function renderRouteTabs() {
  const routesDiv = document.getElementById("routes");
  routesDiv.innerHTML = "";
  const tabContainer = document.createElement("div");
  tabContainer.style.marginBottom = "15px";
  allRoutesData.forEach((_, index) => {
    const btn = document.createElement("button");
    btn.innerText = `Route ${index + 1}`;
    btn.style.marginRight = "10px";
    btn.style.fontWeight = index === selectedRouteIndex ? "bold" : "normal";
    btn.onclick = () => {
      selectedRouteIndex = index;
      clearRoutes();
      renderRouteTabs();
      renderRouteDetails(index);
      drawRoutesOnMap(
        document.getElementById("source").value,
        document.getElementById("destination").value,
        allRoutesData
      );
      updateBestRoute();
    };
    tabContainer.appendChild(btn);
  });
  routesDiv.appendChild(tabContainer);
  const detailsDiv = document.createElement("div");
  detailsDiv.id = "route-details";
  routesDiv.appendChild(detailsDiv);
}
function renderRouteDetails(index) {
  const route = allRoutesData[index];
  const detailsDiv = document.getElementById("route-details");
  detailsDiv.innerHTML = `
    <h3>Route ${index + 1}</h3>
    <b>Distance:</b> ${route.distance}<br/>
    <b>Duration:</b> ${route.duration}<br/>
    <b>Risk Score:</b> ${route.riskScore}<br/><br/>
    <b>Weather Factors:</b><br/>
    🌧️ Rain: ${route.riskBreakdown.rain}<br/>
    🌬️ Wind: ${route.riskBreakdown.wind}<br/>
    👁️ Visibility: ${route.riskBreakdown.visibility}<br/>
    🌡️ Temperature: ${route.riskBreakdown.temperature}<br/>
    ⚠️ Alerts: ${route.riskBreakdown.alerts}
  `;
}
function durationToMinutes(durationStr) {
  const match = durationStr.match(/(\d+)\s*hours?\s*(\d+)\s*mins?/);
  if (!match) return Infinity;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}
function updateBestRoute() {
  if (!allRoutesData.length) return;
  let bestIndex = 0;
  allRoutesData.forEach((route, index) => {
    if (
      route.riskScore < allRoutesData[bestIndex].riskScore ||
      (
        route.riskScore === allRoutesData[bestIndex].riskScore &&
        durationToMinutes(route.duration) <
        durationToMinutes(allRoutesData[bestIndex].duration)
      )
    ) {
      bestIndex = index;
    }
  });
  const best = allRoutesData[bestIndex];
  document.getElementById("best-route-details").innerHTML = `
    <b>Route:</b> Route ${bestIndex + 1}<br/>
    <b>Distance:</b> ${best.distance}<br/>
    <b>Duration:</b> ${best.duration}<br/>
    <b>Risk Score:</b> ${best.riskScore}<br/><br/>
    <b>Weather Factors:</b><br/>
    🌧️ Rain: ${best.riskBreakdown.rain}<br/>
    🌬️ Wind: ${best.riskBreakdown.wind}<br/>
    👁️ Visibility: ${best.riskBreakdown.visibility}<br/>
    🌡️ Temperature: ${best.riskBreakdown.temperature}<br/>
    ⚠️ Alerts: ${best.riskBreakdown.alerts}
  `;
}
function clearRoutes() {
  directionsRenderers.forEach(renderer => renderer.setMap(null));
  directionsRenderers = [];
}
