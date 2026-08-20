import { Info } from "lucide-react";

export default function KpiInfo({
  label,
  source,
  coverage,
  confidence,
  detail
}){
  return (
    <span className="kpiInfoWrap">
      <button
        type="button"
        className="kpiInfoButton"
        aria-label={`Información de ${label}`}
        title={`Información de ${label}`}
      >
        <Info size={14} strokeWidth={1.9}/>
      </button>

      <span className="kpiInfoPopover" role="tooltip">
        <b>{label}</b>
        {detail && <span>{detail}</span>}
        {coverage && <span><strong>Cobertura:</strong> {coverage}</span>}
        {confidence && <span><strong>Confianza:</strong> {confidence}</span>}
        {source && <span><strong>Fuente:</strong> {source}</span>}
      </span>
    </span>
  );
}
