import { useEffect } from 'react';
import { apiClient } from '@lib/apiClient';

export function ServerStatusIndicator() {
  useEffect(() => {
    // Check server status periodically
    const checkServerStatus = async () => {
      try {
        await apiClient.healthCheck();
      } catch {
        // Server is offline - this is handled by the API client
      }
    };

    // Initial check
    checkServerStatus();

    // Check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  // Don't render anything - this component is just for monitoring
  return null;
}
