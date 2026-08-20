import { useMemo, useState } from "react";
import { fires } from "../data/dashboardData.js";
import PopulationExposureMap from "../components/PopulationExposureMap.jsx";
import KpiInfo from "../components/KpiInfo.jsx";

const exposureDemo = {
  "805119003":{name:"Concepción",type:"Urbana",distanceKm:.8,lat:-36.817,lon:-73.031,expansion:.62,index:91,level:"Muy alta",context:"Interfaz urbano-forestal"},
  "805149434":{name:"Hualqui",type:"Urbana",distanceKm:1.4,lat:-36.975,lon:-72.925,expansion:.42,index:82,level:"Alta",context:"Bosque / vegetación natural"},
  "805221387":{name:"Florida",type:"Rural",distanceKm:2.3,lat:-36.805,lon:-72.650,expansion:.31,index:68,level:"Media-alta",context:"Mosaico rural-forestal"},
  "805351873":{name:"Los Ángeles",type:"Urbana",distanceKm:3.7,lat:-37.465,lon:-72.315,expansion:.28,index:57,level:"Media",context:"Agrícola / rural"},
  "811206947":{name:"Parral",type:"Rural",distanceKm:4.8,lat:-36.120,lon:-71.790,expansion:.19,index:43,level:"Moderada",context:"Agrícola"}
};

export default function Exposicion(){
  const [selectedId,setSelectedId]=useState(fires[1]?.id||fires[0]?.id);
  const fire=fires.find(f=>f.id===selectedId)||fires[0];
  const nearest=exposureDemo[fire.id]||exposureDemo["805149434"];

  const counts=useMemo(()=>{
    const rows=Object.values(exposureDemo);
    return {
      lt1:rows.filter(x=>x.distanceKm<1).length,
      one3:rows.filter(x=>x.distanceKm>=1&&x.distanceKm<3).length,
      three5:rows.filter(x=>x.distanceKm>=3&&x.distanceKm<=5).length
    };
  },[]);

  return <div className="exposureView">
    <section className="executiveStatement exposureStatement">
      <div>
        <span>EXPOSICIÓN TERRITORIAL</span>
        <h2>¿Qué incendios están más cerca de zonas pobladas?</h2>
        <p>Proximidad geométrica entre incendios y zonas urbanas/rurales, complementada con contexto territorial y expansión equivalente observada.</p>
      </div>
      <div className="exposureWarning">
        <b>Lectura experimental</b>
        <span>No es un pronóstico de propagación del frente.</span>
      </div>
    </section>

    <section className="exposureKpis">
      <article><span>Incendios a &lt;1 km <KpiInfo label="Incendios a menos de 1 km" detail="Ejemplo demostrativo sobre incendios disponibles en la maqueta."/></span><strong>{counts.lt1}</strong><small>Zona poblada</small></article>
      <article><span>Incendios a 1–3 km <KpiInfo label="Incendios entre 1 y 3 km" detail="Distancia geométrica mínima a zona urbana/rural."/></span><strong>{counts.one3}</strong><small>Zona poblada</small></article>
      <article><span>Incendios a 3–5 km <KpiInfo label="Incendios entre 3 y 5 km" detail="Distancia geométrica mínima a zona urbana/rural."/></span><strong>{counts.three5}</strong><small>Zona poblada</small></article>
      <article><span>Índice de exposición <KpiInfo label="Índice de Exposición Territorial" confidence="Experimental" detail="Combina proximidad, superficie, expansión equivalente y tipo de entorno. No representa probabilidad de afectación."/></span><strong>{nearest.index}/100</strong><small>{nearest.level}</small></article>
    </section>

    <section className="exposureCore">
      <div className="exposureMapCard">
        <div className="sectionHeading">
          <div><span>PROXIMIDAD</span><h3>Anillos de exposición territorial</h3></div>
          <select value={selectedId} onChange={e=>setSelectedId(e.target.value)}>
            {fires.map(f=><option key={f.id} value={f.id}>{f.name} · {f.ha.toLocaleString("es-CL")} ha</option>)}
          </select>
        </div>
        <PopulationExposureMap fire={fire} nearest={nearest}/>
      </div>

      <aside className="exposureSide">
        <div className="exposureSelected">
          <span>INCENDIO SELECCIONADO</span>
          <h3>{fire.name}</h3>
          <strong>{fire.ha.toLocaleString("es-CL")} ha</strong>
        </div>
        <div className="exposureMetric"><span>Zona más cercana</span><b>{nearest.name}</b><small>{nearest.type}</small></div>
        <div className="exposureMetric emphasis"><span>Distancia mínima</span><b>{nearest.distanceKm.toFixed(1).replace(".",",")} km</b><small>Línea geométrica más próxima</small></div>
        <div className="exposureMetric"><span>Entorno inmediato</span><b>{nearest.context}</b></div>
        <div className="exposureMetric"><span>Expansión equivalente</span><b>{nearest.expansion.toFixed(2).replace(".",",")} km/h</b><small>Estimación geométrica por evolución de superficie</small></div>
      </aside>
    </section>

    <section className="exposureExplanation">
      <div><span>CÓMO LEERLO</span><h3>Misma superficie, distinto contexto</h3></div>
      <p>Un incendio remoto y otro próximo a una zona urbana pueden tener la misma superficie, pero no la misma exposición territorial. Esta vista incorpora la proximidad como una dimensión adicional para priorización.</p>
      <div className="exposureBands">
        <span><i></i><b>&lt;1 km</b> proximidad inmediata</span>
        <span><i></i><b>1–3 km</b> proximidad alta</span>
        <span><i></i><b>3–5 km</b> proximidad de contexto</span>
        <span><i></i><b>&gt;5 km</b> fuera de anillos principales</span>
      </div>
    </section>
  </div>;
}
