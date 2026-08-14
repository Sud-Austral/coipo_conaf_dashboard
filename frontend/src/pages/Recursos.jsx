import {dummy} from '../data/dummy.js'
import {Kpi,Card,Bars,Table,Header,Page} from '../components/DashboardUI.jsx'
export default function Recursos(){const k=dummy.kpis;return <Page><Header title="Recursos" subtitle="Movilización, utilización y cobertura de recursos desplegados."/>
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Kpi label="Recursos movilizados" value={k.recursosMovilizados.toLocaleString('es-CL')}/><Kpi label="Promedio / incendio" value={(k.recursosMovilizados/k.incendios).toFixed(1)}/><Kpi label="Tipos de recurso" value={dummy.recursos.length}/><Kpi label="Movimientos" value={dummy.recursos.reduce((a,x)=>a+x.movimientos,0).toLocaleString('es-CL')}/></div>
<div className="grid gap-6 lg:grid-cols-2"><Card title="Movimientos por tipo"><Bars rows={dummy.recursos} label="tipo" value="movimientos"/></Card><Card title="Incendios atendidos"><Bars rows={dummy.recursos} label="tipo" value="incendios"/></Card></div>
<Card title="Detalle de recursos"><Table rows={dummy.recursos} columns={[['tipo','Tipo'],['movimientos','Movimientos'],['incendios','Incendios']]}/></Card></Page>}
