import { useMemo, useState } from "react";
import { regions, territorialPriority } from "../data/dashboardData.js";

const color = v => v >= 80 ? "#aa433a" : v >= 60 ? "#d57e34" : v >= 40 ? "#d0aa36" : "#56856e";

function Factor({label,value}) {
  return <div className="factorRow">
    <div><span>{label}</span><b>{value}</b></div>
    <div className="factorTrack"><i style={{width:`${value}%`, background:color(value)}} /></div>
  </div>;
}

export default function TerritorialPriorityView({onTerritorySelect}) {
  const [selectedId,setSelectedId]=useState(8);
  const selected=useMemo(()=>territorialPriority.find(x=>x.id===selectedId) || territorialPriority[0],[selectedId]);
  const region=regions.find(r=>Number(r.id)===Number(selected.id)) || {};

  const choose = item => {
    setSelectedId(item.id);
    const r=regions.find(x=>Number(x.id)===Number(item.id));
    if(r) onTerritorySelect?.(r);
  };

  return <div className="priorityView">
    <section className="executiveReading">
      <p><b>{selected.name}</b> concentra una combinación relevante de superficie, frecuencia, grandes incendios y carga operacional. El IPT permite ordenar territorios y explicar qué factores impulsan su prioridad.</p>
      <div className="readingMeta"><span>Foco actual: CHILE</span><strong>Mayor prioridad: {territorialPriority[0].name.toUpperCase()} · {territorialPriority[0].ipt}</strong></div>
    </section>

    <section className="priorityKpis">
      <article><small>IPT</small><strong>{selected.ipt} / 100</strong><span>Prioridad {selected.ipt>=80?"muy alta":selected.ipt>=60?"alta":"media"}</span></article>
      <article><small>INCENDIOS</small><strong>{(region.incendios||2256).toLocaleString("es-CL")}</strong><span>Territorio seleccionado</span></article>
      <article><small>SUPERFICIE</small><strong>{(region.superficie||62290).toLocaleString("es-CL")} ha</strong><span>Superficie registrada</span></article>
      <article><small>INCENDIOS &gt;400 HA</small><strong>{selected.id===8 ? "—" : "—"}</strong><span>Filtro territorial al conectar datos reales</span></article>
    </section>

    <section className="priorityMain">
      <div className="priorityMapPlaceholder">
        <div className="priorityMapTitle"><div><h3>Mapa de prioridad territorial</h3><p>Leaflet · polígonos reales · IPT por territorio</p></div><span>Claro · Satélite</span></div>
        <div className="priorityMapCanvas">
          <div className="mapConcept">IPT TERRITORIAL</div>
          {territorialPriority.map((x,i)=><button key={x.id} className={`territoryChip ${selectedId===x.id?"active":""}`} style={{"--ipt":color(x.ipt), left:`${16+i*15}%`, top:`${20+(i%3)*22}%`}} onClick={()=>choose(x)}>{x.name}<b>{x.ipt}</b></button>)}
          <p>La implementación conserva la capa Leaflet/GeoJSON de Vista 1; al conectar polígonos provinciales y comunales continuará el drill-down Chile → Región → Provincia → Comuna.</p>
        </div>
      </div>

      <aside className="priorityAside">
        <div className="rankingBox"><h3>Territorios prioritarios</h3>{territorialPriority.map((x,i)=><button key={x.id} onClick={()=>choose(x)} className={selectedId===x.id?"selected":""}><em>{String(i+1).padStart(2,"0")}</em><span>{x.name}</span><b>{x.ipt}</b></button>)}</div>
        <div className="whyBox"><h3>Por qué está arriba</h3><Factor label="Superficie" value={selected.superficie}/><Factor label="Frecuencia" value={selected.frecuencia}/><Factor label="Grandes incendios >400 ha" value={selected.grandes}/><Factor label="Carga operacional" value={selected.operacion}/><Factor label="Variación interanual" value={selected.variacion}/><small>IPT experimental para ordenamiento territorial; no representa probabilidad futura de incendio.</small></div>
      </aside>
    </section>

    <section className="territorialCompare">
      <div><h3>Comparación territorial</h3><p>X = incendios · Y = superficie · tamaño = carga operacional · color = IPT</p></div>
      <div className="bubbleChart">{territorialPriority.map((x,i)=><button key={x.id} title={`${x.name} · IPT ${x.ipt}`} onClick={()=>choose(x)} style={{left:`${12+i*18}%`,bottom:`${15+x.superficie*.55}%`,width:`${30+x.operacion/3}px`,height:`${30+x.operacion/3}px`,background:color(x.ipt)}}>{x.name.slice(0,3).toUpperCase()}</button>)}</div>
    </section>

    <section className="significantChanges"><h3>Cambios significativos</h3><div><article><small>Mayor prioridad</small><b>Biobío · IPT 92</b></article><article><small>Grandes incendios nacionales</small><b>48 &gt;400 ha</b><span>−45,5% vs anterior</span></article><article><small>Eventos extremos</small><b>4 &gt;5.000 ha</b><span>+100% vs anterior</span></article></div></section>
  </div>;
}
