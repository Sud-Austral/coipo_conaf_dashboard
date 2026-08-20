export const hasValidLatLng = (item) => {
  if (!item) return false;

  const rawLat = item.lat;
  const rawLon = item.lon;

  if (rawLat === null || rawLat === undefined || rawLat === "") return false;
  if (rawLon === null || rawLon === undefined || rawLon === "") return false;

  const lat = Number(rawLat);
  const lon = Number(rawLon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return false;

  return true;
};

export const validMapItems = (items = []) =>
  items.filter(hasValidLatLng);
