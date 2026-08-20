import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer, TileLayer, LayersControl, LayerGroup,
  CircleMarker, Popup, Tooltip, Marker, GeoJSON, useMap
} from "react-leaflet";
import {
  regions, provincesByRegion, communesByProvince, fires
} from "../data/dashboardData.js";
import { loadRegionGeoJSON } from "../data/regionGeoJson.js";
import { flameHtml } from "./FlameIcon.jsx";
import CensusContextLayers from "./CensusContextLayers.jsx";
import EnvironmentalContextLayers from "./EnvironmentalContextLayers.jsx";
import ResourceBasesLayer from "./ResourceBasesLayer.jsx";
import { hasValidLatLng } from "../utils/mapData.js";

const { BaseLayer, Overlay } = LayersControl;

const priorityColor = (v) => {
  if (v >= 80) return "#aa433a";
  if (v >= 60) return "#d57e34";
  if (v >= 40) return "#d0aa36";
  return "#56856e";
};

const qualityColor = v =>
  v >= 90 ? "#4f826a" :
  v >= 75 ? "#c9a83f" :
  v >= 60 ? "#d57d35" : "#ad4a43";

function FireMarker({fire, onSelectFire, onOpenBitacora}) {
  if(!hasValidLatLng(fire)) return null;

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


function RegionalFireSummary({region,onTerritorySelect}) {
  if(!hasValidLatLng(region)) return null;

  const count = Number(region.incendios || 0);
  const size = Math.max(30, Math.min(84, 26 + Math.sqrt(Math.max(count,1)) * 2.25));

  const icon = useMemo(() => L.divIcon({
    className:"regionalFireDivIcon",
    html:`
      <div class="regionalFireSummary" style="width:${size}px;height:${size}px">
        <span class="regionalFireEmoji">🔥</span>
        <b>${count.toLocaleString("es-CL")}</b>
      </div>
    `,
    iconSize:[size,size],
    iconAnchor:[size/2,size/2]
  }),[size,count]);

  return (
    <Marker
      position={[region.lat,region.lon]}
      icon={icon}
      eventHandlers={{click:()=>onTerritorySelect?.(region)}}
    >
      <Tooltip direction="top" opacity={0.97}>
        <div className="fireTooltip">
          <b>{region.name}</b>
          <span>{count.toLocaleString("es-CL")} incendios</span>
          <span>{Number(region.superficie||0).toLocaleString("es-CL")} ha registradas</span>
          <span>Clic para entrar a la región</span>
        </div>
      </Tooltip>
    </Marker>
  );
}


function ZoomAwareFires({context,regionalFireSummaries,visibleFires,onTerritorySelect,onSelectFire,onOpenBitacora}){
  const map=useMap();
  const [zoom,setZoom]=useState(map.getZoom());

  useEffect(()=>{
    const update=()=>setZoom(map.getZoom());
    map.on("zoomend",update);
    return()=>map.off("zoomend",update);
  },[map]);

  // Al alejarnos suficientemente, siempre volvemos a la lectura agregada regional.
  const aggregate = context.level==="country" || zoom<=6.15;

  return aggregate
    ? regionalFireSummaries.map(region=>(
        <RegionalFireSummary key={`regional-fire-${region.id}`} region={region} onTerritorySelect={onTerritorySelect}/>
      ))
    : visibleFires.map(f=>(
        <FireMarker key={f.id} fire={f} onSelectFire={onSelectFire} onOpenBitacora={onOpenBitacora}/>
      ));
}

function MapNavigator({context, selectedBounds}) {
  const map = useMap();

  useEffect(() => {
    if (selectedBounds?.isValid?.()) {
      map.flyToBounds(selectedBounds, {
        padding: [28, 28],
        duration: 1.15,
        easeLinearity: 0.25
      });
      return;
    }

    if (!context || context.level === "country") {
      map.flyTo([-36.8,-72.4], 5, {duration:1.1});
      return;
    }

    if (hasValidLatLng(context)) {
      const zoom =
        context.level === "region" ? 7 :
        context.level === "province" ? 9 : 11;
      map.flyTo([context.lat,context.lon], zoom, {duration:1.05});
    }
  }, [context, map, selectedBounds]);

  return null;
}

function RegionPolygonLayer({geojson, context, onTerritorySelect, onBoundsChange}) {
  const byId = useMemo(
    () => Object.fromEntries(regions.map(r => [String(r.id), r])),
    []
  );

  if (!geojson) return null;

  const styleFeature = (feature) => {
    const id = String(feature?.properties?.__regionId || "");
    const region = byId[id];
    const isSelected = context?.level === "region" && String(context.id) === id;
    const ipt = region?.prioridad ?? 0;

    return {
      fillColor: priorityColor(ipt),
      fillOpacity: isSelected ? 0.58 : 0.34,
      color: isSelected ? "#ffffff" : "#f5f7f8",
      weight: isSelected ? 3.2 : 1.15,
      opacity: 0.98
    };
  };

  const eachFeature = (feature, layer) => {
    const id = String(feature?.properties?.__regionId || "");
    const region = byId[id];

    if (!region) {
      layer.setStyle({fillOpacity:0.06, opacity:0.25});
      return;
    }

    layer.bindTooltip(
      `<div class="regionTooltip">
        <b>${region.name}</b>
        <span>IPT ${region.prioridad}/100</span>
        <span>${region.incendios.toLocaleString("es-CL")} incendios</span>
        <span>${region.superficie.toLocaleString("es-CL")} ha</span>
      </div>`,
      {sticky:true, direction:"top", opacity:0.97}
    );

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: 3,
          fillOpacity: 0.52,
          color: "#ffffff"
        });
        e.target.bringToFront?.();
      },
      mouseout: (e) => {
        e.target.setStyle(styleFeature(feature));
      },
      click: (e) => {
        const bounds = e.target.getBounds?.();
        if (bounds?.isValid?.()) onBoundsChange?.(bounds);
        onTerritorySelect?.(region);
      }
    });
  };

  return (
    <GeoJSON
      key={`regions-${context?.level}-${context?.id}`}
      data={geojson}
      style={styleFeature}
      onEachFeature={eachFeature}
    />
  );
}

