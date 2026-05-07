import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Sun, Moon } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Liens visibles sur desktop (5 max pour éviter l'écrasement)
const desktopLinks = [
  { to: '/collections',  label: 'Nos Gammes' },
  { to: '/parfums',      label: 'Parfums' },
  { to: '/offres',       label: 'Offres Æ' },
  { to: '/coffret',      label: 'Coffret' },
  { to: '/histoire',     label: 'Notre Histoire' },
];

// Tous les liens pour le menu mobile
const allLinks = [
  { to: '/',             label: 'Accueil' },
  { to: '/collections',  label: 'Nos Gammes' },
  { to: '/parfums',      label: 'Tous les Parfums' },
  { to: '/coffret',      label: 'Coffret Découverte' },
  { to: '/offres',       label: 'Les Offres Æ' },
  { to: '/quiz',         label: 'Quiz Olfactif' },
  { to: '/histoire',     label: 'Notre Histoire' },
  { to: '/contact',      label: 'Contact' },
];

const themeLabels: Record<string, string> = {
  sacrae: 'SACRÆ', vitae: 'VITÆ', umbrae: 'UMBRÆ', nerolae: 'NEROLÆ', aera: 'ÆRA',
};

const Navbar = () => {
  const { totalItems, setIsOpen } = useCart();
  const { activeTheme, lightMode, toggleLightMode } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCollectionPage = location.pathname.startsWith('/collection/') || location.pathname.startsWith('/produit/');
  const showLightToggle = !isCollectionPage;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: `hsl(var(--navbar-bg) / 0.88)`,
        borderColor: `hsl(var(--navbar-border))`,
        transition: 'background-color 0.7s ease, border-color 0.6s ease',
      }}
    >
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16 lg:h-18">

        {/* Logo */}
        <Link
          to="/"
          className="font-display font-semibold tracking-wider whitespace-nowrap shrink-0"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.25rem)', letterSpacing: '0.08em' }}
        >
          TH<span className="ae-highlight">Æ</span>M{' '}
          <span className="ae-highlight">Æ</span>TERNUM
        </Link>

        {/* Liens desktop — centrés */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {desktopLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-body text-[10px] xl:text-[11px] tracking-widest uppercase transition-colors duration-300 hover:text-primary whitespace-nowrap ${
                location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Icônes droite */}
        <div className="flex items-center gap-1 lg:gap-2 shrink-0">

          {/* Badge thème actif */}
          <AnimatePresence>
            {activeTheme && (
              <motion.span
                key={activeTheme}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="hidden lg:inline-flex theme-badge"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `hsl(var(--primary))` }} />
                {themeLabels[activeTheme]}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Toggle mode clair */}
          {showLightToggle && (
            <button
              onClick={toggleLightMode}
              className="p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label={lightMode ? 'Mode sombre' : 'Mode blanc & or'}
            >
              {lightMode
                ? <Moon className="w-4 h-4 text-muted-foreground" />
                : <Sun className="w-4 h-4 text-muted-foreground" />
              }
            </button>
          )}

          {/* Compte */}
          <Link
            to={user ? '/account' : '/login'}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Mon compte"
          >
            <User className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
          </Link>

          {/* Panier */}
          <button onClick={() => setIsOpen(true)} className="relative p-2 transition-colors hover:text-primary">
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-body font-semibold"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {/* Menu burger mobile */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 ml-1">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b overflow-hidden"
            style={{ backgroundColor: `hsl(var(--navbar-bg))`, borderColor: `hsl(var(--navbar-border))` }}
          >
            <div className="container mx-auto px-4 py-5 flex flex-col gap-1">
              {allLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body text-sm tracking-widest uppercase py-3 border-b transition-colors ${
                    location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={user ? '/account' : '/login'}
                onClick={() => setMobileOpen(false)}
                className="font-body text-sm tracking-widest uppercase py-3 transition-colors text-muted-foreground hover:text-primary mt-1"
              >
                {user ? 'Mon compte' : 'Connexion'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
