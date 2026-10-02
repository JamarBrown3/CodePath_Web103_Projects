import React, { useEffect, useState } from "react";
import EventsAPI from "../services/EventsAPI";
import LocationsAPI from "../services/LocationsAPI";
import Event from "../components/Event";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("all");

  useEffect(() => {
    let ignore = false;

    const fetchEvents = async () => {
      try {
        const [data, locationData] = await Promise.all([
          EventsAPI.getAllEvents(),
          LocationsAPI.getAllLocations(),
        ]);

        if (!ignore) {
          setEvents(data);
          setLocations(locationData);
        }
      } catch (error) {
        if (!ignore) {
          console.error("Error loading events:", error);
          setError("Unable to load events. Please try again later.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    fetchEvents();
    return () => {
      ignore = true;
    };
  }, []);

  // Match by database ID, not array position.
  const locationsById = new Map(
    locations.map((location) => [location.id, location]),
  );

  // filtering for the All events page
  const filteredEvents =
    selectedLocation === "all"
      ? events
      : events.filter(
          (event) => String(event.location_id) === selectedLocation,
        );

  return (
    <section className="events-page">
      <h2>All Community Events</h2>
      <div className="events-filter">
        <label htmlFor="location-filter">Filter by location:</label>
        <select
          id="location-filter"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="all">All Locations</option>
          {locations.map((location) => (
            <option key={location.id} value={String(location.id)}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading events...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && filteredEvents.length === 0 && (
        <p>
          {events.length === 0
            ? "No events scheduled yet."
            : "No events at this location."}
        </p>
      )}

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <Event
            key={event.id}
            id={event.id}
            title={event.title}
            description={event.description}
            starts_at={event.starts_at}
            image={locationsById.get(event.location_id)?.image}
            locationName={locationsById.get(event.location_id)?.name}
          />
        ))}
      </div>
    </section>
  );
};

export default Events;
