import { useMemo, useState } from "react";
import { Info, Gauge, Users, Truck, Flame, Clock, Activity } from "lucide-react";
import OperationalReplayMap from "./OperationalReplayMap.jsx";
import KpiInfo from "./KpiInfo.jsx";
import { operationalSummary, operationalReplayFires } from "../data/dashboardData.js";
import { operationalFireLifecycleReal } from "../data/operationalFireLifecycle.real.js";


function formatDuration(minutes){
  const m=Math.max(0,Math.round(minutes));
  if(m<60) return `${m} min`;
  const h=Math.floor(m/60);
  const rest=m%60;
  return rest ? `${h} h ${rest} min` : `${h} h`;
}

function formatLongDuration(minutes){
  const m=Math.max(0,Math.round(minutes||0));
  if(m<60) return `${m} min`;
  if(m<1440) return formatDuration(m);
  const days=Math.floor(m/1440);
  const rest=m%1440;
  const hours=Math.floor(rest/60);
  return hours ? `${days} d ${hours} h` : `${days} días`;
}

function dateLabel(value){
  if(!value) return "Activo";
  const d=new Date(value);
  return d.toLocaleDateString("es-CL",{day:"2-digit",month:"short",year:"numeric"})+
    " · "+d.toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"});
}

function FireTimeline({meta}){
  const events=meta?.events||[];
  if(!events.length) return <p className="timelineUnavailable">Sin hitos de incendio disponibles.</p>;

  const times=events.map(e=>new Date(e.datetime).getTime());
  const start=Math.min(...times);
  const end=Math.max(...times);
  const durationMinutes=Math.max(0,(end-start)/60000);
  const span=Math.max(1,end-start);

  return <article className="fireMasterTimeline">
    <div className="fireTimelineDates">
      <span><small>PRIMER DESPACHO</small><b>{dateLabel(meta?.firstDispatch||meta?.start)}</b></span>
      <span><small>{meta?.active?"ESTADO":"TÉRMINO"}</small><b>{meta?.active?"Activo":dateLabel(meta?.end)}</b></span>
    </div>
    <div className="fireTimelineTrack">
      <div className="fireTimelineGradient"/>
      {events.map(e=>{
        const at=new Date(e.datetime).getTime();
        const left=((at-start)/span)*100;
        return <span key={`${e.label}-${e.datetime}`} className="fireMasterEvent" style={{left:`${left}%`,"--lane":events.indexOf(e)%3}}>
          <i/>
          <em>{e.label}</em>
          <small>{dateLabel(e.datetime)}</small>
        </span>;
      })}
      <strong className="fireTimelineTotal">{formatLongDuration(durationMinutes)}</strong>
    </div>
  </article>;
}

function ResourceTimeline({resource}){
  const events=resource.events || [];
  const max=Math.max(1,...events.map(e=>e.t));
  const first=Math.min(...events.map(e=>e.t));
  const last=Math.max(...events.map(e=>e.t));
  return (
    <article className="resourceTimeline selectedResourceTimeline">
      <b>{resource.name}<small>Duración visible · {formatLongDuration(last-first)}</small></b>
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
        <strong className="resourceTimelineTotal">{formatLongDuration(last-first)}</strong>
      </div>
    </article>
  );
}


function Kpi({icon:Icon,label,value,sub,detail,coverage,source,confidence}){
  return <article className="opKpi">
    <div className="opKpiTitle">
      <span><Icon size={17}/>{label}</span>
      <KpiInfo label={label} detail={detail || sub} coverage={coverage} source={source} confidence={confidence}/>
    </div>
    <strong>{value}</strong>
    <small>{sub}</small>
  </article>;
}

