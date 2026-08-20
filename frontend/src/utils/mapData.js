export const hasValidLatLng = (item) => {
  if (!item) return false;
  const lat = Number(item.lat);
  const lon = Number(item.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return false;

  return true;
};

export const validMapItems = (items = []) =>
  items.filter(hasValidLatLng);
