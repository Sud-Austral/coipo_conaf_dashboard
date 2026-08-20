import { useMemo, useState } from "react";
import { ChevronRight, RotateCcw } from "lucide-react";
import KpiCard from "../components/KpiCard.jsx";
import ExecutiveMap from "../components/ExecutiveMap.jsx";
import { baseKpis, regions, provincesByRegion, communesByProvince, fires } from "../data/dashboardData.js";
import { seasonTrendReal } from "../data/seasonTrend.real.js";

export default function Resumen({onOpenBitacora}) {
  const [path,setPath] = useState([{level:"country",id:"CL",name:"Chile",lat:-36.8,lon:-72.4}]);
  const [selectedFire,setSelectedFire] = useState(null);
  const [trendHover,setTrendHover] = useState(null);
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
        <div>
          <small>EVOLUCIÓN</small>
          <h3>Temporada 2025/26 vs 2024/25</h3>
          <p className="trendHelp">Pasa el mouse por cada mes para comparar el acumulado mensual disponible.</p>
        </div>
        <div className="trendInteractive">
          {(()=>{
            const max=Math.max(1,...seasonTrendReal.map(x=>Number(x.current||0)));
            const pts=seasonTrendReal.map((x,i)=>{
              const px=(i/(seasonTrendReal.length-1))*1000;
              const py=145-(Number(x.current||0)/max)*112;
              return {x,...x,px,py};
            });
            return <>
              <svg viewBox="0 0 1000 170" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  points={pts.map(p=>`${p.px},${p.py}`).join(" ")}
                />
                {pts.map((pt,i)=><g key={pt.label}>
                  <circle cx={pt.px} cy={pt.py} r="5" className="trendPoint"/>
                  <rect
                    x={Math.max(0,pt.px-42)}
                    y="0"
                    width="84"
                    height="170"
                    fill="transparent"
                    onMouseEnter={()=>setTrendHover(i)}
                    onMouseLeave={()=>setTrendHover(null)}
                  />
                </g>)}
              </svg>

              {trendHover!=null && (()=>{
                const x=seasonTrendReal[trendHover];
                return <div
                  className="trendHoverCard"
                  style={{left:`${Math.min(88,Math.max(8,(trendHover/(seasonTrendReal.length-1))*100))}%`}}
                >
                  <b>{x.label} {x.year}</b>
                  <span><strong>{Number(x.current||0).toLocaleString("es-CL")}</strong> incendios · 2025/26</span>
                  <span>
                    <strong>{x.previous==null?"—":Number(x.previous).toLocaleString("es-CL")}</strong>
                    {x.previous==null?" 2024/25 · pendiente extracción mensual":" incendios · 2024/25"}
                  </span>
                </div>;
              })()}

              <div className="months">
                {seasonTrendReal.map(x=><span key={x.label}>{x.label}</span>)}
              </div>
              <div className="trendLegend">
                <span><i/>2025/26 · datos reales</span>
                <span className="previousPending">2024/25 · pendiente serie mensual</span>
              </div>
            </>;
          })()}
        </div>
      </section>
    </>
  );
}
