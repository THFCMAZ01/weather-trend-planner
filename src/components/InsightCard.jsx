// InsightCard.jsx
// Props:
//   insight: { icon: string, text: string }

export default function InsightCard({ insight }) {
  return (
    <div className="insight-card" role="complementary" aria-label="Weather insight">
      <div className="insight-card__label">Insight</div>
      <div className="insight-card__content">
        <span className="insight-card__icon" aria-hidden="true">
          {insight.icon}
        </span>
        <p className="insight-card__text">{insight.text}</p>
      </div>
    </div>
  );
}
