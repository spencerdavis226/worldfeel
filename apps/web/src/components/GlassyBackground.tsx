import React from 'react';

interface GlassyBackgroundProps {
  colorHex?: string;
  children: React.ReactNode;
}

export function GlassyBackground({ colorHex = '#6DCFF6', children }: GlassyBackgroundProps) {
  // Convert hex to RGB for CSS variables
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 109, g: 207, b: 246 }; // Default blue
  };

  const { r, g, b } = hexToRgb(colorHex);

  const backgroundStyle = {
    '--accent-r': r,
    '--accent-g': g,
    '--accent-b': b,
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={backgroundStyle}
    >
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(${r}, ${g}, ${b}, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)}, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)
          `,
          animation: 'gradient-shift 20s ease-in-out infinite',
        }}
      />

      {/* Subtle noise texture */}
      <div className="absolute inset-0 noise-overlay opacity-20" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-30"
            style={{
              backgroundColor: `rgba(${r}, ${g}, ${b}, 0.4)`,
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 10)}%`,
              animation: `float ${4 + (i * 0.5)}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
