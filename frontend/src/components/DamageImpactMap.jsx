import { useEffect, useMemo, useState } from "react";
import { Layers3, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { fires, regions } from "../data/dashboardData.js";
import { loadRegionGeoJSON } from "../data/regionGeoJson.js";
import CensusContextLayers from "./CensusContextLayers.jsx";

const flameIcon = ha => {
  const size=Math.max(25,Math.min(58,24+Math.sqrt(Math.max(ha,0))/3));
  return L.divIcon({
    className:"damageFireIcon",
    html:`<div style="font-size:${size}px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.32))">🔥</div>`,
    iconSize:[size,size],
    iconAnchor:[size/2,size*.88]
  });
};

function FlyToSelection({regionId}){
  const map=useMap();
  useEffect(()=>{
    const r=regions.find(x=>String(x.id)===String(regionId));
    if(r) map.flyTo([r.lat,r.lon],7.3,{duration:1.0});
    else map.flyTo([-36.4,-71.4],5.25,{duration:1.0});
  },[regionId,map]);
  return null;
}

export default function DamageImpactMap({selectedRegion,onSelectRegion,onOpenBitacora}){
  const [geo,setGeo]=useState(null);
  const [base,setBase]=useState("normal");
  const [urban,setUrban]=useState(false);
  const [rural,setRural]=useState(false);
  const [censusStatus,setCensusStatus]=useState({urban:"off",rural:"off"});

  useEffect(()=>{
    let alive=true;
    loadRegionGeoJSON().then(g=>alive&&setGeo(g)).catch(()=>{});
    return ()=>{alive=false};
  },[]);

  const shownFires=useMemo(
    ()=>selectedRegion ? fires.filter(f=>String(f.regionId)===String(selectedRegion)) : fires,
    [selectedRegion]
  );

  const styleFeature=feature=>{
    const id=feature?.properties?.__regionId;
    const r=regions.find(x=>String(x.id)===String(id));
    const intensity=r ? Math.min(1,(r.superficie||0)/62290) : .08;
    const selected=String(id)===String(selectedRegion);
    return {
      color:selected?"#3e4b52":"#6d767b",
      weight:selected?2.5:1,
      fillColor:"#b96049",
      fillOpacity:r ? .12 + intensity*.45 : .04
    };
  };

  return <section className="damageMapCard">
    <div className="damageMapHeader">
      <div><small>MAPA DE IMPACTO</small><h3>Concentración territorial del daño</h3><p>Polígono territorial + incendios dimensionados por superficie.</p></div>
      <div className="damageMapBase">
        <button className={base==="normal"?"active":""} onClick={()=>setBase("normal")}>Claro</button>
        <button className={base==="satellite"?"active":""} onClick={()=>setBase("satellite")}>Satélite</button>
        <button className={base==="relief"?"active":""} onClick={()=>setBase("relief")}>Relieve</button>
      </div>
    </div>
    <div className="damageLayerBar">
      <span><Layers3 size={14}/> Capas</span>
      <button className="active">Incendios</button>
      <button className="active">Superficie</button>
      <button className="active">&gt;400 ha</button>
      <button className={urban?"active":""} onClick={()=>setUrban(v=>!v)}>Zonas urbanas</button>
      <button className={rural?"active":""} onClick={()=>setRural(v=>!v)}>Localidades rurales</button>
    </div>
    <div className="damageMap">
      <MapContainer center={[-36.4,-71.4]} zoom={5.25} scrollWheelZoom>
        <FlyToSelection regionId={selectedRegion}/>
        {base==="normal" && <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>}
        {base==="satellite" && <TileLayer attribution="Esri" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>}
        {base==="relief" && <TileLayer attribution="OpenTopoMap" url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"/>}
        {geo && <GeoJSON key={`${selectedRegion||"all"}-${base}`} data={geo} style={styleFeature}
          onEachFeature={(feature,layer)=>{
            const id=feature?.properties?.__regionId;
            const r=regions.find(x=>String(x.id)===String(id));
            if(r){
              layer.bindTooltip(`${r.name} · ${(r.superficie||0).toLocaleString("es-CL")} ha registradas`);
              layer.on("click",()=>onSelectRegion?.(id));
            }
          }}
        />}
        {shownFires.map(f=><Marker key={f.id} position={[f.lat,f.lon]} icon={flameIcon(f.ha)}
          eventHandlers={{dblclick:()=>onOpenBitacora?.(f)}}>
          <Tooltip direction="top" offset={[0,-20]}>
            <div className="fireTooltip"><b>{f.name}</b><span>{f.ha.toLocaleString("es-CL")} ha</span><small>Doble clic → Bitácora</small></div>
          </Tooltip>
          <Popup><b>{f.name}</b><br/>{f.ha.toLocaleString("es-CL")} ha<br/>{f.estado}</Popup>
        </Marker>)}

        <CensusContextLayers
          showUrban={urban}
          showRural={rural}
          minUrbanZoom={7}
          minRuralZoom={9}
          onStatusChange={setCensusStatus}
        />
      </MapContainer>

      {(urban||rural) && <div className="officialLayerNotice">
        <MapPin size={14}/>
        <span>
          {urban && censusStatus.urban==="zoom" && "Zonas urbanas: acerca el mapa para cargar geometrías reales. "}
          {rural && censusStatus.rural==="zoom" && "Localidades rurales: acerca el mapa a nivel comunal para cargar geometrías reales. "}
          {urban && String(censusStatus.urban).startsWith("ok:") && `Zonas urbanas cargadas: ${String(censusStatus.urban).split(":")[1]}. `}
          {rural && String(censusStatus.rural).startsWith("ok:") && `Entidades rurales cargadas: ${String(censusStatus.rural).split(":")[1]}. `}
          {(censusStatus.urban==="error"||censusStatus.rural==="error") && "No fue posible consultar temporalmente el servicio cartográfico."}
        </span>
      </div>}
    </div>
  </section>;
}
