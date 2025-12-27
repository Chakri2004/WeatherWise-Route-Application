exports.calculateRisk = (weatherDataList) => {
  let totalRisk = 0;
  let rainLevel = "None";
  let windLevel = "Low";
  let visibilityLevel = "Good";
  let temperatureLevel = "Normal";
  let alertStatus = "None";

  weatherDataList.forEach(weather => {
    if (weather.rain) {
      const rainMm = weather.rain["1h"] || 0;
      if (rainMm > 10) {
        totalRisk += 50;
        rainLevel = "Heavy";
      } else if (rainMm > 0) {
        totalRisk += 30;
        rainLevel = "Light";
      }
    }
    if (weather.wind?.speed) {
      if (weather.wind.speed > 20) {
        totalRisk += 40;
        windLevel = "Strong";
      } else if (weather.wind.speed > 10) {
        totalRisk += 20;
        windLevel = "Moderate";
      }
    }
    if (weather.visibility) {
      if (weather.visibility < 1000) {
        totalRisk += 40;
        visibilityLevel = "Very Poor";
      } else if (weather.visibility < 2000) {
        totalRisk += 25;
        visibilityLevel = "Poor";
      }
    }
    if (weather.main?.temp) {
      if (weather.main.temp > 40 || weather.main.temp < 5) {
        totalRisk += 15;
        temperatureLevel = "Extreme";
      }
    }
    if (weather.alerts?.length > 0) {
      totalRisk += 50;
      alertStatus = "Active";
    }
  });

  const riskScore = Math.min(
    100,
    Math.round(totalRisk / weatherDataList.length)
  );
  return {
    riskScore,
    riskBreakdown: {
      rain: rainLevel,
      wind: windLevel,
      visibility: visibilityLevel,
      temperature: temperatureLevel,
      alerts: alertStatus
    }
  };
};
