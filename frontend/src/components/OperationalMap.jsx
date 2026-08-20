import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

export default function OperationalMap() {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    const map = new maplibregl.Map({
      container: container.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-72.7, -36.8],
      zoom: 5
    });

    map.addControl(new maplibregl.NavigationControl());

    return () => map.remove();
  }, []);

  return (
    <section className="map-panel">
      <div className="section-title">
        <div>
          <h3>Mapa operacional · MapLibre</h3>
          <small>Incendios | Recursos | Movimientos | Empresas | Tiempos</small>
        </div>
      </div>

      <div ref={container} className="maplibre-box" />

      <small className="note">
        Feature futura: ubicación individual validada de helicópteros, vehículos,
        bases y dotaciones.
      </small>
    </section>
  );
}
