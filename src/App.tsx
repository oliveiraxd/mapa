import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ProgressProvider } from "@/contexts/ProgressContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import DefinePassword from "./pages/DefinePassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const search = window.location.search;
    const hash = window.location.hash;
    const pathname = window.location.pathname;

    const hasCode = search.includes("code=");
    const hasAccessToken = hash.includes("access_token=");
    const isInviteOrRecovery =
      search.includes("type=invite") ||
      search.includes("type=recovery") ||
      search.includes("type=signup") ||
      hash.includes("type=invite") ||
      hash.includes("type=recovery") ||
      hash.includes("type=signup");

    if ((hasCode || hasAccessToken || isInviteOrRecovery) && pathname !== "/definir-senha") {
      navigate(`/definir-senha${search}${hash}`, { replace: true });
    }
  }, [navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthRedirectHandler />
        <ProgressProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/definir-senha" element={<DefinePassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProgressProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;