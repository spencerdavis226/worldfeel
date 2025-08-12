import { useEffect } from 'react';

/**
 * Hook to manage page titles with Apple-like design principles
 * Follows the format: "Page Name – worldfeel.org" or "worldfeel.org – Description"
 */
export function usePageTitle(title: string, isMainPage: boolean = false) {
  useEffect(() => {
    const baseTitle = 'worldfeel.org';

    if (isMainPage) {
      // Main page format: "worldfeel.org"
      document.title = baseTitle;
    } else {
      // Other pages format: "Page Name – worldfeel.org"
      document.title = `${title} – ${baseTitle}`;
    }
  }, [title, isMainPage]);
}
