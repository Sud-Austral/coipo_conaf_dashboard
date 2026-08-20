import { useMemo, useState } from "react";
import { Flame, MapPin, Database, Trees, Info, ChevronRight } from "lucide-react";
import DamageImpactMap from "../components/DamageImpactMap.jsx";
import KpiInfo from "../components/KpiInfo.jsx";
import {
  damageSummary202526,
  damageByCategory202526,
  damageByGrade202526,
  damageTerritoriesDemo,
  regions
} from "../data/dashboardData.js";
import { damageByRegionReal } from "../data/damageByRegion.real.js";

const fmt=n=>Number(n||0).toLocaleString("es-CL",{maximumFractionDigits:1});

function Kpi({icon:Icon,label,value,sub,detail,coverage,source,confidence}){
  return <article className="damageKpi">
    <div className="damageKpiTitle">
      <span><Icon size={16}/><small>{label}</small></span>
      <KpiInfo label={label} detail={detail || sub} coverage={coverage} source={source} confidence={confidence}/>
    </div>
    <strong>{value}</strong>
    {sub && <span>{sub}</span>}
  </article>;
}

export default function Impacto({onOpenBitacora}){
  const [regionId,setRegionId]=useState(null);
  const [category,setCategory]=useState(null);
  const selectedRegion=regions.find(r=>String(r.id)===String(regionId));
  const regionDamage=regionId ? damageByRegionReal[String(regionId)] : null;
  const currentCategories=regionDamage?.categories || damageByCategory202526;
  const totalCat=currentCategories.reduce((a,x)=>a+x.ha,0);
  const currentDamageSummary=regionDamage ? {
    incendiosConDano:regionDamage.firesWithDamage,
    coberturaDanoPct:regionDamage.firesWithDamage/Math.max(1,regionDamage.firesTotal)*100,
    superficieDanoCaracterizada:regionDamage.damageSurface,
    largeFires:regionDamage.largeFires,
    surfaceRegistered:regionDamage.surfaceRegistered
  } : {
    ...damageSummary202526,
    surfaceRegistered:regions.reduce((a,r)=>a+(r.superficie||0),0)
  };

  const ranking=useMemo(()=>{
    const arr=[...damageTerritoriesDemo];
    return arr.sort((a,b)=>b.damageHa-a.damageHa);
  },[]);

  return <div className="damageView">
    <section className="executiveStatement damageStatement">
      <p>
        La caracterización SIDCO permite distinguir <b>Plantaciones, Arbolado, Matorral, Pastizal, Agrícola y Desechos</b>.
        En la temporada analizada existen <b>{fmt(currentDamageSummary.incendiosConDano)} incendios con daño caracterizado</b>
        y los eventos mayores a 400 ha concentran la atención sobre los territorios de mayor impacto.
      </p>
      <div className="focusLine"><span>Foco actual</span><b>{selectedRegion?.name || "Chile"}</b><em>Temporada 2025/26</em></div>
    </section>

    <section className="damageKpiGrid">
      <Kpi icon={Trees} label="Superficie afectada registrada" value={`${Number(currentDamageSummary.surfaceRegistered).toLocaleString("es-CL",{maximumFractionDigits:0})} ha`} sub="Temporada 2025/26" detail="Suma de la superficie registrada para incendios de la temporada." coverage="~77% con superficie informada" source="SIDCO · incendio.ince_superficie" confidence="Media-Alta"/>
      <Kpi icon={Flame} label="Incendios >400 ha" value={currentDamageSummary.largeFires} sub="Temporada 2025/26" detail="Cantidad de incendios cuya superficie registrada supera 400 ha." coverage="Depende de ince_superficie informada" source="SIDCO · incendio.ince_superficie" confidence="Media-Alta"/>
      <Kpi icon={Database} label="Incendios con daño caracterizado" value={fmt(currentDamageSummary.incendiosConDano)} sub="Eventos con detalle de daño" detail="Incendios con al menos un registro asociado en public.dano." coverage={`${currentDamageSummary.coberturaDanoPct}% del universo de la temporada`} source="SIDCO · public.dano" confidence="Media"/>
      <Kpi icon={MapPin} label="Superficie de daño clasificada" value={`${fmt(currentDamageSummary.superficieDanoCaracterizada)} ha`} sub="Composición por uso de suelo" detail="Suma de superficies clasificadas en los registros de daño. Se utiliza para composición del impacto, no como una segunda superficie total del incendio." source="SIDCO · dano.dano_superficie" confidence="Media"/>
    </section>

    <section className="damageCore">
      <DamageImpactMap selectedRegion={regionId} onSelectRegion={setRegionId} onOpenBitacora={onOpenBitacora}/>
      <aside className="damageRankingCard">
        <div className="damageCardHead"><small>TERRITORIO</small><h3>Mayor concentración de impacto</h3></div>
        {ranking.map((r,i)=><button key={r.id} className={String(regionId)===String(r.id)?"selected":""} onClick={()=>setRegionId(r.id)}>
          <span>{String(i+1).padStart(2,"0")}</span>
          <div><b>{r.name}</b><small>{fmt(r.damageHa)} ha caracterizadas · {fmt(r.fires)} incendios</small></div>
          <ChevronRight size={15}/>
        </button>)}
        <div className="damageUrbanNote"><Info size={15}/><p>La capa urbano/rural se carga desde el cache cartográfico local cuando está disponible. La proximidad poblada se interpreta como exposición territorial.</p></div>
      </aside>
    </section>

    <section className="damageCategoryCard">
      <div className="damageCardHead"><small>COMPOSICIÓN</small><h3>¿Qué se está dañando?</h3><p>Cada barra se compara contra el total de superficie de daño caracterizada de la temporada: <b>{fmt(totalCat)} ha = 100%</b>.</p></div>
      <div className="damageCategoryBars">
        {currentCategories.map(x=>{
          const pct=x.ha/totalCat*100;
          return <button key={x.key} className={category===x.key?"selected":""} onClick={()=>setCategory(category===x.key?null:x.key)}>
            <div><b>{x.label}</b><span>{fmt(x.ha)} ha · {pct.toFixed(1).replace(".",",")}%</span></div>
            <i title={`${pct.toFixed(1).replace(".",",")}% del total caracterizado`}><em style={{width:`${pct}%`}}/></i>
          </button>
        })}
      </div>
    </section>

    <section className="damageBottomGrid">
      <div className="damageGradeCard">
        <div className="damageCardHead"><small>GRADO REGISTRADO</small><h3>Distribución del grado de daño</h3><p>Se mantienen los valores originales SIDCO 0/25/50/75/100 sin asignar etiquetas semánticas no verificadas.</p></div>
        <div className="gradeBars">{damageByGrade202526.map(g=><div key={g.grade}><span>{g.grade}</span><i><em style={{width:`${g.ha/Math.max(...damageByGrade202526.map(x=>x.ha))*100}%`}}/></i><b>{fmt(g.ha)} ha</b><small>{fmt(g.registros)} registros</small></div>)}</div>
      </div>
      <div className="damageImpactSummaryCard">
        <div className="damageCardHead"><small>CONCENTRACIÓN DEL IMPACTO</small><h3>Principales señales de la temporada</h3></div>
        <dl>
          <div><dt>Uso de suelo más afectado</dt><dd>{currentCategories[0]?.label || "—"}</dd></div>
          <div><dt>Superficie en Plantaciones</dt><dd>{fmt(currentCategories[0]?.ha || 0)} ha</dd></div>
          <div><dt>Segundo componente</dt><dd>{currentCategories[1]?.label || "—"}</dd></div>
          <div><dt>Territorio destacado</dt><dd>{ranking[0]?.name || "—"}</dd></div>
        </dl>
        <p>Este bloque resume exclusivamente resultados de impacto. Las métricas de cobertura, consistencia y confianza se consultan en la Vista 7 · Calidad y Confianza.</p>
      </div>
    </section>
  </div>;
}
