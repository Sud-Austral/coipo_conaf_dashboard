import InfoPopover from "./InfoPopover.jsx";

export default function KpiCard({item, compact=false}) {
  return (
    <article className={`kpiCard ${compact ? "compact" : ""}`}>
      <div className="kpiTitle">
        <span>{item.label}</span>
        <InfoPopover item={item}/>
      </div>
      <strong>{item.value}</strong>
      <small className={item.delta.startsWith("+") ? "delta up" : item.delta.startsWith("−") ? "delta down" : "delta"}>
        {item.delta}
      </small>
    </article>
  );
}
