import { Info } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

const OPEN_EVENT = "sidco:kpi-info-open";

export default function KpiInfo({ label, source, coverage, confidence, detail }){
  const id = useId();
  const [open,setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(()=>{
    const onOtherOpen = (event)=>{
      if(event.detail !== id) setOpen(false);
    };

    const onPointerDown = (event)=>{
      if(open && wrapRef.current && !wrapRef.current.contains(event.target)){
        setOpen(false);
      }
    };

    const onKeyDown = (event)=>{
      if(event.key === "Escape") setOpen(false);
    };

    window.addEventListener(OPEN_EVENT,onOtherOpen);
    document.addEventListener("pointerdown",onPointerDown);
    document.addEventListener("keydown",onKeyDown);

    return ()=>{
      window.removeEventListener(OPEN_EVENT,onOtherOpen);
      document.removeEventListener("pointerdown",onPointerDown);
      document.removeEventListener("keydown",onKeyDown);
    };
  },[id,open]);

  const toggle = (event)=>{
    event.stopPropagation();
    const next=!open;
    if(next){
      window.dispatchEvent(new CustomEvent(OPEN_EVENT,{detail:id}));
    }
    setOpen(next);
  };

  return (
    <span className="kpiInfoWrap" ref={wrapRef}>
      <button
        type="button"
        className={`kpiInfoButton ${open ? "active" : ""}`}
        aria-label={`Información de ${label}`}
        aria-expanded={open}
        onClick={toggle}
      >
        <Info size={14} strokeWidth={1.9}/>
      </button>

      {open && (
        <span className="kpiInfoPopover open" role="tooltip">
          <b>{label}</b>
          {detail && <span>{detail}</span>}
          {coverage && <span><strong>Cobertura:</strong> {coverage}</span>}
          {confidence && <span><strong>Confianza:</strong> {confidence}</span>}
          {source && <span><strong>Fuente:</strong> {source}</span>}
        </span>
      )}
    </span>
  );
}
