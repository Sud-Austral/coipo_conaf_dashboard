export const fmt=n=>new Intl.NumberFormat('es-CL',{maximumFractionDigits:1}).format(n||0)
export const pct=n=>`${n>=0?'+':''}${Number(n||0).toFixed(1)}%`
export const minutes=(a,b)=>a&&b?(new Date(b)-new Date(a))/60000:null
export const yoy=(a,b)=>b?((a-b)/b)*100:0
export async function loadData(){
 const r=await fetch(`${import.meta.env.BASE_URL}sidco_sintetico_sur_chile_1mes_yoy.json`)
 if(!r.ok) throw new Error('No se pudo cargar la fuente SIDCO sintética')
 return r.json()
}
export function split(data){
 const current=data.incendios.filter(x=>x.periodo_comparacion==='actual')
 const previous=data.incendios.filter(x=>x.periodo_comparacion==='anterior')
 return {current,previous}
}
export function sum(rows,key){return rows.reduce((a,x)=>a+(Number(x[key])||0),0)}
export function avg(rows,fn){const v=rows.map(fn).filter(x=>Number.isFinite(x)); return v.length?v.reduce((a,b)=>a+b,0)/v.length:0}
export function group(rows,key,valueFn=()=>1){
 const m={}; rows.forEach(r=>{const k=typeof key==='function'?key(r):r[key];m[k]=(m[k]||0)+valueFn(r)});return Object.entries(m).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value)
}
export function byFireIds(rows, fires){const ids=new Set(fires.map(x=>x.ince_id));return rows.filter(x=>ids.has(x.ince_id))}
export function responseKpis(fires){return {
 detection:avg(fires,x=>minutes(x.ince_fecha_inicio,x.ince_fecha_deteccion)),
 dispatch:avg(fires,x=>minutes(x.ince_fecha_aviso,x.ince_fecha_despacho)),
 departure:avg(fires,x=>minutes(x.ince_fecha_despacho,x.ince_fecha_salida)),
 travel:avg(fires,x=>minutes(x.ince_fecha_salida,x.ince_fecha_arribo)),
 firstAttack:avg(fires,x=>minutes(x.ince_fecha_arribo,x.ince_fecha_primer_ataque)),
 control:avg(fires,x=>minutes(x.ince_fecha_primer_ataque,x.ince_fecha_control)),
 total:avg(fires,x=>minutes(x.ince_fecha_inicio,x.ince_fecha_extincion)),
}}
