import React from "react";
import "../css/Event.css";
import Countdown from "./Countdown";

const Event = (props) => {
  const eventDate = new Date(props.starts_at);
  const validDate = !Number.isNaN(eventDate.getTime());
  const isPast = validDate && eventDate.getTime() < Date.now();

  return (
    <article className={`event-information${isPast ? " past" : ""}`}>
      {props.image && (
        <img
          className="event-image"
          src={props.image}
          alt={props.locationName || "Event location"}
          loading="lazy"
        />
      )}
      <div className="event-content">
        {props.locationName && (
          <p className="event-location">{props.locationName}</p>
        )}
        <h3>{props.title}</h3>

        <p className="event-description">{props.description}</p>

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

        {validDate && <Countdown startsAt={props.starts_at} />}
      </div>
    </article>
  );
};

export default Event;
