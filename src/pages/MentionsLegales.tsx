import { motion } from 'framer-motion';

const MentionsLegales = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-2">Légal</p>
          <h1 className="font-display text-3xl lg:text-4xl italic font-light text-foreground mb-12">Mentions légales</h1>

          <div className="space-y-10 font-body text-sm text-foreground/70 leading-relaxed">

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">Éditeur du site</h2>
              <p>THÆM ÆTERNUM</p>
              <p>30 Rue Jean Moulin, 56100 Lorient, France</p>
              <p>Email : thaemaeternum@gmail.com</p>
              <p>SIRET : 999 094 477 00018</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">Hébergement</h2>
              <p>Le site est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">Propriété intellectuelle</h2>
              <p>L'ensemble du contenu de ce site (textes, images, visuels, logos, parfums, noms de gammes) est la propriété exclusive de THÆM ÆTERNUM et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable écrite.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">Responsabilité</h2>
              <p>THÆM ÆTERNUM s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Cependant, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. THÆM ÆTERNUM décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur ce site.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">Droit applicable</h2>
              <p>Le présent site et ses mentions légales sont soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MentionsLegales;
