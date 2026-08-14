import {useEffect,useState} from 'react'
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer} from 'recharts'
import {getDashboard} from '../data/api.js'
import {dummy} from '../data/dummy.js'
import {Kpi,Card,Bars,Header,Page} from '../components/DashboardUI.jsx'

export default function Inteligencia(){
 const [d,setD]=useState(dummy)
 useEffect(()=>{getDashboard().then(setD).catch(()=>{})},[])
 const k=d.kpis
 return <Page><Header title="Inteligencia de Incendios" subtitle="Vista ejecutiva para entender ocurrencia, magnitud, estado y presión operacional."/>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Kpi label="Incendios" value={k.incendios.toLocaleString('es-CL')} note={`▲ ${k.variacion}% vs período anterior`}/><Kpi label="Activos" value={k.activos}/><Kpi label="Superficie afectada" value={`${k.superficieHa.toLocaleString('es-CL')} ha`}/><Kpi label="Recursos movilizados" value={k.recursosMovilizados.toLocaleString('es-CL')}/></div>
  <div className="grid gap-6 lg:grid-cols-2"><Card title="Incendios por mes"><div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={d.mensual}><XAxis dataKey="mes"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="incendios" fill="#2f7d4a" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></Card>
  <Card title="Principales comunas"><Bars rows={d.territorio} label="comuna" value="incendios"/></Card></div>
  <div className="grid gap-6 lg:grid-cols-2"><Card title="Estado actual">{[['Activos',k.activos],['Controlados',k.controlados],['Extinguidos',k.extinguidos],['Con daños',k.incendiosConDanos]].map(x=><div className="flex justify-between border-b border-slate-100 py-3 text-sm last:border-0" key={x[0]}><span>{x[0]}</span><b>{x[1].toLocaleString('es-CL')}</b></div>)}</Card>
  <Card title="Lectura ejecutiva"><p className="mt-4 text-sm leading-6 text-slate-600">Esta vista concentra los indicadores que permiten responder rápidamente: cuántos incendios ocurren, dónde se concentran, qué magnitud presentan y cuál es su estado.</p></Card></div>
 </Page>
}
