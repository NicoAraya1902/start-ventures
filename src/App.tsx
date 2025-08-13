
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Index from "./pages/Index";

import ProjectPage from "./pages/Project";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";

import News from "./pages/News";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileCheck } from "@/components/ProfileCheck";
import { FloatingFeedbackButton } from "@/components/FloatingFeedbackButton";

const queryClient = new QueryClient();

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
        <FloatingFeedbackButton />
      </main>
      <Footer />
    </div>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<ProfileCheck><Index /></ProfileCheck>} />
              
              <Route path="news" element={<ProfileCheck><News /></ProfileCheck>} />
              
              <Route path="project/:id" element={<ProfileCheck><ProjectPage /></ProfileCheck>} />
              <Route path="messages" element={<ProfileCheck><Messages /></ProfileCheck>} />
              <Route path="profile" element={<Profile />} />
              <Route path="auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

