import { useMemo, useState } from "react";
import { Info, MapPin, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { regions, territorialPriority } from "../data/dashboardData.js";
import KpiInfo from "./KpiInfo.jsx";

const priorityColor = v =>
  v >= 80 ? "#aa433a" :
  v >= 60 ? "#d57e34" :
  v >= 40 ? "#d0aa36" : "#56856e";

function Factor({label,value}) {
  return (
    <div className="iptFactor">
      <div className="iptFactorLabel">
        <span>{label}</span>
        <b>{value}</b>
      </div>
      <div className="iptFactorTrack">
        <i style={{width:`${Math.max(0,Math.min(100,value))}%`, background:priorityColor(value)}} />
      </div>
    </div>
  );
}

function BubbleChart({items,selectedId,onSelect}) {
  const maxInc = Math.max(...items.map(x=>x.incendios || 1));
  const maxSup = Math.max(...items.map(x=>x.superficie || 1));
  const w=900, h=280, pad=46;

  return (
    <div className="territorialBubbleWrap">
      <svg viewBox={`0 0 ${w} ${h}`} className="territorialBubbleSvg" role="img" aria-label="Comparación territorial">
        <line x1={pad} y1={h-pad} x2={w-18} y2={h-pad} className="chartAxis"/>
        <line x1={pad} y1={18} x2={pad} y2={h-pad} className="chartAxis"/>
        <text x={w/2} y={h-8} textAnchor="middle" className="axisLabel">Incendios</text>
        <text x={12} y={h/2} textAnchor="middle" transform={`rotate(-90 12 ${h/2})`} className="axisLabel">Superficie registrada</text>

        {[0.25,0.5,0.75,1].map(t=>{
          const y=(h-pad)-(h-pad-24)*t;
          return <line key={`gy-${t}`} x1={pad} y1={y} x2={w-18} y2={y} className="chartGrid"/>;
        })}
        {[0.25,0.5,0.75,1].map(t=>{
          const x=pad+(w-pad-24)*t;
          return <line key={`gx-${t}`} x1={x} y1={20} x2={x} y2={h-pad} className="chartGrid"/>;
        })}

        {items.map(item=>{
          const x=pad+((item.incendios||0)/maxInc)*(w-pad-40);
          const y=(h-pad)-((item.superficie||0)/maxSup)*(h-pad-32);
          const radius=18 + ((item.operacion||50)/100)*22;
          const selected=Number(selectedId)===Number(item.id);
          return (
            <g key={item.id} className="territorialBubble" onClick={()=>onSelect(item)} style={{cursor:"pointer"}}>
              <circle cx={x} cy={y} r={radius+5} fill="transparent" stroke={selected?"currentColor":"transparent"} strokeWidth="2"/>
              <circle cx={x} cy={y} r={radius} fill={priorityColor(item.ipt)} fillOpacity={selected?0.95:0.78}/>
              <text x={x} y={y+3} textAnchor="middle" className="bubbleCode">{item.name.slice(0,3).toUpperCase()}</text>
              <title>{item.name} · IPT {item.ipt} · {(item.incendios||0).toLocaleString("es-CL")} incendios · {(item.superficie||0).toLocaleString("es-CL")} ha</title>
            </g>
          );
        })}
      </svg>
      <div className="bubbleLegend">
        <span><i style={{background:"#56856e"}}/> IPT bajo/medio</span>
        <span><i style={{background:"#d57e34"}}/> IPT alto</span>
        <span><i style={{background:"#aa433a"}}/> IPT muy alto</span>
        <small>Tamaño de burbuja = carga operacional</small>
      </div>
    </div>
  );
}

export default function TerritorialPriorityView(){
  const [selectedId,setSelectedId]=useState(8);
  const [sortBy,setSortBy]=useState("IPT");

  const enriched=useMemo(()=>territorialPriority.map(x=>{
    const region=regions.find(r=>Number(r.id)===Number(x.id)) || {};
    return {...x,...region,ipt:x.ipt};
  }),[]);

  const selected=useMemo(
    ()=>enriched.find(x=>Number(x.id)===Number(selectedId)) || enriched[0],
    [enriched,selectedId]
  );

  const ranking=useMemo(()=>{
    const arr=[...enriched];
    if(sortBy==="Incendios") arr.sort((a,b)=>(b.incendios||0)-(a.incendios||0));
    else if(sortBy==="Superficie") arr.sort((a,b)=>(b.superficie||0)-(a.superficie||0));
    else if(sortBy==="Variación") arr.sort((a,b)=>(b.variacion||0)-(a.variacion||0));
    else arr.sort((a,b)=>b.ipt-a.ipt);
    return arr;
  },[enriched,sortBy]);

  return (
    <div className="priorityViewV251">
      <section className="executiveStatement priorityStatement">
        <p>
          <b>{selected.name}</b> combina superficie, frecuencia, grandes incendios y carga operacional.
          El IPT permite ordenar territorios y, a la vez, explicar qué dimensiones empujan su prioridad.
        </p>
        <div className="focusLine">
          <span>Foco actual</span><b>Chile</b>
          <em>Mayor prioridad: {enriched[0].name} · {enriched[0].ipt}</em>
        </div>
      </section>

      <div className="priorityToolbar">
        <div className="priorityBreadcrumb"><MapPin size={15}/><span>Chile</span></div>
        <label>Ordenar por
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option>IPT</option>
            <option>Incendios</option>
            <option>Superficie</option>
            <option>Variación</option>
          </select>
        </label>
      </div>

      <section className="priorityKpiGrid">
        <article className="priorityKpiHero">
          <div className="kpiHeaderLine">
            <small>IPT · {selected.name}</small>
            <KpiInfo label={`IPT · ${selected.name}`} detail="Índice experimental de prioridad territorial. Integra superficie, frecuencia, grandes incendios, operación y variación." source="Modelo interno del dashboard" confidence="Experimental"/>
          </div>
          <strong>{selected.ipt}<span>/100</span></strong>
          <div className="iptLinear"><i style={{width:`${selected.ipt}%`,background:priorityColor(selected.ipt)}}/></div>
          <p>Prioridad {selected.ipt>=80?"muy alta":selected.ipt>=60?"alta":"media"}</p>
        </article>

        <article>
          <div className="kpiHeaderLine"><small>Incendios</small><KpiInfo label="Incendios" detail="Cantidad de incendios del territorio y período seleccionados." source="SIDCO · public.incendio"/></div>
          <strong>{(selected.incendios||0).toLocaleString("es-CL")}</strong>
          <span>Territorio seleccionado</span>
        </article>

        <article>
          <div className="kpiHeaderLine"><small>Superficie registrada</small><KpiInfo label="Superficie registrada" detail="Suma de superficie informada para los incendios del territorio seleccionado." coverage="~77% a nivel temporada" source="SIDCO · incendio.ince_superficie" confidence="Media-Alta"/></div>
          <strong>{(selected.superficie||0).toLocaleString("es-CL")} ha</strong>
          <span>Magnitud acumulada</span>
        </article>

        <article>
          <div className="kpiHeaderLine"><small>Grandes incendios</small><KpiInfo label="Grandes incendios" detail="Se considera gran incendio todo evento con superficie registrada mayor a 400 ha." coverage="Depende de ince_superficie informada" source="SIDCO · incendio.ince_superficie"/></div>
          <strong>&gt;400 ha</strong>
          <span>Umbral del proyecto</span>
        </article>

        <article>
          <div className="kpiHeaderLine"><small>Variación territorial</small><KpiInfo label="Variación territorial" detail="Variación utilizada como uno de los factores experimentales del IPT." source="Modelo interno del dashboard" confidence="Experimental"/></div>
          <strong className={selected.variacion>=0?"metricBad":"metricGood"}>
            {selected.variacion>=0?<ArrowUpRight size={18}/>:<ArrowDownRight size={18}/>}
            {selected.variacion}%
          </strong>
          <span>Variación del territorio</span>
        </article>

        <article>
          <div className="kpiHeaderLine"><small>Carga operacional</small><KpiInfo label="Carga operacional" detail="Factor experimental construido a partir de actividad operacional disponible." source="SIDCO · movimiento/recurso" confidence="Experimental"/></div>
          <strong>{selected.operacion}/100</strong>
          <span>Índice operacional</span>
        </article>
      </section>

      <section className="priorityCoreGrid">
        <div className="priorityMapCard">
          <div className="priorityCardHead">
            <div><small>MAPA</small><h3>Prioridad territorial</h3><p>La Vista 2 usa la misma lógica Leaflet/GeoJSON de la Vista 1: polígono completo = territorio.</p></div>
            <span>Claro · Satélite</span>
          </div>
          <div className="priorityMapVisual">
            <div className="mapChileSilhouette">
              {ranking.slice(0,5).map((x,i)=>(
                <button
                  key={x.id}
                  className={Number(selectedId)===Number(x.id)?"selected":""}
                  style={{"--priority":priorityColor(x.ipt),top:`${12+i*16}%`,left:`${44 + (i%2?9:-7)}%`}}
                  onClick={()=>setSelectedId(x.id)}
                >
                  <i/>
                  <span>{x.name}</span>
                  <b>{x.ipt}</b>
                </button>
              ))}
            </div>
            <div className="priorityLayerLegend">
              <b>IPT</b>
              <span><i className="low"/>Baja</span>
              <span><i className="medium"/>Media</span>
              <span><i className="high"/>Alta</span>
              <span><i className="veryHigh"/>Muy alta</span>
            </div>
          </div>
        </div>

        <aside className="priorityRightColumn">
          <section className="territorialRankingCard">
            <div className="priorityCardHead"><div><small>RANKING</small><h3>Territorios prioritarios</h3></div></div>
            <div className="territorialRankingList">
              {ranking.map((x,i)=>(
                <button key={x.id} className={Number(selectedId)===Number(x.id)?"selected":""} onClick={()=>setSelectedId(x.id)}>
                  <span>{String(i+1).padStart(2,"0")}</span>
                  <div><b>{x.name}</b><small>{(x.incendios||0).toLocaleString("es-CL")} incendios · {(x.superficie||0).toLocaleString("es-CL")} ha</small><i style={{width:`${x.ipt}%`,background:priorityColor(x.ipt)}}/></div>
                  <strong>{x.ipt}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="whyPriorityCard">
            <div className="priorityCardHead"><div><small>EXPLICABILIDAD</small><h3>Por qué está arriba</h3></div><Info size={16}/></div>
            <Factor label="Superficie" value={selected.superficie}/>
            <Factor label="Frecuencia" value={selected.frecuencia}/>
            <Factor label="Grandes incendios >400 ha" value={selected.grandes}/>
            <Factor label="Carga operacional" value={selected.operacion}/>
            <Factor label="Variación interanual" value={selected.variacion}/>
            <p>IPT experimental para ordenar territorios. No representa probabilidad futura de incendio.</p>
          </section>
        </aside>
      </section>

      <section className="territorialComparisonCard">
        <div className="priorityCardHead">
          <div><small>COMPARACIÓN</small><h3>Comparación territorial</h3><p>X = incendios · Y = superficie · tamaño = carga operacional · color = IPT</p></div>
        </div>
        <BubbleChart items={enriched} selectedId={selectedId} onSelect={x=>setSelectedId(x.id)}/>
      </section>

      <section className="significantChangesV251">
        <div className="priorityCardHead"><div><small>SEÑALES</small><h3>Cambios significativos</h3></div></div>
        <div>
          <article><small>Mayor prioridad</small><b>Biobío · IPT 92</b><span>Principal territorio de atención.</span></article>
          <article><small>Grandes incendios nacionales</small><b>48 &gt;400 ha</b><span>−45,5% vs temporada anterior.</span></article>
          <article><small>Eventos extremos</small><b>4 &gt;5.000 ha</b><span>+100% vs temporada anterior.</span></article>
        </div>
      </section>
    </div>
  );
}
