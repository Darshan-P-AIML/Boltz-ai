import React, { useState, useEffect } from 'react';
import { Clock } from './Icons';

export default function CountdownTimer({ targetDate, onExpire }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft({ isExpired: true });
      return;
    }

    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();

      if (isNaN(target)) {
        setTimeLeft({ isExpired: true });
        return;
      }

      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (timeLeft.isExpired) {
    return (
      <span className="badge badge-ended" style={{ fontSize: '0.75rem' }}>
        CLOSED
      </span>
    );
  }

  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '0.35rem', 
      fontSize: '0.75rem', 
      color: 'var(--accent-amber)', 
      fontWeight: 600,
      background: 'rgba(245, 158, 11, 0.12)',
      border: '1px solid rgba(245, 158, 11, 0.25)',
      padding: '0.2rem 0.55rem',
      borderRadius: 'var(--radius-full)'
    }}>
      <Clock size={12} />
      <span>
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
      </span>
    </span>
  );
}
