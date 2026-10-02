import React, { useState, useEffect } from "react";
import LocationsAPI from "../services/LocationsAPI";
import { Link } from "react-router-dom";
import "../css/Locations.css";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsData = await LocationsAPI.getAllLocations();
        setLocations(locationsData);
      } catch (error) {
        console.error("Error loading locations:", error);
        setError("Unable to load locations. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div className="locations-page">
      <h1>Explore Xenoblade Chronicles Locations</h1>

      {loading && <p>Loading locations...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && locations.length === 0 && (
        <p>No locations available.</p>
      )}

      <div className="locations-grid">
        {locations.map((location) => (
          <article key={location.id} className="location-card">
            <Link to={`/locations/${location.id}`}>
              <img src={location.image} alt={location.name} />
              <h2>{location.name}</h2>
            </Link>

            <p>{location.description}</p>

            <Link to={`/locations/${location.id}`}>View Events</Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Locations;
