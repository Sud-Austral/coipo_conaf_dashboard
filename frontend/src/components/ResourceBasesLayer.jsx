import { GeoJSON } from "react-leaflet";
import L from "leaflet";
import { resourceBasesReal } from "../data/resourceBases.real.js";

const houseIcon = L.divIcon({
  className: "resourceBaseHouse",
  html: '<div class="resourceBaseHouseEmoji">🏠</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

export default function ResourceBasesLayer({ visible = true }) {
  if (!visible) return null;
  return (
    <GeoJSON
      data={resourceBasesReal}
      pointToLayer={(feature, latlng) => L.marker(latlng, { icon: houseIcon })}
      onEachFeature={(feature, layer) => {
        const p = feature.properties || {};
        const title = "🏠 " + (p.base_name || "Base de recursos");
        const types = (p.resource_types || []).join(", ");
        layer.bindTooltip(
          "<b>" + title + "</b><br>" +
          (p.resource_count || 1) + " recurso(s)" +
          (types ? "<br>" + types : ""),
          { sticky: true }
        );
      }}
    />
  );
}
