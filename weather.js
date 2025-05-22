console.log("weather.js loaded ✅");

let weatherChart; // Global chart instance

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherResult = document.getElementById("weatherResult");
  const apiKey = "1ae4dcc418a55db0e38d0e153c5a178c";

  if (!city) {
    weatherResult.innerHTML = `<p class="text-red-600 font-semibold">Please enter a city name.</p>`;
    return;
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  console.log("Fetching weather from:", apiUrl);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    console.log("API response:", data);

    const currentWeather = data.list[0];
    weatherResult.innerHTML = `
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <strong class="text-xl">${data.city.name}, ${data.city.country}</strong><br/>
        ${new Date(currentWeather.dt_txt).toLocaleString()}<br/>
        🌡 Temp: <strong>${currentWeather.main.temp}°C</strong> |
        💧 Humidity: ${currentWeather.main.humidity}% |
        🌬 Wind: ${currentWeather.wind.speed} m/s
      </div>
    `;

    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
    const labels = dailyData.map(item => new Date(item.dt_txt).toLocaleDateString());
    const temps = dailyData.map(item => item.main.temp);

    updateChart(labels, temps);

  } catch (error) {
    console.error("Weather fetch error:", error);
    weatherResult.innerHTML = `<p class="text-red-600 font-semibold">${error.message}</p>`;
    if (weatherChart) weatherChart.destroy();
  }
}

function updateChart(labels, temps) {
  const ctx = document.getElementById("weatherChart").getContext("2d");

  if (weatherChart) {
    weatherChart.destroy();
  }

  weatherChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Temperature (°C)",
        data: temps,
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "rgba(99, 102, 241, 1)",
        tension: 0.3,
        pointBackgroundColor: "rgba(99, 102, 241, 1)"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          title: { display: true, text: "Temp (°C)" }
        }
      }
    }
  });
}
