import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, Polyline, Tooltip, Popup, LayersControl, LayerGroup, useMap } from "react-leaflet";
import L from "leaflet";
import CensusContextLayers from "./CensusContextLayers.jsx";
import EnvironmentalContextLayers from "./EnvironmentalContextLayers.jsx";
import { hasValidLatLng } from "../utils/mapData.js";
import ResourceBasesLayer from "./ResourceBasesLayer.jsx";

const {BaseLayer,Overlay}=LayersControl;

const fireIcon=L.divIcon({
  className:"exposureFireIcon",
  html:'<div class="exposureFire">🔥</div>',
  iconSize:[42,42],iconAnchor:[21,21]
});

const placeIcon=L.divIcon({
  className:"exposurePlaceIcon",
  html:'<div class="exposurePlace">🏘️</div>',
  iconSize:[34,34],iconAnchor:[17,17]
});


function FlyExposure({fire}){
  const map=useMap();
  useEffect(()=>{
    if(hasValidLatLng(fire)) map.flyTo([fire.lat,fire.lon],11,{duration:1.15});
  },[fire?.id,fire?.lat,fire?.lon,map]);
  return null;
}

export default function PopulationExposureMap({fire,nearest}){
  const safeFire = hasValidLatLng(fire) ? fire : { ...fire, lat:-33.45, lon:-70.66 };
  const nearestHasCoords =
    nearest?.lat !== null && nearest?.lat !== undefined && nearest?.lat !== "" &&
    nearest?.lon !== null && nearest?.lon !== undefined && nearest?.lon !== "" &&
    Number.isFinite(Number(nearest.lat)) && Number.isFinite(Number(nearest.lon));

  const safeNearest = nearestHasCoords
    ? nearest
    : { ...nearest, lat:safeFire.lat, lon:safeFire.lon };

  const center=[safeFire.lat,safeFire.lon];
  const place=[safeNearest.lat,safeNearest.lon];
  const lineColor =
    safeNearest.distanceKm <= 1 ? "#b53b32" :
    safeNearest.distanceKm <= 3 ? "#d9772f" :
    "#d4b13e";

  return <div className="populationExposureMap">
    <MapContainer center={center} zoom={11} scrollWheelZoom>
      <FlyExposure fire={safeFire}/>
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

        <Overlay checked name="Incendio y distancia">
          <LayerGroup>
            <Circle
              center={center}
              radius={1000}
              pathOptions={{color:"#b53b32",weight:2,fillColor:"#b53b32",fillOpacity:.055,dashArray:"5 4"}}
            >
              <Tooltip permanent direction="right">1 km · proximidad inmediata</Tooltip>
            </Circle>

            <Circle
              center={center}
              radius={3000}
              pathOptions={{color:"#d9772f",weight:2,fillColor:"#d9772f",fillOpacity:.035,dashArray:"6 5"}}
            >
              <Tooltip permanent direction="right">3 km · proximidad alta</Tooltip>
            </Circle>

            <Circle
              center={center}
              radius={5000}
              pathOptions={{color:"#d4b13e",weight:2,fillColor:"#d4b13e",fillOpacity:.022,dashArray:"7 6"}}
            >
              <Tooltip permanent direction="right">5 km · proximidad de contexto</Tooltip>
            </Circle>

            <Marker position={center} icon={fireIcon}>
              <Popup><b>{safeFire.name}</b><br/>{Number(safeFire.ha||0).toLocaleString("es-CL")} ha</Popup>
            </Marker>
            <Marker position={place} icon={placeIcon}><Tooltip permanent direction="top">{safeNearest.name} · {safeNearest.type}</Tooltip></Marker>
            <Polyline positions={[center,place]} pathOptions={{color:lineColor,weight:3,dashArray:"7 6"}}>
              <Tooltip permanent>{Number(safeNearest.distanceKm||0).toFixed(1).replace(".",",")} km</Tooltip>
            </Polyline>
          </LayerGroup>
        </Overlay>

        <Overlay checked name="Zonas urbanas">
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
  </div>;
}
