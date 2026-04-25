import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AnimatedBackground from "@/components/AnimatedBackground";
import SplashScreen from "@/components/SplashScreen";
import ThemeTransition from "@/components/ThemeTransition";
import { useTheme } from "@/context/ThemeContext";
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import CollectionPage from "./pages/CollectionPage";
import ProductPage from "./pages/ProductPage";
import DiscoveryBox from "./pages/DiscoveryBox";
import OurStory from "./pages/OurStory";
import Contact from "./pages/Contact";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };

// Reset le thème quand on quitte une page collection ou produit
const ThemeGuard = () => {
  const location = useLocation();
  const { setTheme } = useTheme();

  useEffect(() => {
    const isCollectionPage = location.pathname.startsWith('/collection/');
    const isProductPage = location.pathname.startsWith('/produit/');
    if (!isCollectionPage && !isProductPage) {
      setTheme(null);
    }
  }, [location.pathname]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
          <Route path="/produit/:id" element={<ProductPage />} />
          <Route path="/coffret" element={<DiscoveryBox />} />
          <Route path="/histoire" element={<OurStory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/login" element={<LoginPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SplashScreen>
              <ThemeTransition />
              <ThemeGuard />
              <AnimatedBackground />
              <Navbar />
              <CartDrawer />
              <main><AnimatedRoutes /></main>
              <Footer />
            </SplashScreen>
          </BrowserRouter>
        </CartProvider>
      </ThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;