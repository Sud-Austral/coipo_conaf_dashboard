import { Info } from "lucide-react";

export default function InfoPopover({item}) {
  return (
    <span className="infoWrap">
      <button className="iconButton infoButton" aria-label={`Información de ${item.label}`}>
        <Info size={15} strokeWidth={1.8}/>
      </button>
      <span className="infoPopover">
        <b>Confianza: {item.confidence}</b>
        <span>Cobertura: {item.coverage}</span>
        <span>Fuente: {item.source}</span>
      </span>
    </span>
  );
}
