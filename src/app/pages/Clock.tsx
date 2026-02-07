import { useEffect, useState } from 'react';

export default function Clock() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let rafId: number;

    const tick = () => {
      setNow(Date.now());
      rafId = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(rafId);
  }, []);

  const time = new Date(now);

  return (
    <div className="text-sm opacity-80">
      {time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}
    </div>
  );
}
