import { useEffect, useState } from "react";
import { Moon, Sun, CalendarDays, MapPin } from "lucide-react";
import Resumen from "./views/Resumen.jsx";
import Prioridad from "./views/Prioridad.jsx";
import Operacion from "./views/Operacion.jsx";
import Impacto from "./views/Impacto.jsx";
import Calidad from "./views/Calidad.jsx";
import Bitacora from "./views/Bitacora.jsx";

const nav = ["Resumen","Prioridad Territorial","Operación y Recursos","Impacto y Daño","Calidad y Confianza","Bitácora"];

export default function App(){
  const [active,setActive]=useState("Resumen");
  const [theme,setTheme]=useState(()=>localStorage.getItem("sidco-theme") || "light");
  const [fire,setFire]=useState(null);

  useEffect(()=>{
    document.documentElement.dataset.theme=theme;
    localStorage.setItem("sidco-theme",theme);
  },[theme]);

  const openBitacora=(selectedFire)=>{setFire(selectedFire);setActive("Bitácora");};

  let content;
  if(active==="Resumen") content=<Resumen onOpenBitacora={openBitacora}/>;
  else if(active==="Prioridad Territorial") content=<Prioridad/>;
  else if(active==="Operación y Recursos") content=<Operacion/>;
  else if(active==="Impacto y Daño") content=<Impacto/>;
  else if(active==="Calidad y Confianza") content=<Calidad/>;
  else content=<Bitacora fire={fire} onBack={()=>setActive("Resumen")}/>;

  return (
    <div className="app">
      <header className="topbar noPrint">
        <div className="brand">
          <small>COIPO · SITUACIÓN NACIONAL</small>
          <h1>Dashboard de Incendios</h1>
        </div>
        <div className="toolbar">
          <div className="periodGroup">
            <button>Hoy</button><button>7 días</button><button>30 días</button><button className="active"><CalendarDays size={15}/> Temporada 2025/26</button><button>Personalizado</button>
          </div>
          <button className="territoryButton"><MapPin size={16}/> Chile</button>
          <button className="themeButton" title="Cambiar modo" onClick={()=>setTheme(theme==="dark"?"light":"dark")}>
            {theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}
          </button>
        </div>
      </header>

      <nav className="mainNav noPrint">
        {nav.map(n=><button key={n} className={active===n?"active":""} onClick={()=>setActive(n)}>{n}</button>)}
      </nav>

      <main>{content}</main>
    </div>
  );
}
