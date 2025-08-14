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

  // Mouse parallax effect for subtle interactivity
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const backgroundRef = useRef<HTMLDivElement>(null);

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

  // Create organic, asymmetric gradient backgrounds with multiple layers
  const createOrganicGradient = (
    centerR: number,
    centerG: number,
    centerB: number,
    edgeR?: number,
    edgeG?: number,
    edgeB?: number,
    mouseX: number = 0.5,
    mouseY: number = 0.5
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

    // Calculate mouse-influenced positions for more dynamic feel
    const primaryX = 45 + (mouseX - 0.5) * 10;
    const primaryY = 35 + (mouseY - 0.5) * 10;
    const secondaryX = 55 + (mouseX - 0.5) * 15;
    const secondaryY = 65 + (mouseY - 0.5) * 15;
    const tertiaryX = 25 + (mouseX - 0.5) * 20;
    const tertiaryY = 75 + (mouseY - 0.5) * 20;

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
        rgba(${effectiveEdgeR}, ${effectiveEdgeG}, ${effectiveEdgeB}, 0.18) 0%,
        rgba(${lightEdgeR}, ${lightEdgeG}, ${lightEdgeB}, 0.14) 45%,
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
        rgba(${effectiveEdgeR}, ${effectiveEdgeG}, ${effectiveEdgeB}, 0.06) 60%,
        transparent 100%
      ),
      /* Additional secondary color prominence layer */
      radial-gradient(ellipse 100% 70% at 60% 60%,
        rgba(${effectiveEdgeR}, ${effectiveEdgeG}, ${effectiveEdgeB}, 0.12) 0%,
        rgba(${lightEdgeR}, ${lightEdgeG}, ${lightEdgeB}, 0.08) 50%,
        transparent 80%
      ),
      /* Organic flowing lines - creates movement */
      conic-gradient(from 45deg at 30% 40%,
        transparent 0deg,
        rgba(${centerR}, ${centerG}, ${centerB}, 0.06) 60deg,
        transparent 120deg,
        rgba(${effectiveEdgeR}, ${effectiveEdgeG}, ${effectiveEdgeB}, 0.06) 180deg,
        transparent 240deg,
        rgba(${centerR}, ${centerG}, ${centerB}, 0.04) 300deg,
        transparent 360deg
      ),
      /* Enhanced diagonal flow */
      linear-gradient(135deg,
        rgba(${centerR}, ${centerG}, ${centerB}, 0.06) 0%,
        transparent 30%,
        rgba(${effectiveEdgeR}, ${effectiveEdgeG}, ${effectiveEdgeB}, 0.06) 70%,
        transparent 100%
      ),
      /* Reduced warm ambient overlay */
      radial-gradient(ellipse 150% 100% at 50% 50%,
        rgba(255, 248, 240, 0.008) 0%,
        transparent 70%
      )
    `;
  };

  const baseGradient = createOrganicGradient(
    centerRgb.r,
    centerRgb.g,
    centerRgb.b,
    edgeRgb?.r,
    edgeRgb?.g,
    edgeRgb?.b,
    mousePosition.x,
    mousePosition.y
  );

  const fadeGradient = createOrganicGradient(
    fadeCenterRgb.r,
    fadeCenterRgb.g,
    fadeCenterRgb.b,
    fadeEdgeRgb?.r,
    fadeEdgeRgb?.g,
    fadeEdgeRgb?.b,
    mousePosition.x,
    mousePosition.y
  );

  const transitionStyle = `all ${transitionDurationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;

  // Handle mouse movement for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;

      const rect = backgroundRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0.5, y: 0.5 });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-[100vh] min-h-[100svh] min-h-[100dvh] relative overflow-hidden">
      {/* Fixed background container - pinned to viewport */}
      <div ref={backgroundRef} className="fixed inset-0 w-full h-full z-0">
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
              : {
                  animation: 'wf-temperature-shift 15s ease-in-out infinite',
                  willChange: 'filter',
                }),
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

        {/* Animated organic shapes layer */}
        <div
          className="absolute inset-0 w-full h-full organic-shapes"
          style={{
            animation: 'wf-breathing 8s ease-in-out infinite',
            transform: `translate(${(mousePosition.x - 0.5) * 8}px, ${(mousePosition.y - 0.5) * 8}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />

        {/* Subtle shimmer effect */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            opacity: 0.5,
          }}
        >
          <div
            className="absolute w-full h-full"
            style={{
              background:
                'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%)',
              animation: 'wf-shimmer 12s ease-in-out infinite',
              willChange: 'transform',
            }}
          />
        </div>

        {/* Subtle noise texture */}
        <div className="absolute inset-0 w-full h-full noise-overlay opacity-10" />
      </div>

      {/* Main content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
