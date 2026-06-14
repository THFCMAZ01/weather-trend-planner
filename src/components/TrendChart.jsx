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

export default function TrendChart({ days }) {
  const labels = days.map((d) =>
    new Date(`${d.date}T12:00:00`).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  );

  const temps = days.map((d) => d.temp);

  // Compute clean Y-axis min/max to avoid floating point tick values
  const minTemp = Math.floor(Math.min(...temps)) - 1;
  const maxTemp = Math.ceil(Math.max(...temps)) + 1;

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
    maintainAspectRatio: false,
    layout: {
      padding: { left: 8, right: 8, top: 8, bottom: 4 },
    },
    plugins: {
      legend: { display: false },
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
          label: (ctx) => ` ${ctx.parsed.y.toFixed(1)}°C`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(56, 189, 248, 0.06)',
        },
        ticks: {
          color: '#5a7a96',
          font: { family: 'Outfit', size: 11 },
          maxRotation: 30,
          minRotation: 0,
          // autoSkip prevents label cramming on small screens
          autoSkip: true,
          maxTicksLimit: 5,
        },
      },
      y: {
        // Force integer-based min/max so Chart.js picks clean tick steps
        min: minTemp,
        max: maxTemp,
        grid: {
          color: 'rgba(56, 189, 248, 0.06)',
        },
        ticks: {
          color: '#5a7a96',
          font: { family: 'Space Mono', size: 11 },
          // stepSize forces whole-number ticks — kills the .40000000002 bug
          stepSize: 1,
          // Round whatever Chart.js passes just to be double-safe
          callback: (val) => `${Math.round(val)}°`,
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
