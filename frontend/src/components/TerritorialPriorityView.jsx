import { useEffect, useMemo, useState } from "react";
import { Info, MapPin, ArrowUpRight, ArrowDownRight, Layers3 } from "lucide-react";
import { MapContainer, TileLayer, GeoJSON, Tooltip, useMap, LayersControl, LayerGroup } from "react-leaflet";
import L from "leaflet";
import { regions, territorialPriority } from "../data/dashboardData.js";
import { loadRegionGeoJSON } from "../data/regionGeoJson.js";
import KpiInfo from "./KpiInfo.jsx";
import CensusContextLayers from "./CensusContextLayers.jsx";

const { BaseLayer, Overlay } = LayersControl;

const priorityColor = v =>
  v >= 80 ? "#aa433a" :
  v >= 60 ? "#d57e34" :
  v >= 40 ? "#d0aa36" : "#56856e";

function Factor({label,value}) {
  return (
    <div className="iptFactor">
      <div className="iptFactorLabel"><span>{label}</span><b>{value}</b></div>
      <div className="iptFactorTrack"><i style={{width:`${Math.max(0,Math.min(100,value))}%`,background:priorityColor(value)}}/></div>
    </div>
  );
}

function FlyRegion({selected,geo}){
  const map=useMap();
  useEffect(()=>{
    if(!selected || !geo) return;
    const features=(geo.features||[]).filter(f=>String(f.properties?.__regionId)===String(selected.id));
    if(features.length){
      const layer=L.geoJSON({type:"FeatureCollection",features});
      const bounds=layer.getBounds();
      if(bounds.isValid()) map.flyToBounds(bounds,{padding:[30,30],duration:1.0,maxZoom:8});
    }
  },[selected,geo,map]);
  return null;
}

function reasonFor(item){
  const factors=[
    ["Mayor superficie",item.superficieIndice ?? item.superficie],
    ["Alta cantidad de incendios",item.frecuencia],
    ["Grandes incendios",item.grandes],
    ["Alta carga operacional",item.operacion],
    ["Variación relevante",item.variacion]
  ].sort((a,b)=>Number(b[1]||0)-Number(a[1]||0));
  return factors[0][0];
}

function PriorityMap({items,selectedId,onSelect}){
  const [geo,setGeo]=useState(null);

  useEffect(()=>{
    let alive=true;
    loadRegionGeoJSON().then(g=>alive&&setGeo(g)).catch(()=>{});
    return ()=>{alive=false};
  },[]);

  const selected=items.find(x=>String(x.id)===String(selectedId));

  const styleFeature=feature=>{
    const id=feature?.properties?.__regionId;
    const item=items.find(x=>String(x.id)===String(id));
    const selectedFeature=String(id)===String(selectedId);
    return {
      color:selectedFeature?"#f1f3f4":"#6d767b",
      weight:selectedFeature?2.5:1,
      fillColor:item?priorityColor(item.ipt):"#778187",
      fillOpacity:item?(selectedFeature?.55:.34):.06
    };
  };

  return <section className="priorityLeafletCard">
    <div className="priorityCardHead">
      <div>
        <small>MAPA</small>
        <h3>Prioridad territorial</h3>
        <p>Polígono completo = territorio. Clic para seleccionar; el mapa hace zoom animado.</p>
      </div>
    </div>

<div className="priorityLeafletMap">
      <MapContainer center={[-36.5,-71.3]} zoom={5.2} scrollWheelZoom>
        <FlyRegion selected={selected} geo={geo}/>

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

          <Overlay checked name="IPT territorial">
            <LayerGroup>
              {geo && <GeoJSON
                key={`${selectedId}-ipt`}
                data={geo}
                style={styleFeature}
                onEachFeature={(feature,layer)=>{
                  const id=feature?.properties?.__regionId;
                  const item=items.find(x=>String(x.id)===String(id));
                  if(item){
                    layer.bindTooltip(
                      `<b>${item.name}</b><br>IPT ${item.ipt}<br>${Number(item.incendios||0).toLocaleString("es-CL")} incendios`,
                      {sticky:true}
                    );
                    layer.on("click",()=>onSelect(item.id));
                  }
                }}
              />}
            </LayerGroup>
          </Overlay>

          <Overlay name="Zonas urbanas">
            <LayerGroup><CensusContextLayers showUrban minUrbanZoom={7}/></LayerGroup>
          </Overlay>

          <Overlay name="Localidades rurales">
            <LayerGroup><CensusContextLayers showRural minRuralZoom={9}/></LayerGroup>
          </Overlay>
        </LayersControl>
      </MapContainer>

<div className="priorityLayerLegend">
        <b>IPT</b>
        <span><i className="low"/>Baja</span>
        <span><i className="medium"/>Media</span>
        <span><i className="high"/>Alta</span>
        <span><i className="veryHigh"/>Muy alta</span>
      </div>
    </div>
  </section>;
}

