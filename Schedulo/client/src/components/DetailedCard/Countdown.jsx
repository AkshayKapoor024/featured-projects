import { useEffect, useState } from 'react';

function CountdownTimer({ eventDate, eventTime }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const target = new Date(`${eventDate} ${eventTime}`);

    const updateTimer = () => {
      const now = new Date();
      const diff = target - now;

      if (isNaN(diff)) {
        setTimeLeft("Invalid date format");
        return;
      }

      if (diff <= 0) {
        setTimeLeft('Event Started');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer(); // call once immediately
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [eventDate, eventTime]);

  return (
    <div className="text-base text-center 2xl:text-left 2xl:text-xl font-bold text-indigo-600">
      ⏳ {timeLeft}
    </div>
  );
}

export default CountdownTimer;