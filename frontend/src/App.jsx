import { useEffect, useState } from "react";
import { Moon, Sun, CalendarDays, MapPin, Database } from "lucide-react";
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

export default function App(){
  const [active,setActive]=useState("resumen");
  const [theme,setTheme]=useState(()=>localStorage.getItem("sidco-theme") || "light");
  const [fire,setFire]=useState(null);

  useEffect(()=>{
    document.documentElement.dataset.theme=theme;
    localStorage.setItem("sidco-theme",theme);
  },[theme]);

  const openBitacora=(selectedFire)=>{setFire(selectedFire);setActive("bitacora");};

  let content=null;
  if(active==="resumen") content=<Resumen onOpenBitacora={openBitacora}/>;
  if(active==="prioridad") content=<PrioridadTerritorial/>;
  if(active==="operacion") content=<OperacionRecursos/>;
  if(active==="impacto") content=<Impacto onOpenBitacora={openBitacora}/>;
  if(active==="bitacora") content=<Bitacora fire={fire} onBack={()=>setActive("impacto")}/>;
  if(active==="calidad") content=<Calidad/>;

  return <div className="app">
    <img className="institutionalBanner" src={`${import.meta.env.BASE_URL}assets/banner-institucional.png`} alt="Banner institucional"/>
    <header className="topbar noPrint">
      <div className="brand"><small>COIPO · SITUACIÓN NACIONAL</small><h1>Dashboard de Incendios</h1></div>
      <div className="toolbar">
        <div className="periodGroup">
          <button>Hoy</button><button>7 días</button><button>30 días</button>
          <button className="active"><CalendarDays size={15}/> Temporada 2025/26</button><button>Personalizado</button>
        </div>
        <button className="territoryButton"><MapPin size={16}/> Chile</button>
        <button className="themeButton" title="Cambiar modo" onClick={()=>setTheme(theme==="dark"?"light":"dark")}>{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}</button>
      </div>
    </header>

    <nav className="mainNav noPrint">
      <div className="navDashboardGroup">{dashboardViews.map(([label,key])=><button key={key} className={active===key?"active":""} onClick={()=>setActive(key)}>{label}</button>)}</div>
      <div className="navDataGroup"><span></span><button className={`dataNavButton ${active==="calidad"?"active":""}`} onClick={()=>setActive("calidad")}><Database size={14}/> Calidad y Confianza</button></div>
    </nav>
    <main>{content}</main>
  </div>;
}
