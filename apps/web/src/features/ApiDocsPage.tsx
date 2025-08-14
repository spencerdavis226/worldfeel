import { UniversalBackground } from '@components/UniversalBackground';
import { usePageTitle } from '@hooks/usePageTitle';

export function ApiDocsPage() {
  // Set page title
  usePageTitle('API Documentation');

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE || 'https://api.worldfeel.org';

  return (
    <UniversalBackground hueCycle={true} hueDurationMs={120000}>
      <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 pt-20 sm:pt-24">
        {/* Main content */}
        <div className="w-full max-w-4xl mx-auto text-center px-4 sm:px-6 animate-fade-in space-y-6 sm:space-y-8">
          {/* Header with proper spacing */}
          <div className="space-y-4 sm:space-y-5 pt-4 sm:pt-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-800 leading-tight">
              API Documentation
            </h1>
            <p className="text-base sm:text-lg text-gray-600 text-balance max-w-2xl mx-auto">
              Access the world's current emotional state through our simple,
              public API.
            </p>
          </div>

          {/* Main content panel */}
          <section className="backdrop-blur-lg bg-white/[0.28] border border-white/40 rounded-2xl shadow-lg px-6 sm:px-8 py-6 sm:py-8 text-left space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                The worldfeel.org API provides real-time access to the current
                emotional state of the world. Get the emotion and color of the
                day, updated every 10 seconds as people share their feelings.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Base URL
              </h3>
              <div className="backdrop-blur-lg bg-gray-900/[0.9] border border-gray-700/40 rounded-xl p-4 font-mono text-sm text-gray-100">
                {apiBaseUrl}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Endpoints
              </h3>

              {/* Emotion of the Day Endpoint */}
              <div className="space-y-4">
                <div className="backdrop-blur-lg bg-white/[0.28] border border-white/40 rounded-2xl shadow-lg p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      GET
                    </span>
                    <code className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
                      /public/emotion-of-the-day
                    </code>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">
                    Returns the current emotion and color of the day, along with
                    usage statistics.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Response Format
                      </h4>
                      <div className="backdrop-blur-lg bg-gray-900/[0.9] border border-gray-700/40 rounded-lg p-4 font-mono text-xs text-gray-100 overflow-x-auto">
                        {`{
  "success": true,
  "data": {
    "emotion": "joy",
    "color": "#FFD700",
    "count": 42,
    "total": 156,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}`}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Example Request
                      </h4>
                      <div className="backdrop-blur-lg bg-gray-900/[0.9] border border-gray-700/40 rounded-lg p-4 font-mono text-xs text-gray-100 overflow-x-auto">
                        {`curl ${apiBaseUrl}/public/emotion-of-the-day`}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        Example Response
                      </h4>
                      <div className="backdrop-blur-lg bg-gray-900/[0.9] border border-gray-700/40 rounded-lg p-4 font-mono text-xs text-gray-100 overflow-x-auto">
                        {`{
  "success": true,
  "data": {
    "emotion": "calm",
    "color": "#87CEEB",
    "count": 23,
    "total": 89,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Rate Limits
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                The public API is rate limited to ensure fair usage. Please
                respect reasonable request frequencies and implement appropriate
                caching in your applications.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Data Freshness
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Data updates every 10 seconds as new emotions are submitted.
                Each emotion entry expires after 24 hours, ensuring the API
                always reflects the current emotional state of the world.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Use Cases
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm sm:text-base">
                <li>Dashboard widgets showing global emotional trends</li>
                <li>Creative projects that respond to collective mood</li>
                <li>Research and data visualization</li>
                <li>Art installations that change based on world emotion</li>
                <li>Personal mood tracking apps</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Support
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                For questions about the API or to report issues, please reach
                out through our
                <a
                  href="https://github.com/spencerdavis226/worldfeel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline mx-1"
                >
                  GitHub repository
                </a>
                or contact us directly.
              </p>
            </div>
          </section>
        </div>

        {/* Footer with proper spacing */}
        <div className="w-full text-center pb-16 sm:pb-20 px-4 pt-8 sm:pt-12">
          <p className="text-sm text-gray-500">
            Real-time global emotional data
          </p>
        </div>
      </div>
    </UniversalBackground>
  );
}
