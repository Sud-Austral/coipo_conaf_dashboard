import { qualityRows } from "../data/mockData";

export default function Calidad() {
  const kpis = [
    ["Integridad territorial", "99,98%"],
    ["Georreferenciación", "76,08%"],
    ["Integridad temporal", "99%+"],
    ["Cobertura daño", "54,7%"]
  ];

  return (
    <>
      <section className="executive">
        <h2>Lectura de calidad</h2>
        <p>
          Los campos básicos del incendio presentan alta cobertura y buena
          consistencia temporal. Las principales brechas se concentran en
          variables operacionales intermedias, superficie por etapa y
          caracterización de daño.
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
        <h3>Matriz de cobertura</h3>
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Cobertura</th>
              <th>Confianza</th>
            </tr>
          </thead>
          <tbody>
            {qualityRows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => <td key={i}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h3>Inconsistencias y anomalías</h3>
        <div className="chips">
          <span>Tiempos negativos</span>
          <span>Coordenadas faltantes</span>
          <span>Superficie faltante</span>
          <span>Daño &gt; superficie</span>
          <span>Posibles duplicados</span>
        </div>
      </section>
    </>
  );
}
