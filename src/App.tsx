import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Landing from "@/components/landing/Landing";
import MatrixPills from "@/components/landing/MatrixPills";
import MatrixRain from "@/components/landing/MatrixRain";

const queryClient = new QueryClient();

const App = () => {
  const [stage, setStage] = useState("landing");

  if (stage === "landing") {
    return (
      <Landing
        onRedPill={() => setStage("rain")}
        onBluePill={() => setStage("pills")}
      />
    );
  }
  if (stage === "pills") {
    return <MatrixPills onComplete={() => setStage("rain")} />;
  }
  if (stage === "rain") {
    return <MatrixRain onComplete={() => setStage("profile")} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/portfolio/">
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
