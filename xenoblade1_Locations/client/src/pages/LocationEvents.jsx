import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LocationsAPI from "../services/LocationsAPI";
import EventsAPI from "../services/EventsAPI";
import Event from "../components/Event";
import "../css/LocationEvents.css";

const LocationEvents = () => {
  const { locationId } = useParams();

  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchLocationEvents = async () => {
      setLoading(true);
      setError("");

      try {
        const locationData = await LocationsAPI.getLocationById(locationId);

        const eventsData = await EventsAPI.getEventsByLocation(locationId);

        if (!ignore) {
          setLocation(locationData);
          setEvents(eventsData);
        }
      } catch (error) {
        if (!ignore) {
          console.error("Error loading location:", error);
          setError("Unable to load this location and its events.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchLocationEvents();

    return () => {
      ignore = true;
    };
  }, [locationId]);

  if (loading) {
    return <p>Loading location and events...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!location) {
    return <p>Location not found.</p>;
  }

  return (
    <div className="location-events">
      <header>
        <div className="location-image">
          <img src={location.image} alt={location.name} />
        </div>

        <div className="location-info">
          <h2>{location.name}</h2>
          <p>{location.description}</p>
        </div>
      </header>

      <section aria-label="Events at this location">
        {events.length > 0 ? (
          events.map((event) => (
            <Event
              key={event.id}
              id={event.id}
              title={event.title}
              description={event.description}
              starts_at={event.starts_at}
              image={location.image}
              locationName={location.name}
            />
          ))
        ) : (
          <h2>
            <i
              className="fa-regular fa-calendar-xmark fa-shake"
              aria-hidden="true"
            ></i>{" "}
            No events scheduled at this location yet!
          </h2>
        )}
      </section>
    </div>
  );
};

export default LocationEvents;
