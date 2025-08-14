import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Navigation } from '@components/Navigation';

// Lazy load pages for better performance
const HomePage = lazy(() =>
  import('@features/HomePage').then((module) => ({ default: module.HomePage }))
);
const ResultsPage = lazy(() =>
  import('@features/ResultsPage').then((module) => ({
    default: module.ResultsPage,
  }))
);
const AboutPage = lazy(() =>
  import('@features/AboutPage').then((module) => ({
    default: module.AboutPage,
  }))
);
const ApiDocsPage = lazy(() =>
  import('@features/ApiDocsPage').then((module) => ({
    default: module.ApiDocsPage,
  }))
);

export function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div id="route-root">
        <Navigation />
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[100vh] min-h-[100svh] min-h-[100dvh]">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/api" element={<ApiDocsPage />} />
            {/* Catch-all route redirects to home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

// Remove unused default export
