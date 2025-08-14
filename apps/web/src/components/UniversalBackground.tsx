import React, { useEffect, useMemo, useRef, useState } from 'react';

interface UniversalBackgroundProps {
  /** Primary color for the center of the background */
  centerColorHex?: string;
  /** Secondary color for the edges of the background (optional) */
  edgeColorHex?: string;
  /** Enable slow hue cycling of the background */
  hueCycle?: boolean;
  /** Initial hue rotation in degrees for the cycle start */
  hueStartDeg?: number;
  /** Duration in ms for one full cycle */
  hueDurationMs?: number;
  /** Duration in ms for color transitions (default: 800ms) */
  transitionDurationMs?: number;
  /** Children to render on top of the background */
  children: React.ReactNode;
}

export function UniversalBackground({
  centerColorHex = '#6DCFF6',
  edgeColorHex,
  hueCycle = false,
  hueStartDeg = 0,
  hueDurationMs = 120000,
  transitionDurationMs = 800,
  children,
}: UniversalBackgroundProps) {
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
  const [displayCenterHex, setDisplayCenterHex] =
    useState<string>(centerColorHex);
  const [displayEdgeHex, setDisplayEdgeHex] = useState<string | undefined>(
    edgeColorHex
  );
  const [fadeCenterHex, setFadeCenterHex] = useState<string | null>(null);
  const [fadeEdgeHex, setFadeEdgeHex] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  const targetCenterHexRef = useRef<string>(centerColorHex);
  const targetEdgeHexRef = useRef<string | undefined>(edgeColorHex);

  // Handle center color transitions
  useEffect(() => {
    if (centerColorHex === displayCenterHex) return;
    targetCenterHexRef.current = centerColorHex;
    setFadeCenterHex(centerColorHex);
    // next frame to ensure transition kicks in
    const id = requestAnimationFrame(() => setFadeIn(true));
    return () => cancelAnimationFrame(id);
  }, [centerColorHex, displayCenterHex]);

  // Handle edge color transitions
  useEffect(() => {
    if (edgeColorHex === displayEdgeHex) return;
    targetEdgeHexRef.current = edgeColorHex;
    setFadeEdgeHex(edgeColorHex || null);
    // next frame to ensure transition kicks in
    const id = requestAnimationFrame(() => setFadeIn(true));
    return () => cancelAnimationFrame(id);
  }, [edgeColorHex, displayEdgeHex]);

  // Convert colors to RGB
  const centerRgb = useMemo(
    () => hexToRgb(displayCenterHex),
    [displayCenterHex]
  );
  const edgeRgb = useMemo(
    () => (displayEdgeHex ? hexToRgb(displayEdgeHex) : null),
    [displayEdgeHex]
  );
  const fadeCenterRgb = useMemo(
    () => hexToRgb(fadeCenterHex || displayCenterHex),
    [fadeCenterHex, displayCenterHex]
  );
  const fadeEdgeRgb = useMemo(
    () => (fadeEdgeHex ? hexToRgb(fadeEdgeHex) : null),
    [fadeEdgeHex]
  );

  // Create gradient backgrounds
  const createGradient = (
    centerR: number,
    centerG: number,
    centerB: number,
    edgeR?: number,
    edgeG?: number,
    edgeB?: number
  ) => {
    const edge1 =
      edgeR !== undefined
        ? `rgba(${edgeR}, ${edgeG}, ${edgeB}, 0.12)`
        : `rgba(255,255,255,0.12)`;
    const edge2 =
      edgeR !== undefined
        ? `rgba(${edgeR}, ${edgeG}, ${edgeB}, 0.12)`
        : `rgba(0,0,0,0.10)`;

    const lightCenterR = Math.min(255, centerR + 40);
    const lightCenterG = Math.min(255, centerG + 40);
    const lightCenterB = Math.min(255, centerB + 40);
    const darkCenterR = Math.max(0, centerR - 20);
    const darkCenterG = Math.max(0, centerG - 20);
    const darkCenterB = Math.max(0, centerB - 20);

    const lightColor = `rgba(${lightCenterR}, ${lightCenterG}, ${lightCenterB}, 0.1)`;
    const mainColor = `rgba(${centerR}, ${centerG}, ${centerB}, 0.06)`;
    const darkColor = `rgba(${darkCenterR}, ${darkCenterG}, ${darkCenterB}, 0.1)`;

    return `
      radial-gradient( 60% 60% at 50% 40%,
        ${mainColor} 0%,
        ${lightColor} 45%,
        ${darkColor} 70%,
        ${edge1} 100%
      ),
      linear-gradient(135deg,
        ${lightColor} 0%,
        ${mainColor} 50%,
        ${edge2} 100%
      )
    `;
  };

  const baseGradient = createGradient(
    centerRgb.r,
    centerRgb.g,
    centerRgb.b,
    edgeRgb?.r,
    edgeRgb?.g,
    edgeRgb?.b
  );

  const fadeGradient = createGradient(
    fadeCenterRgb.r,
    fadeCenterRgb.g,
    fadeCenterRgb.b,
    fadeEdgeRgb?.r,
    fadeEdgeRgb?.g,
    fadeEdgeRgb?.b
  );

  const transitionStyle = `all ${transitionDurationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;

  return (
    <div className="min-h-[100vh] min-h-[100svh] min-h-[100dvh] relative overflow-hidden">
      {/* Fixed background container - pinned to viewport */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Base layer (fades out) */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: fadeCenterHex || fadeEdgeHex ? (fadeIn ? 0 : 1) : 1,
            transition: transitionStyle,
            background: baseGradient,
            ...(hueCycle
              ? {
                  animation: `wf-hue-rotate ${hueDurationMs}ms linear infinite`,
                  ['--wf-hue-start' as any]: `${hueStartDeg}deg`,
                  filter: 'hue-rotate(var(--wf-hue-start)) saturate(1.15)',
                  willChange: 'filter',
                }
              : {}),
          }}
        />

        {/* Fade-in layer (fades in to new color) */}
        {(fadeCenterHex || fadeEdgeHex) && (
          <div
            className="absolute inset-0 w-full h-full"
            onTransitionEnd={(e) => {
              if (e.propertyName !== 'opacity') return;
              if (fadeIn) {
                // Fade-in reached; swap base to the new colors while overlay is at max opacity
                setDisplayCenterHex(fadeCenterHex || centerColorHex);
                setDisplayEdgeHex(fadeEdgeHex || edgeColorHex);
                // Then start fading overlay out next frame
                requestAnimationFrame(() => setFadeIn(false));
              } else {
                // Fade-out completed; remove overlay to avoid any stacking
                setFadeCenterHex(null);
                setFadeEdgeHex(null);
              }
            }}
            style={{
              opacity: fadeIn ? 1 : 0,
              transition: transitionStyle,
              background: fadeGradient,
              ...(hueCycle
                ? {
                    animation: `wf-hue-rotate ${hueDurationMs}ms linear infinite`,
                    ['--wf-hue-start' as any]: `${hueStartDeg}deg`,
                    filter: 'hue-rotate(var(--wf-hue-start)) saturate(1.15)',
                    willChange: 'filter',
                  }
                : {}),
            }}
          />
        )}

        {/* Subtle noise texture */}
        <div className="absolute inset-0 w-full h-full noise-overlay opacity-20" />
      </div>

      {/* Main content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
