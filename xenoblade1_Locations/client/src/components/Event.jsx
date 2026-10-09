import React from "react";
import "../css/Event.css";
import Countdown from "./Countdown";

const Event = ({ title, description, starts_at, image, locationName }) => {
  const eventDate = new Date(starts_at);
  const validDate = !Number.isNaN(eventDate.getTime());
  const isPast = validDate && eventDate.getTime() < Date.now();

  return (
    <article className={`event-information${isPast ? " past" : ""}`}>
      {image && (
        <img
          className="event-image"
          src={image}
          alt={locationName || "Event location"}
          loading="lazy"
        />
      )}
      <div className="event-content">
        {locationName && (
          <p className="event-location">{locationName}</p>
        )}
        <h3>{title}</h3>

        <p className="event-description">{description}</p>

        <p className="event-date">
          <i
            className="fa-regular fa-calendar-days fa-bounce"
            aria-hidden="true"
          ></i>{" "}
          {validDate ? (
            <time dateTime={eventDate.toISOString()}>
              {eventDate.toLocaleString()}
            </time>
          ) : (
            <span>Date unavailable</span>
          )}
        </p>

        {validDate && <Countdown startsAt={starts_at} />}
      </div>
    </article>
  );
};

export default Event;
