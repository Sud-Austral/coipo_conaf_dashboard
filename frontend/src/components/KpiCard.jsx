export default function KpiCard({ item, compact = false }) {
  return (
    <article className={`kpi ${compact ? "compact" : ""}`}>
      <div className="kpi-head">
        <span>{item.label}</span>
        <span
          className="info"
          title={`Confianza: ${item.trust}. ${item.note}`}
          aria-label={`Información de confianza: ${item.trust}`}
        >
          i
        </span>
      </div>
      <strong>{item.value}</strong>
      <small>{item.delta}</small>
    </article>
  );
}
