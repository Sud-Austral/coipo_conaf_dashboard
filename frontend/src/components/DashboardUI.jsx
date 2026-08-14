export function Kpi({label,value,note}){
 return <div className="rounded-2xl border border-arena-200 bg-white p-5 shadow-sm">
  <div className="text-sm text-slate-500">{label}</div><div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
  {note&&<div className="mt-1 text-xs font-medium text-verde-600">{note}</div>}
 </div>
}
export function Card({title,children,className=''}){return <section className={`rounded-2xl border border-arena-200 bg-white p-5 shadow-sm ${className}`}><h2 className="font-semibold text-slate-900">{title}</h2>{children}</section>}
export function Bars({rows,label,value}){
 const max=Math.max(...rows.map(x=>Number(x[value])||0),1)
 return <div className="mt-5 space-y-3">{rows.map((r,i)=><div key={i} className="grid grid-cols-[120px_1fr_60px] items-center gap-3 text-xs">
  <span className="truncate text-slate-600">{r[label]}</span><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-verde-500" style={{width:`${Number(r[value])/max*100}%`}}/></div><strong className="text-right text-slate-700">{Number(r[value]).toLocaleString('es-CL')}</strong>
 </div>)}</div>
}
export function Table({rows,columns}){return <div className="scrollbar mt-4 overflow-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-200 text-[10px] uppercase text-slate-500">{columns.map(([k,l])=><th key={k} className="px-2 py-2">{l}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i} className="border-b border-slate-100 last:border-0">{columns.map(([k])=><td key={k} className="px-2 py-2 text-slate-700">{typeof r[k]==='number'?r[k].toLocaleString('es-CL'):r[k]}</td>)}</tr>)}</tbody></table></div>}
export function Header({title,subtitle}){return <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><div className="text-xs font-bold uppercase tracking-widest text-verde-600">Centro de análisis</div><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div><div className="flex gap-2"><select className="rounded-xl border border-arena-200 bg-white px-3 py-2 text-sm"><option>Últimos 12 meses</option><option>Últimos 30 días</option><option>Temporada</option></select><select className="rounded-xl border border-arena-200 bg-white px-3 py-2 text-sm"><option>Todos los estados</option><option>Activos</option><option>Controlados</option><option>Extinguidos</option></select></div></div>}
export function Page({children}){return <section className="space-y-6">{children}</section>}
