import React from 'react';
import { Link } from 'react-router-dom';
import { GlassyBackground } from '../components/GlassyBackground';

export function AboutPage() {
  return (
    <GlassyBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors mb-8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to feelings</span>
            </Link>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              How Is The World Feeling?
            </h1>
            <p className="text-xl text-gray-600">
              A global emotional snapshot, one word at a time
            </p>
          </div>

          <div className="glass-card p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">What is this?</h2>
              <p className="text-gray-600 leading-relaxed">
                This is a simple experiment in collective emotion. Every day, people from around the world
                share how they're feeling in just one word. We collect these feelings and show you what
                the world looks like emotionally in real-time.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">How it works</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">1.</span>
                  <span>Share your current emotion in one word (letters only)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">2.</span>
                  <span>See how your feeling compares to others globally</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">3.</span>
                  <span>Filter by location to see regional emotional patterns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">4.</span>
                  <span>Data refreshes every 10 seconds and expires after 24 hours</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Privacy & Data</h3>
              <div className="text-gray-600 space-y-2">
                <p>Your privacy matters to us:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We never store your IP address directly</li>
                  <li>Location data is optional and only used for filtering</li>
                  <li>All data expires automatically after 24 hours</li>
                  <li>You can only submit one feeling per day</li>
                  <li>You can edit your submission for 5 minutes after posting</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">The Colors</h3>
              <p className="text-gray-600 leading-relaxed">
                Each emotion is mapped to a unique color. Common feelings like "happy", "sad", or "calm"
                have predefined colors, while unique words get colors generated from their meaning.
                The background subtly shifts to reflect the world's dominant emotion.
              </p>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-500 text-center">
                Built with care using modern web technologies.<br />
                Open source and designed for privacy.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="glass-button px-8 py-3 text-lg font-medium focus-visible-ring inline-block"
            >
              Share Your Feeling
            </Link>
          </div>
        </div>
      </div>
    </GlassyBackground>
  );
}
