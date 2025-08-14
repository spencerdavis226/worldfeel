import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navigateWithViewTransition } from '@lib/viewTransitions';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithViewTransition('/', navigate);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-panel nav-bar">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16">
          {/* Logo/Brand */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="text-lg sm:text-xl font-medium text-gray-800 hover:text-gray-900 transition-all duration-200 focus-visible-ring"
          >
            worldfeel.org
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link
              to="/results"
              className={`text-sm sm:text-base font-medium transition-all duration-200 focus-visible-ring ${
                isActive('/results')
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-800 hover:font-medium'
              }`}
            >
              Results
            </Link>
            <Link
              to="/about"
              className={`text-sm sm:text-base font-medium transition-all duration-200 focus-visible-ring ${
                isActive('/about')
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-800 hover:font-medium'
              }`}
            >
              About
            </Link>
            <Link
              to="/api"
              className={`text-sm sm:text-base font-medium transition-all duration-200 focus-visible-ring ${
                isActive('/api')
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-800 hover:font-medium'
              }`}
            >
              API
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
