import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ deadline, status, onZero }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isLate, setIsLate] = useState(false);

  useEffect(() => {
    if (status === 'done' || status === 'in_review') {
      setTimeLeft(status === 'done' ? 'Completed' : 'Under Review');
      setIsLate(false);
      return;
    }

    const targetDate = new Date(deadline).getTime();
    let zeroTriggered = false;

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        if (!zeroTriggered) {
          zeroTriggered = true;
          if (onZero) onZero();
        }
        setIsLate(true);
        setTimeLeft('Deadline Passed');
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      setIsLate(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [deadline, status, onZero]);

  return (
    <span style={{ 
      color: status === 'done' ? '#16A34A' : (isLate ? '#EF4444' : 'var(--color-text)'),
      fontWeight: '500' 
    }}>
      {timeLeft}
    </span>
  );
}
