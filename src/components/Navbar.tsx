import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/collections', label: 'Nos Gammes' },
  { to: '/coffret', label: 'Coffret Découverte' },
  { to: '/quiz', label: 'Quiz Olfactif' },
  { to: '/histoire', label: 'Notre Histoire' },
  { to: '/contact', label: 'Contact' },
];

const themeLabels: Record<string, string> = {
  sacrae: 'SACRÆ', vitae: 'VITÆ', umbrae: 'UMBRÆ', nerolae: 'NEROLÆ', aera: 'ÆRA',
};

const Navbar = () => {
  const { totalItems, setIsOpen } = useCart();
  const { activeTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{ backgroundColor: `hsl(var(--navbar-bg) / 0.85)`, borderColor: `hsl(var(--navbar-border))`, transition: 'background-color 0.7s ease, border-color 0.6s ease' }}>
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        <Link to="/" className="font-display text-xl lg:text-2xl font-semibold tracking-wider">
          TH<span className="ae-highlight">Æ</span>M <span className="ae-highlight">Æ</span>TERNUM
        </Link>
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className={`font-body text-[11px] tracking-widest uppercase transition-colors duration-300 hover:text-primary ${location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'}`}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {activeTheme && (
              <motion.span key={activeTheme} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="hidden lg:inline-flex theme-badge">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `hsl(var(--primary))` }} />
                {themeLabels[activeTheme]}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Icône compte */}
          <Link
            to={user ? '/account' : '/login'}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Mon compte"
          >
            <User className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>

          {/* Panier */}
          <button onClick={() => setIsOpen(true)} className="relative p-2 transition-colors hover:text-primary">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-body font-semibold">
                {totalItems}
              </motion.span>
            )}
          </button>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-b overflow-hidden"
            style={{ backgroundColor: `hsl(var(--navbar-bg))`, borderColor: `hsl(var(--navbar-border))` }}>
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={`font-body text-sm tracking-widest uppercase py-2 transition-colors ${location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'}`}>
                  {link.label}
                </Link>
              ))}
              <Link
                to={user ? '/account' : '/login'}
                onClick={() => setMobileOpen(false)}
                className="font-body text-sm tracking-widest uppercase py-2 transition-colors text-muted-foreground hover:text-primary"
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
