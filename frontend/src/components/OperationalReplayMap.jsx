import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, SkipBack, Clock3 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip, useMap, LayersControl, LayerGroup } from "react-leaflet";
import L from "leaflet";
import CensusContextLayers from "./CensusContextLayers.jsx";
import EnvironmentalContextLayers from "./EnvironmentalContextLayers.jsx";
import ResourceBasesLayer from "./ResourceBasesLayer.jsx";
import { hasValidLatLng } from "../utils/mapData.js";

const { BaseLayer, Overlay } = LayersControl;

const validPair = (p) =>
  Array.isArray(p) &&
  p.length >= 2 &&
  Number.isFinite(Number(p[0])) &&
  Number.isFinite(Number(p[1]));

const validResource = (r) =>
  r && validPair(r.base) && validPair(r.destination) && Array.isArray(r.events);

const iconFor = (type, active=false) => {
  const symbol =
    type==="aereo" ? "🚁" :
    type==="avion" ? "✈️" :
    type==="brigada" ? "🚙" :
    type==="terrestre" ? "🛻" :
    type==="personal" ? "👥" : "🚐";

  const label =
    type==="aereo" ? "Helicóptero" :
    type==="avion" ? "Avión" :
    type==="brigada" ? "Brigada" :
    type==="terrestre" ? "Recurso terrestre" :
    type==="personal" ? "Personal" : "Recurso";

  return L.divIcon({
    className:"opResourceIcon",
    html:`<div class="opResourceEmoji ${active?"active":""}" title="${label}">${symbol}</div>`,
    iconSize:[38,38],
    iconAnchor:[19,19]
  });
};

function interpolate(a,b,p){
  return [a[0] + (b[0]-a[0])*p, a[1] + (b[1]-a[1])*p];
}

const offsetAroundFire=(destination,index,total)=>{
  if(!destination || total<=1) return destination;
  const angle=(Math.PI*2*index/total)-Math.PI/2;
  return [
    destination[0] + Math.sin(angle)*0.0085,
    destination[1] + Math.cos(angle)*0.0105
  ];
};

function FitFire({fire}){
  const map=useMap();
  useEffect(()=>{
    if(!fire || !hasValidLatLng(fire)) return;
    const pts=[
      ...(fire.resources||[]).filter(validResource).map(r=>r.base),
      [fire.lat,fire.lon]
    ].filter(validPair);
    if(!pts.length) return;
    const bounds=L.latLngBounds(pts);
    if(bounds.isValid()) map.flyToBounds(bounds,{padding:[40,40],duration:1.0});
  },[fire,map]);
  return null;
}

