import { MapPin, Building2, Mail } from "lucide-react";
import Index from "./pages/Index.jsx";
import Overview from "./pages/Overview.jsx";
import EmailCreation from "./pages/EmailCreation.jsx";
import Criteria from "./pages/Criteria.jsx";
import CompanyTable from "./pages/CompanyTable.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
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
    title: "Email Creation",
    to: "/email-creation",
    icon: <Mail className="h-4 w-4" />,
    page: <EmailCreation />,
  },
];

export const hiddenRoutes = [
  {
    to: "/criteria",
    page: <Criteria />,
  },
  {
    to: "/company-table/:templateId",
    page: <CompanyTable />,
  },
];