import {qualityRows} from "../data/dashboardData.js";
export default function Calidad(){return <section className="placeholderView"><h2>Calidad y Confianza</h2><table><thead><tr><th>Variable</th><th>Cobertura</th><th>Confianza</th></tr></thead><tbody>{qualityRows.map(r=><tr key={r[0]}>{r.map((c,i)=><td key={i}>{c}</td>)}</tr>)}</tbody></table></section>}
