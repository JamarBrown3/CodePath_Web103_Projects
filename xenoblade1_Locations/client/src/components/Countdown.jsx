import React, { useEffect, useState } from "react";

const getTimeLeft = (startsAt) => {
  const diff = new Date(startsAt).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const Countdown = ({ startsAt }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(startsAt));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(startsAt)), 1000);
    return () => clearInterval(timer);
  }, [startsAt]);

  if (!timeLeft) {
    return <p className="countdown countdown-past">This event has passed.</p>;
  }

  return (
    <p className="countdown">
      {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </p>
  );
};

export default Countdown;
