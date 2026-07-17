import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-border bg-background py-12">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-display text-lg font-semibold mb-4">
            TH<span className="ae-highlight">Æ</span>M <span className="ae-highlight">Æ</span>TERNUM
          </h3>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Le souffle de l'âme. Parfumerie artisanale française.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-primary mb-4">Navigation</h4>
          <div className="flex flex-col gap-2">
            <Link to="/collections" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Nos Gammes</Link>
            <Link to="/coffret" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Coffret Découverte</Link>
            <Link to="/histoire" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Notre Histoire</Link>
            <Link to="/contact" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-primary mb-4">Contact</h4>
          <p className="font-body text-sm text-muted-foreground">contact@thaem-aeternum.com</p>
          <div className="flex gap-4 mt-4">
            <a href="https://www.instagram.com/thaem_aeternum/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm font-body">Instagram</a>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-body text-xs text-muted-foreground">© 2026 THÆM ÆTERNUM. Tous droits réservés.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center sm:justify-end">
          <a href="/mentions-legales" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors">Mentions légales</a>
          <a href="/cgv" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors">CGV</a>
          <a href="/politique-retour" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors">Politique de retour</a>
          <a href="/confidentialite" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors">Confidentialité</a>
        </div>
      </div>
    </div>
</footer>
);

export default Footer;
