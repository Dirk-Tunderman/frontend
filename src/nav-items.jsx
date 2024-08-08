import { Search, FileJson } from "lucide-react";
import Index from "./pages/Index.jsx";
import Overview from "./pages/Overview.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Company Data Accumulator",
    to: "/",
    icon: <Search className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "JSON Maps Overview",
    to: "/overview",
    icon: <FileJson className="h-4 w-4" />,
    page: <Overview />,
  },
];
