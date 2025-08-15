import { useEffect, useState } from 'react';
import { apiClient } from '@lib/apiClient';

export function ServerStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check server status periodically
    const checkServerStatus = async () => {
      try {
        await apiClient.healthCheck();
        setIsOnline(true);
      } catch {
        // Server is offline - this is handled by the API client
        setIsOnline(false);
      }
    };

    // Initial check
    checkServerStatus();

    // Check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  // Don't render anything if server is online
  if (isOnline) {
    return null;
  }

  // Show a subtle indicator when using fallback data
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-yellow-50/90 backdrop-blur-sm border border-yellow-200/50 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2 text-xs text-yellow-800">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          <span>Offline mode</span>
        </div>
      </div>
    </div>
  );
}
