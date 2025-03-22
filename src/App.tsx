
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FoodDetail from "./pages/FoodDetail";
import DailyPlate from "./pages/DailyPlate";
import Profile from "./pages/Profile";
import AllFoods from "./pages/AllFoods";
import Navbar from "./components/layout/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1 pt-2">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/aliment/:id" element={<FoodDetail />} />
              <Route path="/assiette" element={<DailyPlate />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/aliments" element={<AllFoods />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
