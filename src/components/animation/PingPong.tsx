'use client';

import { useEffect, useRef, useState } from 'react';

interface PingPongProps {
  children: React.ReactNode;
  className?: string;
  /** pixels per second */
  speed?: number;
  /** milliseconds to pause at each end */
  pause?: number;
}

export function PingPong({ children, className, speed = 50, pause = 1000 }: PingPongProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);

  const offsetRef = useRef(0);      // current scroll offset
  const directionRef = useRef(1);   // 1 = left, -1 = right
  const pauseTimerRef = useRef(0);  // time left to pause in ms
  const lastTimeRef = useRef<number | null>(null);

  // measure overflow dynamically
  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const frame = requestAnimationFrame(() => {
      const o = text.scrollWidth - container.clientWidth;
      setOverflow(o > 0 ? o : 0);
      offsetRef.current = 0;
      directionRef.current = 1;
      pauseTimerRef.current = 0;
      lastTimeRef.current = null;
      if (textRef.current) textRef.current.style.transform = 'translateX(0)';
    });

    return () => cancelAnimationFrame(frame);
  }, [children]);

  // animation loop
  useEffect(() => {
    if (overflow <= 0) return;

    const step = (timestamp: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const deltaMs = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (pauseTimerRef.current > 0) {
        pauseTimerRef.current -= deltaMs;
      } else {
        offsetRef.current += directionRef.current * speed * (deltaMs / 1000);

        if (offsetRef.current >= overflow) {
          offsetRef.current = overflow;
          directionRef.current = -1;
          pauseTimerRef.current = pause;
        } else if (offsetRef.current <= 0) {
          offsetRef.current = 0;
          directionRef.current = 1;
          pauseTimerRef.current = pause;
        }
      }

      if (textRef.current) {
        textRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      }

      requestAnimationFrame(step);
    };

    const frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [overflow, speed, pause]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={textRef} className="inline-block whitespace-nowrap">
        {children}
      </div>
    </div>
  );
}

// -------------------------
// Example usage
// -------------------------

export default function PingPongDemo() {
  return (
    <div className="w-[300px] border p-2">
      <PingPong speed={30} pause={3000}>
        Smoothly scrolls left and right if it exceeds the container width.
      </PingPong>
    </div>
  );
}