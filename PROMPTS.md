# Prompt Documentation — Weather Trend Planner
## BSE 3350 Full-Stack Web Development

This file documents the AI prompts used during development of this project,
as required for academic transparency.

---

## Tool Used
Claude (Anthropic) — claude.ai

---

## Prompt 1 — Initial Project Scaffold
**Prompt:**
> "Take a step by step approach to achieve the best possible output as a senior
> react dev. The instructions in the test have been set and are clear, we are
> using npm create vite@latest to create or build this app. Always run a code
> review before any output is given out."

**Purpose:** Generate the initial project architecture, component breakdown,
and identify which Vite files to keep, replace, or create.

**Output used:** File structure plan, component responsibilities, API selection
(Open-Meteo over OpenWeather to avoid API key activation delays).

---

## Prompt 2 — Full Build with All Files
**Prompt:**
> "These steps aren't complete, follow instructions and make sure nothing from
> the requirements in the test has been left out and always run a code review.
> My lecturer mentioned we should document the prompts we use as well. You can
> provide nano commands if possible to get it done fast and to avoid any errors
> by naming the folders wrong. Make sure all the codes are provided. I want a
> well designed app that I will deploy via Vercel and please make sure there are
> no bugs or errors or incompatibility issues."

**Purpose:** Generate production-ready code for every file in the project with
terminal commands, covering all test spec requirements including city search,
current weather display, 7-day temperature trend chart, insight generation,
Vercel deployment config, and this prompt log.

**Output used:** All source files — weatherService.js, SearchBar.jsx,
WeatherCard.jsx, TrendChart.jsx, InsightCard.jsx, App.jsx, index.css,
vercel.json, and this PROMPTS.md.

---

## Test Requirements Coverage

| Requirement                        | File                        | Status |
|------------------------------------|-----------------------------|--------|
| City name input                    | SearchBar.jsx               | ✅     |
| Search button                      | SearchBar.jsx               | ✅     |
| Display city name                  | WeatherCard.jsx             | ✅     |
| Display current temperature        | WeatherCard.jsx             | ✅     |
| Display weather condition          | WeatherCard.jsx             | ✅     |
| Temperature trend line chart       | TrendChart.jsx              | ✅     |
| X-axis: Date                       | TrendChart.jsx              | ✅     |
| Y-axis: Temperature (°C)           | TrendChart.jsx              | ✅     |
| Best day to go out insight         | weatherService.js           | ✅     |
| Rain warning insight               | weatherService.js           | ✅     |
| Heat warning (>35°C)               | weatherService.js           | ✅     |
| Cold warning (<5°C)                | weatherService.js           | ✅     |
| React framework                    | App.jsx + Vite              | ✅     |
| Chart.js library                   | TrendChart.jsx              | ✅     |

---

## API Used
**Open-Meteo** (https://open-meteo.com)
- No API key required
- Free and open source
- Endpoints: Geocoding API + Forecast API
- Chosen over OpenWeather to avoid 2-hour key activation delay
