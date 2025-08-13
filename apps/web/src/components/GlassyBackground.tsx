import React, { useEffect, useMemo, useRef, useState } from 'react';

interface GlassyBackgroundProps {
  colorHex?: string;
  children: React.ReactNode;
  /** Enable slow hue cycling of the background overlay (does not affect children) */
  hueCycle?: boolean;
  /** Initial hue rotation in degrees for the cycle start */
  hueStartDeg?: number;
  /** Optional duration override in ms for one full cycle */
  hueDurationMs?: number;
}

export function GlassyBackground({
  colorHex = '#6DCFF6',
  children,
  hueCycle = false,
  hueStartDeg = 0,
  hueDurationMs,
}: GlassyBackgroundProps) {
  // Convert hex to RGB for CSS variables
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 109, g: 207, b: 246 }; // Default blue
  };

  // Smooth crossfade between background color changes
  const [displayHex, setDisplayHex] = useState<string>(colorHex);
  const [fadeHex, setFadeHex] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  const targetHexRef = useRef<string>(colorHex);
  useEffect(() => {
    if (colorHex === displayHex) return;
    targetHexRef.current = colorHex;
    setFadeHex(colorHex);
    // next frame to ensure transition kicks in
    const id = requestAnimationFrame(() => setFadeIn(true));
    return () => cancelAnimationFrame(id);
  }, [colorHex, displayHex]);

  const {
    r: rBase,
    g: gBase,
    b: bBase,
  } = useMemo(() => hexToRgb(displayHex), [displayHex]);
  const {
    r: rFade,
    g: gFade,
    b: bFade,
  } = useMemo(() => hexToRgb(fadeHex || displayHex), [fadeHex, displayHex]);

  const baseVars = {
    '--accent-r': rBase,
    '--accent-g': gBase,
    '--accent-b': bBase,
  } as React.CSSProperties;

  const fadeVars = {
    '--accent-r': rFade,
    '--accent-g': gFade,
    '--accent-b': bFade,
  } as React.CSSProperties;

  return (
    <div className="min-h-[100vh] min-h-[100svh] min-h-[100dvh] relative overflow-hidden">
      {/* Animated gradient background */}
      {/* Base layer (fades out) */}
      <div
        className="absolute inset-0"
        style={{
          ...baseVars,
          // Crossfade: base fades out while overlay fades in, keeping total ~0.7
          opacity: fadeHex ? (fadeIn ? 0 : 0.7) : 0.7,
          transition: 'opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)',
          background: `
            radial-gradient(circle at 20% 80%, rgba(${rBase}, ${gBase}, ${bBase}, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(${Math.min(255, rBase + 30)}, ${Math.min(255, gBase + 30)}, ${Math.min(255, bBase + 30)}, 0.35) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(${Math.max(0, rBase - 30)}, ${Math.max(0, gBase - 30)}, ${Math.max(0, bBase - 30)}, 0.25) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)
          `,
          ...(hueCycle
            ? {
                animation: `wf-hue-rotate ${
                  typeof hueDurationMs === 'number'
                    ? `${hueDurationMs}ms`
                    : '180000ms'
                } linear infinite`,
                ['--wf-hue-start' as any]: `${hueStartDeg}deg`,
                filter: 'hue-rotate(var(--wf-hue-start)) saturate(1.15)',
                willChange: 'filter',
              }
            : {}),
        }}
      />

      {/* Fade-in layer (fades in to new color) */}
      {fadeHex && (
        <div
          className="absolute inset-0"
          onTransitionEnd={(e) => {
            if (e.propertyName !== 'opacity') return;
            if (fadeIn) {
              // Fade-in reached; swap base to the new color while overlay is at max opacity
              setDisplayHex(fadeHex || colorHex);
              // Then start fading overlay out next frame
              requestAnimationFrame(() => setFadeIn(false));
            } else {
              // Fade-out completed; remove overlay to avoid any stacking
              setFadeHex(null);
            }
          }}
          style={{
            ...fadeVars,
            opacity: fadeIn ? 0.7 : 0,
            transition: 'opacity 400ms cubic-bezier(0.22, 1, 0.36, 1)',
            background: `
              radial-gradient(circle at 20% 80%, rgba(${rFade}, ${gFade}, ${bFade}, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(${Math.min(255, rFade + 30)}, ${Math.min(255, gFade + 30)}, ${Math.min(255, bFade + 30)}, 0.35) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(${Math.max(0, rFade - 30)}, ${Math.max(0, gFade - 30)}, ${Math.max(0, bFade - 30)}, 0.25) 0%, transparent 50%),
              linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)
            `,
            ...(hueCycle
              ? {
                  animation: `wf-hue-rotate ${
                    typeof hueDurationMs === 'number'
                      ? `${hueDurationMs}ms`
                      : '180000ms'
                  } linear infinite`,
                  ['--wf-hue-start' as any]: `${hueStartDeg}deg`,
                  filter: 'hue-rotate(var(--wf-hue-start)) saturate(1.15)',
                  willChange: 'filter',
                }
              : {}),
          }}
        />
      )}

      {/* Subtle noise texture */}
      <div className="absolute inset-0 noise-overlay opacity-20" />

      {/* Main content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
