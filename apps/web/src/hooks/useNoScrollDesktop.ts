import { useEffect } from 'react';

/**
 * Hook to prevent scrolling on desktop for specific pages
 * @param enabled - Whether to enable no-scroll behavior
 */
export function useNoScrollDesktop(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const htmlElement = document.documentElement;
    
    // Add class to enable no-scroll on desktop
    htmlElement.classList.add('no-scroll-desktop');
    
    return () => {
      // Remove class when component unmounts or effect cleans up
      htmlElement.classList.remove('no-scroll-desktop');
    };
  }, [enabled]);
}
