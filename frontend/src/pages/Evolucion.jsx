import {dummy} from '../data/dummy.js'
import {Kpi,Card,Bars,Header,Page} from '../components/DashboardUI.jsx'
export default function Evolucion(){return <Page><Header title="Evolución" subtitle="Seguimiento del ciclo de vida del incendio desde detección hasta extinción."/>
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Kpi label="Detectados" value={dummy.evolucion[0].cantidad.toLocaleString('es-CL')}/><Kpi label="Despachados" value={dummy.evolucion[1].cantidad.toLocaleString('es-CL')}/><Kpi label="Controlados" value={dummy.evolucion[3].cantidad.toLocaleString('es-CL')}/><Kpi label="Extinguidos" value={dummy.evolucion[4].cantidad.toLocaleString('es-CL')}/></div>
<Card title="Embudo de evolución"><Bars rows={dummy.evolucion} label="estado" value="cantidad"/></Card>
<Card title="Lectura del ciclo"><p className="mt-4 text-sm leading-6 text-slate-600">Esta vista permite identificar pérdidas o diferencias entre etapas, tiempos de transición y evolución del incendio a través del ciclo operacional.</p></Card>
</Page>}
