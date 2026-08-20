const REGION_GEOJSON_URL =
  "https://raw.githubusercontent.com/caracena/chile-geojson/master/regiones.json";

const REGION_ALIASES = {
  "1": ["tarapaca"],
  "2": ["antofagasta"],
  "3": ["atacama"],
  "4": ["coquimbo"],
  "5": ["valparaiso"],
  "6": ["ohiggins", "o'higgins", "libertador general bernardo ohiggins", "libertador gral bernardo ohiggins"],
  "7": ["maule"],
  "8": ["biobio", "bio bio", "bio-bio"],
  "9": ["araucania", "la araucania"],
  "10": ["los lagos", "lagos"],
  "11": ["aysen", "aisen"],
  "12": ["magallanes", "magallanes y de la antartica chilena"],
  "13": ["metropolitana", "metropolitana de santiago", "region metropolitana"],
  "14": ["los rios"],
  "15": ["arica y parinacota"],
  "16": ["nuble"]
};

export function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/región|region|de la|del|de/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function allPropertyValues(properties = {}) {
  return Object.values(properties)
    .filter(v => typeof v === "string" || typeof v === "number")
    .map(v => normalizeText(v));
}

function findRegionId(feature) {
  const props = feature?.properties || {};
  const numericCandidates = [
    props.region_id, props.regionId, props.REGION_ID,
    props.codregion, props.cod_region, props.COD_REGI,
    props.codigo, props.CODIGO, props.id, props.ID
  ];

  for (const candidate of numericCandidates) {
    const n = Number(candidate);
    if (Number.isInteger(n) && n >= 1 && n <= 16) return String(n);
  }

  const values = allPropertyValues(props);

  for (const [regionId, aliases] of Object.entries(REGION_ALIASES)) {
    const normalizedAliases = aliases.map(normalizeText);
    if (values.some(v => normalizedAliases.some(a => v === a || v.includes(a) || a.includes(v)))) {
      return regionId;
    }
  }
  return null;
}

export async function loadRegionGeoJSON() {
  const response = await fetch(REGION_GEOJSON_URL);
  if (!response.ok) throw new Error(`GeoJSON regional HTTP ${response.status}`);

  const data = await response.json();
  const features = Array.isArray(data?.features) ? data.features : [];

  return {
    type: "FeatureCollection",
    features: features.map(feature => ({
      ...feature,
      properties: {
        ...(feature.properties || {}),
        __regionId: findRegionId(feature)
      }
    }))
  };
}

export const regionGeoJsonSource = REGION_GEOJSON_URL;
