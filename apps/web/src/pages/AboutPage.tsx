import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassyBackground } from '../components/GlassyBackground';

export function AboutPage() {
  const [avatarError, setAvatarError] = useState<boolean>(false);
  const [avatarSrc, setAvatarSrc] = useState<string>('/spencer.png');
  return (
    <GlassyBackground hueCycle={true} hueDurationMs={120000}>
      <div className="min-h-screen flex flex-col items-center justify-between p-4">
        {/* Top bar with back link */}
        <div className="w-full max-w-xl mx-auto flex items-center justify-start pt-2">
          <Link
            to="/"
            className="glass-token inline-flex items-center gap-2 px-3 py-1.5 focus-visible-ring"
          >
            <svg
              className="w-4 h-4 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm text-gray-800">Back</span>
          </Link>
        </div>

        {/* Main content */}
        <div className="w-full max-w-2xl mx-auto text-center px-4 sm:px-2 animate-fade-in space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-4xl md:text-5xl font-medium text-gray-800 leading-tight">
              About worldfeel.org
            </h1>
            <p className="text-base sm:text-lg text-gray-600 text-balance">
              A calm, real‑time snapshot of how people feel today — one word at
              a time.
            </p>
          </div>

          <section className="glass-panel px-6 sm:px-8 py-7 sm:py-8 text-left space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-800">
                What it is
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Worldfeel is a minimal, privacy‑minded experiment in collective
                emotion. You share one word that describes your current feeling.
                We aggregate those words globally and reflect the moment — no
                feeds, no comments, just a quiet pulse of how the world feels.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">
                How it works
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-[2px]">1</span>
                  <span>Share one word (letters only, lowercase).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-[2px]">2</span>
                  <span>
                    See how your word contributes to today’s global snapshot.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-500 mt-[2px]">3</span>
                  <span>
                    Stats update about every 10 seconds. Entries naturally
                    expire in ~24 hours.
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">
                Color mapping
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Each emotion maps to a color. Common emotions use a curated
                palette; uncommon words resolve to the nearest known emotion. We
                tune contrast for readability and keep labels neutral — the
                color is the emotion.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">Privacy</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>
                  No personal info is required. Submissions are one‑word only.
                </li>
                <li>
                  Entries live in a 24‑hour window (TTL) and then disappear.
                </li>
                <li>
                  Basic device‑level rate limiting prevents spam; no profiles or
                  tracking.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">Credits</h3>
              <div className="glass-panel flex items-center gap-4 p-4">
                {avatarError ? (
                  <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center text-gray-700 font-semibold">
                    S
                  </div>
                ) : (
                  <img
                    src={avatarSrc}
                    alt="Creator portrait"
                    className="w-12 h-12 rounded-2xl object-cover"
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
                  <p className="text-gray-800 font-medium truncate">
                    Created by Spencer
                  </p>
                  <p className="text-gray-600 text-sm truncate">
                    Design, code, and color system
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/spencerdavis226"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-token w-9 h-9 inline-flex items-center justify-center focus-visible-ring"
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
                    className="glass-token w-9 h-9 inline-flex items-center justify-center focus-visible-ring"
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
                  {/* Optional: personal site */}
                  <a
                    href="http://www.spencerdavis.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-token w-9 h-9 hidden sm:inline-flex items-center justify-center focus-visible-ring"
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

            <div className="pt-2 border-t border-white/40">
              <p className="text-sm text-gray-600">
                Built with a small, modern stack. Open to feedback and future
                experiments.
              </p>
            </div>
          </section>

          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              to="/"
              className="glass-button px-5 sm:px-6 py-3 text-sm sm:text-base font-medium focus-visible-ring"
            >
              Share your feeling
            </Link>
            <Link
              to="/results"
              className="glass-button px-5 sm:px-6 py-3 text-sm sm:text-base font-medium focus-visible-ring"
            >
              View results
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full text-center pb-6 px-4">
          <p className="text-xs text-gray-500">
            A global emotional snapshot of today
          </p>
        </div>
      </div>
    </GlassyBackground>
  );
}
