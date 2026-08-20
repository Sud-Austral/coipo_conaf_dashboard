import { useMemo, useState } from "react";
import { ChevronRight, RotateCcw } from "lucide-react";
import KpiCard from "../components/KpiCard.jsx";
import ExecutiveMap from "../components/ExecutiveMap.jsx";
import { baseKpis, regions, provincesByRegion, communesByProvince, fires } from "../data/dashboardData.js";

export default function Resumen({onOpenBitacora}) {
  const [path,setPath] = useState([{level:"country",id:"CL",name:"Chile",lat:-36.8,lon:-72.4}]);
  const [selectedFire,setSelectedFire] = useState(null);
  const context = path[path.length-1];

  const nextItems = useMemo(()=>{
    if(context.level==="country") return regions;
    if(context.level==="region") return provincesByRegion[context.id] || [];
    if(context.level==="province") return communesByProvince[context.id] || [];
    if(context.level==="commune") return fires.filter(f=>f.communeId===context.id);
    return [];
  },[context]);

  const panelTitle = context.level==="country" ? "Regiones prioritarias"
    : context.level==="region" ? "Provincias prioritarias"
    : context.level==="province" ? "Comunas prioritarias"
    : "Incendios prioritarios";

  const selectTerritory=(item)=>{
    if(context.level==="country") setPath([...path,{level:"region",...item}]);
    else if(context.level==="region") setPath([...path,{level:"province",...item}]);
    else if(context.level==="province") setPath([...path,{level:"commune",...item}]);
  };

  const reset=()=>{setPath([{level:"country",id:"CL",name:"Chile",lat:-36.8,lon:-72.4}]);setSelectedFire(null);};

  const executiveText = context.level==="country"
    ? "La temporada registra menos incendios y menor superficie total que la anterior, pero aumenta la superficie media. Biobío concentra la mayor superficie registrada y constituye el principal foco territorial."
    : `El dashboard está filtrado en ${context.name}. Los KPI, el mapa y el ranking representan exclusivamente este contexto territorial.`;

  return (
    <>
      <section className="executiveStatement">
        <p>{executiveText}</p>
        <div className="focusLine">
          <span>Foco actual</span>
          <b>{context.name}</b>
          {context.prioridad && <em>Prioridad {context.prioridad>=85?"muy alta":context.prioridad>=70?"alta":"media"}</em>}
        </div>
      </section>

      <div className="breadcrumbRow">
        <div className="breadcrumbs">
          {path.map((p,i)=>(
            <span key={`${p.level}-${p.id}`}>
              <button onClick={()=>setPath(path.slice(0,i+1))}>{p.name}</button>
              {i<path.length-1 && <ChevronRight size={14}/>}
            </span>
          ))}
        </div>
        {path.length>1 && <button className="resetButton" onClick={reset}><RotateCcw size={15}/> Restablecer territorio</button>}
      </div>

      <div className="kpiGrid primary">
        {baseKpis.slice(0,4).map(x=><KpiCard key={x.label} item={x}/>)}
      </div>
      <div className="kpiGrid secondary">
        {baseKpis.slice(4).map(x=><KpiCard key={x.label} compact item={x}/>)}
      </div>

      <div className="mapLayout">
        <ExecutiveMap
          context={context}
          onTerritorySelect={selectTerritory}
          onSelectFire={setSelectedFire}
          onOpenBitacora={onOpenBitacora}
        />

        <aside className="priorityPanel">
          <div className="priorityHeader">
            <div><small>TERRITORIOS PRIORITARIOS</small><h3>{panelTitle}</h3></div>
            <span>{nextItems.length}</span>
          </div>

          <div className="priorityList">
            {nextItems.slice(0,6).map((item,i)=>(
              <button key={item.id} className="priorityItem" onClick={()=>{
                if(context.level==="commune") { setSelectedFire(item); }
                else selectTerritory(item);
              }}>
                <span className="priorityIndex">{String(i+1).padStart(2,"0")}</span>
                <span className="priorityCopy">
                  <b>{item.name}</b>
                  <small>
                    {item.ha ? `${item.ha.toLocaleString("es-CL")} ha` :
                    `${item.incendios?.toLocaleString("es-CL") || "—"} incendios · ${(item.superficie||0).toLocaleString("es-CL")} ha`}
                  </small>
                  <i style={{width:`${Math.min(100,item.prioridad||70)}%`}}/>
                </span>
                <strong>{item.prioridad || (item.ha ? "🔥" : "—")}</strong>
              </button>
            ))}
          </div>

          {selectedFire && (
            <div className="selectedFireCard">
              <small>INCENDIO SELECCIONADO</small>
              <h4>{selectedFire.name}</h4>
              <p>{selectedFire.ha.toLocaleString("es-CL")} ha · {selectedFire.estado}</p>
              <button onClick={()=>onOpenBitacora(selectedFire)}>Ver bitácora</button>
            </div>
          )}
        </aside>
      </div>

      <section className="trendPanel">
        <div><small>EVOLUCIÓN</small><h3>Temporada 2025/26 vs 2024/25</h3></div>
        <div className="trendMock">
          <svg viewBox="0 0 1000 170" preserveAspectRatio="none">
            <polyline fill="none" stroke="currentColor" strokeWidth="3"
              points="0,145 90,142 180,136 270,118 350,84 430,38 510,53 590,91 680,110 770,128 870,139 1000,146"/>
            <polyline className="previousLine" fill="none" strokeWidth="2"
              points="0,144 90,140 180,131 270,112 350,94 430,60 510,45 590,75 680,103 770,119 870,133 1000,142"/>
          </svg>
          <div className="months"><span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dic</span><span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span></div>
        </div>
      </section>
    </>
  );
}
