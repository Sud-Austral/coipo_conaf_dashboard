import { LazyLocalLayer } from "./LazyLocalLayer.jsx";

export default function CensusContextLayers({showUrban=false,showRural=false,minUrbanZoom=7,minRuralZoom=9}){
  return <>
    {showUrban && <LazyLocalLayer
      layer="urbano" label="Zonas urbanas" minZoom={minUrbanZoom}
      style={{color:"#556b73",weight:1.3,fillColor:"#9aa6aa",fillOpacity:.18}}
      onEachFeature={(f,l)=>{const p=f.properties||{};l.bindTooltip(`<b>${p.URBANO||"Zona urbana"}</b>${p.COMUNA?`<br>${p.COMUNA}`:""}`,{sticky:true})}}
    />}
    {showRural && <LazyLocalLayer
      layer="rural" label="Localidades rurales" minZoom={minRuralZoom}
      style={{color:"#75846f",weight:.8,fillColor:"#8fa184",fillOpacity:.15}}
      onEachFeature={(f,l)=>{const p=f.properties||{};l.bindTooltip(`<b>${p.NOM_ENTIDAD||p.NOM_LOCALIDAD||"Entidad rural"}</b>${p.NOM_COMUNA?`<br>${p.NOM_COMUNA}`:""}`,{sticky:true})}}
    />}
  </>;
}
