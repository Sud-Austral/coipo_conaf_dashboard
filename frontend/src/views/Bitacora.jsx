import { useState } from "react";
import { Printer, ArrowLeft, Copy, Map, Satellite, Truck, Building2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, LayersControl, LayerGroup, Circle } from "react-leaflet";
import L from "leaflet";
import { operationalReplayFires } from "../data/dashboardData.js";
import CensusContextLayers from "../components/CensusContextLayers.jsx";
import PopulationExposureMap from "../components/PopulationExposureMap.jsx";
import ResourceBasesLayer from "../components/ResourceBasesLayer.jsx";
import { hasValidLatLng } from "../utils/mapData.js";

const { BaseLayer, Overlay } = LayersControl;

const fireIcon=L.divIcon({className:"bitFireIcon",html:'<div style="font-size:28px">🔥</div>',iconSize:[30,30],iconAnchor:[15,25]});
const bitResourceIcon=(type)=>{
  const symbol = type==="aereo" ? "🚁" : type==="avion" ? "✈️" : type==="brigada" ? "🚙" : type==="terrestre" ? "🛻" : "👥";
  return L.divIcon({
    className:"bitResourceIcon",
    html:`<div class="bitResourceEmoji">${symbol}</div>`,
    iconSize:[28,28],
    iconAnchor:[14,14]
  });
};

function MiniMap({type,fire}){
  const op=operationalReplayFires.find(x=>x.id===fire.id);
  const safeFire = hasValidLatLng(fire)
    ? fire
    : (hasValidLatLng(op) ? op : {lat:-36.925556,lon:-72.888056});
  const center=[safeFire.lat,safeFire.lon];
  return <div className="bitMapBox">
    <div className="bitMapLabel">
      {type==="normal"&&<Map size={14}/>}
      {type==="satellite"&&<Satellite size={14}/>}
      {type==="resources"&&<Truck size={14}/>}
      {type==="urban"&&<Building2 size={14}/>}
      <b>{type==="normal"?"Ubicación y contexto":type==="satellite"?"Vista satelital":type==="resources"?"Recursos en el sitio":"Contexto urbano/rural · anillos de exposición"}</b>
    </div>
    <MapContainer center={center} zoom={type==="urban"?11:10} zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} attributionControl={false}>
      <LayersControl position="topright">
        <BaseLayer checked={type!=="satellite"} name="Mapa claro">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        </BaseLayer>
        <BaseLayer checked={type==="satellite"} name="Satélite">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>
        </BaseLayer>
        <BaseLayer name="Relieve">
          <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"/>
        </BaseLayer>

        <Overlay checked name="Incendio">
          <LayerGroup>
            {type==="urban"&&<>
              <Circle center={center} radius={1000} pathOptions={{color:"#b53b32",weight:2,fillColor:"#b53b32",fillOpacity:.05,dashArray:"5 4"}}><Tooltip permanent direction="right">1 km</Tooltip></Circle>
              <Circle center={center} radius={3000} pathOptions={{color:"#d9772f",weight:2,fillColor:"#d9772f",fillOpacity:.035,dashArray:"6 5"}}><Tooltip permanent direction="right">3 km</Tooltip></Circle>
              <Circle center={center} radius={5000} pathOptions={{color:"#d4b13e",weight:2,fillColor:"#d4b13e",fillOpacity:.02,dashArray:"7 6"}}><Tooltip permanent direction="right">5 km</Tooltip></Circle>
            </>}
            <Marker position={center} icon={fireIcon}/>
          </LayerGroup>
        </Overlay>

        <Overlay checked={type==="resources"} name="Recursos">
          <LayerGroup>
            {resourcePositionsAroundFire(center,op?.resources||[]).map(({resource:r,position})=><span key={r.id}>
              <Polyline
                positions={[position,center]}
                pathOptions={{weight:1.5,dashArray:"3 5",opacity:.42}}
              />
              <Marker position={position} icon={bitResourceIcon(r.type)}>
                <Tooltip direction="top">
                  <b>{r.name}</b><br/>{r.combatants} combatientes
                </Tooltip>
              </Marker>
            </span>)}
          </LayerGroup>
        </Overlay>

        <Overlay checked={type==="urban"} name="Zonas urbanas">
          <LayerGroup><CensusContextLayers showUrban minUrbanZoom={7}/></LayerGroup>
        </Overlay>

        <Overlay checked={type==="urban"} name="Localidades rurales">
          <LayerGroup><CensusContextLayers showRural minRuralZoom={9}/></LayerGroup>
        </Overlay>

        <Overlay checked={type==="resources"} name="Bases de recursos">
          <LayerGroup><ResourceBasesLayer/></LayerGroup>
        </Overlay>
      </LayersControl>
    </MapContainer>
    {type==="urban"&&<small className="bitMapCaveat">Contexto urbano/rural disponible desde el selector de capas.</small>}
  </div>;
}

