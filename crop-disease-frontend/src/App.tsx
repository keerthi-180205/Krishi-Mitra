import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Detection from "./pages/Detection";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import CropRecommender from "./pages/CropRecommender";
import FertilizerRecommender from "./pages/FertilizerRecommender";
import Assistant from "./pages/Assistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/detection" element={<Detection />} />
          <Route path="/about" element={<About />} />
          
          {/* --- CORRECTED ROUTES TO MATCH HOME PAGE CARDS --- */}
          {/* Was "/assistant", needs to be "/ai-assistant" */}
          <Route path="/ai-assistant" element={<Assistant />} />
          
          {/* Was "/crop-recommender", needs to be "/crop-recommend" */}
          <Route path="/crop-recommend" element={<CropRecommender />} />
          
          {/* Was "/fertilizer-recommender", needs to be "/fertilizer" */}
          <Route path="/fertilizer" element={<FertilizerRecommender />} />
          {/* ----------------------------------------------- */}

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;