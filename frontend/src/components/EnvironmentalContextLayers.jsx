import { GeoJSON, Circle, Tooltip } from "react-leaflet";

/*
 * Contexto territorial natural.
 *
 * La arquitectura queda preparada para reemplazar estas geometrías demostrativas
 * por servicios oficiales de Catastro Vegetacional CONAF / IDE Minagri / MMA.
 *
 * Importante: no se etiqueta "despoblado" como categoría oficial. La ausencia de
 * poblamiento debe derivarse posteriormente del cruce espacial con urbano/rural.
 */

const demoForest = {
  type:"FeatureCollection",
  features:[
    {type:"Feature",properties:{name:"Bosque / vegetación natural"},geometry:{type:"Polygon",coordinates:[[[-73.12,-37.07],[-72.80,-37.07],[-72.80,-36.84],[-73.12,-36.84],[-73.12,-37.07]]]}}
  ]
};

const demoProtected = {
  type:"FeatureCollection",
  features:[
    {type:"Feature",properties:{name:"Área protegida · contexto demostrativo"},geometry:{type:"Polygon",coordinates:[[[-72.86,-37.03],[-72.72,-37.03],[-72.72,-36.92],[-72.86,-36.92],[-72.86,-37.03]]]}}
  ]
};

const demoLand = {
  type:"FeatureCollection",
  features:[
    {type:"Feature",properties:{name:"Otros usos de suelo"},geometry:{type:"Polygon",coordinates:[[[-73.18,-36.88],[-72.92,-36.88],[-72.92,-36.70],[-73.18,-36.70],[-73.18,-36.88]]]}}
  ]
};

export default function EnvironmentalContextLayers({showForest=false,showProtected=false,showOtherLand=false}){
  return <>
    {showForest && <GeoJSON data={demoForest} style={{color:"#3d6f55",weight:1.2,fillColor:"#6f987b",fillOpacity:.18}}
      onEachFeature={(f,l)=>l.bindTooltip(`<b>${f.properties?.name||"Bosque / vegetación natural"}</b><br>Conectar Catastro Vegetacional oficial`)}/>}
    {showProtected && <GeoJSON data={demoProtected} style={{color:"#4d7485",weight:1.2,dashArray:"5 4",fillColor:"#7fa0aa",fillOpacity:.15}}
      onEachFeature={(f,l)=>l.bindTooltip(`<b>${f.properties?.name||"Área protegida"}</b><br>Conectar capa oficial SNASPE/MMA`)}/>}
    {showOtherLand && <GeoJSON data={demoLand} style={{color:"#8a7d62",weight:1,fillColor:"#b1a787",fillOpacity:.12}}
      onEachFeature={(f,l)=>l.bindTooltip(`<b>${f.properties?.name||"Otros usos de suelo"}</b>`)}/>}
  </>;
}

export const environmentalLayerSources = {
  forest:"Catastro Vegetacional CONAF / IDE Minagri",
  protected:"SNASPE CONAF / MMA / IDE Minagri",
  otherLand:"Catastro de uso de la tierra CONAF"
};
