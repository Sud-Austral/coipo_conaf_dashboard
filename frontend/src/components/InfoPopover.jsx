import { Info } from "lucide-react";

export default function InfoPopover({item}) {
  return (
    <span className="infoWrap">
      <button className="iconButton infoButton" aria-label={`Información de ${item.label}`}>
        <Info size={15} strokeWidth={1.8}/>
      </button>
      <span className="infoPopover">
        <b>{item.label}</b>
        {item.detail && <span>{item.detail}</span>}
        {item.coverage && item.coverage !== "—" && <span><strong>Cobertura:</strong> {item.coverage}</span>}
        {item.confidence && <span><strong>Confianza:</strong> {item.confidence}</span>}
        {item.source && <span><strong>Fuente:</strong> {item.source}</span>}
      </span>
    </span>
  );
}
