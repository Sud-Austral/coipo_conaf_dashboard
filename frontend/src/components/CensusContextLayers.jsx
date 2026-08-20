import { useCallback, useEffect, useRef, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";

/*
 * Capas territoriales reales para contexto poblado.
 *
 * URBANO:
 * Límite urbano censal INE 2017, publicado como FeatureServer
 * y utilizado por SERNAGEOMIN/Esri Chile.
 *
 * RURAL:
 * Manzanas-entidades / entidades rurales, fuente INE.
 *
 * Se consulta sólo el viewport visible para evitar descargar
 * toda la cartografía nacional en GitHub Pages.
 */
const URBAN_SERVICE =
  "https://services.arcgis.com/r7t1P5pnkoOLRdhr/ArcGIS/rest/services/L%C3%ADmite_Royalty_Minero_2025/FeatureServer/9/query";

const RURAL_SERVICE =
  "https://services.arcgis.com/r7t1P5pnkoOLRdhr/ArcGIS/rest/services/Microdatos_Censo_2024/FeatureServer/1/query";

function queryUrl(service, bounds, outFields){
  const sw=bounds.getSouthWest();
  const ne=bounds.getNorthEast();
  const geometry=[sw.lng,sw.lat,ne.lng,ne.lat].join(",");
  const params=new URLSearchParams({
    where:"1=1",
    geometry,
    geometryType:"esriGeometryEnvelope",
    inSR:"4326",
    spatialRel:"esriSpatialRelIntersects",
    outFields,
    returnGeometry:"true",
    outSR:"4326",
    f:"geojson",
    resultRecordCount:"1800"
  });
  return `${service}?${params.toString()}`;
}

async function fetchLayer(service,bounds,outFields,signal){
  const response=await fetch(queryUrl(service,bounds,outFields),{signal});
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  const data=await response.json();
  if(data?.error) throw new Error(data.error?.message || "ArcGIS error");
  return data;
}

export default function CensusContextLayers({
  showUrban=false,
  showRural=false,
  minUrbanZoom=7,
  minRuralZoom=9,
  onStatusChange
}){
  const map=useMap();
  const [urban,setUrban]=useState(null);
  const [rural,setRural]=useState(null);
  const abortRef=useRef(null);

  const load=useCallback(async()=>{
    abortRef.current?.abort();
    const controller=new AbortController();
    abortRef.current=controller;

    const zoom=map.getZoom();
    const bounds=map.getBounds();

    let status={
      urban:showUrban ? (zoom>=minUrbanZoom?"loading":"zoom") : "off",
      rural:showRural ? (zoom>=minRuralZoom?"loading":"zoom") : "off"
    };
    onStatusChange?.(status);

    try{
      const jobs=[];

      if(showUrban && zoom>=minUrbanZoom){
        jobs.push(
          fetchLayer(
            URBAN_SERVICE,
            bounds,
            "OBJECTID,URBANO,COMUNA,PROVINCIA,REGION,CUT_COM",
            controller.signal
          ).then(data=>{
            setUrban(data);
            status={...status,urban:`ok:${data?.features?.length||0}`};
            onStatusChange?.(status);
          }).catch(err=>{
            if(err.name!=="AbortError"){
              setUrban(null);
              status={...status,urban:"error"};
              onStatusChange?.(status);
            }
          })
        );
      }else{
        setUrban(null);
      }

      if(showRural && zoom>=minRuralZoom){
        jobs.push(
          fetchLayer(
            RURAL_SERVICE,
            bounds,
            "OBJECTID,NOM_REGION,NOM_PROVINCIA,NOM_COMUNA,NOM_LOCALIDAD,NOM_ENTIDAD,TIPO_CATEGORIA,AREA_C,n_per",
            controller.signal
          ).then(data=>{
            setRural(data);
            status={...status,rural:`ok:${data?.features?.length||0}`};
            onStatusChange?.(status);
          }).catch(err=>{
            if(err.name!=="AbortError"){
              setRural(null);
              status={...status,rural:"error"};
              onStatusChange?.(status);
            }
          })
        );
      }else{
        setRural(null);
      }

      await Promise.allSettled(jobs);
    }catch(_){}
  },[map,showUrban,showRural,minUrbanZoom,minRuralZoom,onStatusChange]);

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

  return <>
    {showUrban && urban && (
      <GeoJSON
        key={`urban-${urban.features?.length||0}-${map.getZoom()}`}
        data={urban}
        style={{
          color:"#556b73",
          weight:1.3,
          fillColor:"#9aa6aa",
          fillOpacity:.18
        }}
        onEachFeature={(feature,layer)=>{
          const p=feature.properties||{};
          layer.bindTooltip(
            `<b>${p.URBANO || "Zona urbana"}</b>${p.COMUNA?`<br>${p.COMUNA}`:""}`,
            {sticky:true}
          );
        }}
      />
    )}

    {showRural && rural && (
      <GeoJSON
        key={`rural-${rural.features?.length||0}-${map.getZoom()}`}
        data={rural}
        style={{
          color:"#75846f",
          weight:.8,
          fillColor:"#8fa184",
          fillOpacity:.15
        }}
        onEachFeature={(feature,layer)=>{
          const p=feature.properties||{};
          const name=p.NOM_ENTIDAD || p.NOM_LOCALIDAD || "Entidad rural";
          layer.bindTooltip(
            `<b>${name}</b>${p.NOM_COMUNA?`<br>${p.NOM_COMUNA}`:""}${p.n_per!=null?`<br>Población censada: ${Number(p.n_per).toLocaleString("es-CL")}`:""}`,
            {sticky:true}
          );
        }}
      />
    )}
  </>;
}

export const censusLayerSources = {
  urban: URBAN_SERVICE,
  rural: RURAL_SERVICE
};
