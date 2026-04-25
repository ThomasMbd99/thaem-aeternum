import { motion } from 'framer-motion';

const CGV = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-2">Légal</p>
          <h1 className="font-display text-3xl lg:text-4xl italic font-light text-foreground mb-12">Conditions Générales de Vente</h1>

          <div className="space-y-10 font-body text-sm text-foreground/70 leading-relaxed">

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">1. Objet</h2>
              <p>Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits effectuées par THÆM ÆTERNUM (SIRET : 999 094 477 00018), dont le siège social est situé au 30 Rue Jean Moulin, 56100 Lorient, France.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">2. Produits</h2>
              <p>Les produits proposés sont des extraits de parfum et flacons voyage. Chaque produit est décrit avec soin sur le site. Les photographies sont non contractuelles.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">3. Prix</h2>
              <p>Les prix sont indiqués en euros, toutes taxes comprises (TTC). THÆM ÆTERNUM se réserve le droit de modifier ses prix à tout moment. Les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">4. Commande</h2>
              <p>Toute commande passée sur le site vaut acceptation des présentes CGV. La commande est confirmée par l'envoi d'un email de confirmation à l'adresse indiquée par le client.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">5. Paiement</h2>
              <p>Le paiement s'effectue en ligne par carte bancaire via la solution sécurisée Stripe. Les données bancaires sont cryptées et ne transitent pas par nos serveurs.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">6. Livraison</h2>
              <p>Les commandes sont expédiées dans un délai de 3 à 5 jours ouvrés après confirmation du paiement. Les délais de livraison varient selon le transporteur et la destination.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">7. Droit de rétractation</h2>
              <p>Conformément à la législation en vigueur, le client dispose d'un délai de 14 jours à compter de la réception de sa commande pour exercer son droit de rétractation, sans avoir à justifier de motifs. Les produits retournés doivent être dans leur état d'origine, non ouverts et non utilisés.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">8. Service client</h2>
              <p>Pour toute question, contactez-nous à : thaemaeternum@gmail.com</p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CGV;
