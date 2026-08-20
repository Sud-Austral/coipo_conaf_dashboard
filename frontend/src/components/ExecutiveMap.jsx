import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import {
  MapContainer, TileLayer, LayersControl, LayerGroup,
  CircleMarker, Popup, Tooltip, Marker, useMap
} from "react-leaflet";
import { regions, provincesByRegion, communesByProvince, fires } from "../data/dashboardData.js";
import { flameHtml } from "./FlameIcon.jsx";

const { BaseLayer, Overlay } = LayersControl;

const priorityColor = v => v >= 85 ? "#a83d36" : v >= 70 ? "#d47c32" : v >= 55 ? "#d0aa36" : "#56856e";
const qualityColor = v => v >= 90 ? "#4f826a" : v >= 75 ? "#c9a83f" : v >= 60 ? "#d57d35" : "#ad4a43";

function FireMarker({fire, onSelectFire, onOpenBitacora}) {
  const size = Math.max(20, Math.min(58, 18 + Math.sqrt(Math.max(fire.ha,1)) / 2.6));
  const icon = useMemo(() => L.divIcon({
    className: "fireDivIcon",
    html: flameHtml(size),
    iconSize: [size,size],
    iconAnchor: [size/2,size]
  }), [size]);

  return (
    <Marker
      position={[fire.lat, fire.lon]}
      icon={icon}
      eventHandlers={{
        click: () => onSelectFire?.(fire),
        dblclick: (e) => {
          L.DomEvent.stopPropagation(e.originalEvent);
          onOpenBitacora?.(fire);
        }
      }}
    >
      <Tooltip direction="top" offset={[0,-size/2]} opacity={0.97}>
        <div className="fireTooltip">
          <b>Incendio · {fire.name}</b>
          <span>{fire.ha.toLocaleString("es-CL")} ha</span>
          <span>Estado: {fire.estado}</span>
          <span>Inicio: {fire.inicio}</span>
          <span>Confianza: {fire.confianza}%</span>
        </div>
      </Tooltip>
      <Popup>
        <b>{fire.name}</b><br/>
        {fire.ha.toLocaleString("es-CL")} ha<br/>
        {fire.estado}<br/>
        <small>Doble clic para abrir Bitácora</small>
      </Popup>
    </Marker>
  );
}

function MapNavigator({context}) {
  const map = useMap();
  useEffect(() => {
    if (!context || context.level === "country") {
      map.flyTo([-36.8,-72.4], 5, {duration:1.1});
      return;
    }
    if (context.lat && context.lon) {
      const zoom = context.level === "region" ? 7 : context.level === "province" ? 9 : 11;
      map.flyTo([context.lat,context.lon], zoom, {duration:1.05});
    }
  }, [context, map]);
  return null;
}

export default function ExecutiveMap({context, onTerritorySelect, onSelectFire, onOpenBitacora}) {
  const territoryData = context.level === "country"
    ? regions
    : context.level === "region"
      ? (provincesByRegion[context.id] || [])
      : context.level === "province"
        ? (communesByProvince[context.id] || [])
        : [];

  const visibleFires = fires.filter(f => {
    if(context.level === "country") return true;
    if(context.level === "region") return f.regionId === context.id;
    if(context.level === "province") return f.provinceId === context.id;
    if(context.level === "commune") return f.communeId === context.id;
    return true;
  });

  return (
    <section className="mapShell">
      <div className="mapHeading">
        <div>
          <h3>Mapa de situación</h3>
          <p>Hover informa · clic filtra · doble clic en llama abre Bitácora.</p>
        </div>
        <span className="mapBadge">Leaflet</span>
      </div>

      <MapContainer center={[-36.8,-72.4]} zoom={5} scrollWheelZoom>
        <MapNavigator context={context}/>

        <LayersControl position="topright">
          <BaseLayer checked name="Mapa claro">
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>
          <BaseLayer name="Satélite">
            <TileLayer
              attribution='Imagery &copy; Esri and contributors'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </BaseLayer>

          <Overlay checked name="Prioridad">
            <LayerGroup>
              {territoryData.map(t => (
                <CircleMarker
                  key={`priority-${t.id}`}
                  center={[t.lat,t.lon]}
                  radius={12 + (t.prioridad||50)/7}
                  pathOptions={{
                    color:priorityColor(t.prioridad||50),
                    fillColor:priorityColor(t.prioridad||50),
                    fillOpacity:.30, weight:2
                  }}
                  eventHandlers={{click:()=>onTerritorySelect?.(t)}}
                >
                  <Tooltip sticky>{t.name} · IPT {t.prioridad || "—"}</Tooltip>
                  <Popup>
                    <b>{t.name}</b><br/>
                    {t.incendios?.toLocaleString("es-CL") || "—"} incendios<br/>
                    {t.superficie?.toLocaleString("es-CL") || "—"} ha
                  </Popup>
                </CircleMarker>
              ))}
            </LayerGroup>
          </Overlay>

          <Overlay checked name="Incendios">
            <LayerGroup>
              {visibleFires.map(f => (
                <FireMarker
                  key={f.id}
                  fire={f}
                  onSelectFire={onSelectFire}
                  onOpenBitacora={onOpenBitacora}
                />
              ))}
            </LayerGroup>
          </Overlay>

          <Overlay name="Superficie">
            <LayerGroup>
              {territoryData.map(t => (
                <CircleMarker
                  key={`surface-${t.id}`}
                  center={[t.lat,t.lon]}
                  radius={8 + Math.sqrt(Math.max(t.superficie||0,1))/8}
                  pathOptions={{color:"#9d8235",fillColor:"#c8aa43",fillOpacity:.26,weight:2}}
                  eventHandlers={{click:()=>onTerritorySelect?.(t)}}
                >
                  <Tooltip sticky>{t.name} · {(t.superficie||0).toLocaleString("es-CL")} ha</Tooltip>
                </CircleMarker>
              ))}
            </LayerGroup>
          </Overlay>

          <Overlay name="Carga operacional">
            <LayerGroup>
              {regions.map(r => (
                <CircleMarker
                  key={`resource-${r.id}`}
                  center={[r.lat,r.lon]}
                  radius={8 + Math.sqrt(r.recursos)/5}
                  pathOptions={{color:"#55778f",fillColor:"#708fa5",fillOpacity:.28,weight:2}}
                >
                  <Tooltip sticky>{r.name} · carga agregada {r.recursos.toLocaleString("es-CL")}</Tooltip>
                </CircleMarker>
              ))}
            </LayerGroup>
          </Overlay>

          <Overlay name="Calidad del dato">
            <LayerGroup>
              {regions.map(r => (
                <CircleMarker
                  key={`quality-${r.id}`}
                  center={[r.lat,r.lon]}
                  radius={13}
                  pathOptions={{
                    color:qualityColor(r.calidad),
                    fillColor:qualityColor(r.calidad),
                    fillOpacity:.45,weight:2
                  }}
                >
                  <Tooltip sticky>{r.name} · calidad {r.calidad}%</Tooltip>
                </CircleMarker>
              ))}
            </LayerGroup>
          </Overlay>
        </LayersControl>
      </MapContainer>

      <div className="fireLegend">
        <span><i className="legendFlame sm">◆</i>&lt;10 ha</span>
        <span><i className="legendFlame md">◆</i>10–100 ha</span>
        <span><i className="legendFlame lg">◆</i>100–1.000 ha</span>
        <span><i className="legendFlame xl">◆</i>&gt;1.000 ha</span>
        <small>Tamaño de llama = superficie registrada</small>
      </div>
    </section>
  );
}
