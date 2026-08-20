import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, RotateCcw, SkipBack, Clock3 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip, useMap, LayersControl, LayerGroup } from "react-leaflet";
import L from "leaflet";
import CensusContextLayers from "./CensusContextLayers.jsx";
import EnvironmentalContextLayers from "./EnvironmentalContextLayers.jsx";

const { BaseLayer, Overlay } = LayersControl;

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

function FitFire({fire}){
  const map=useMap();
  useEffect(()=>{
    if(!fire) return;
    const pts=[...fire.resources.map(r=>r.base), [fire.lat,fire.lon]];
    map.flyToBounds(L.latLngBounds(pts),{padding:[40,40],duration:1.0});
  },[fire,map]);
  return null;
}

export default function OperationalReplayMap({fire,onFireChange,fireOptions=[]}){
  const [playing,setPlaying]=useState(false);
  const [time,setTime]=useState(0);
  const maxTime=useMemo(()=>Math.max(1,...fire.resources.flatMap(r=>r.events.map(e=>e.t))),[fire]);

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

  useEffect(()=>{setPlaying(false);setTime(0)},[fire.id]);

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
        <h3>{fire.name} · {fire.ha.toLocaleString("es-CL")} ha</h3>
        <p>Animación demostrativa basada en hitos temporales de movimiento.</p>
      </div>
      <select value={fire.id} onChange={e=>onFireChange?.(e.target.value)}>
        {fireOptions.map(f=><option key={f.id} value={f.id}>{f.name} · {f.id}</option>)}
      </select>
    </div>

    <div className="opReplayMap">
      <MapContainer center={[fire.lat,fire.lon]} zoom={9} scrollWheelZoom>
        <FitFire fire={fire}/>

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
              <CircleMarker center={[fire.lat,fire.lon]} radius={18} pathOptions={{color:"#a9423a",fillColor:"#d65749",fillOpacity:.72}}>
                <Tooltip permanent direction="top">🔥 {fire.name}</Tooltip>
                <Popup>{fire.ha.toLocaleString("es-CL")} ha · {fire.status}</Popup>
              </CircleMarker>
            </LayerGroup>
          </Overlay>

          <Overlay checked name="Recursos">
            <LayerGroup>
              {fire.resources.map(r=>{
                const s=resourceState(r);
                return <span key={r.id}>
                  <Polyline positions={[r.base,r.destination]} pathOptions={{weight:2,dashArray:"6 7",opacity:.45}}/>
                  <Marker position={s.pos} icon={iconFor(r.type,s.status==="En operación")}>
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
      {fire.resources.map(r=>{
        const current=[...r.events].reverse().find(e=>e.t<=time);
        return <div key={r.id}><b>{r.name}</b><span>{current ? `${current.label} · ${current.time}` : "En base"}</span><small>{r.combatants} combatientes</small></div>
      })}
    </div>
  </section>;
}
