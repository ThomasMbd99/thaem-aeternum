import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AnimatedBackground from "@/components/AnimatedBackground";
import SplashScreen from "@/components/SplashScreen";
import ThemeTransition from "@/components/ThemeTransition";
import CookieBanner from "@/components/CookieBanner";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { useTheme } from "@/context/ThemeContext";
const Index = lazy(() => import("./pages/Index"));
const Collections = lazy(() => import("./pages/Collections"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const DiscoveryBox = lazy(() => import("./pages/DiscoveryBox"));
const OurStory = lazy(() => import("./pages/OurStory"));
const Contact = lazy(() => import("./pages/Contact"));
const Quiz = lazy(() => import("./pages/Quiz"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const CGV = lazy(() => import("./pages/CGV"));
const Confidentialite = lazy(() => import("./pages/Confidentialite"));
const PolitiqueRetour = lazy(() => import("./pages/PolitiqueRetour"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AllParfums = lazy(() => import("./pages/AllParfums"));
const InvoicePage = lazy(() => import("./pages/InvoicePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const OffresPage = lazy(() => import("./pages/OffresPage"));
const Sillages = lazy(() => import("./pages/Sillages"));
const SillageArticle = lazy(() => import("./pages/SillageArticle"));

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

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
        <Suspense fallback={null}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/parfums" element={<AllParfums />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
          <Route path="/produit/:id" element={<ProductPage />} />
          <Route path="/coffret" element={<DiscoveryBox />} />
          <Route path="/offres" element={<OffresPage />} />
          <Route path="/histoire" element={<OurStory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/login" element={<LoginPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/invoice/:id" element={<InvoicePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/politique-retour" element={<PolitiqueRetour />} />
            <Route path="/journal" element={<Sillages />} />
            <Route path="/journal/:slug" element={<SillageArticle />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <HelmetProvider>
  <MotionConfig reducedMotion="user">
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
              <ScrollToTop />
              <AnimatedBackground />
              <Navbar />
              <CartDrawer />
              <main><AnimatedRoutes /></main>
              <Footer />
              <ScrollToTopButton />
            </SplashScreen>
          </BrowserRouter>
        </CartProvider>
      </ThemeProvider>
        <CookieBanner />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </MotionConfig>
  </HelmetProvider>
);

export default App;