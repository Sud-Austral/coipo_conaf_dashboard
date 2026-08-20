import SimpleTerritoryMap from "../components/SimpleTerritoryMap";
import { regions } from "../data/mockData";

export default function Prioridad() {
  return (
    <>
      <section className="executive">
        <h2>Lectura territorial</h2>
        <p>
          Biobío concentra la mayor superficie registrada y combina alta
          frecuencia, incendios de gran magnitud y elevada carga operacional.
          El IPT es experimental y se utiliza para ordenar territorios, no para
          predecir riesgo.
        </p>
      </section>

      <div className="two-col">
        <SimpleTerritoryMap title="Prioridad territorial · Leaflet" />

        <section className="panel">
          <h3>Ranking territorial</h3>
          {regions.map((r, i) => (
            <div className="rank" key={r.name}>
              <b>{i + 1}. {r.name}</b>
              <span>{r.prioridad}/100</span>
              <small>
                {r.incendios.toLocaleString("es-CL")} incendios ·{" "}
                {r.superficie.toLocaleString("es-CL")} ha
              </small>
            </div>
          ))}
        </section>
      </div>

      <section className="panel">
        <h3>Factores de prioridad</h3>
        <div className="chips">
          <span>Superficie</span>
          <span>Concentración</span>
          <span>Magnitud</span>
          <span>Operación</span>
          <span>Variación interanual</span>
        </div>
      </section>

      <section className="panel">
        <h3>Comparación territorial</h3>
        <div className="fake-chart">
          X = incendios · Y = superficie · Tamaño = recursos · Color = IPT
        </div>
      </section>
    </>
  );
}
