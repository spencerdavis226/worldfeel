import { Link, useLocation } from 'react-router-dom';
import { navigateWithViewTransition } from '@lib/viewTransitions';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithViewTransition('/', () => {});
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="max-w-7xl mx-auto">
        <div className="nav-glass">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            {/* Logo/Brand */}
            <Link
              to="/"
              onClick={handleLogoClick}
              className="text-lg sm:text-xl font-medium text-gray-800 hover:text-gray-900 transition-colors duration-200 focus-visible-ring rounded-lg px-3 py-2 -ml-2 nav-link"
            >
              worldfeel.org
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Link
                to="/results"
                className={`nav-link ${
                  isActive('/results') ? 'nav-link-active' : 'nav-link-inactive'
                }`}
              >
                Results
              </Link>
              <Link
                to="/about"
                className={`nav-link ${
                  isActive('/about') ? 'nav-link-active' : 'nav-link-inactive'
                }`}
              >
                About
              </Link>
              <Link
                to="/api"
                className={`nav-link ${
                  isActive('/api') ? 'nav-link-active' : 'nav-link-inactive'
                }`}
              >
                API
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
