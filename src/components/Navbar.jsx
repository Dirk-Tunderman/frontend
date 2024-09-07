import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { navItems } from '../nav-items';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img src="/veloxforce-logo.png" alt="Veloxforce Logo" className="h-8 w-auto" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={location.pathname === item.to ? "default" : "ghost"}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-black"
                  >
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
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