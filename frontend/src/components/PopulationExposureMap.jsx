import { MapContainer, TileLayer, Marker, Circle, Polyline, Tooltip, Popup, LayersControl, LayerGroup } from "react-leaflet";
import L from "leaflet";
import CensusContextLayers from "./CensusContextLayers.jsx";
import EnvironmentalContextLayers from "./EnvironmentalContextLayers.jsx";

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

export default function PopulationExposureMap({fire,nearest}){
  const center=[fire.lat,fire.lon];
  const place=[nearest.lat,nearest.lon];

  return <div className="populationExposureMap">
    <MapContainer center={center} zoom={11} scrollWheelZoom>
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
            <Circle center={center} radius={1000} pathOptions={{color:"#7c8589",weight:1,fillOpacity:.025,dashArray:"4 4"}}><Tooltip permanent>1 km</Tooltip></Circle>
            <Circle center={center} radius={3000} pathOptions={{color:"#7c8589",weight:1,fillOpacity:.018,dashArray:"5 5"}}><Tooltip permanent>3 km</Tooltip></Circle>
            <Circle center={center} radius={5000} pathOptions={{color:"#7c8589",weight:1,fillOpacity:.012,dashArray:"6 6"}}><Tooltip permanent>5 km</Tooltip></Circle>
            <Marker position={center} icon={fireIcon}><Popup><b>{fire.name}</b><br/>{fire.ha.toLocaleString("es-CL")} ha</Popup></Marker>
            <Marker position={place} icon={placeIcon}><Tooltip permanent direction="top">{nearest.name} · {nearest.type}</Tooltip></Marker>
            <Polyline positions={[center,place]} pathOptions={{color:"#5c6870",weight:2,dashArray:"7 6"}}>
              <Tooltip permanent>{nearest.distanceKm.toFixed(1).replace(".",",")} km</Tooltip>
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
      </LayersControl>
    </MapContainer>
  </div>;
}