function ExecutiveRanking({items,selectedId,onSelect}){
  return <section className="executiveTerritoryRanking">
    <div className="priorityCardHead">
      <div>
        <small>COMPARACIÓN EJECUTIVA</small>
        <h3>¿Dónde priorizar y por qué?</h3>
        <p>Una fila resume la posición y el factor dominante de cada territorio.</p>
      </div>
    </div>
    <div className="executiveRankingTable">
      <div className="executiveRankingHeader">
        <span>#</span><span>Territorio</span><span>IPT</span><span>Incendios</span><span>Superficie</span><span>&gt;400 ha</span><span>Carga</span><span>Principal razón</span>
      </div>
      {items.map((x,i)=><button key={x.id} className={String(selectedId)===String(x.id)?"selected":""} onClick={()=>onSelect(x.id)}>
        <span>{i+1}</span>
        <strong>{x.name}</strong>
        <b className="iptBadge" style={{"--ipt":priorityColor(x.ipt)}}>{x.ipt}</b>
        <span>{Number(x.incendios||0).toLocaleString("es-CL")}</span>
        <span>{Number(x.superficie||0).toLocaleString("es-CL")} ha</span>
        <span>{x.grandes>=70?"Alta":x.grandes>=55?"Media":"Baja"}</span>
        <span>{x.operacion>=75?"Alta":x.operacion>=60?"Media":"Baja"}</span>
        <em>{reasonFor(x)}</em>
      </button>)}
    </div>
  </section>;
}

