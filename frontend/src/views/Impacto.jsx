import { useMemo, useState } from "react";
import { Flame, MapPin, Database, Trees, Info, ChevronRight } from "lucide-react";
import DamageImpactMap from "../components/DamageImpactMap.jsx";
import {
  damageSummary202526,
  damageByCategory202526,
  damageByGrade202526,
  damageTerritoriesDemo,
  regions
} from "../data/dashboardData.js";

const fmt=n=>Number(n||0).toLocaleString("es-CL",{maximumFractionDigits:1});

function Kpi({icon:Icon,label,value,sub}){
  return <article className="damageKpi"><div><Icon size={16}/><small>{label}</small></div><strong>{value}</strong><span>{sub}</span></article>;
}

export default function Impacto({onOpenBitacora}){
  const [regionId,setRegionId]=useState(null);
  const [category,setCategory]=useState(null);
  const selectedRegion=regions.find(r=>String(r.id)===String(regionId));
  const totalCat=damageByCategory202526.reduce((a,x)=>a+x.ha,0);
  const maxCat=Math.max(...damageByCategory202526.map(x=>x.ha));

  const ranking=useMemo(()=>{
    const arr=[...damageTerritoriesDemo];
    return arr.sort((a,b)=>b.damageHa-a.damageHa);
  },[]);

  return <div className="damageView">
    <section className="executiveStatement damageStatement">
      <p>
        La caracterización SIDCO permite distinguir <b>Plantaciones, Arbolado, Matorral, Pastizal, Agrícola y Desechos</b>.
        En la temporada analizada existen <b>{fmt(damageSummary202526.incendiosConDano)} incendios con registros de daño</b>,
        equivalentes a {damageSummary202526.coberturaDanoPct}% del universo.
      </p>
      <div className="focusLine"><span>Foco actual</span><b>{selectedRegion?.name || "Chile"}</b><em>Temporada 2025/26</em></div>
    </section>

    <section className="damageKpiGrid">
      <Kpi icon={Trees} label="Superficie afectada registrada" value="131.891 ha" sub="public.incendio · cobertura superficie ~77%"/>
      <Kpi icon={Flame} label="Incendios >400 ha" value={damageSummary202526.largeFires} sub="Umbral estándar del proyecto"/>
      <Kpi icon={Database} label="Incendios con daño caracterizado" value={fmt(damageSummary202526.incendiosConDano)} sub={`${damageSummary202526.coberturaDanoPct}% de cobertura`}/>
      <Kpi icon={MapPin} label="Superficie de daño clasificada" value={`${fmt(damageSummary202526.superficieDanoCaracterizada)} ha`} sub="Suma de public.dano"/>
    </section>

    <section className="damageCore">
      <DamageImpactMap selectedRegion={regionId} onSelectRegion={setRegionId} onOpenBitacora={onOpenBitacora}/>
      <aside className="damageRankingCard">
        <div className="damageCardHead"><small>TERRITORIO</small><h3>Mayor concentración de impacto</h3></div>
        {ranking.map((r,i)=><button key={r.id} className={String(regionId)===String(r.id)?"selected":""} onClick={()=>setRegionId(r.id)}>
          <span>{String(i+1).padStart(2,"0")}</span>
          <div><b>{r.name}</b><small>{fmt(r.damageHa)} ha caracterizadas · cobertura demo {r.coverage}%</small></div>
          <ChevronRight size={15}/>
        </button>)}
        <div className="damageUrbanNote"><Info size={15}/><p>La capa urbano/rural queda preparada para conectarse a cartografía oficial INE/IDE. La proximidad poblada debe tratarse como exposición territorial, no como personas amenazadas.</p></div>
      </aside>
    </section>

    <section className="damageCategoryCard">
      <div className="damageCardHead"><small>COMPOSICIÓN</small><h3>¿Qué se está dañando?</h3><p>Clasificación ejecutiva validada contra reportes CONAF provenientes de SIDCO.</p></div>
      <div className="damageCategoryBars">
        {damageByCategory202526.map(x=>{
          const pct=x.ha/totalCat*100;
          return <button key={x.key} className={category===x.key?"selected":""} onClick={()=>setCategory(category===x.key?null:x.key)}>
            <div><b>{x.label}</b><span>{fmt(x.ha)} ha · {pct.toFixed(1).replace(".",",")}%</span></div>
            <i><em style={{width:`${x.ha/maxCat*100}%`}}/></i>
            <small>SIDCO {x.codes.length>1?`códigos ${x.codes[0]}–${x.codes.at(-1)}`:`código ${x.codes[0]}`}</small>
          </button>
        })}
      </div>
      <div className="damageDictionaryNote">
        <Info size={15}/><p>Los códigos 1–5 se consolidan como <b>Plantaciones</b>. Sus subtipos individuales permanecen pendientes de catálogo oficial y no se interpretan en esta versión.</p>
      </div>
    </section>

    <section className="damageBottomGrid">
      <div className="damageGradeCard">
        <div className="damageCardHead"><small>GRADO REGISTRADO</small><h3>Distribución del grado de daño</h3><p>Se mantienen los valores originales SIDCO 0/25/50/75/100 sin asignar etiquetas semánticas no verificadas.</p></div>
        <div className="gradeBars">{damageByGrade202526.map(g=><div key={g.grade}><span>{g.grade}</span><i><em style={{width:`${g.ha/Math.max(...damageByGrade202526.map(x=>x.ha))*100}%`}}/></i><b>{fmt(g.ha)} ha</b><small>{fmt(g.registros)} registros</small></div>)}</div>
      </div>
      <div className="damageQualityCard">
        <div className="damageCardHead"><small>CALIDAD DEL DATO</small><h3>Cómo leer esta vista</h3></div>
        <dl>
          <div><dt>Cobertura daño</dt><dd>{damageSummary202526.coberturaDanoPct}%</dd></div>
          <div><dt>Registros de daño</dt><dd>18.255</dd></div>
          <div><dt>Superficies negativas</dt><dd>0</dd></div>
          <div><dt>Registros con superficie 0</dt><dd>8.564</dd></div>
        </dl>
        <p>La superficie de daño es una caracterización de componentes del incendio. No debe confundirse automáticamente con una segunda medición independiente de la superficie total.</p>
      </div>
    </section>
  </div>;
}
