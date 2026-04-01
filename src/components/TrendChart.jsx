// TrendChart.jsx
// Chart.js v4 REQUIRES manual registration of every component used.
// Missing any registration = silent blank chart with zero error messages.

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register once at module level — NOT inside the component function
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// Props:
//   days: [{ date, temp, condition, rainProb }]
export default function TrendChart({ days }) {
  // Format x-axis labels: "2025-04-01" → "Mon, Apr 1"
  const labels = days.map((d) =>
    new Date(`${d.date}T12:00:00`).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  );

  const temps = days.map((d) => d.temp);

  const data = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: temps,
        fill: true,
        backgroundColor: 'rgba(56, 189, 248, 0.07)',
        borderColor: '#38bdf8',
        borderWidth: 2.5,
        pointBackgroundColor: '#38bdf8',
        pointBorderColor: '#070e1f',
        pointBorderWidth: 2.5,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#38bdf8',
        pointHoverBorderColor: '#ffffff',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // REQUIRED — lets CSS control the height
    plugins: {
      legend: {
        display: false, // we label it in the section title instead
      },
      tooltip: {
        backgroundColor: '#0d1b33',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        titleColor: '#38bdf8',
        bodyColor: '#e8f4fd',
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (items) => items[0].label,
          label: (ctx) => ` ${ctx.parsed.y}°C`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(56, 189, 248, 0.06)',
          drawBorder: false,
        },
        ticks: {
          color: '#5a7a96',
          font: { family: 'Outfit', size: 12 },
          maxRotation: 0,
        },
      },
      y: {
        grid: {
          color: 'rgba(56, 189, 248, 0.06)',
          drawBorder: false,
        },
        ticks: {
          color: '#5a7a96',
          font: { family: 'Space Mono', size: 11 },
          callback: (val) => `${val}°`,
        },
      },
    },
  };

  return (
    <div className="chart-section">
      <h3 className="section-title">Temperature Trend</h3>
      <div className="chart-wrapper">
        <Line data={data} options={options} aria-label="Temperature trend chart" />
      </div>
    </div>
  );
}
