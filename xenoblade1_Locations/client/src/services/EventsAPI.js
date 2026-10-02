const getAllEvents = async () => {
  const response = await fetch("/api/events");

  if (!response.ok) {
    throw new Error(`Unable to load events: (${response.status}).`);
  }

  const data = await response.json();
  return data;
};
const getEventsByLocation = async (locationId) => {
  const response = await fetch(
    `/api/locations/${encodeURIComponent(locationId)}/events`,
  );

  if (!response.ok) {
    throw new Error(`Unable to load Events (${response.status}).`);
  }

  const data = await response.json();
  return data;
};

export default {
  getAllEvents,
  getEventsByLocation,
};
