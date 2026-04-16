'use client';

import { cn } from '@/lib/utils';
import { usePlayerMain } from '@/modules/player/context/usePlayerMain';
import { usePlayerMedia } from '@/modules/player/context/usePlayerMedia';
import { useEffect, useMemo, useRef } from 'react';

// ----------------------------------------------------------------------

export type VisualizerBarsConfig = {
  /**
   * Maximum decibels for analyser normalization.
   * Higher (less negative) makes peaks saturate sooner.
   *
   * Typical range: `-30` to `-10`.
   */
  decibelsMax: number;

  /**
   * Minimum decibels for analyser normalization.
   * Lower (more negative) makes quiet audio show up more.
   *
   * Typical range: `-100` to `-60`.
   */
  decibelsMin: number;

  /**
   * Duplicates the bars horizontally by mirroring them around the screen center.
   *
   * - `undefined`: render a single set of bars across the full width (default).
   * - `'left'`: center-out (lowest index + red hues near center, extending outward).
   * - `'right'`: edge-in (lowest index + red hues near edges, extending inward).
   *
   * In doubled modes, the bars are rendered at half-width per side and mirrored across the center.
   *
   * @default undefined
   */
  double?: 'left' | 'right';

  /**
   * FFT size used by the WebAudio `AnalyserNode`.
   * - Higher = more frequency detail, more bins, slightly more CPU.
   * - Must be a power of two in WebAudio (the visualizer will clamp as needed).
   *
   * Common values: `256`, `512`, `1024`, `2048`.
   */
  fftSize: number;

  /**
   * Optional shaping for frequency distribution.
   * - `1` = neutral (current behavior)
   * - `>1` = allocate more bars toward the low end
   * - `<1` = allocate more bars toward the high end
   *
   * @default 1
   */
  frequencyExponent?: number;

  /**
   * How bars are distributed across the selected frequency range.
   *
   * @default 'linear'
   */
  frequencyScale?: 'linear' | 'log';

  /**
   * Maximum frequency (Hz) used for sampling the analyser.
   *
   * @default Nyquist (sampleRate / 2)
   */
  hzMax?: number;

  /**
   * Minimum frequency (Hz) used for sampling the analyser.
   *
   * @default 0
   */
  hzMin?: number;

  /**
   * If true, mirrors bars across the center line (up+down).
   */
  mirror: boolean;

  /**
   * Bars opacity (alpha channel).
   *
   * @default 0.9
   */
  opacity?: number;

  /**
   * Color palette identifier.
   * Current renderer supports:
   * - `'rainbow'` (multi-hue across bars)
   * - anything else falls back to a single cool hue.
   */
  palette: string;

  /**
   * Linear multiplier applied to the normalized bin value.
   * - `1` = neutral.
   * - `>1` = more reactive (taller bars).
   * - `<1` = calmer.
   */
  sensitivity: number;

  /**
   * WebAudio smoothing factor for the analyser output.
   * - `0` = no smoothing (snappier / more jitter).
   * - `1` = heavily smoothed (slower response).
   */
  smoothing: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function clamp01(n: number) {
  return clamp(n, 0, 1);
}

export function VisualizerBars({
  className,
  config,
}: {
  className?: string;
  config: VisualizerBarsConfig;
}) {
  const { playing, track } = usePlayerMain();
  const { mediaEl } = usePlayerMedia();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const boundMediaElRef = useRef<HTMLMediaElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const bufferRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  const opts = config;
  const bars = useMemo(() => Math.max(12, Math.floor(opts.fftSize / 8)), [opts.fftSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    // Only run when a media element exists; connecting routes audio through WebAudio for analysis.
    if (!mediaEl) return;
    if (!(mediaEl instanceof HTMLMediaElement)) return;

    const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextCtor) return;

    const ctx = (audioCtxRef.current ?? new AudioContextCtor()) as AudioContext;
    audioCtxRef.current = ctx;

    // If the underlying element changes, rebuild the source node.
    if (boundMediaElRef.current && boundMediaElRef.current !== mediaEl) {
      try {
        sourceRef.current?.disconnect();
        analyserRef.current?.disconnect();
      } catch {
        // ignore
      }
      sourceRef.current = null;
    }
    boundMediaElRef.current = mediaEl;

    // Only one MediaElementAudioSourceNode can be created per element.
    if (!sourceRef.current) {
      try {
        sourceRef.current = ctx.createMediaElementSource(mediaEl);
      } catch {
        // If a source node already exists for this element, bail gracefully.
        return;
      }
    }

    const analyser = (analyserRef.current ?? ctx.createAnalyser()) as AnalyserNode;
    analyserRef.current = analyser;

    analyser.fftSize = clamp(opts.fftSize, 32, 32768);
    analyser.smoothingTimeConstant = clamp(opts.smoothing, 0, 1);
    analyser.minDecibels = opts.decibelsMin;
    analyser.maxDecibels = opts.decibelsMax;

    // Wire graph once.
    const source = sourceRef.current;
    try {
      // Disconnect first in case of HMR / preset changes.
      source.disconnect();
      analyser.disconnect();
    } catch {
      // ignore
    }

    source.connect(analyser);
    analyser.connect(ctx.destination);

    return () => {
      // Keep audio playing; avoid disconnecting on teardown.
    };
  }, [mediaEl, opts.decibelsMax, opts.decibelsMin, opts.fftSize, opts.smoothing]);

  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    if (!playing) return;
    void ctx.resume?.();
  }, [playing, track?.src]);

  useEffect(() => {
    // Browsers often require a user gesture to start an AudioContext. Prime a one-time resume handler.
    const resume = () => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state !== 'suspended') return;
      void ctx.resume?.();
    };
    window.addEventListener('pointerdown', resume, { once: true, capture: true });
    return () => window.removeEventListener('pointerdown', resume, { capture: true } as any);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    const dpr = window.devicePixelRatio || 1;

    const draw = (ms: number) => {
      rafRef.current = requestAnimationFrame(draw);

      const analyser = analyserRef.current;
      if (analyser) {
        if (!bufferRef.current || bufferRef.current.length !== analyser.frequencyBinCount) {
          bufferRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;
        }
        analyser.getByteFrequencyData(bufferRef.current);
      }
      const buffer = analyser ? bufferRef.current : null;

      const w = canvas.width;
      const h = canvas.height;
      ctx2d.clearRect(0, 0, w, h);

      const usableW = Math.max(1, w);
      const usableH = Math.max(1, h);

      const barCount = bars;
      const gap = 2 * dpr;
      const doubled = opts.double === 'left' || opts.double === 'right';
      const barW = usableW / (doubled ? barCount * 2 : barCount);
      const centerX = usableW / 2;

      const alpha = clamp(opts.opacity ?? 0.9, 0, 1);

      const centerY = usableH / 2;
      const halfH = usableH / 2;

      const binForIndex = (index: number) => {
        if (!analyser || !buffer) return 0;
        const bufferLen = buffer.length;
        if (bufferLen <= 1) return 0;

        const sampleRate = analyser.context.sampleRate || 44100;
        const nyquist = sampleRate / 2;
        const hzMin = Math.max(0, opts.hzMin ?? 0);
        const hzMax = clamp(opts.hzMax ?? nyquist, 0, nyquist);

        const scale = opts.frequencyScale ?? 'linear';
        const exponent = Number.isFinite(opts.frequencyExponent ?? 1)
          ? (opts.frequencyExponent ?? 1)
          : 1;

        const baseT = index / barCount; // preserve existing behavior (never reaches 1.0)
        const shapedT = exponent === 1 ? baseT : Math.pow(clamp01(baseT), exponent);

        if (scale === 'log') {
          // Log-frequency interpolation (requires a non-zero lower bound).
          const minF = Math.max(1, hzMin);
          const maxF = Math.max(minF + 1, hzMax || nyquist);
          const hz = minF * Math.pow(maxF / minF, clamp01(shapedT));

          const binHz = sampleRate / analyser.fftSize;
          const rawBin = Math.floor(hz / binHz);
          return clamp(rawBin, 0, bufferLen - 1);
        }

        // Linear mapping across a bin window.
        const binHz = sampleRate / analyser.fftSize;
        const minBin = clamp(Math.floor(hzMin / binHz), 0, bufferLen - 1);
        const maxBinExclusive = clamp(Math.ceil(hzMax / binHz) + 1, minBin + 1, bufferLen);
        const span = Math.max(1, maxBinExclusive - minBin);
        const rawBin = minBin + Math.floor(clamp01(shapedT) * span);
        return clamp(rawBin, minBin, maxBinExclusive - 1);
      };

      const drawBarAt = (x: number, index: number) => {
        const v = buffer ? (buffer[binForIndex(index)] ?? 0) / 255 : 0;
        const scaled = clamp(v * opts.sensitivity, 0, 1);

        const barH = scaled * (opts.mirror ? halfH : usableH);
        const y = opts.mirror ? centerY - barH : usableH - barH;

        const hue = opts.palette === 'rainbow' ? Math.floor((index / barCount) * 300) : 210;
        ctx2d.fillStyle = `hsla(${hue} 90% 60% / ${alpha})`;

        ctx2d.fillRect(x, y, Math.max(1, barW - gap), barH);

        if (opts.mirror) {
          const y2 = centerY;
          ctx2d.fillRect(x, y2, Math.max(1, barW - gap), barH);
        }
      };

      for (let i = 0; i < barCount; i += 1) {
        if (!doubled) {
          drawBarAt(i * barW, i);
          continue;
        }

        const index = opts.double === 'right' ? barCount - 1 - i : i;
        const xRight = centerX + i * barW;
        const xLeft = centerX - (i + 1) * barW;
        drawBarAt(xRight, index);
        drawBarAt(xLeft, index);
      }
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [
    bars,
    opts.decibelsMax,
    opts.decibelsMin,
    opts.double,
    opts.frequencyExponent,
    opts.frequencyScale,
    opts.hzMax,
    opts.hzMin,
    opts.mirror,
    opts.opacity,
    opts.palette,
    opts.sensitivity,
    opts.smoothing,
  ]);

  return (
    <div className={cn('pointer-events-none', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
