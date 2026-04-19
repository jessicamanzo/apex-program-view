import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Programs from "./pages/Programs";
import Risks from "./pages/Risks";
import Roadmap from "./pages/Roadmap";
import ProgramDetail from "./pages/ProgramDetail";
import RiskDetail from "./pages/RiskDetail";
import MyApproach from "./pages/MyApproach";
import ExecutiveBriefing from "./pages/ExecutiveBriefing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/risks" element={<Risks />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/program/:id" element={<ProgramDetail />} />
          <Route path="/risk/:id" element={<RiskDetail />} />
          <Route path="/my-approach" element={<MyApproach />} />
          <Route path="/executive-briefing" element={<ExecutiveBriefing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
