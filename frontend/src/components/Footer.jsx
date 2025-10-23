import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-notion-lightgray border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-notion-blue rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-lg font-semibold text-notion-text">
                Science Builder
              </span>
            </div>
            <p className="text-notion-gray text-sm max-w-md">
              AI-powered science project generator for students and educators. 
              Create amazing projects with just a few clicks.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-notion-text font-semibold mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/try" className="text-notion-gray hover:text-notion-blue text-sm">
                  Try It Free
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-notion-gray hover:text-notion-blue text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="text-notion-gray hover:text-notion-blue text-sm">
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-notion-text font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com" className="text-notion-gray hover:text-notion-blue text-sm">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-notion-gray hover:text-notion-blue text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-notion-gray hover:text-notion-blue text-sm">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-notion-gray text-sm">
            © {new Date().getFullYear()} AI Science Builder. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-notion-gray hover:text-notion-blue text-sm">
              Privacy
            </a>
            <a href="#" className="text-notion-gray hover:text-notion-blue text-sm">
              Terms
            </a>
            <a href="#" className="text-notion-gray hover:text-notion-blue text-sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