export default function TerritorialPriorityView(){
  const [selectedId,setSelectedId]=useState(8);
  const [sortBy,setSortBy]=useState("IPT");

  const enriched=useMemo(()=>territorialPriority.map(x=>{
    const region=regions.find(r=>Number(r.id)===Number(x.id)) || {};
    return {
      ...x,
      superficieIndice:x.superficie,
      ...region,
      ipt:x.ipt,
      frecuencia:x.frecuencia,
      grandes:x.grandes,
      operacion:x.operacion,
      variacion:x.variacion
    };
  }),[]);

  const selected=useMemo(
    ()=>enriched.find(x=>Number(x.id)===Number(selectedId)) || enriched[0],
    [enriched,selectedId]
  );

  const ranking=useMemo(()=>{
    const arr=[...enriched];
    if(sortBy==="Incendios") arr.sort((a,b)=>(b.incendios||0)-(a.incendios||0));
    else if(sortBy==="Superficie") arr.sort((a,b)=>(b.superficie||0)-(a.superficie||0));
    else if(sortBy==="Variación") arr.sort((a,b)=>(b.variacion||0)-(a.variacion||0));
    else arr.sort((a,b)=>b.ipt-a.ipt);
    return arr;
  },[enriched,sortBy]);

  return (
    <div className="priorityViewV263">
      <section className="executiveStatement priorityStatement">
        <p><b>{selected.name}</b> combina superficie, frecuencia, grandes incendios y carga operacional. El IPT permite ordenar territorios y explicar qué dimensión empuja su prioridad.</p>
        <div className="focusLine"><span>Foco actual</span><b>{selected.name}</b><em>IPT {selected.ipt} · prioridad {selected.ipt>=80?"muy alta":selected.ipt>=60?"alta":"media"}</em></div>
      </section>

      <div className="priorityToolbar">
        <div className="priorityBreadcrumb"><MapPin size={15}/><span>Chile → {selected.name}</span></div>
        <label>Ordenar por
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option>IPT</option><option>Incendios</option><option>Superficie</option><option>Variación</option>
          </select>
        </label>
      </div>

      <section className="priorityKpiGrid">
        <article className="priorityKpiHero">
          <div className="kpiHeaderLine"><small>IPT · {selected.name}</small><KpiInfo label={`IPT · ${selected.name}`} detail="Índice experimental de prioridad territorial. Integra superficie, frecuencia, grandes incendios, operación y variación." source="Modelo interno del dashboard" confidence="Experimental"/></div>
          <strong>{selected.ipt}<span>/100</span></strong>
          <div className="iptLinear"><i style={{width:`${selected.ipt}%`,background:priorityColor(selected.ipt)}}/></div>
          <p>Prioridad {selected.ipt>=80?"muy alta":selected.ipt>=60?"alta":"media"}</p>
        </article>

        <article><div className="kpiHeaderLine"><small>Incendios</small><KpiInfo label="Incendios" detail="Cantidad del territorio seleccionado." source="SIDCO · public.incendio"/></div><strong>{Number(selected.incendios||0).toLocaleString("es-CL")}</strong><span>Territorio seleccionado</span></article>
        <article><div className="kpiHeaderLine"><small>Superficie registrada</small><KpiInfo label="Superficie registrada" coverage="~77% a nivel temporada" source="SIDCO · ince_superficie" confidence="Media-Alta"/></div><strong>{Number(selected.superficie||0).toLocaleString("es-CL")} ha</strong><span>Magnitud acumulada</span></article>
        <article><div className="kpiHeaderLine"><small>Grandes incendios</small><KpiInfo label="Grandes incendios" detail="Eventos con superficie registrada mayor a 400 ha." source="SIDCO · ince_superficie"/></div><strong>&gt;400 ha</strong><span>Umbral del proyecto</span></article>
        <article><div className="kpiHeaderLine"><small>Variación territorial</small><KpiInfo label="Variación territorial" source="Modelo interno del dashboard" confidence="Experimental"/></div><strong className={selected.variacion>=0?"metricBad":"metricGood"}>{selected.variacion>=0?<ArrowUpRight size={18}/>:<ArrowDownRight size={18}/>} {selected.variacion}%</strong><span>Variación territorial</span></article>
        <article><div className="kpiHeaderLine"><small>Carga operacional</small><KpiInfo label="Carga operacional" source="SIDCO · movimiento/recurso" confidence="Experimental"/></div><strong>{selected.operacion}/100</strong><span>Índice operacional</span></article>
      </section>

      <section className="priorityCoreGrid">
        <PriorityMap items={enriched} selectedId={selectedId} onSelect={setSelectedId}/>
        <aside className="priorityRightColumn">
          <section className="territorialRankingCard">
            <div className="priorityCardHead"><div><small>RANKING</small><h3>Territorios prioritarios</h3></div></div>
            <div className="territorialRankingList">{ranking.map((x,i)=><button key={x.id} className={Number(selectedId)===Number(x.id)?"selected":""} onClick={()=>setSelectedId(x.id)}><span>{String(i+1).padStart(2,"0")}</span><div><b>{x.name}</b><small>{Number(x.incendios||0).toLocaleString("es-CL")} incendios · {Number(x.superficie||0).toLocaleString("es-CL")} ha</small><i style={{width:`${x.ipt}%`,background:priorityColor(x.ipt)}}/></div><strong>{x.ipt}</strong></button>)}</div>
          </section>

          <section className="whyPriorityCard">
            <div className="priorityCardHead"><div><small>EXPLICABILIDAD</small><h3>Por qué está arriba</h3></div><Info size={16}/></div>
            <Factor label="Superficie" value={selected.superficieIndice}/>
            <Factor label="Frecuencia" value={selected.frecuencia}/>
            <Factor label="Grandes incendios >400 ha" value={selected.grandes}/>
            <Factor label="Carga operacional" value={selected.operacion}/>
            <Factor label="Variación interanual" value={selected.variacion}/>
            <p>IPT experimental para ordenar territorios. No representa probabilidad futura de incendio.</p>
          </section>
        </aside>
      </section>

      <ExecutiveRanking items={ranking} selectedId={selectedId} onSelect={setSelectedId}/>

      <section className="significantChangesV251">
        <div className="priorityCardHead"><div><small>SEÑALES</small><h3>Cambios significativos</h3></div></div>
        <div>
          <article><small>Mayor prioridad</small><b>Biobío · IPT 92</b><span>Principal territorio de atención.</span></article>
          <article><small>Grandes incendios nacionales</small><b>48 &gt;400 ha</b><span>−45,5% vs temporada anterior.</span></article>
          <article><small>Eventos extremos</small><b>4 &gt;5.000 ha</b><span>+100% vs temporada anterior.</span></article>
        </div>
      </section>
    </div>
  );
}