export default function ExecutiveMap({
  context,
  onTerritorySelect,
  onSelectFire,
  onOpenBitacora
}) {
  const [regionGeoJson, setRegionGeoJson] = useState(null);
  const [geoStatus, setGeoStatus] = useState("loading");
  const [selectedBounds, setSelectedBounds] = useState(null);

  useEffect(() => {
    let alive = true;

    loadRegionGeoJSON()
      .then(data => {
        if (!alive) return;
        setRegionGeoJson(data);
        setGeoStatus("ready");
      })
      .catch(() => {
        if (!alive) return;
        setGeoStatus("fallback");
      });

    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (context?.level === "country") setSelectedBounds(null);
  }, [context]);

  const territoryData =
    context.level === "country"
      ? regions
      : context.level === "region"
        ? (provincesByRegion[context.id] || [])
        : context.level === "province"
          ? (communesByProvince[context.id] || [])
          : [];

  // Rendimiento cartográfico:
  // Chile completo = una llama agregada por región.
  // Región/provincia/comuna = incendios individuales del territorio seleccionado.
  const visibleFires = context.level === "country" ? [] : fires.filter(f => {
    if (!hasValidLatLng(f)) return false;
    if(context.level === "region") return f.regionId === context.id;
    if(context.level === "province") return f.provinceId === context.id;
    if(context.level === "commune") return f.communeId === context.id;
    return false;
  });

  const regionalFireSummaries =
    context.level === "country"
      ? regions.filter(hasValidLatLng)
      : [];

  return (
    <section className="mapShell">
      <div className="mapHeading">
        <div><h3>Mapa de situación</h3></div>
      </div>

      <MapContainer center={[-36.8,-72.4]} zoom={5} scrollWheelZoom>
        <MapNavigator context={context} selectedBounds={selectedBounds}/>

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

          <BaseLayer name="Relieve">
            <TileLayer
              attribution='&copy; OpenTopoMap contributors'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              maxZoom={17}
            />
          </BaseLayer>

          <Overlay checked name="Prioridad territorial">
            <LayerGroup>
              {geoStatus === "ready" && context.level === "country" ? (
                <RegionPolygonLayer
                  geojson={regionGeoJson}
                  context={context}
                  onTerritorySelect={onTerritorySelect}
                  onBoundsChange={setSelectedBounds}
                />
              ) : (
                territoryData.filter(hasValidLatLng).map(t => (
                  <CircleMarker
                    key={`priority-${t.id}`}
                    center={[t.lat,t.lon]}
                    radius={12 + (t.prioridad||50)/7}
                    pathOptions={{
                      color:priorityColor(t.prioridad||50),
                      fillColor:priorityColor(t.prioridad||50),
                      fillOpacity:.30,
                      weight:2
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
                ))
              )}
            </LayerGroup>
          </Overlay>

          <Overlay checked name={context.level==="country" ? "Incendios por región" : "Incendios"}>
            <LayerGroup>
              <ZoomAwareFires
                context={context}
                regionalFireSummaries={regions.filter(hasValidLatLng)}
                visibleFires={visibleFires}
                onTerritorySelect={onTerritorySelect}
                onSelectFire={onSelectFire}
                onOpenBitacora={onOpenBitacora}
              />
            </LayerGroup>
          </Overlay>

          <Overlay name="Superficie">
            <LayerGroup>
              {territoryData.filter(hasValidLatLng).map(t => (
                <CircleMarker
                  key={`surface-${t.id}`}
                  center={[t.lat,t.lon]}
                  radius={8 + Math.sqrt(Math.max(t.superficie||0,1))/8}
                  pathOptions={{
                    color:"#9d8235",
                    fillColor:"#c8aa43",
                    fillOpacity:.26,
                    weight:2
                  }}
                  eventHandlers={{click:()=>onTerritorySelect?.(t)}}
                >
                  <Tooltip sticky>
                    {t.name} · {(t.superficie||0).toLocaleString("es-CL")} ha
                  </Tooltip>
                </CircleMarker>
              ))}
            </LayerGroup>
          </Overlay>

          <Overlay name="Carga operacional">
            <LayerGroup>
              {regions.filter(hasValidLatLng).map(r => (
                <CircleMarker
                  key={`resource-${r.id}`}
                  center={[r.lat,r.lon]}
                  radius={8 + Math.sqrt(r.recursos)/5}
                  pathOptions={{
                    color:"#55778f",
                    fillColor:"#708fa5",
                    fillOpacity:.28,
                    weight:2
                  }}
                >
                  <Tooltip sticky>
                    {r.name} · carga agregada {r.recursos.toLocaleString("es-CL")}
                  </Tooltip>
                </CircleMarker>
              ))}
            </LayerGroup>
          </Overlay>

          <Overlay name="Zonas urbanas">
            <LayerGroup>
              <CensusContextLayers showUrban minUrbanZoom={7}/>
            </LayerGroup>
          </Overlay>

          <Overlay name="Localidades rurales">
            <LayerGroup>
              <CensusContextLayers showRural minRuralZoom={9}/>
            </LayerGroup>
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

          <Overlay name="Calidad del dato">
            <LayerGroup>
              {regions.filter(hasValidLatLng).map(r => (
                <CircleMarker
                  key={`quality-${r.id}`}
                  center={[r.lat,r.lon]}
                  radius={13}
                  pathOptions={{
                    color:qualityColor(r.calidad),
                    fillColor:qualityColor(r.calidad),
                    fillOpacity:.45,
                    weight:2
                  }}
                >
                  <Tooltip sticky>{r.name} · calidad {r.calidad}%</Tooltip>
                </CircleMarker>
              ))}
            </LayerGroup>
          </Overlay>

          <Overlay name="Bases de recursos">
            <LayerGroup><ResourceBasesLayer/></LayerGroup>
          </Overlay>
        </LayersControl>
      </MapContainer>

      <div className="mapMetaRow">
        <span className="geoRule">
          {context.level==="country"
            ? "Número = incendios registrados por región · clic para drill-down"
            : "Al alejar el mapa, los incendios vuelven a agruparse por región"}
        </span>
      </div>

      {context.level!=="country" &&
        <div className="fireLegend flameSizeLegend">
          <span><i className="legendFlameEmoji f1">🔥</i>&lt;10 ha</span>
          <span><i className="legendFlameEmoji f2">🔥</i>10–400 ha</span>
          <span><i className="legendFlameEmoji f3">🔥</i>400–1.000 ha</span>
          <span><i className="legendFlameEmoji f4">🔥</i>&gt;1.000 ha</span>
        </div>
      }
    </section>
  );
}
