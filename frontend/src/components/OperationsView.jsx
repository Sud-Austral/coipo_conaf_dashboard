import { useMemo, useState } from "react";
import { Info, Gauge, Users, Truck, Flame, Clock, Activity } from "lucide-react";
import OperationalReplayMap from "./OperationalReplayMap.jsx";
import { operationalSummary, operationalReplayFires } from "../data/dashboardData.js";


function formatDuration(minutes){
  const m=Math.max(0,Math.round(minutes));
  if(m<60) return `${m} min`;
  const h=Math.floor(m/60);
  const rest=m%60;
  return rest ? `${h} h ${rest} min` : `${h} h`;
}

function ResourceTimeline({resource}){
  const events=resource.events || [];
  const max=Math.max(1,...events.map(e=>e.t));
  return (
    <article className="resourceTimeline">
      <b>{resource.name}</b>
      <div className="resourceTimelineBody">
        <div className="timelineTrackV251">
          {events.map((e,index)=>(
            <span
              key={`${resource.id}-${e.label}`}
              className="timelineEventV251"
              style={{left:`${(e.t/max)*100}%`}}
              title={`${e.label} · ${e.time}`}
            >
              <i/>
              <em>{e.label}</em>
              <small>{e.time}</small>
            </span>
          ))}
        </div>
        <div className="timelineDurationsV251">
          {events.slice(0,-1).map((e,index)=>{
            const next=events[index+1];
            const left=(e.t/max)*100;
            const right=(next.t/max)*100;
            const width=Math.max(2,right-left);
            return (
              <span
                key={`${resource.id}-dur-${index}`}
                style={{left:`${left}%`,width:`${width}%`}}
                title={`${e.label} → ${next.label}: ${formatDuration(next.t-e.t)}`}
              >
                {formatDuration(next.t-e.t)}
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}


function Kpi({icon:Icon,label,value,sub}){
  return <article className="opKpi"><div><Icon size={17}/><span>{label}</span></div><strong>{value}</strong><small>{sub}</small></article>;
}

export default function OperationsView(){
  const [fireId,setFireId]=useState(operationalReplayFires[0].id);
  const fire=useMemo(()=>operationalReplayFires.find(f=>f.id===fireId)||operationalReplayFires[0],[fireId]);

  const totalCombatants=fire.resources.reduce((a,r)=>a+r.combatants,0);
  const firstDispatch=Math.min(...fire.resources.map(r=>r.events.find(e=>e.label==="Despacho")?.t ?? 9999));
  const firstArrival=Math.min(...fire.resources.map(r=>r.events.find(e=>e.label==="Arribo")?.t ?? 9999));
  const firstCombat=Math.min(...fire.resources.map(r=>r.events.find(e=>e.label==="Inicio combate")?.t ?? 9999));

  return <div className="operationsView">
    <section className="executiveReading">
      <p>La vista operacional muestra cómo se movilizan recursos y personal, dónde se concentra el esfuerzo y cuánto demora la respuesta. El replay permite reconstruir de forma visual los hitos disponibles del incendio seleccionado.</p>
      <div className="readingMeta"><span>Foco operacional: {fire.name}</span><strong>{fire.resources.length} recursos demo · {totalCombatants} combatientes</strong></div>
    </section>

    <section className="opKpis">
      <Kpi icon={Truck} label="Recursos movilizados" value={operationalSummary.recursosMovilizados.toLocaleString("es-CL")} sub="Recursos internos distintos"/>
      <Kpi icon={Users} label="Personal movilizado" value={operationalSummary.personalMovilizado.toLocaleString("es-CL")} sub="Combatientes informados"/>
      <Kpi icon={Flame} label="Incendios atendidos" value={operationalSummary.incendiosAtendidos.toLocaleString("es-CL")} sub="Con registros de movimiento"/>
      <Kpi icon={Clock} label="Despacho → arribo" value={`${operationalSummary.medianaDespachoArribo} min`} sub="Mediana temporada"/>
      <Kpi icon={Activity} label="Arribo → combate" value={`${operationalSummary.medianaArriboCombate} min`} sub="Mediana disponible"/>
      <Kpi icon={Gauge} label="Primer ataque → control" value={`${operationalSummary.medianaPrimerAtaqueControl} min`} sub="Mediana temporada"/>
    </section>

    <section className="opMainGrid">
      <OperationalReplayMap fire={fire} fireOptions={operationalReplayFires} onFireChange={setFireId}/>
      <aside className="opSide">
        <div className="opIncident">
          <small>INCENDIO SELECCIONADO</small>
          <h3>{fire.name}</h3>
          <b>{fire.ha.toLocaleString("es-CL")} ha</b>
          <p>{fire.region} · {fire.status}</p>
        </div>
        <div className="opMetrics">
          <h3>Respuesta del evento</h3>
          <div><span>Primer despacho</span><b>{firstDispatch} min</b></div>
          <div><span>Despacho → primer arribo</span><b>{firstArrival-firstDispatch} min</b></div>
          <div><span>Primer arribo → combate</span><b>{firstCombat-firstArrival} min</b></div>
          <div><span>Recursos representados</span><b>{fire.resources.length}</b></div>
          <div><span>Combatientes representados</span><b>{totalCombatants}</b></div>
        </div>
        <div className="opResources">
          <h3>Recursos asignados</h3>
          {fire.resources.map(r=><div key={r.id}><span>{r.name}</span><b>{r.combatants}</b><small>{r.type}</small></div>)}
        </div>
      </aside>
    </section>

    <section className="opTimeline">
      <div><small>HISTORIA OPERACIONAL</small><h3>Hitos del incendio seleccionado</h3></div>
      {fire.resources.map(r=><ResourceTimeline key={r.id} resource={r}/>)}
    </section>

    <section className="opNote">
      <Info size={16}/>
      <p>El replay de esta versión usa datos demostrativos para validar la interacción. Al conectar movimientos reales, cada recurso se animará usando sus marcas temporales SIDCO. No se interpreta la línea animada como una trayectoria GPS real.</p>
    </section>
  </div>;
}
