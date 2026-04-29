import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

const CheckoutPage = () => {
  const { items, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout`,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.url) window.location.href = data.url;
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center">
        <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
        <p className="font-body text-muted-foreground mb-6">Votre panier est vide.</p>
        <Link
          to="/collections"
          className="font-body text-xs uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
        >
          Découvrir les collections →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> Retour
          </Link>
          <h1 className="font-display text-4xl lg:text-5xl">Votre commande</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 mb-8"
        >
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.format}`}
              className="flex items-center justify-between p-4 bg-secondary/50 rounded border border-border"
            >
              <div>
                <p className="font-display text-sm">{item.name}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">
                  {item.format === 'recharge' ? 'Recharge 50ml ♻️' : item.format} × {item.quantity}
                </p>
              </div>
              <span className="font-body text-sm text-primary">{item.price * item.quantity}€</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border-t border-border pt-6 space-y-6"
        >
          <div className="flex justify-between font-display text-xl">
            <span>Total</span>
            <span className="text-primary">{totalPrice}€</span>
          </div>

          {error && (
            <p className="font-body text-xs text-destructive text-center">{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground font-body text-xs uppercase tracking-[0.3em] rounded hover:bg-primary/90 transition-all duration-300 btn-ripple flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Chargement…</>
            ) : (
              'Procéder au paiement'
            )}
          </button>

          <p className="font-body text-xs text-muted-foreground text-center">
            Paiement sécurisé par Stripe. Vos données sont chiffrées.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
