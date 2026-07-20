import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const PolitiqueRetour = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <Helmet>
        <title>Politique de Retour, THÆM ÆTERNUM</title>
        <meta name="description" content="Politique de retour THÆM ÆTERNUM : droit de rétractation 14 jours, conditions de retour, procédure et remboursement." />
        <link rel="canonical" href="https://www.thaem-aeternum.com/politique-retour" />
      </Helmet>
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-2">Légal</p>
          <h1 className="font-display text-3xl lg:text-4xl italic font-light text-foreground mb-12">Politique de Retour</h1>

          <div className="space-y-10 font-body text-sm text-foreground/70 leading-relaxed">

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">1. Droit de rétractation</h2>
              <p>Conformément à l'article L221-18 du Code de la consommation, vous disposez d'un délai de <strong className="text-foreground">14 jours calendaires</strong> à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">2. Conditions de retour</h2>
              <p className="mb-3">Pour être acceptés, les produits retournés doivent impérativement :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Être dans leur état d'origine, non ouverts et non utilisés</li>
                <li>Être dans leur emballage d'origine intact</li>
                <li>Être accompagnés de la facture ou du bon de commande</li>
              </ul>
              <p className="mt-3">Les produits ouverts ou partiellement utilisés ne peuvent pas être repris pour des raisons d'hygiène et de sécurité, conformément à l'article L221-28 du Code de la consommation.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">3. Procédure de retour</h2>
              <p className="mb-3">Pour effectuer un retour :</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Contactez-nous à <a href="mailto:thaemaeternum@gmail.com" className="text-primary hover:underline">thaemaeternum@gmail.com</a> en indiquant votre numéro de commande et le motif du retour.</li>
                <li>Nous vous communiquerons l'adresse de retour et les instructions d'expédition.</li>
                <li>Expédiez le colis à vos frais dans un emballage sécurisé.</li>
              </ol>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">4. Frais de retour</h2>
              <p>Les frais de retour sont à la charge du client, sauf en cas de produit défectueux ou d'erreur de notre part. Nous vous recommandons d'utiliser un mode d'expédition avec suivi.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">5. Remboursement</h2>
              <p>Dès réception et vérification du retour, nous procéderons au remboursement intégral du montant de votre commande (hors frais de livraison initiaux) dans un délai de <strong className="text-foreground">14 jours</strong>, via le même moyen de paiement que celui utilisé lors de l'achat.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">6. Produits défectueux</h2>
              <p>En cas de produit défectueux ou endommagé à la livraison, contactez-nous immédiatement à <a href="mailto:thaemaeternum@gmail.com" className="text-primary hover:underline">thaemaeternum@gmail.com</a> avec photos à l'appui. Nous prendrons en charge les frais de retour et procéderons à un échange ou un remboursement complet.</p>
            </section>

            <section>
              <h2 className="font-display italic text-xl text-foreground mb-4">7. Contact</h2>
              <p>Pour toute question concernant votre retour : <a href="mailto:thaemaeternum@gmail.com" className="text-primary hover:underline">thaemaeternum@gmail.com</a></p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PolitiqueRetour;
