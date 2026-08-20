const finitePair = (pair) =>
  Array.isArray(pair) &&
  pair.length >= 2 &&
  pair[0] !== null && pair[0] !== undefined && pair[0] !== "" &&
  pair[1] !== null && pair[1] !== undefined && pair[1] !== "" &&
  Number.isFinite(Number(pair[0])) &&
  Number.isFinite(Number(pair[1]));

const validCoords = (coords, depth = 0) => {
  if (!Array.isArray(coords) || coords.length === 0) return false;

  // Coordinate pair [lon, lat]
  if (finitePair(coords)) return true;

  // Nested coordinate arrays
  return coords.every(child => validCoords(child, depth + 1));
};

export const isValidGeometry = (geometry) => {
  if (!geometry || typeof geometry !== "object") return false;

  if (geometry.type === "GeometryCollection") {
    return (
      Array.isArray(geometry.geometries) &&
      geometry.geometries.length > 0 &&
      geometry.geometries.every(isValidGeometry)
    );
  }

  return Boolean(geometry.type) && validCoords(geometry.coordinates);
};

export const sanitizeFeatureCollection = (fc) => {
  const features = Array.isArray(fc?.features)
    ? fc.features.filter(feature => isValidGeometry(feature?.geometry))
    : [];

  return {
    type: "FeatureCollection",
    features
  };
};
