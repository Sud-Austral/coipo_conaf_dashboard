import { useState } from "react";
import Resumen from "./views/Resumen.jsx";
import Prioridad from "./views/Prioridad.jsx";
import Operacion from "./views/Operacion.jsx";
import Impacto from "./views/Impacto.jsx";
import Calidad from "./views/Calidad.jsx";
import Bitacora from "./views/Bitacora.jsx";

const views = [
  ["Resumen", Resumen],
  ["Prioridad Territorial", Prioridad],
  ["Operación y Recursos", Operacion],
  ["Impacto y Daño", Impacto],
  ["Calidad y Confianza", Calidad],
  ["Bitácora", Bitacora]
];

export default function App() {
  const [active, setActive] = useState("Resumen");
  const CurrentView = views.find(([name]) => name === active)[1];

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <small>COIPO · Inteligencia de incendios</small>
          <h1>Dashboard de Incendios</h1>
        </div>

        <div className="filters no-print">
          <button>Hoy</button>
          <button>7d</button>
          <button>30d</button>
          <button className="active">Temporada 2025/26</button>
          <button>Personalizado</button>
        </div>
      </header>

      <nav className="nav no-print">
        {views.map(([name]) => (
          <button
            key={name}
            className={active === name ? "active" : ""}
            onClick={() => setActive(name)}
          >
            {name}
          </button>
        ))}
      </nav>

      <main>
        <CurrentView />
      </main>
    </div>
  );
}
