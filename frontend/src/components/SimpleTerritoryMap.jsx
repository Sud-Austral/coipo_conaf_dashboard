import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { regions } from "../data/mockData";

export default function SimpleTerritoryMap({ title = "Mapa territorial" }) {
  return (
    <section className="map-panel">
      <div className="section-title">
        <div>
          <h3>{title}</h3>
          <small>Prioridad | Incendios | Superficie | Recursos</small>
        </div>
      </div>

      <MapContainer center={[-36.8, -72.5]} zoom={5} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {regions.map((region) => (
          <CircleMarker
            key={region.name}
            center={[region.lat, region.lon]}
            radius={7 + region.prioridad / 11}
          >
            <Popup>
              <b>{region.name}</b>
              <br />
              IPT: {region.prioridad}
              <br />
              {region.incendios.toLocaleString("es-CL")} incendios
              <br />
              {region.superficie.toLocaleString("es-CL")} ha
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </section>
  );
}
