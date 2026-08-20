import { LazyLocalLayer } from "./LazyLocalLayer.jsx";

export default function EnvironmentalContextLayers({showForest=false,showProtected=false,showOtherLand=false}){
  return <>
    {showForest && <LazyLocalLayer
      layer="bosques" label="Bosques / vegetación natural" minZoom={6}
      style={{color:"#396f50",weight:.9,fillColor:"#5f936c",fillOpacity:.24}}
      onEachFeature={(f,l)=>l.bindTooltip(`<b>${f.properties?.region_dashboard||"Bosque / vegetación natural"}</b><br>IDE Minagri / CONAF`,{sticky:true})}
    />}
    {showProtected && <LazyLocalLayer
      layer="areas_protegidas" label="Áreas protegidas" minZoom={5}
      style={{color:"#347484",weight:1.4,fillColor:"#62a3aa",fillOpacity:.20}}
      onEachFeature={(f,l)=>l.bindTooltip(`<b>${f.properties?.NombreOriginal||"Área protegida"}</b>${f.properties?.designacion?`<br>${f.properties.designacion}`:""}`,{sticky:true})}
    />}
    {showOtherLand && <LazyLocalLayer
      layer="otros_usos" label="Otros usos de suelo" minZoom={7}
      style={{color:"#877a5d",weight:.9,fillColor:"#ad9f7b",fillOpacity:.16}}
    />}
  </>;
}
