// ─────────────────────────────────────────────
// weatherService.js
// Uses Open-Meteo — 100% free, no API key,
// no signup, works immediately.
// ─────────────────────────────────────────────

// STEP 1: Convert city name → lat/lon via geocoding API
async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Geocoding service unavailable. Please try again.');
  }

  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found. Check the spelling and try again.`);
  }

  const { latitude, longitude, name, country } = data.results[0];
  return { latitude, longitude, name, country };
}

// STEP 2: Use coordinates → get 7-day hourly forecast
async function getRawForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    hourly: 'temperature_2m,weathercode,precipitation_probability',
    timezone: 'auto',
    forecast_days: '7',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

  if (!res.ok) {
    throw new Error('Could not load forecast data. Please try again.');
  }

  return res.json();
}

// WMO weather code → human-readable label
// Full code table: https://open-meteo.com/en/docs
function decodeWeatherCode(code) {
  if (code === 0)                    return 'Clear';
  if (code <= 2)                     return 'Partly Cloudy';
  if (code === 3)                    return 'Overcast';
  if (code >= 45 && code <= 48)      return 'Foggy';
  if (code >= 51 && code <= 55)      return 'Drizzle';
  if (code >= 56 && code <= 57)      return 'Freezing Drizzle';
  if (code >= 61 && code <= 65)      return 'Rain';
  if (code >= 66 && code <= 67)      return 'Freezing Rain';
  if (code >= 71 && code <= 77)      return 'Snow';
  if (code >= 80 && code <= 82)      return 'Rain Showers';
  if (code >= 85 && code <= 86)      return 'Snow Showers';
  if (code >= 95 && code <= 99)      return 'Thunderstorm';
  return 'Cloudy';
}

// ── Main export called by App.jsx ──
// Returns: { current, forecast (raw Open-Meteo object) }
export async function fetchWeather(city) {
  const location = await geocodeCity(city);
  const raw = await getRawForecast(location.latitude, location.longitude);

  // Grab the noon (index 12) reading as "current" to represent today's conditions
  // Noon is more representative than midnight (index 0)
  const noonIndex = 12;
  const current = {
    name: `${location.name}, ${location.country}`,
    main: {
      temp: raw.hourly.temperature_2m[noonIndex],
    },
    weather: [
      { main: decodeWeatherCode(raw.hourly.weathercode[noonIndex]) },
    ],
  };

  return { current, forecast: raw };
}

// ── processForecast ──
// Collapses 168 hourly entries into 7 daily summaries
// Returns: [{ date, temp, condition, rainProb }, ...]
export function processForecast(forecastData) {
  const { time, temperature_2m, weathercode, precipitation_probability } =
    forecastData.hourly;

  const buckets = {};

  time.forEach((timestamp, i) => {
    const date = timestamp.split('T')[0]; // "2025-04-01T12:00" → "2025-04-01"

    if (!buckets[date]) {
      buckets[date] = { temps: [], codes: [], rainProbs: [] };
    }

    buckets[date].temps.push(temperature_2m[i]);
    buckets[date].codes.push(weathercode[i]);
    buckets[date].rainProbs.push(precipitation_probability[i] ?? 0);
  });

  return Object.entries(buckets).map(([date, data]) => {
    // Average temperature
    const avg =
      data.temps.reduce((sum, t) => sum + t, 0) / data.temps.length;

    // Most frequent weather code = dominant condition of the day
    const freq = {};
    data.codes.forEach((c) => {
      freq[c] = (freq[c] ?? 0) + 1;
    });
    const dominantCode = Number(
      Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]
    );

    // Worst-case rain probability of the day
    const maxRain = Math.max(...data.rainProbs);

    return {
      date,
      temp: Math.round(avg * 10) / 10,       // one decimal place
      condition: decodeWeatherCode(dominantCode),
      rainProb: Math.round(maxRain),           // percentage 0–100
    };
  });
}

// ── generateInsight ──
// Priority: heat → cold → rain → best day
// Satisfies all test spec insight examples
export function generateInsight(days) {
  // Heat warning (spec: temp > 35°C)
  const hotDay = days.find((d) => d.temp > 35);
  if (hotDay) {
    return {
      icon: '🔥',
      text: `Very hot day expected on ${fmt(hotDay.date)} — ${hotDay.temp}°C. Stay hydrated and avoid prolonged sun exposure.`,
    };
  }

  // Cold warning (spec: temp < 5°C)
  const coldDay = days.find((d) => d.temp < 5);
  if (coldDay) {
    return {
      icon: '🥶',
      text: `Cold warning on ${fmt(coldDay.date)} — ${coldDay.temp}°C. Dress in layers and stay warm.`,
    };
  }

  // Rain warning (spec: rain probability > 60%)
  const rainyDay = days.find((d) => d.rainProb > 60);
  if (rainyDay) {
    return {
      icon: '🌧️',
      text: `Rain expected on ${fmt(rainyDay.date)} — ${rainyDay.rainProb}% chance of precipitation. Carry an umbrella.`,
    };
  }

  // Best day: no heavy rain, closest to a comfortable 24°C
  const best =
    [...days]
      .filter((d) => d.rainProb < 40)
      .sort((a, b) => Math.abs(a.temp - 24) - Math.abs(b.temp - 24))[0] ??
    days[0];

  return {
    icon: '✅',
    text: `Best day to go out: ${fmt(best.date)} — ${best.temp}°C and ${best.condition.toLowerCase()} with only ${best.rainProb}% chance of rain.`,
  };
}

// "2025-04-04" → "Friday, Apr 4"
function fmt(dateStr) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}
