import { MapPin, Building2, CheckSquare } from "lucide-react";
import Index from "./pages/Index.jsx";
import Overview from "./pages/Overview.jsx";
import CompanyDetails from "./pages/CompanyDetails.jsx";
import FinishedCompanyLists from "./pages/FinishedCompanyLists.jsx";

export const navItems = [
  {
    title: "Location Scraper",
    to: "/",
    icon: <MapPin className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Accumulated Companies",
    to: "/overview",
    icon: <Building2 className="h-4 w-4" />,
    page: <Overview />,
  },
  {
    title: "Finished Company Lists",
    to: "/finished-companies",
    icon: <CheckSquare className="h-4 w-4" />,
    page: <FinishedCompanyLists />,
  },
];

export const hiddenRoutes = [
  {
    to: "/company/:id",
    page: <CompanyDetails />,
  },
];