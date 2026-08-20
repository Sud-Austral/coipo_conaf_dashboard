import { GeoJSON } from "react-leaflet";
import L from "leaflet";
import { resourceBasesReal } from "../data/resourceBases.real.js";
import { sanitizeFeatureCollection } from "../utils/geoJson.js";

const houseIcon = L.divIcon({
  className: "resourceBaseHouse",
  html: '<div class="resourceBaseHouseEmoji">🏠</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const safeResourceBases = sanitizeFeatureCollection(resourceBasesReal);

export default function ResourceBasesLayer({ visible = true }) {
  if (!visible) return null;
  return (
    <GeoJSON
      data={safeResourceBases}
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
