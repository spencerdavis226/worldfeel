import { useState } from 'react';

import { UniversalBackground } from '@components/UniversalBackground';
import { usePageTitle } from '@hooks/usePageTitle';

export function AboutPage() {
  // Set page title
  usePageTitle('About');

  const [avatarError, setAvatarError] = useState<boolean>(false);
  const [avatarSrc, setAvatarSrc] = useState<string>('/spencer.png');
  return (
    <UniversalBackground hueCycle={true} hueDurationMs={120000}>
      <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 pt-20 sm:pt-24">
        {/* Main content */}
        <div className="w-full max-w-3xl mx-auto text-center px-4 sm:px-6 animate-fade-in space-y-6 sm:space-y-8">
          {/* Header with proper spacing */}
          <div className="space-y-4 sm:space-y-5 pt-4 sm:pt-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-800 leading-tight">
              About worldfeel.org
            </h1>
            <p className="text-base sm:text-lg text-gray-600 text-balance max-w-2xl mx-auto">
              A calm, real‑time snapshot of how people feel today - one word at
              a time.
            </p>
          </div>

          {/* Main content panel with reduced spacing */}
          <section className="backdrop-blur-lg bg-white/[0.28] border border-white/40 rounded-2xl shadow-lg px-6 sm:px-8 py-5 sm:py-6 lg:py-8 text-left space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                What it is
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                worldfeel.org is a mindful experiment in collective emotion. You
                share one word that captures your current feeling. We gather
                these words globally and reflect the moment - no feeds, no
                comments, just a gentle pulse of how the world feels.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                How it works
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-[2px] text-sm">1</span>
                  <span>
                    Choose one word from our curated list of emotions.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-[2px] text-sm">2</span>
                  <span>
                    See how your feeling contributes to today's global snapshot.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-[2px] text-sm">3</span>
                  <span>
                    Stats update every 15 seconds. One submission per device per
                    hour, entries expire in 24 hours.
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Color mapping
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Each emotion has its own carefully chosen color. Our palette
                includes over 150 feelings, from joy and calm to reflection and
                growth. The colors are designed for accessibility and create a
                visual language of emotion.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Privacy
              </h3>
              <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 text-gray-700 text-sm sm:text-base">
                <li>
                  No personal information is collected. Submissions are one‑word
                  only.
                </li>
                <li>
                  Entries live for 24 hours and then disappear completely.
                </li>
                <li>
                  Basic rate limiting prevents spam. No profiles or tracking.
                </li>
              </ul>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                API Access
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                We provide a public API for developers and creators who want to
                integrate the world's emotional state into their projects.
                Access real-time data about the current emotion and color of the
                day.
              </p>
              <a
                href="/api"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 underline text-sm sm:text-base"
              >
                View API Documentation
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </div>

            {/* Credits section with improved mobile layout */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Credits
              </h3>
              <div className="backdrop-blur-lg bg-white/[0.28] border border-white/40 rounded-2xl shadow-lg p-4 sm:p-5">
                {/* Desktop: single row layout */}
                <div className="hidden sm:flex items-center gap-4">
                  {avatarError ? (
                    <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
                      S
                    </div>
                  ) : (
                    <img
                      src={avatarSrc}
                      alt="Creator portrait"
                      className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
                      onError={() => {
                        if (avatarSrc.endsWith('.png'))
                          setAvatarSrc('/spencer.jpg');
                        else setAvatarError(true);
                      }}
                      decoding="async"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium">Spencer Davis</p>
                    <p className="text-gray-600 text-sm">Design and code</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href="https://github.com/spencerdavis226"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="backdrop-blur-lg bg-white/[0.28] border border-white/40 rounded-2xl shadow-lg w-9 h-9 inline-flex items-center justify-center focus-visible-ring hover:bg-white/[0.35] transition-colors"
                      aria-label="GitHub"
                      title="GitHub"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-gray-800"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.31 6.84 9.65.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.74 0 0 .84-.27 2.75 1.05A9.42 9.42 0 0112 7.48c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.48.1 2.74.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.57 5.08.36.31.68.92.68 1.86 0 1.34-.01 2.41-.01 2.74 0 .26.18.58.69.48A10.07 10.07 0 0022 12.26C22 6.58 17.52 2 12 2z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/davisspencer/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="backdrop-blur-lg bg-white/[0.28] border border-white/40 rounded-2xl shadow-lg w-9 h-9 inline-flex items-center justify-center focus-visible-ring hover:bg-white/[0.35] transition-colors"
                      aria-label="LinkedIn"
                      title="LinkedIn"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-gray-800"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M4.98 3.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM0 8.5h5V23H0V8.5zM8 8.5h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V23h-5v-6.8c0-1.62-.03-3.7-2.25-3.7-2.25 0-2.59 1.76-2.59 3.58V23H8V8.5z" />
                      </svg>
                    </a>
                    <a
                      href="http://www.spencerdavis.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="backdrop-blur-lg bg-white/[0.28] border border-white/40 rounded-2xl shadow-lg w-9 h-9 inline-flex items-center justify-center focus-visible-ring hover:bg-white/[0.35] transition-colors"
                      aria-label="Website"
                      title="Website"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-gray-800"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" />
                        <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Mobile: stacked layout - picture and text in one row, links in another */}
                <div className="sm:hidden space-y-4">
                  <div className="flex items-center gap-4">
                    {avatarError ? (
                      <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center text-gray-700 font-semibold flex-shrink-0">
                        S
                      </div>
                    ) : (
                      <img
                        src={avatarSrc}
                        alt="Creator portrait"
                        className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
                        onError={() => {
                          if (avatarSrc.endsWith('.png'))
                            setAvatarSrc('/spencer.jpg');
                          else setAvatarError(true);
                        }}
                        decoding="async"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium">Spencer Davis</p>
                      <p className="text-gray-600 text-sm">Design and code</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href="https://github.com/spencerdavis226"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="backdrop-blur-lg bg-white/[0.28] border border-white/40 rounded-2xl shadow-lg w-10 h-10 inline-flex items-center justify-center focus-visible-ring hover:bg-white/[0.35] transition-colors"
                      aria-label="GitHub"
                      title="GitHub"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-gray-800"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.31 6.84 9.65.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.74 0 0 .84-.27 2.75 1.05A9.42 9.42 0 0112 7.48c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.43.2 2.48.1 2.74.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.57 5.08.36.31.68.92.68 1.86 0 1.34-.01 2.41-.01 2.74 0 .26.18.58.69.48A10.07 10.07 0 0022 12.26C22 6.58 17.52 2 12 2z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/davisspencer/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="backdrop-blur-lg bg-white/[0.28] border border-white/40 rounded-2xl shadow-lg w-10 h-10 inline-flex items-center justify-center focus-visible-ring hover:bg-white/[0.35] transition-colors"
                      aria-label="LinkedIn"
                      title="LinkedIn"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-gray-800"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M4.98 3.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM0 8.5h5V23H0V8.5zM8 8.5h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V23h-5v-6.8c0-1.62-.03-3.7-2.25-3.7-2.25 0-2.59 1.76-2.59 3.58V23H8V8.5z" />
                      </svg>
                    </a>
                    <a
                      href="http://www.spencerdavis.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="backdrop-blur-lg bg-white/[0.28] border border-white/40 rounded-2xl shadow-lg w-10 h-10 inline-flex items-center justify-center focus-visible-ring hover:bg-white/[0.35] transition-colors"
                      aria-label="Website"
                      title="Website"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-gray-800"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" />
                        <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-white/40">
              <p className="text-sm text-gray-600">
                Built with care and simplicity. Open to feedback and future
                experiments.
              </p>
            </div>
          </section>
        </div>
      </div>
    </UniversalBackground>
  );
}
