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
  const [currentCenterHex, setCurrentCenterHex] =
    useState<string>(centerColorHex);
  const [currentEdgeHex, setCurrentEdgeHex] = useState<string | undefined>(
    edgeColorHex
  );
  const [nextCenterHex, setNextCenterHex] = useState<string | null>(null);
  const [nextEdgeHex, setNextEdgeHex] = useState<string | null>(null);
  const [crossfadeProgress, setCrossfadeProgress] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const transitionRef = useRef<number | null>(null);

  // Handle center color transitions with smooth crossfade
  useEffect(() => {
    if (centerColorHex === currentCenterHex && edgeColorHex === currentEdgeHex)
      return;

    // If we're already transitioning, queue the next change
    if (isTransitioning) {
      // Cancel current transition and start new one
      if (transitionRef.current) {
        cancelAnimationFrame(transitionRef.current);
      }
      setCrossfadeProgress(0);
    }

    setNextCenterHex(centerColorHex);
    setNextEdgeHex(edgeColorHex || null);
    setIsTransitioning(true);

    const startTime = performance.now();
    const duration = transitionDurationMs;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use ease-in-out curve for smoother transition
      const easedProgress =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setCrossfadeProgress(easedProgress);

      if (progress < 1) {
        transitionRef.current = requestAnimationFrame(animate);
      } else {
        // Transition complete
        setCurrentCenterHex(centerColorHex);
        setCurrentEdgeHex(edgeColorHex);
        setNextCenterHex(null);
        setNextEdgeHex(null);
        setCrossfadeProgress(0);
        setIsTransitioning(false);
        transitionRef.current = null;
      }
    };

    transitionRef.current = requestAnimationFrame(animate);

    return () => {
      if (transitionRef.current) {
        cancelAnimationFrame(transitionRef.current);
        transitionRef.current = null;
      }
    };
  }, [
    centerColorHex,
    edgeColorHex,
    currentCenterHex,
    currentEdgeHex,
    isTransitioning,
    transitionDurationMs,
  ]);

  // Convert colors to RGB
  const currentCenterRgb = useMemo(
    () => hexToRgb(currentCenterHex),
    [currentCenterHex]
  );
  const currentEdgeRgb = useMemo(
    () => (currentEdgeHex ? hexToRgb(currentEdgeHex) : null),
    [currentEdgeHex]
  );
  const nextCenterRgb = useMemo(
    () => (nextCenterHex ? hexToRgb(nextCenterHex) : null),
    [nextCenterHex]
  );
  const nextEdgeRgb = useMemo(
    () => (nextEdgeHex ? hexToRgb(nextEdgeHex) : null),
    [nextEdgeHex]
  );

  // Interpolate between current and next colors
  const interpolateColor = (
    current: number,
    next: number | null,
    progress: number
  ) => {
    if (next === null) return current;
    return current + (next - current) * progress;
  };

  const displayCenterRgb = {
    r: interpolateColor(
      currentCenterRgb.r,
      nextCenterRgb?.r || null,
      crossfadeProgress
    ),
    g: interpolateColor(
      currentCenterRgb.g,
      nextCenterRgb?.g || null,
      crossfadeProgress
    ),
    b: interpolateColor(
      currentCenterRgb.b,
      nextCenterRgb?.b || null,
      crossfadeProgress
    ),
  };

  // Calculate edge color with opacity interpolation for smooth add/remove
  const getEdgeColorWithOpacity = () => {
    const hasCurrentEdge = currentEdgeRgb !== null;
    const hasNextEdge = nextEdgeRgb !== null;

    // If we have both current and next edge colors, interpolate normally
    if (hasCurrentEdge && hasNextEdge) {
      return {
        r: interpolateColor(
          currentEdgeRgb!.r,
          nextEdgeRgb!.r,
          crossfadeProgress
        ),
        g: interpolateColor(
          currentEdgeRgb!.g,
          nextEdgeRgb!.g,
          crossfadeProgress
        ),
        b: interpolateColor(
          currentEdgeRgb!.b,
          nextEdgeRgb!.b,
          crossfadeProgress
        ),
        opacity: 1, // Full opacity when transitioning between colors
      };
    }

    // If we're transitioning from no edge color to having one (fade in)
    if (!hasCurrentEdge && hasNextEdge) {
      return {
        r: nextEdgeRgb!.r,
        g: nextEdgeRgb!.g,
        b: nextEdgeRgb!.b,
        opacity: crossfadeProgress, // Fade in from 0 to 1
      };
    }

    // If we're transitioning from having edge color to none (fade out)
    if (hasCurrentEdge && !hasNextEdge) {
      return {
        r: currentEdgeRgb!.r,
        g: currentEdgeRgb!.g,
        b: currentEdgeRgb!.b,
        opacity: 1 - crossfadeProgress, // Fade out from 1 to 0
      };
    }

    // No edge color at all
    return null;
  };

  const displayEdgeRgb = getEdgeColorWithOpacity();

  // Create organic, asymmetric gradient backgrounds with multiple layers
  const createOrganicGradient = (
    centerR: number,
    centerG: number,
    centerB: number,
    edgeR?: number,
    edgeG?: number,
    edgeB?: number,
    edgeOpacity: number = 1
  ) => {
    // Use edge color if provided, otherwise create a complementary color
    const effectiveEdgeR = edgeR ?? Math.max(0, Math.min(255, centerR + 60));
    const effectiveEdgeG = edgeG ?? Math.max(0, Math.min(255, centerG - 40));
    const effectiveEdgeB = edgeB ?? Math.max(0, Math.min(255, centerB + 80));

    // Create variations for depth and organic feel
    const lightCenterR = Math.min(255, centerR + 50);
    const lightCenterG = Math.min(255, centerG + 50);
    const lightCenterB = Math.min(255, centerB + 50);

    const darkCenterR = Math.max(0, centerR - 30);
    const darkCenterG = Math.max(0, centerG - 30);
    const darkCenterB = Math.max(0, centerB - 30);

    const lightEdgeR = Math.min(255, effectiveEdgeR + 40);
    const lightEdgeG = Math.min(255, effectiveEdgeG + 40);
    const lightEdgeB = Math.min(255, effectiveEdgeB + 40);

    // Fixed positions for organic shapes
    const primaryX = 45;
    const primaryY = 35;
    const secondaryX = 55;
    const secondaryY = 65;
    const tertiaryX = 25;
    const tertiaryY = 75;

    // Create organic, asymmetric shapes with multiple layers
    return `
      /* Primary organic blob - asymmetric, flowing */
      radial-gradient(ellipse 80% 60% at ${primaryX}% ${primaryY}%,
        rgba(${centerR}, ${centerG}, ${centerB}, 0.18) 0%,
        rgba(${lightCenterR}, ${lightCenterG}, ${lightCenterB}, 0.14) 40%,
        rgba(${darkCenterR}, ${darkCenterG}, ${darkCenterB}, 0.08) 70%,
        transparent 100%
      ),
      /* Secondary organic blob - offset, creates asymmetry */
      radial-gradient(ellipse 85% 65% at ${secondaryX}% ${secondaryY}%,
        rgba(${effectiveEdgeR}, ${effectiveEdgeG}, ${effectiveEdgeB}, ${0.18 * edgeOpacity}) 0%,
        rgba(${lightEdgeR}, ${lightEdgeG}, ${lightEdgeB}, ${0.14 * edgeOpacity}) 45%,
        transparent 85%
      ),
      /* Tertiary accent blob - smaller, adds depth */
      radial-gradient(ellipse 40% 30% at ${tertiaryX}% ${tertiaryY}%,
        rgba(${centerR}, ${centerG}, ${centerB}, 0.12) 0%,
        rgba(${lightCenterR}, ${lightCenterG}, ${lightCenterB}, 0.08) 60%,
        transparent 100%
      ),
      /* Enhanced ambient glow layer */
      radial-gradient(ellipse 120% 80% at 50% 50%,
        rgba(${centerR}, ${centerG}, ${centerB}, 0.08) 0%,
        rgba(${effectiveEdgeR}, ${effectiveEdgeG}, ${effectiveEdgeB}, ${0.06 * edgeOpacity}) 60%,
        transparent 100%
      ),
      /* Additional secondary color prominence layer */
      radial-gradient(ellipse 100% 70% at 60% 60%,
        rgba(${effectiveEdgeR}, ${effectiveEdgeG}, ${effectiveEdgeB}, ${0.12 * edgeOpacity}) 0%,
        rgba(${lightEdgeR}, ${lightEdgeG}, ${lightEdgeB}, ${0.08 * edgeOpacity}) 50%,
        transparent 80%
      ),
      /* Organic flowing lines - creates movement */
      conic-gradient(from 45deg at 30% 40%,
        transparent 0deg,
        rgba(${centerR}, ${centerG}, ${centerB}, 0.06) 60deg,
        transparent 120deg,
        rgba(${effectiveEdgeR}, ${effectiveEdgeG}, ${effectiveEdgeB}, ${0.06 * edgeOpacity}) 180deg,
        transparent 240deg,
        rgba(${centerR}, ${centerG}, ${centerB}, 0.04) 300deg,
        transparent 360deg
      ),
      /* Enhanced diagonal flow */
      linear-gradient(135deg,
        rgba(${centerR}, ${centerG}, ${centerB}, 0.06) 0%,
        transparent 30%,
        rgba(${effectiveEdgeR}, ${effectiveEdgeG}, ${effectiveEdgeB}, ${0.06 * edgeOpacity}) 70%,
        transparent 100%
      ),
      /* Reduced warm ambient overlay */
      radial-gradient(ellipse 150% 100% at 50% 50%,
        rgba(255, 248, 240, 0.008) 0%,
        transparent 70%
      )
    `;
  };

  const currentGradient = createOrganicGradient(
    displayCenterRgb.r,
    displayCenterRgb.g,
    displayCenterRgb.b,
    displayEdgeRgb?.r,
    displayEdgeRgb?.g,
    displayEdgeRgb?.b,
    displayEdgeRgb?.opacity ?? 1
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionRef.current) {
        cancelAnimationFrame(transitionRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen md:h-screen relative md:overflow-hidden">
      {/* Background container - moves with content */}
      <div className="absolute inset-0 w-full min-h-full z-0">
        {/* Single background layer with interpolated colors */}
        <div
          className="absolute inset-0 w-full min-h-full"
          style={{
            background: currentGradient,
            ...(hueCycle
              ? ({
                  animation: `wf-hue-rotate ${hueDurationMs}ms linear infinite`,
                  '--wf-hue-start': `${hueStartDeg}deg`,
                  filter: 'hue-rotate(var(--wf-hue-start)) saturate(1.15)',
                  willChange: 'filter',
                } as React.CSSProperties)
              : {
                  animation: 'wf-temperature-shift 15s ease-in-out infinite',
                  willChange: 'filter',
                }),
          }}
        />

        {/* Animated organic shapes layer */}
        <div
          className="absolute inset-0 w-full min-h-full organic-shapes"
          style={{
            animation: 'wf-breathing 8s ease-in-out infinite',
          }}
        />

        {/* Subtle noise texture */}
        <div className="absolute inset-0 w-full min-h-full noise-overlay opacity-10" />
      </div>

      {/* Main content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
