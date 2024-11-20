import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { navItems } from '../nav-items';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-black shadow-lg sticky top-0 z-50 transition-all duration-300 ease-in-out border-b border-orange-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center justify-center w-full">
            <div className="hidden sm:flex sm:space-x-2 md:space-x-4">
              {navItems.map((item) => (
                <Link 
                  key={item.to} 
                  to={item.to}
                  className="transform transition-transform duration-200 hover:scale-105"
                >
                  <Button
                    variant={location.pathname === item.to ? "default" : "ghost"}
                    className={`
                      inline-flex items-center px-4 py-2 text-sm font-medium
                      transition-all duration-200 ease-in-out
                      rounded-lg
                      ${location.pathname === item.to 
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                        : 'text-gray-300 hover:bg-orange-500/10 hover:text-orange-500'
                      }
                      hover:shadow-md
                      active:scale-95
                      backdrop-blur-sm
                    `}
                  >
                    <span className={`
                      transition-colors duration-200
                      ${location.pathname === item.to ? 'text-white' : 'text-gray-300'}
                    `}>
                      {item.icon}
                    </span>
                    <span className="ml-2 font-medium">{item.title}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;