import { useCallback, useEffect, useRef, useState } from "react";
import { GeoJSON, WMSTileLayer, useMap } from "react-leaflet";

/*
 * v2.7.1
 * CAPAS TERRITORIALES REALES
 *
 * 1. Áreas protegidas:
 *    MMA · SIMBIO · FeatureServer
 *    Layer 0 = Áreas Protegidas
 *
 * 2. Bosques / recursos forestales:
 *    IDE Minagri / CONAF · WMS Recursos Forestales
 *
 * 3. Usos de la tierra:
 *    IDE Minagri / CONAF · WMS Usos de la Tierra
 *
 * Las capas WMS se renderizan desde el servidor oficial.
 * Áreas Protegidas se solicita como GeoJSON por viewport.
 */

const PROTECTED_QUERY =
  "https://arcgis.mma.gob.cl/server/rest/services/SIMBIO/SIMBIO_AP/FeatureServer/0/query";

export const FOREST_WMS =
  "https://esri.ciren.cl/server/services/IDEMINAGRI/RECURSOS_FORESTALES/MapServer/WMSServer";

export const LAND_USE_WMS =
  "https://esri.ciren.cl/server/services/USOS_DE_LA_TIERRA__CONAF/MapServer/WMSServer";

function protectedQueryUrl(bounds){
  const sw=bounds.getSouthWest();
  const ne=bounds.getNorthEast();

  const params=new URLSearchParams({
    where:"1=1",
    geometry:[sw.lng,sw.lat,ne.lng,ne.lat].join(","),
    geometryType:"esriGeometryEnvelope",
    inSR:"4326",
    spatialRel:"esriSpatialRelIntersects",
    outFields:"OBJECTID,NombreOriginal,designacion,categoria,region",
    returnGeometry:"true",
    outSR:"4326",
    f:"geojson",
    resultRecordCount:"2000"
  });

  return `${PROTECTED_QUERY}?${params.toString()}`;
}

function ProtectedAreasLayer({minZoom=6}){
  const map=useMap();
  const [data,setData]=useState(null);
  const abortRef=useRef(null);

  const load=useCallback(async()=>{
    if(map.getZoom()<minZoom){
      setData(null);
      return;
    }

    abortRef.current?.abort();
    const controller=new AbortController();
    abortRef.current=controller;

    try{
      const response=await fetch(protectedQueryUrl(map.getBounds()),{
        signal:controller.signal
      });

      if(!response.ok) throw new Error(`HTTP ${response.status}`);

      const json=await response.json();
      if(json?.error) throw new Error(json.error.message||"SIMBIO");

      setData(json);
    }catch(error){
      if(error.name!=="AbortError"){
        console.warn("No fue posible cargar Áreas Protegidas SIMBIO",error);
        setData(null);
      }
    }
  },[map,minZoom]);

  useEffect(()=>{
    load();
    map.on("moveend",load);
    map.on("zoomend",load);
    return ()=>{
      abortRef.current?.abort();
      map.off("moveend",load);
      map.off("zoomend",load);
    };
  },[map,load]);

  if(!data) return null;

  return <GeoJSON
    key={`protected-${data.features?.length||0}-${map.getZoom()}`}
    data={data}
    style={{
      color:"#346d79",
      weight:1.4,
      fillColor:"#68a2a7",
      fillOpacity:.20
    }}
    onEachFeature={(feature,layer)=>{
      const p=feature.properties||{};
      const name=p.NombreOriginal || "Área protegida";
      const designation=p.designacion || p.categoria || "";
      layer.bindTooltip(
        `<b>${name}</b>${designation?`<br>${designation}`:""}`,
        {sticky:true}
      );
    }}
  />;
}

export default function EnvironmentalContextLayers({
  showForest=false,
  showProtected=false,
  showOtherLand=false
}){
  return <>
    {showForest && (
      <WMSTileLayer
        url={FOREST_WMS}
        layers="0"
        format="image/png"
        transparent
        version="1.3.0"
        opacity={0.58}
        attribution="IDE Minagri / CONAF"
      />
    )}

    {showProtected && <ProtectedAreasLayer/>}

    {showOtherLand && (
      <WMSTileLayer
        url={LAND_USE_WMS}
        layers="0"
        format="image/png"
        transparent
        version="1.3.0"
        opacity={0.50}
        attribution="IDE Minagri / CONAF"
      />
    )}
  </>;
}

export const environmentalLayerSources = {
  forest:{
    type:"WMS",
    source:"IDE Minagri / CONAF",
    url:FOREST_WMS
  },
  protected:{
    type:"ArcGIS FeatureServer",
    source:"MMA · SIMBIO",
    url:PROTECTED_QUERY
  },
  otherLand:{
    type:"WMS",
    source:"IDE Minagri / CONAF",
    url:LAND_USE_WMS
  }
};
