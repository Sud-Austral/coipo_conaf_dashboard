import { qualityRows, damageSummary202526 } from "../data/dashboardData.js";
import { Database, MapPin, Clock3, Crosshair, Activity, ShieldCheck } from "lucide-react";

const kpis=[
  ["Cobertura general","Alta","Variables básicas",ShieldCheck],
  ["Integridad territorial","99,98%","Región/provincia/comuna",MapPin],
  ["Georreferenciación","76,08%","Coordenadas disponibles",Crosshair],
  ["Integridad temporal","98%+","Fechas principales",Clock3],
  ["Cobertura operacional","Media-Alta","Movimientos y tiempos",Activity],
  ["Cobertura de daño",`${damageSummary202526.coberturaDanoPct}%`,"Incendios con public.dano",Database]
];

export default function Calidad(){
  return <div className="qualityViewV260">
    <section className="qualityIntro">
      <small>DATOS · VISTA DE AUDITORÍA</small>
      <h2>Calidad y Confianza de Datos</h2>
      <p>Esta sección está separada del flujo operacional del dashboard. Su propósito es entender cobertura, consistencia y limitaciones de la información utilizada para construir los indicadores.</p>
    </section>
    <section className="qualityKpis">{kpis.map(([l,v,s,I])=><article key={l}><I size={17}/><small>{l}</small><strong>{v}</strong><span>{s}</span></article>)}</section>
    <section className="qualityMatrix">
      <h3>Matriz de calidad</h3>
      <table><thead><tr><th>Variable</th><th>Cobertura</th><th>Confianza</th><th>Uso recomendado</th></tr></thead>
      <tbody>{qualityRows.map(r=><tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[2]==="Alta"?"Confiable":r[2]==="Media-Alta"?"Utilizable con advertencia":"Parcial"}</td></tr>)}</tbody></table>
    </section>
  </div>;
}
