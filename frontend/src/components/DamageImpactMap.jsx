import { useEffect, useMemo, useState } from "react";
import { Layers3, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, GeoJSON, useMap, LayersControl, LayerGroup } from "react-leaflet";
import L from "leaflet";
import { fires, regions } from "../data/dashboardData.js";
import { loadRegionGeoJSON } from "../data/regionGeoJson.js";
import CensusContextLayers from "./CensusContextLayers.jsx";
import EnvironmentalContextLayers from "./EnvironmentalContextLayers.jsx";
import ResourceBasesLayer from "./ResourceBasesLayer.jsx";
import { hasValidLatLng } from "../utils/mapData.js";

const { BaseLayer, Overlay } = LayersControl;

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
    if(r && hasValidLatLng(r)) map.flyTo([r.lat,r.lon],7.3,{duration:1.0});
    else map.flyTo([-36.4,-71.4],5.25,{duration:1.0});
  },[regionId,map]);
  return null;
}

export default function DamageImpactMap({selectedRegion,onSelectRegion,onOpenBitacora}){
  const [geo,setGeo]=useState(null);

  useEffect(()=>{
    let alive=true;
    loadRegionGeoJSON().then(g=>alive&&setGeo(g)).catch(()=>{});
    return ()=>{alive=false};
  },[]);

  const shownFires=useMemo(
    ()=>fires.filter(f =>
      hasValidLatLng(f) &&
      (!selectedRegion || String(f.regionId)===String(selectedRegion))
    ),
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
    </div>
<div className="damageMap">
      <MapContainer center={[-36.4,-71.4]} zoom={5.25} scrollWheelZoom>
        <FlyToSelection regionId={selectedRegion}/>

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

          <Overlay checked name="Impacto territorial">
            <LayerGroup>
              {geo && <GeoJSON
                key={`${selectedRegion||"all"}-impact`}
                data={geo}
                style={styleFeature}
                onEachFeature={(feature,layer)=>{
                  const id=feature?.properties?.__regionId;
                  const r=regions.find(x=>String(x.id)===String(id));
                  if(r){
                    layer.bindTooltip(`${r.name} · ${(r.superficie||0).toLocaleString("es-CL")} ha registradas`);
                    layer.on("click",()=>onSelectRegion?.(id));
                  }
                }}
              />}
            </LayerGroup>
          </Overlay>

          <Overlay checked name="Incendios">
            <LayerGroup>
              {shownFires.map(f=><Marker key={f.id} position={[f.lat,f.lon]} icon={flameIcon(f.ha)}
                eventHandlers={{dblclick:()=>onOpenBitacora?.(f)}}>
                <Tooltip direction="top" offset={[0,-20]}>
                  <div className="fireTooltip"><b>{f.name}</b><span>{f.ha.toLocaleString("es-CL")} ha</span><small>Doble clic → Bitácora</small></div>
                </Tooltip>
                <Popup><b>{f.name}</b><br/>{f.ha.toLocaleString("es-CL")} ha<br/>{f.estado}</Popup>
              </Marker>)}
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
  </section>;
}
