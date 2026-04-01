// SearchBar.jsx
// Props:
//   onSearch(city: string) — called on valid submit
//   loading: boolean       — disables input and button during fetch

import { useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [city, setCity] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = city.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} noValidate>
      <label className="search-bar__label" htmlFor="city-input">
        Enter city
      </label>
      <div className="search-row">
        <input
          id="city-input"
          type="text"
          placeholder="e.g. Lusaka, London, Nairobi"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          aria-label="City name"
        />
        <button
          type="submit"
          disabled={loading || !city.trim()}
          aria-label="Search weather"
        >
          {loading ? <span className="spinner" aria-hidden="true" /> : 'Search'}
        </button>
      </div>
    </form>
  );
}
