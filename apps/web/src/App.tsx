import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load pages for better performance
const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const ResultsPage = lazy(() =>
  import('./pages/ResultsPage').then((m) => ({ default: m.ResultsPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ApiDocsPage = lazy(() =>
  import('./pages/ApiDocsPage').then((m) => ({ default: m.ApiDocsPage }))
);

export function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div id="route-root">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
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
