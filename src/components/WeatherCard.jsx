// WeatherCard.jsx
// Props:
//   city: string       — e.g. "Lusaka, Zambia"
//   temp: number       — current temperature in °C
//   condition: string  — e.g. "Clear", "Rain"

const CONDITION_ICONS = {
  'Clear':           '☀️',
  'Partly Cloudy':   '⛅',
  'Overcast':        '☁️',
  'Cloudy':          '☁️',
  'Foggy':           '🌫️',
  'Drizzle':         '🌦️',
  'Freezing Drizzle':'🌨️',
  'Rain':            '🌧️',
  'Freezing Rain':   '🌨️',
  'Snow':            '❄️',
  'Rain Showers':    '🌧️',
  'Snow Showers':    '🌨️',
  'Thunderstorm':    '⛈️',
};

export default function WeatherCard({ city, temp, condition }) {
  const icon = CONDITION_ICONS[condition] ?? '🌡️';

  return (
    <div className="weather-card">
      <div className="weather-card__header">
        <span className="weather-card__icon" aria-hidden="true">{icon}</span>
        <h2 className="weather-card__city">{city}</h2>
      </div>
      <div className="weather-card__body">
        <span className="weather-card__temp" aria-label={`${temp} degrees Celsius`}>
          {temp}°C
        </span>
        <span className="weather-card__condition">{condition}</span>
      </div>
    </div>
  );
}
