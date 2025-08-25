import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PatientDashboard from "./pages/PatientDashboard";
import MedecinDashboard from "./pages/MedecinDashboard";
import UserHistory from "./pages/section/UserHistory";
import RdvHistory from "./pages/section/RdvHistory";
import RdvPage from "./pages/section/RdvPage";
import UsersPage from "./pages/section/UsersPage";
import CreneauForm from "./pages/Historiques/CreneauForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Auth />} /> 
          <Route path="/auth" element={<Auth />} /> 
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/patientdashboard" element={<PatientDashboard />} /> 
          <Route path="/medecindashboard" element={<MedecinDashboard />} /> 
          <Route path="/history/users" element={<UserHistory />} />
          <Route path="/history/appointments" element={<RdvHistory />} />
          <Route path="/rendezvous" element={<RdvPage />} /> 
          <Route path="/userspage" element={<UsersPage />} />
          <Route path="/creer-creneau" element={<CreneauForm />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
