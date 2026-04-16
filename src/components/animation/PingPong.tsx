'use client';

import { useEffect, useRef, useState } from 'react';

interface PingPongProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // pixels per second
  pause?: number; // ms to pause at each end
}

export function PingPong({ children, className, speed = 50, pause = 1000 }: PingPongProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [overflow, setOverflow] = useState(0);
  const [hovered, setHovered] = useState(false);

  const offsetRef = useRef(0);
  const directionRef = useRef(1);
  const pauseTimerRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  // measure overflow
  useEffect(() => {
    void children;

    const measure = () => {
      const container = containerRef.current;
      const text = textRef.current;
      if (!container || !text) return;

      const o = text.scrollWidth - container.clientWidth;
      setOverflow(o > 0 ? o : 0);

      offsetRef.current = 0;
      directionRef.current = 1;
      pauseTimerRef.current = 0;
      lastTimeRef.current = null;
      text.style.transform = 'translateX(0)';
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [children]);

  // animation loop
  useEffect(() => {
    if (overflow <= 0) return;

    let frameId: number;

    const step = (timestamp: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (!hovered) {
        // handle pause at ends
        if (pauseTimerRef.current > 0) {
          pauseTimerRef.current -= delta;
        } else {
          offsetRef.current += directionRef.current * speed * (delta / 1000);

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
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [overflow, speed, pause, hovered]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className ?? ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
