import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems, hiddenRoutes } from "./nav-items";
import EmailLinkedInCreation from "./pages/EmailLinkedInCreation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
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
          <div className="fixed bottom-4 right-4 z-50">
            <img src="/logo.svg" alt="Logo" className="w-24 h-24" />
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;