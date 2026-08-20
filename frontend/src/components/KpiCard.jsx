import KpiInfo from "./KpiInfo.jsx";

export default function KpiCard({item,compact=false}){
  const delta=String(item.delta||"");
  return (
    <article className={`kpiCard ${compact?"compact":""}`}>
      <div className="kpiTitle">
        <span>{item.label}</span>
        <KpiInfo
          label={item.label}
          detail={item.detail}
          coverage={item.coverage}
          confidence={item.confidence}
          source={item.source}
        />
      </div>
      <strong>{item.value}</strong>
      <small className={delta.startsWith("+")?"delta up":delta.startsWith("−")?"delta down":"delta"}>
        {delta}
      </small>
    </article>
  );
}
