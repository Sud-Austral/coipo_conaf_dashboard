import {NavLink,useLocation} from 'react-router-dom'
import {Flame,MapPinned,Clock3,Truck,TriangleAlert,TrendingUp} from 'lucide-react'

const nav=[
 ['/', 'Inteligencia de Incendios', Flame],
 ['/territorio','Incidencia del Territorio',MapPinned],
 ['/respuesta','Respuesta',Clock3],
 ['/recursos','Recursos',Truck],
 ['/impacto','Impacto',TriangleAlert],
 ['/evolucion','Evolución',TrendingUp]
]

export default function Layout({children}){
 const loc=useLocation()
 return <div className="min-h-dvh bg-arena-50">
  <header className="bg-verde-700 text-white shadow-sm">
   <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
    <div className="flex items-center gap-3">
     <span className="rounded-xl bg-white/10 p-2.5"><Flame size={22}/></span>
     <div><div className="font-semibold">Inteligencia de Incendios</div><div className="text-xs text-verde-100">FW Coipo · Dashboard BI</div></div>
    </div>
    <div className="ml-auto rounded-xl bg-verde-800/70 px-3 py-2 text-xs font-semibold">Datos dummy · maqueta</div>
   </div>
   <nav className="border-t border-verde-600/50"><div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2">
    {nav.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==='/'}
      className={({isActive})=>`flex min-h-12 items-center gap-2 border-b-2 px-4 py-3 text-sm whitespace-nowrap ${isActive?'border-white text-white font-semibold':'border-transparent text-verde-100 hover:text-white'}`}>
      <Icon size={16}/>{label}</NavLink>)}
   </div></nav>
  </header>
  <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
  <footer className="border-t border-arena-200 bg-white"><div className="mx-auto flex max-w-7xl justify-between gap-4 px-4 py-4 text-xs text-slate-500">
   <span><strong className="text-slate-700">Dashboard BI</strong> · Datos ficticios · Arquitectura React + Node + PostgreSQL</span><span>Ruta: {loc.pathname}</span>
  </div></footer>
 </div>
}
