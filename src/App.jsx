import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems, hiddenRoutes } from "./nav-items";
import EmailLinkedInCreation from "./pages/EmailLinkedInCreation";
import Navbar from './components/Navbar';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-black">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <img src="/veloxforce-logo.png" alt="Veloxforce Logo" className="mx-auto mb-8 h-16" />
            <div className="flex-grow">
              <Routes>
                {navItems.map(({ to, page }) => (
                  <Route key={to} path={to} element={page} />
                ))}
                {hiddenRoutes.map(({ to, page }) => (
                  <Route key={to} path={to} element={page} />
                ))}
                <Route path="/email-linkedin-creation" element={<EmailLinkedInCreation />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;