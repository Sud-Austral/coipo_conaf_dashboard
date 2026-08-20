import { Info } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const OPEN_EVENT = "sidco:kpi-info-open";

export default function KpiInfo({ label, source, coverage, confidence, detail }){
  const id=useId();
  const [open,setOpen]=useState(false);
  const [pos,setPos]=useState({top:0,left:0});
  const buttonRef=useRef(null);

  useEffect(()=>{
    const closeOther=(e)=>{if(e.detail!==id)setOpen(false)};
    const outside=(e)=>{
      if(open && buttonRef.current && !buttonRef.current.contains(e.target)){
        const pop=document.querySelector(`[data-kpi-pop="${CSS.escape(id)}"]`);
        if(!pop?.contains(e.target)) setOpen(false);
      }
    };
    const key=(e)=>{if(e.key==="Escape")setOpen(false)};
    window.addEventListener(OPEN_EVENT,closeOther);
    document.addEventListener("pointerdown",outside);
    document.addEventListener("keydown",key);
    return()=>{
      window.removeEventListener(OPEN_EVENT,closeOther);
      document.removeEventListener("pointerdown",outside);
      document.removeEventListener("keydown",key);
    };
  },[id,open]);

  const toggle=(e)=>{
    e.stopPropagation();
    const next=!open;
    if(next && buttonRef.current){
      const r=buttonRef.current.getBoundingClientRect();
      const width=205;
      const left=Math.max(8,Math.min(window.innerWidth-width-8,r.right-width));
      const top=Math.min(window.innerHeight-130,r.bottom+6);
      setPos({top,left});
      window.dispatchEvent(new CustomEvent(OPEN_EVENT,{detail:id}));
    }
    setOpen(next);
  };

  return <>
    <button
      ref={buttonRef}
      type="button"
      className={`kpiInfoButton ${open?"active":""}`}
      aria-label={`Información de ${label}`}
      onClick={toggle}
    >
      <Info size={11} strokeWidth={1.9}/>
    </button>

    {open && createPortal(
      <div
        data-kpi-pop={id}
        className="kpiInfoFloating"
        style={{top:pos.top,left:pos.left}}
        role="tooltip"
      >
        <b>{label}</b>
        {detail&&<span>{detail}</span>}
        {coverage&&<span><strong>Cobertura:</strong> {coverage}</span>}
        {confidence&&<span><strong>Confianza:</strong> {confidence}</span>}
        {source&&<span><strong>Fuente:</strong> {source}</span>}
      </div>,
      document.body
    )}
  </>;
}
