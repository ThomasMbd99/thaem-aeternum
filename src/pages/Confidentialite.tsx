import { motion } from 'framer-motion';

const Confidentialite = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-2">Légal</p>
          <h1 className="font-display text-3xl lg:text-4xl italic font-light text-foreground mb-12">Politique de confidentialité</h1>

          <div className="space-y-10 font-body text-sm text-foreground/70 leading-relaxed">

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">Données collectées</h2>
              <p>Dans le cadre de votre utilisation du site, THÆM ÆTERNUM collecte les données suivantes : nom, prénom, adresse email, adresse postale, historique de commandes. Ces données sont nécessaires au traitement de vos commandes et à la gestion de votre compte client.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">Utilisation des données</h2>
              <p>Vos données personnelles sont utilisées exclusivement pour le traitement de vos commandes, la gestion de votre compte, et l'envoi d'informations relatives à vos achats. Elles ne sont jamais vendues ou transmises à des tiers à des fins commerciales.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">Hébergement des données</h2>
              <p>Vos données sont stockées de manière sécurisée sur les serveurs de Supabase (infrastructure PostgreSQL), conformément aux normes de sécurité en vigueur.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">Cookies</h2>
              <p>Le site utilise des cookies techniques nécessaires à son bon fonctionnement (session, authentification). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">Vos droits</h2>
              <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à : thaemaeternum@gmail.com</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">Contact</h2>
              <p>Pour toute question relative à la protection de vos données personnelles : thaemaeternum@gmail.com</p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Confidentialite;