function durationLabel(m){
  if(m<60) return `${m} min`;
  const h=Math.floor(m/60), r=m%60;
  return r?`${h} h ${r} min`:`${h} h`;
}

function resourcePositionsAroundFire(center,resources=[]){
  if(!resources.length) return [];

  const [lat,lon]=center;
  const radiusLat=0.0105;
  const radiusLon=0.0135;

  return resources.map((resource,index)=>{
    const angle=(Math.PI*2*index/resources.length) - Math.PI/2;
    return {
      resource,
      position:[
        lat + Math.sin(angle)*radiusLat,
        lon + Math.cos(angle)*radiusLon
      ]
    };
  });
}

export default function Bitacora({fire,onBack}) {
  const [includeOperationalPdf,setIncludeOperationalPdf]=useState(false);
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
          <p>Durante la jornada se registró un incendio forestal en <b>{f.name}</b>. La superficie registrada alcanzó aproximadamente <b>{f.ha.toLocaleString("es-CL")} hectáreas</b>.</p>
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

      
      <section className="bitOperationalHistory">
        <h2>Historia operacional</h2>

        {/* Pantalla: línea horizontal interactiva/compacta */}
        <div className="bitTimeline noPrint">
          {events.map((e,i)=><div key={e.label} className="bitTimelineEvent">
            <div><i></i><b>{e.label}</b><small>{e.time}</small></div>
            {i<events.length-1&&<span>{durationLabel(events[i+1].t-e.t)}</span>}
          </div>)}
        </div>

        {/* Impresión/PDF: secuencia vertical, sin scroll ni barras */}
        <div className="bitTimelinePrint printOnly">
          {events.map((e,i)=><div key={`print-${e.label}`} className="bitPrintEvent">
            <div className="bitPrintNode">
              <i></i>
              <div>
                <b>{e.label}</b>
                <small>{e.time}</small>
              </div>
            </div>
            {i<events.length-1&&
              <div className="bitPrintDuration">
                <span>{durationLabel(events[i+1].t-e.t)}</span>
              </div>
            }
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

      <section className="bitResponseOperational">
        <h2>Respuesta operacional</h2>
        <p className="bitSectionIntro">Hitos de cada recurso participante y duración total registrada.</p>
        <label className="bitPdfOperationalToggle noPrint">
          <input type="checkbox" checked={includeOperationalPdf} onChange={e=>setIncludeOperationalPdf(e.target.checked)}/>
          <span>Agregar esta información al PDF</span>
        </label>
        <div className={`bitResourceHistories ${includeOperationalPdf?"includeInPdf":"excludeFromPdf"}`}>
          {(op?.resources||[]).map(r=>{
            const ev=r.events||[];
            const first=ev.length?Math.min(...ev.map(e=>e.t)):0;
            const last=ev.length?Math.max(...ev.map(e=>e.t)):0;
            return <article key={r.id} className="bitResourceHistory">
              <div className="bitResourceHistoryHead">
                <div><b>{r.name}</b><small>{r.type} · {r.combatants} combatientes</small></div>
                <strong>{durationLabel(last-first)}</strong>
              </div>
              <div className="bitResourceHistoryLine noPrint">
                {ev.map((e,i)=><span key={`${r.id}-${e.label}`} style={{left:`${((e.t-first)/Math.max(1,last-first))*100}%`,"--lane":i%2}}>
                  <i/><b>{e.label}</b><small>{e.time}</small>
                </span>)}
              </div>
              <div className="bitResourceHistoryPrint printOnly">
                {ev.map((e,i)=><div key={`pdf-${r.id}-${e.label}`}>
                  <span><b>{e.label}</b><small>{e.time}</small></span>
                  {i<ev.length-1&&<em>{durationLabel(ev[i+1].t-e.t)}</em>}
                </div>)}
              </div>
            </article>;
          })}
        </div>
      </section>

      <section>
        <h2>Información utilizada</h2>
        <div className="bitSources"><span>Incendio ✓</span><span>Movimientos ✓</span><span>Recursos ✓</span><span>Daño · según cobertura</span><span>Urbano/rural · pendiente servicio oficial</span></div>
      </section>

      <footer>Fuente: SIDCO · Documento generado desde Forestin / COIPO Dashboard · v2.8.8</footer>
    </article>
  );
}
