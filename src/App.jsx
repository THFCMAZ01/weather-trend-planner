// App.jsx — root component and data orchestrator
// Manages all state and coordinates child components

import { useState } from 'react';
import SearchBar    from './components/SearchBar';
import WeatherCard  from './components/WeatherCard';
import TrendChart   from './components/TrendChart';
import InsightCard  from './components/InsightCard';
import {
  fetchWeather,
  processForecast,
  generateInsight,
} from './services/weatherService';

export default function App() {
  // weatherData: raw current weather object from Open-Meteo (or null)
  const [weatherData, setWeatherData] = useState(null);
  // forecast: processed daily array [{ date, temp, condition, rainProb }]
  const [forecast,    setForecast]    = useState([]);
  // insight: { icon, text }
  const [insight,     setInsight]     = useState(null);
  // loading: true while awaiting API responses
  const [loading,     setLoading]     = useState(false);
  // error: human-readable string or empty
  const [error,       setError]       = useState('');

  async function handleSearch(city) {
    setLoading(true);
    setError('');
    setWeatherData(null); // clear previous city results immediately

    try {
      const { current, forecast: rawForecast } = await fetchWeather(city);
      const days = processForecast(rawForecast);
      const insightResult = generateInsight(days);

      setWeatherData(current);
      setForecast(days);
      setInsight(insightResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const showResults  = weatherData && !loading;
  const showEmpty    = !weatherData && !loading && !error;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__badge">BSE 3350 · Full-Stack Web Dev</div>
        <h1 className="app-header__title">Weather Trend Planner</h1>
        <p className="app-header__subtitle">
          Forecast analysis &amp; outdoor activity planner
        </p>
      </header>

      <main>
        <SearchBar onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="error-banner" role="alert">
            ⚠️&nbsp; {error}
          </div>
        )}

        {loading && (
          <div className="loading-state" aria-live="polite">
            <div className="loading-dots" aria-hidden="true">
              <span /><span /><span />
            </div>
            <p>Fetching weather data…</p>
          </div>
        )}

        {showResults && (
          <div className="results">
            <WeatherCard
              city={weatherData.name}
              temp={Math.round(weatherData.main.temp * 10) / 10}
              condition={weatherData.weather[0].main}
            />
            <TrendChart days={forecast} />
            <InsightCard insight={insight} />
          </div>
        )}

        {showEmpty && (
          <div className="empty-state">
            <span className="empty-state__icon">🌍</span>
            <p>Enter a city above to view its 7-day weather forecast</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        Powered by Open-Meteo · BSE 3350 Assignment · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
