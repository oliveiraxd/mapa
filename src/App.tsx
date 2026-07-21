import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import DefinePassword from "./pages/DefinePassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Synchronously capture if the initial page load has invitation or recovery parameters
// before Supabase SDK consumes the hash/search and removes them from window.location.
const initialHash = typeof window !== "undefined" ? window.location.hash : "";
const initialSearch = typeof window !== "undefined" ? window.location.search : "";
const isInviteOrRecoveryInitial =
  initialHash.includes("type=invite") ||
  initialHash.includes("type=recovery") ||
  initialHash.includes("type=signup") ||
  initialHash.includes("access_token=") ||
  initialSearch.includes("type=invite") ||
  initialSearch.includes("type=recovery") ||
  initialSearch.includes("type=signup") ||
  initialSearch.includes("code=");

if (typeof window !== "undefined" && isInviteOrRecoveryInitial) {
  (window as any).__IS_INVITE_OR_RECOVERY__ = true;
}

const AuthRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isInvite = typeof window !== "undefined" && (window as any).__IS_INVITE_OR_RECOVERY__;
    const pathname = window.location.pathname;

    if (isInvite && pathname !== "/definir-senha") {
      (window as any).__IS_INVITE_OR_RECOVERY__ = false;
      navigate("/definir-senha", { replace: true });
    }
  }, [navigate]);

  return null;
};

const RootRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    const isInvite = typeof window !== "undefined" && (window as any).__IS_INVITE_OR_RECOVERY__;

    if (isInvite) {
      (window as any).__IS_INVITE_OR_RECOVERY__ = false;
      navigate("/definir-senha", { replace: true });
    } else if (user) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
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
            <Route path="/" element={<RootRedirect />} />
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