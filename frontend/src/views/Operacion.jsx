import OperationalMap from "../components/OperationalMap";
import { timeline } from "../data/mockData";

export default function Operacion() {
  const kpis = [
    ["Movimientos", "63.457"],
    ["Recursos distintos", "1.769"],
    ["Incendios atendidos", "8.279"],
    ["Combatientes informados", "179.969"]
  ];

  return (
    <>
      <section className="executive">
        <h2>Lectura operacional</h2>
        <p>
          La mediana salida→arribo es 18 min. El tramo de mayor duración se
          concentra entre primer ataque y control, con una mediana de 67 min.
          La vista compara tiempos y esfuerzo sin inferir causalidad.
        </p>
      </section>

      <div className="kpi-grid compact-grid">
        {kpis.map(([label, value]) => (
          <article className="kpi compact" key={label}>
            <div className="kpi-head">{label}</div>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <section className="panel">
        <h3>Cadena operacional</h3>
        <div className="timeline">
          {timeline.map(([label, value, coverage]) => (
            <div key={label}>
              <b>{label}</b>
              <strong>{value}</strong>
              <small>Cobertura {coverage}</small>
            </div>
          ))}
        </div>
      </section>

      <div className="two-col">
        <OperationalMap />
        <section className="panel">
          <h3>Carga operacional</h3>
          <div className="fake-chart">
            Top incendios · Top regiones · recursos por incendio
          </div>
        </section>
      </div>

      <section className="panel">
        <h3>Esfuerzo vs superficie</h3>
        <div className="fake-chart">
          Relación exploratoria entre superficie, movimientos, recursos y combatientes
        </div>
      </section>
    </>
  );
}