export default function OperationsView(){
  const [fireId,setFireId]=useState(operationalReplayFires[0].id);
  const [selectedResourceId,setSelectedResourceId]=useState(null);
  const fire=useMemo(()=>operationalReplayFires.find(f=>f.id===fireId)||operationalReplayFires[0],[fireId]);
  const lifecycle=operationalFireLifecycleReal[fire.id]||null;
  const selectedResource=fire.resources.find(r=>String(r.id)===String(selectedResourceId))||null;

  const totalCombatants=fire.resources.reduce((a,r)=>a+r.combatants,0);
  const firstDispatch=Math.min(...fire.resources.map(r=>r.events.find(e=>e.label==="Despacho")?.t ?? 9999));
  const firstArrival=Math.min(...fire.resources.map(r=>r.events.find(e=>e.label==="Arribo")?.t ?? 9999));
  const firstCombat=Math.min(...fire.resources.map(r=>r.events.find(e=>e.label==="Inicio combate")?.t ?? 9999));

  return <div className="operationsView">
    <section className="executiveReading executiveReadingAligned">
      <p>La vista operacional muestra cómo se movilizan recursos y personal, dónde se concentra el esfuerzo y cuánto demora la respuesta. El replay permite reconstruir de forma visual los hitos disponibles del incendio seleccionado.</p>
      <div className="readingMeta"><span>Foco operacional: {fire.name}</span><strong>{fire.resources.length} recursos representados · {totalCombatants} combatientes</strong></div>
    </section>

    <section className="opKpis">
      <Kpi icon={Truck} label="Recursos movilizados" value={operationalSummary.recursosMovilizados.toLocaleString("es-CL")} sub="Recursos distintos" detail="Cantidad de recursos internos distintos que registran actividad operacional." source="SIDCO · recurso + movimiento"/>
      <Kpi icon={Users} label="Personal movilizado" value={operationalSummary.personalMovilizado.toLocaleString("es-CL")} sub="Combatientes informados" detail="Suma del personal/combatientes informado en movimientos." source="SIDCO · movimiento.movi_nro_combatientes / movi_personal"/>
      <Kpi icon={Flame} label="Incendios atendidos" value={operationalSummary.incendiosAtendidos.toLocaleString("es-CL")} sub="Con movimiento registrado" detail="Incendios que poseen al menos un registro operacional asociado." source="SIDCO · public.movimiento"/>
      <Kpi icon={Clock} label="Despacho → arribo" value={`${operationalSummary.medianaDespachoArribo} min`} sub="Mediana temporada" detail="Mediana del tiempo entre despacho y arribo para registros utilizables." source="SIDCO · movi_fecha_despacho → movi_fecha_arribo"/>
      <Kpi icon={Activity} label="Arribo → combate" value={`${operationalSummary.medianaArriboCombate} min`} sub="Mediana temporada" detail="Mediana del tiempo desde arribo hasta inicio de combate." source="SIDCO · movi_fecha_arribo → movi_fecha_inicio_combate"/>
      <Kpi icon={Gauge} label="Primer ataque → control" value={`${operationalSummary.medianaPrimerAtaqueControl} min`} sub="Mediana temporada" detail="Mediana del tiempo entre primer ataque y control en registros con ambas marcas temporales." source="SIDCO · incendio · fechas operacionales"/>
    </section>

    <section className="opMainGrid">
      <OperationalReplayMap fire={fire} fireOptions={operationalReplayFires} selectedResourceId={selectedResourceId} onSelectResource={setSelectedResourceId} onFireChange={(id)=>{setFireId(id);setSelectedResourceId(null)}}/>
      <aside className="opSide">
        <div className="opIncident">
          <small>INCENDIO SELECCIONADO</small>
          <h3>{fire.name}</h3>
          <b>{fire.ha.toLocaleString("es-CL")} ha</b>
          <p>{fire.region} · {fire.status}</p>
          <div className="opIncidentDates">
            <span><small>Inicio</small><b>{dateLabel(lifecycle?.start)}</b></span>
            <i>/</i>
            <span><small>Término</small><b>{lifecycle?.end ? dateLabel(lifecycle.end) : "Activo"}</b></span>
          </div>
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
          <p className="opResourcesHint">El filtro de Historia operacional se selecciona en las tarjetas bajo el mapa.</p>
          {fire.resources.map(r=><div key={r.id}><span>{r.name}</span><b>{r.combatants}</b><small>{r.type}</small></div>)}
        </div>
      </aside>
    </section>

    <section className="opTimeline">
      <div>
        <small>HISTORIA OPERACIONAL</small>
        <h3>Hitos del incendio seleccionado</h3>
        <p>La línea principal pertenece al incendio completo. La línea de recurso aparece solo cuando seleccionas uno de los recursos asignados.</p>
      </div>

      <FireTimeline meta={lifecycle}/>

      {selectedResource && <div className="resourceTimelineFiltered">
        <div className="resourceTimelineFilteredHead">
          <small>RECURSO SELECCIONADO</small>
          <button onClick={()=>setSelectedResourceId(null)}>Cerrar filtro</button>
        </div>
        <ResourceTimeline resource={selectedResource}/>
      </div>}
    </section>

    <section className="opNote">
      <Info size={16}/>
      <p>El replay utiliza hitos temporales SIDCO reales. Cuando existe una base georreferenciada, la animación interpola visualmente Base → Incendio entre dos puntos conocidos; no representa una trayectoria GPS histórica.</p>
    </section>
  </div>;
}
