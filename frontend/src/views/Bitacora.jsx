import { Printer, ArrowLeft } from "lucide-react";

export default function Bitacora({fire,onBack}) {
  const f = fire || {id:"805149434",name:"Hualqui",ha:6943,estado:"Extinguido",inicio:"17 ene 2026 · 17:55",confianza:84};
  return (
    <article className="bitacoraSheet">
      <div className="bitacoraActions noPrint">
        <button onClick={onBack}><ArrowLeft size={16}/> Volver</button>
        <button onClick={()=>window.print()}><Printer size={16}/> Imprimir / Guardar PDF</button>
      </div>
      <header>
        <small>BITÁCORA DEL INCENDIO</small>
        <h1>Incendio forestal · {f.name}</h1>
        <p>{f.inicio}</p>
      </header>
      <section>
        <h2>Resumen</h2>
        <p>Durante la jornada se registró un incendio forestal en {f.name}. La superficie registrada alcanzó aproximadamente <b>{f.ha.toLocaleString("es-CL")} hectáreas</b>. La reconstrucción narrativa utiliza únicamente hechos disponibles en SIDCO.</p>
        <p>El evento figura con estado <b>{f.estado}</b>. Cuando una etapa operacional no cuenta con información suficiente, la bitácora lo declara explícitamente en lugar de completar el relato mediante supuestos.</p>
      </section>
      <section>
        <h2>Hechos principales</h2>
        <ul>
          <li>Superficie registrada: {f.ha.toLocaleString("es-CL")} ha.</li>
          <li>Estado registrado: {f.estado}.</li>
          <li>Confianza de reconstrucción de maqueta: {f.confianza}%.</li>
        </ul>
      </section>
      <footer>Fuente: SIDCO · Documento de maqueta v2.3</footer>
    </article>
  );
}
