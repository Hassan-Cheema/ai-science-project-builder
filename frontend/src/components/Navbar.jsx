import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-notion-blue rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-xl font-semibold text-notion-text">
                Science Builder
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/try"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/try')
                    ? 'text-notion-blue bg-notion-lightblue'
                    : 'text-notion-text hover:text-notion-blue hover:bg-notion-lightgray'
                }`}
              >
                Try It Free
              </Link>
              <Link
                to="/mentor"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  isActive('/mentor')
                    ? 'text-notion-blue bg-notion-lightblue'
                    : 'text-notion-text hover:text-notion-blue hover:bg-notion-lightgray'
                }`}
              >
                <span>🤖</span> AI Mentor
              </Link>
              <Link
                to="/pricing"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/pricing')
                    ? 'text-notion-blue bg-notion-lightblue'
                    : 'text-notion-text hover:text-notion-blue hover:bg-notion-lightgray'
                }`}
              >
                Pricing
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-notion-text hover:text-notion-blue px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-notion-gray hover:text-notion-text px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-notion-text hover:text-notion-blue px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/try"
                  className="bg-notion-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Get started →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

