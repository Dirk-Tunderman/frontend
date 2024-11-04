//-------APP.JSX--------//


import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems, hiddenRoutes } from "./nav-items";
import CompanyDetails from "./pages/CompanyDetails";
import SetCriteria from "./pages/SetCriteria";
import { Toaster } from "sonner";
import LinkedInDetails from "./pages/LinkedInDetails";
import SetLinkedInCriteria from "./pages/SetLinkedInCriteria";
import CompanyDashboard from "./pages/CompanyDashboard";
import FinishedCompanyLists from "./pages/FinishedCompanyLists";
import FinishedCompanyTable from "./pages/FinishedCompanyTable";
import FinishedCompanyDashboard from "./pages/FinishedCompanyDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {navItems.map(({ to, page }) => (
            <Route key={to} path={to} element={page} />
          ))}
          {hiddenRoutes.map(({ to, page }) => (
            <Route key={to} path={to} element={page} />
          ))}
          <Route path="/company/:id" element={<CompanyDetails />} />
          <Route path="/set-criteria/:id" element={<SetCriteria />} />
          <Route path="/linkedin/:filename" element={<LinkedInDetails />} />
          <Route path="/set-linkedin-criteria/:filename" element={<SetLinkedInCriteria />} />
          <Route path="/company/:id/:companyName" element={<CompanyDashboard />} />
          <Route path="/finished-companies" element={<FinishedCompanyLists />} />
          <Route path="/finished-company-table/:filename" element={<FinishedCompanyTable />} />
          <Route path="/finished-company-dashboard/:filename/:companyName" element={<FinishedCompanyDashboard />} />
          <Route path="/finished-company-table/:filename" element={<FinishedCompanyTable />} />

          </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;