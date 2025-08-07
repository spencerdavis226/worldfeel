
import { wordToColor } from '@worldfeel/shared';

interface ColorBadgeProps {
  word?: string;
  colorHex?: string;
  className?: string;
}

export function ColorBadge({ word, colorHex, className = '' }: ColorBadgeProps) {
  const colors = word ? wordToColor(word) : { hex: colorHex || '#6DCFF6', shadeHex: '#4A9EBF' };

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        glass-card px-4 py-2
        transition-all duration-500 ease-out
        hover:scale-105
        ${className}
      `}
      style={{
        backgroundColor: `${colors.hex}20`, // 20% opacity
        borderColor: `${colors.hex}40`,
      }}
    >
      <div className="flex items-center space-x-3">
        <div
          className="w-6 h-6 rounded-full border-2 border-white/30 shadow-inner"
          style={{ backgroundColor: colors.hex }}
        />
        <span
          className="text-sm font-mono font-medium tracking-wider"
          style={{ color: colors.shadeHex }}
        >
          {colors.hex.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
