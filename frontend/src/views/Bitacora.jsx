import { Printer, ArrowLeft, Copy, Map, Satellite, Truck, Building2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";
import { operationalReplayFires } from "../data/dashboardData.js";

const fireIcon=L.divIcon({className:"bitFireIcon",html:'<div style="font-size:28px">🔥</div>',iconSize:[30,30],iconAnchor:[15,25]});
const resourceIcon=L.divIcon({className:"bitResourceIcon",html:'<div class="bitResourceDot">●</div>',iconSize:[18,18],iconAnchor:[9,9]});

function MiniMap({type,fire}){
  const op=operationalReplayFires.find(x=>x.id===fire.id);
  const center=[fire.lat||op?.lat||-36.925556,fire.lon||op?.lon||-72.888056];
  return <div className="bitMapBox">
    <div className="bitMapLabel">
      {type==="normal"&&<Map size={14}/>}
      {type==="satellite"&&<Satellite size={14}/>}
      {type==="resources"&&<Truck size={14}/>}
      {type==="urban"&&<Building2 size={14}/>}
      <b>{type==="normal"?"Ubicación y contexto":type==="satellite"?"Vista satelital":type==="resources"?"Recursos en el sitio":"Contexto urbano/rural"}</b>
    </div>
    <MapContainer center={center} zoom={type==="urban"?11:10} zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} attributionControl={false}>
      {type==="satellite"
        ? <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>
        : <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>}
      <Marker position={center} icon={fireIcon}><Tooltip permanent direction="top">Incendio</Tooltip></Marker>
      {type==="resources" && op?.resources?.map(r=><span key={r.id}>
        <Polyline positions={[r.base,r.destination]} pathOptions={{weight:2,dashArray:"4 6",opacity:.55}}/>
        <Marker position={r.destination} icon={resourceIcon}><Tooltip>{r.name}</Tooltip></Marker>
      </span>)}
      {type==="urban" && <CircleMarker center={center} radius={70} pathOptions={{color:"#70787d",weight:1,dashArray:"5 6",fillOpacity:.02}}>
        <Tooltip direction="bottom">Área de análisis · capa oficial INE/IDE pendiente de conexión</Tooltip>
      </CircleMarker>}
    </MapContainer>
    {type==="urban"&&<small className="bitMapCaveat">La maqueta no inventa polígonos urbanos: el mapa queda preparado para recibir la capa oficial INE/IDE Chile.</small>}
  </div>;
}

function durationLabel(m){
  if(m<60) return `${m} min`;
  const h=Math.floor(m/60), r=m%60;
  return r?`${h} h ${r} min`:`${h} h`;
}

export default function Bitacora({fire,onBack}) {
  const f = fire || {id:"805149434",name:"Hualqui",lat:-36.925556,lon:-72.888056,ha:6943,estado:"Extinguido",inicio:"17 ene 2026 · 17:55",confianza:84};
  const op=operationalReplayFires.find(x=>x.id===f.id) || operationalReplayFires[0];
  const events=op?.resources?.[0]?.events || [];
  const copyText=()=>navigator.clipboard?.writeText(`Bitácora ${f.id} · ${f.name} · ${f.ha.toLocaleString("es-CL")} ha · ${f.estado}`);

  return (
    <article className="bitacoraSheet bitacoraV260">
      <div className="bitacoraActions noPrint">
        <button onClick={onBack}><ArrowLeft size={16}/> Volver</button>
        <button onClick={copyText}><Copy size={16}/> Copiar resumen</button>
        <button onClick={()=>window.print()}><Printer size={16}/> Imprimir / Guardar PDF</button>
      </div>

      <header>
        <small>BITÁCORA DEL INCENDIO</small>
        <h1>{f.id} · {f.name}</h1>
        <div className="bitHeaderMeta"><span>{f.estado}</span><b>{f.ha.toLocaleString("es-CL")} ha</b><span>{f.inicio}</span></div>
      </header>

      <section className="bitIntroGrid">
        <div>
          <h2>Resumen del evento</h2>
          <p>Durante la jornada se registró un incendio forestal en <b>{f.name}</b>. La superficie registrada alcanzó aproximadamente <b>{f.ha.toLocaleString("es-CL")} hectáreas</b>. La reconstrucción narrativa utiliza únicamente hechos disponibles en SIDCO.</p>
          <p>El evento figura con estado <b>{f.estado}</b>. Cuando una etapa operacional no cuenta con información suficiente, la bitácora lo declara explícitamente en lugar de completar el relato mediante supuestos.</p>
        </div>
        <aside className="bitQuickFacts">
          <small>EN UNA MIRADA</small>
          <div><span>Superficie</span><b>{f.ha.toLocaleString("es-CL")} ha</b></div>
          <div><span>Estado</span><b>{f.estado}</b></div>
          <div><span>Recursos representados</span><b>{op?.resources?.length||"—"}</b></div>
          <div><span>Fuente</span><b>SIDCO</b></div>
        </aside>
      </section>

      <section>
        <h2>Historia operacional</h2>
        <div className="bitTimeline">
          {events.map((e,i)=><div key={e.label} className="bitTimelineEvent">
            <div><i></i><b>{e.label}</b><small>{e.time}</small></div>
            {i<events.length-1&&<span>{durationLabel(events[i+1].t-e.t)}</span>}
          </div>)}
        </div>
      </section>

      <section>
        <h2>Contexto territorial y operacional</h2>
        <p className="bitSectionIntro">Cuatro lecturas del mismo evento para facilitar la comprensión espacial del informe impreso.</p>
        <div className="bitMapsGrid">
          <MiniMap type="normal" fire={f}/>
          <MiniMap type="satellite" fire={f}/>
          <MiniMap type="resources" fire={f}/>
          <MiniMap type="urban" fire={f}/>
        </div>
      </section>

      <section>
        <h2>Respuesta operacional</h2>
        <div className="bitResourceList">
          {(op?.resources||[]).map(r=><div key={r.id}><b>{r.name}</b><span>{r.type}</span><strong>{r.combatants} combatientes</strong></div>)}
        </div>
      </section>

      <section>
        <h2>Información utilizada</h2>
        <div className="bitSources"><span>Incendio ✓</span><span>Movimientos ✓</span><span>Recursos ✓</span><span>Daño · según cobertura</span><span>Urbano/rural · pendiente servicio oficial</span></div>
      </section>

      <footer>Fuente: SIDCO · Documento generado desde Forestin / COIPO Dashboard · v2.6.0</footer>
    </article>
  );
}
