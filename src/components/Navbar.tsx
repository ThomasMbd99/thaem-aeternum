import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, ChevronDown, Instagram, Home } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const boutiqueLinks = [
  { to: '/collections',  label: 'Nos Gammes' },
  { to: '/parfums',      label: 'Tous les Parfums' },
  { to: '/coffret',      label: 'Coffret Découverte' },
  { to: '/offres',       label: 'Les Offres Æ' },
];

const mainLinks = [
  { to: '/journal',  label: 'Journal Æ' },
  { to: '/quiz',      label: 'Quiz' },
  { to: '/histoire',  label: 'La Maison' },
  { to: '/contact',   label: 'Contact' },
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
  const [boutiqueOpen, setBoutiqueOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const lastY = useRef(0);
  const boutiqueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? y / max : 0);
      setNavVisible(y < lastY.current || y < 80);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (boutiqueRef.current && !boutiqueRef.current.contains(e.target as Node)) {
        setBoutiqueOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setBoutiqueOpen(false); setMobileOpen(false); }, [location.pathname]);

  const isBoutiqueActive = boutiqueLinks.some(l => location.pathname === l.to || location.pathname.startsWith('/collection/') || location.pathname.startsWith('/produit/'));

  const linkCls = (active: boolean) =>
    `font-body uppercase whitespace-nowrap transition-colors duration-300 hover:text-primary ${active ? 'text-primary' : 'text-muted-foreground'}`;

  return (
    <motion.nav
      animate={{ y: navVisible ? 0 : '-100%' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: `hsl(var(--navbar-bg) / 0.88)`,
        borderColor: `hsl(var(--navbar-border))`,
        transition: 'background-color 0.7s ease, border-color 0.6s ease',
      }}
    >
      <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between h-16 lg:h-18 gap-4">

        {/* Logo */}
        <Link
          to="/"
          className="font-display font-semibold whitespace-nowrap shrink-0 tracking-widest"
          style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)' }}
        >
          TH<span className="ae-highlight">Æ</span>M{' '}
          <span className="ae-highlight">Æ</span>TERNUM
        </Link>

        {/* Liens desktop */}
        <div className="hidden lg:flex items-center justify-center flex-1 gap-5 xl:gap-7">

          {/* Accueil icône */}
          <Link
            to="/"
            className={`transition-colors duration-300 hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
            aria-label="Accueil"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>

          {/* Boutique dropdown */}
          <div ref={boutiqueRef} className="relative">
            <button
              onClick={() => setBoutiqueOpen(v => !v)}
              className={`flex items-center gap-1 font-body uppercase whitespace-nowrap transition-colors duration-300 hover:text-primary ${isBoutiqueActive ? 'text-primary' : 'text-muted-foreground'}`}
              style={{ fontSize: '10.5px', letterSpacing: '0.2em' }}
            >
              Boutique
              <ChevronDown
                className="w-3 h-3 transition-transform duration-200"
                style={{ transform: boutiqueOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            <AnimatePresence>
              {boutiqueOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 py-2 rounded-xl border w-48"
                  style={{
                    background: 'hsl(var(--navbar-bg) / 0.98)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  {boutiqueLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-4 py-2.5 font-body text-[9px] uppercase tracking-[0.2em] transition-colors hover:text-primary"
                      style={{ color: location.pathname === link.to ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.5)' }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Liens principaux */}
          {mainLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={linkCls(location.pathname === link.to || location.pathname.startsWith(link.to + '/'))}
              style={{ fontSize: '10.5px', letterSpacing: '0.2em' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Icônes droite */}
        <div className="flex items-center gap-1 shrink-0">
          <AnimatePresence>
            {activeTheme && (
              <motion.span
                key={activeTheme}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="hidden lg:inline-flex theme-badge mr-1"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `hsl(var(--primary))` }} />
                {themeLabels[activeTheme]}
              </motion.span>
            )}
          </AnimatePresence>

          <a
            href="https://www.instagram.com/thaem_aeternum"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex p-2 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
          </a>

          <Link
            to={user ? '/account' : '/login'}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
            aria-label="Mon compte"
          >
            <User className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
          </Link>

          <button onClick={() => setIsOpen(true)} className="relative p-2 transition-colors hover:text-primary">
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-body font-semibold"
                style={{ fontSize: '9px' }}
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Barre de progression scroll */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `hsl(var(--navbar-border))` }}>
        <motion.div
          className="h-full origin-left"
          style={{
            scaleX: scrollProgress,
            background: 'linear-gradient(90deg, hsl(var(--primary)), rgba(196,149,106,0.6))',
            boxShadow: '0 0 6px rgba(196,149,106,0.5)',
          }}
        />
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
            <div className="container mx-auto px-4 py-4 flex flex-col">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className={`font-body text-sm tracking-widest uppercase py-3 border-b transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
              >
                Accueil
              </Link>

              {/* Boutique section */}
              <p className="font-body text-[9px] uppercase tracking-[0.3em] py-2 mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Boutique
              </p>
              {boutiqueLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`font-body text-sm tracking-widest uppercase py-3 border-b pl-3 transition-colors ${
                    location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                >
                  {link.label}
                </Link>
              ))}

              {/* Séparateur */}
              <div className="my-2" />

              {/* Liens principaux */}
              {mainLinks.map(link => (
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
                className="font-body text-sm tracking-widest uppercase py-3 text-muted-foreground hover:text-primary transition-colors"
              >
                {user ? 'Mon compte' : 'Connexion'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
