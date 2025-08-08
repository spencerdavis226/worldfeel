import { useEffect } from 'react';
import { getEmotionColor } from '@worldfeel/shared/emotion-color-map';

/**
 * Hook to dynamically update the page background based on the dominant emotion
 */
export function useBackgroundColor(
  topWord: string | undefined,
  personalWord?: string | undefined
) {
  useEffect(() => {
    if (!topWord) return;

    const hex = getEmotionColor(topWord) || '#6DCFF6';
    const personalHex = personalWord
      ? getEmotionColor(personalWord) || '#6DCFF6'
      : undefined;

    // Convert hex to RGB for CSS variables
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Create lighter and darker variants
    const lightR = Math.min(255, r + 40);
    const lightG = Math.min(255, g + 40);
    const lightB = Math.min(255, b + 40);

    const darkerR = Math.max(0, r - 20);
    const darkerG = Math.max(0, g - 20);
    const darkerB = Math.max(0, b - 20);

    // Update CSS custom properties for smooth transitions
    document.documentElement.style.setProperty(
      '--emotion-color-r',
      r.toString()
    );
    document.documentElement.style.setProperty(
      '--emotion-color-g',
      g.toString()
    );
    document.documentElement.style.setProperty(
      '--emotion-color-b',
      b.toString()
    );

    document.documentElement.style.setProperty(
      '--emotion-light-r',
      lightR.toString()
    );
    document.documentElement.style.setProperty(
      '--emotion-light-g',
      lightG.toString()
    );
    document.documentElement.style.setProperty(
      '--emotion-light-b',
      lightB.toString()
    );

    document.documentElement.style.setProperty(
      '--emotion-dark-r',
      darkerR.toString()
    );
    document.documentElement.style.setProperty(
      '--emotion-dark-g',
      darkerG.toString()
    );
    document.documentElement.style.setProperty(
      '--emotion-dark-b',
      darkerB.toString()
    );

    // Update body background with gradient
    // Center uses top emotion color; edges blend toward personal color if available
    const p = personalHex
      ? {
          pr: parseInt(personalHex.slice(1, 3), 16),
          pg: parseInt(personalHex.slice(3, 5), 16),
          pb: parseInt(personalHex.slice(5, 7), 16),
        }
      : null;
    const edge1 = p
      ? `rgba(${p.pr}, ${p.pg}, ${p.pb}, 0.12)`
      : `rgba(255,255,255,0.12)`;
    const edge2 = p
      ? `rgba(${p.pr}, ${p.pg}, ${p.pb}, 0.12)`
      : `rgba(0,0,0,0.10)`;
    const lightColor = `rgba(${lightR}, ${lightG}, ${lightB}, 0.1)`;
    const mainColor = `rgba(${r}, ${g}, ${b}, 0.06)`;
    const darkColor = `rgba(${darkerR}, ${darkerG}, ${darkerB}, 0.1)`;

    document.body.style.background = `
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
    document.body.style.minHeight = '100vh';

    // Cleanup function
    return () => {
      // Reset to default background
      document.body.style.background = '';
      document.documentElement.style.removeProperty('--emotion-color-r');
      document.documentElement.style.removeProperty('--emotion-color-g');
      document.documentElement.style.removeProperty('--emotion-color-b');
      document.documentElement.style.removeProperty('--emotion-light-r');
      document.documentElement.style.removeProperty('--emotion-light-g');
      document.documentElement.style.removeProperty('--emotion-light-b');
      document.documentElement.style.removeProperty('--emotion-dark-r');
      document.documentElement.style.removeProperty('--emotion-dark-g');
      document.documentElement.style.removeProperty('--emotion-dark-b');
    };
  }, [topWord, personalWord]);
}
