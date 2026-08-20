import { useEffect, useMemo, useState } from "react";
import { Moon, Sun, CalendarDays, MapPin, Database, X } from "lucide-react";
import Resumen from "./views/Resumen.jsx";
import PrioridadTerritorial from "./views/PrioridadTerritorial.jsx";
import OperacionRecursos from "./views/OperacionRecursos.jsx";
import Impacto from "./views/Impacto.jsx";
import Calidad from "./views/Calidad.jsx";
import Bitacora from "./views/Bitacora.jsx";

const dashboardViews = [
  ["Resumen","resumen"],
  ["Prioridad Territorial","prioridad"],
  ["Operación y Recursos","operacion"],
  ["Impacto y Daño","impacto"],
  ["Bitácora","bitacora"]
];

const periodOptions = [
  {key:"today",label:"Hoy"},
  {key:"7d",label:"7 días"},
  {key:"30d",label:"30 días"},
  {key:"season",label:"Temporada 2025/26"}
];

export default function App(){
  const [active,setActive]=useState("resumen");
  const [theme,setTheme]=useState(()=>localStorage.getItem("sidco-theme") || "light");
  const [fire,setFire]=useState(null);
  const [period,setPeriod]=useState("season");
  const [customOpen,setCustomOpen]=useState(false);
  const [customRange,setCustomRange]=useState({from:"2026-01-01",to:"2026-01-31"});
  const [appliedCustom,setAppliedCustom]=useState(null);

  useEffect(()=>{
    document.documentElement.dataset.theme=theme;
    localStorage.setItem("sidco-theme",theme);
  },[theme]);

  const openBitacora=(selectedFire)=>{setFire(selectedFire);setActive("bitacora");};

  const emptyData = period!=="season";
  const periodLabel = useMemo(()=>{
    if(period==="today") return "Hoy";
    if(period==="7d") return "Últimos 7 días";
    if(period==="30d") return "Últimos 30 días";
    if(period==="custom" && appliedCustom) return `${appliedCustom.from} → ${appliedCustom.to}`;
    return "Temporada 2025/26";
  },[period,appliedCustom]);

  let content=null;
  if(active==="resumen") content=<Resumen onOpenBitacora={openBitacora}/>;
  if(active==="prioridad") content=<PrioridadTerritorial/>;
  if(active==="operacion") content=<OperacionRecursos/>;
  if(active==="impacto") content=<Impacto onOpenBitacora={openBitacora}/>;
  if(active==="bitacora") content=<Bitacora fire={fire} onBack={()=>setActive("impacto")}/>;
  if(active==="calidad") content=<Calidad/>;

  const applyCustom=()=>{
    if(!customRange.from || !customRange.to) return;
    setAppliedCustom(customRange);
    setPeriod("custom");
    setCustomOpen(false);
  };

  return <div className="app">
    <img className="institutionalBanner" src={`${import.meta.env.BASE_URL}assets/banner-institucional.png`} alt="Banner institucional"/>

    <header className="topbar noPrint">
      <div className="brand"><small>COIPO · SITUACIÓN NACIONAL</small><h1>Dashboard de Incendios</h1></div>

      <div className="toolbar">
        <div className="periodGroup">
          {periodOptions.map(p=>
            <button
              key={p.key}
              className={period===p.key?"active":""}
              onClick={()=>{setPeriod(p.key);setCustomOpen(false)}}
            >
              {p.key==="season" && <CalendarDays size={15}/>}
              {p.label}
            </button>
          )}

          <div className="customPeriodWrap">
            <button
              className={period==="custom"?"active":""}
              onClick={()=>setCustomOpen(v=>!v)}
            >
              Personalizado
            </button>

            {customOpen && <div className="customPeriodPopover">
              <div className="customPeriodHead">
                <b>Rango personalizado</b>
                <button onClick={()=>setCustomOpen(false)} aria-label="Cerrar"><X size={15}/></button>
              </div>

              <label>
                Desde
                <input type="date" value={customRange.from} onChange={e=>setCustomRange(v=>({...v,from:e.target.value}))}/>
              </label>

              <label>
                Hasta
                <input type="date" value={customRange.to} onChange={e=>setCustomRange(v=>({...v,to:e.target.value}))}/>
              </label>

              <div className="customPeriodActions">
                <button onClick={()=>{setPeriod("season");setAppliedCustom(null);setCustomOpen(false)}}>Limpiar</button>
                <button className="apply" onClick={applyCustom}>Aplicar</button>
              </div>
            </div>}
          </div>
        </div>

        <button className="territoryButton"><MapPin size={16}/> Chile</button>
        <button className="themeButton" title="Cambiar modo" onClick={()=>setTheme(theme==="dark"?"light":"dark")}>
          {theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}
        </button>
      </div>
    </header>

    <nav className="mainNav noPrint">
      <div className="navDashboardGroup">
        {dashboardViews.map(([label,key])=>
          <button key={key} className={active===key?"active":""} onClick={()=>setActive(key)}>{label}</button>
        )}
      </div>

      <div className="navDataGroup">
        <span></span>
        <button className={`dataNavButton ${active==="calidad"?"active":""}`} onClick={()=>setActive("calidad")}>
          <Database size={14}/> Calidad y Confianza
        </button>
      </div>
    </nav>

    <div className="activePeriodBar noPrint">
      <span>Período</span><b>{periodLabel}</b>
      {emptyData && <em>Sin información demostrativa para este período</em>}
    </div>

    <main className={emptyData && active!=="calidad" ? "periodEmpty" : ""}>
      {emptyData && active!=="calidad" && (
        <div className="emptyPeriodNotice">
          <b>Sin información para el período seleccionado</b>
          <span>La estructura del dashboard y la cartografía permanecen visibles para validar el comportamiento del filtro.</span>
        </div>
      )}
      {content}
    </main>
  </div>;
}