export default function OperationalReplayMap({fire,onFireChange,fireOptions=[]}){
  const safeFire = hasValidLatLng(fire)
    ? fire
    : { ...(fire||{}), lat:-33.45, lon:-70.66, resources:[] };
  const safeResources=(safeFire.resources||[]).filter(validResource);

  const [playing,setPlaying]=useState(false);
  const [time,setTime]=useState(0);
  const maxTime=useMemo(()=>Math.max(1,...safeResources.flatMap(r=>r.events.map(e=>Number(e.t)||0))),[safeFire.id]);

  useEffect(()=>{
    if(!playing) return;
    const id=setInterval(()=>{
      setTime(v=>{
        if(v>=maxTime){setPlaying(false);return maxTime;}
        return Math.min(maxTime,v+2);
      });
    },120);
    return ()=>clearInterval(id);
  },[playing,maxTime]);

  useEffect(()=>{setPlaying(false);setTime(0)},[safeFire.id]);

  const resourceState = r => {
    const dispatch=r.events.find(e=>e.label==="Despacho")?.t ?? 0;
    const arrival=r.events.find(e=>e.label==="Arribo")?.t ?? maxTime;
    const retreat=r.events.find(e=>e.label==="Retiro")?.t ?? maxTime;
    if(time<dispatch) return {pos:r.base,status:"En base",progress:0};
    if(time<=arrival){
      const p=Math.max(0,Math.min(1,(time-dispatch)/Math.max(1,arrival-dispatch)));
      return {pos:interpolate(r.base,r.destination,p),status:"En desplazamiento",progress:p};
    }
    if(time<retreat) return {pos:r.destination,status:"En operación",progress:1};
    return {pos:r.base,status:"Retirado",progress:1};
  };

  const elapsedLabel = `${Math.floor(time/60)}h ${String(Math.round(time%60)).padStart(2,"0")}m`;

  return <section className="opMapShell">
    <div className="opMapHead">
      <div>
        <small>REPLAY OPERACIONAL</small>
        <h3>{safeFire.name} · {Number(safeFire.ha||0).toLocaleString("es-CL")} ha</h3>
        <p>Hitos temporales SIDCO reales · Base → Incendio es interpolación visual entre puntos conocidos.</p>
      </div>
      <select value={safeFire.id} onChange={e=>onFireChange?.(e.target.value)}>
        {fireOptions.map(f=><option key={f.id} value={f.id}>{f.name} · {f.id}</option>)}
      </select>
    </div>

    <div className="opReplayMap">
      <MapContainer center={[safeFire.lat,safeFire.lon]} zoom={9} scrollWheelZoom>
        <FitFire fire={{...safeFire,resources:safeResources}}/>

        <LayersControl position="topright">
          <BaseLayer checked name="Mapa claro">
            <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          </BaseLayer>

          <BaseLayer name="Satélite">
            <TileLayer attribution="Imagery &copy; Esri" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>
          </BaseLayer>

          <BaseLayer name="Relieve">
            <TileLayer attribution="&copy; OpenTopoMap contributors" url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"/>
          </BaseLayer>

          <Overlay checked name="Incendio">
            <LayerGroup>
              <CircleMarker center={[safeFire.lat,safeFire.lon]} radius={18} pathOptions={{color:"#a9423a",fillColor:"#d65749",fillOpacity:.72}}>
                
                <Popup>{Number(safeFire.ha||0).toLocaleString("es-CL")} ha · {safeFire.status}</Popup>
              </CircleMarker>
            </LayerGroup>
          </Overlay>

          <Overlay checked name="Recursos">
            <LayerGroup>
              {safeResources.map((r,index)=>{
                const s=resourceState(r);
                const displayPos = s.status==="En operación"
                  ? offsetAroundFire(s.pos,index,safeResources.length)
                  : s.pos;
                return <span key={r.id}>
                  <Polyline positions={[r.base,r.destination]} pathOptions={{weight:2,dashArray:"6 7",opacity:.45}}/>
                  <Marker position={displayPos} icon={iconFor(r.type,s.status==="En operación")}>
                    <Tooltip>
                      <div className="resourceTooltip">
                        <b>{r.name}</b>
                        <span>{r.type==="aereo"?"Helicóptero":r.type==="brigada"?"Brigada":r.type==="terrestre"?"Recurso terrestre":r.type}</span>
                        <span>{r.combatants} combatientes</span>
                        <span>{s.status}</span>
                      </div>
                    </Tooltip>
                    <Popup><b>{r.name}</b><br/>{r.combatants} combatientes<br/>{s.status}</Popup>
                  </Marker>
                </span>;
              })}
            </LayerGroup>
          </Overlay>

          <Overlay name="Zonas urbanas">
            <LayerGroup><CensusContextLayers showUrban minUrbanZoom={7}/></LayerGroup>
          </Overlay>

          <Overlay name="Localidades rurales">
            <LayerGroup><CensusContextLayers showRural minRuralZoom={9}/></LayerGroup>
          </Overlay>

          <Overlay name="Bosques / vegetación natural">
            <LayerGroup><EnvironmentalContextLayers showForest/></LayerGroup>
          </Overlay>
          <Overlay name="Áreas protegidas">
            <LayerGroup><EnvironmentalContextLayers showProtected/></LayerGroup>
          </Overlay>
          <Overlay name="Otros usos de suelo">
            <LayerGroup><EnvironmentalContextLayers showOtherLand/></LayerGroup>
          </Overlay>

          <Overlay name="Bases de recursos">
            <LayerGroup><ResourceBasesLayer/></LayerGroup>
          </Overlay>
        </LayersControl>
      </MapContainer>
    </div>

    <div className="replayControls">
      <button onClick={()=>{setPlaying(false);setTime(0)}} title="Reiniciar"><RotateCcw size={16}/></button>
      <button className="playButton" onClick={()=>setPlaying(v=>!v)}>{playing?<Pause size={17}/>:<Play size={17}/>} {playing?"Pausa":"Play"}</button>
      <input type="range" min="0" max={maxTime} value={time} onChange={e=>{setPlaying(false);setTime(Number(e.target.value))}}/>
      <span><Clock3 size={15}/>{elapsedLabel}</span>
    </div>

    <div className="replayEvents">
      {safeResources.map((r,index)=>{
        const current=[...r.events].reverse().find(e=>e.t<=time);
        return <div key={r.id}><b>{r.name}</b><span>{current ? `${current.label} · ${current.time}` : "En base"}</span><small>{r.combatants} combatientes</small></div>
      })}
    </div>
  </section>;
}
