import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-blue-600">Company Data Tool</span>
            </div>
            <div className="ml-6 flex space-x-4">
              <Link to="/">
                <Button variant="ghost">Location Scraper</Button>
              </Link>
              <Link to="/accumulated-companies">
                <Button variant="ghost">Accumulated Companies</Button>
              </Link>
              <Link to="/overview">
                <Button variant="ghost">JSON Overview</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
