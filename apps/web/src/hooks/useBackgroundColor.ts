import { useEffect } from 'react';
import { wordToColor } from '@worldfeel/shared';

/**
 * Hook to dynamically update the page background based on the dominant emotion
 */
export function useBackgroundColor(word: string | undefined) {
  useEffect(() => {
    if (!word) return;

    const colors = wordToColor(word);
    const { hex } = colors;

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
    document.documentElement.style.setProperty('--emotion-color-r', r.toString());
    document.documentElement.style.setProperty('--emotion-color-g', g.toString());
    document.documentElement.style.setProperty('--emotion-color-b', b.toString());

    document.documentElement.style.setProperty('--emotion-light-r', lightR.toString());
    document.documentElement.style.setProperty('--emotion-light-g', lightG.toString());
    document.documentElement.style.setProperty('--emotion-light-b', lightB.toString());

    document.documentElement.style.setProperty('--emotion-dark-r', darkerR.toString());
    document.documentElement.style.setProperty('--emotion-dark-g', darkerG.toString());
    document.documentElement.style.setProperty('--emotion-dark-b', darkerB.toString());

    // Update body background with gradient
    const lightColor = `rgba(${lightR}, ${lightG}, ${lightB}, 0.1)`;
    const mainColor = `rgba(${r}, ${g}, ${b}, 0.05)`;
    const darkColor = `rgba(${darkerR}, ${darkerG}, ${darkerB}, 0.1)`;

    document.body.style.background = `
      linear-gradient(135deg,
        ${lightColor} 0%,
        ${mainColor} 50%,
        ${darkColor} 100%
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
  }, [word]);
}
