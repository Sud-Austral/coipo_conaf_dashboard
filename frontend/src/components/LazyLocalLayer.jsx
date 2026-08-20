import { useCallback, useEffect, useMemo, useState } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { sanitizeFeatureCollection } from "../utils/geoJson.js";

const BASE=`${import.meta.env.BASE_URL}data/capas/`;

function intersects(a,b){
  if(!a||!b) return true;
  return !(a[2]<b[0] || a[0]>b[2] || a[3]<b[1] || a[1]>b[3]);
}

function mapBBox(map){
  const b=map.getBounds();
  return [b.getWest(),b.getSouth(),b.getEast(),b.getNorth()];
}

function Notice(){ return null; }

export function LazyLocalLayer({layer,style,onEachFeature,minZoom=0,label}){
  const map=useMap();
  const [manifest,setManifest]=useState(null);
  const [collections,setCollections]=useState([]);
  const [status,setStatus]=useState("loading");

  useEffect(()=>{
    let alive=true;
    fetch(`${BASE}manifest.json`,{cache:"no-store"})
      .then(r=>r.ok?r.json():Promise.reject())
      .then(d=>{if(alive)setManifest(d)})
      .catch(()=>{if(alive)setStatus("unavailable")});
    return()=>{alive=false};
  },[]);

  const load=useCallback(async()=>{
    if(!manifest) return;
    if(map.getZoom()<minZoom){setCollections([]);setStatus("zoom");return}
    const item=manifest?.layers?.[layer];
    if(!item?.available){setCollections([]);setStatus("unavailable");return}

    const bb=mapBBox(map);
    const entries=(item.entries||[]).filter(e=>intersects(e.bbox,bb));
    if(!entries.length){setCollections([]);setStatus("empty");return}

    setStatus("loading");
    const loaded=await Promise.all(entries.map(async e=>{
      try{
        const r=await fetch(`${BASE}${e.file}`);
        if(!r.ok) return null;
        return sanitizeFeatureCollection(await r.json());
      }catch(_){return null}
    }));
    const good=loaded.filter(fc => fc?.features?.length);
    setCollections(good);
    setStatus(good.length?"ready":"unavailable");
  },[manifest,map,layer,minZoom]);

  useEffect(()=>{
    load();
    map.on("moveend",load);map.on("zoomend",load);
    return()=>{map.off("moveend",load);map.off("zoomend",load)}
  },[load,map]);

  return <>
    
    {collections.map((fc,i)=><GeoJSON key={`${layer}-${i}-${map.getZoom()}`} data={fc} style={style} onEachFeature={onEachFeature}/>)}
  </>;
}
