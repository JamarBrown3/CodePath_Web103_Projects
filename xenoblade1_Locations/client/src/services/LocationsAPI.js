// Setup placeholder only. Replace this with a real API request during the lab.
// An empty list is intentional: no database is queried and no sample data is faked.
const getAllLocations = async () => {
  const response = await fetch("/api/locations");
  if (!response.ok) {
    throw new Error(`Unable to load locations: (${response.status}).`);
  }

  const data = await response.json();
  return data;
};

const getLocationById = async (locationId) => {
  const response = await fetch(
    `/api/locations/${encodeURIComponent(locationId)}`,
  );

  if (!response.ok) {
    throw new Error(`Unable to load location: (${response.status}).`);
  }
  const data = await response.json();
  return data;
};

export default { getAllLocations, getLocationById };
