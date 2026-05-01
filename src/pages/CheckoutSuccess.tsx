import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

const CheckoutSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();

    const raw = sessionStorage.getItem('pendingOrder');
    if (raw) {
      try {
        const orderData = JSON.parse(raw);
        if (orderData.userEmail) {
          supabase.functions.invoke('send-confirmation-email', { body: orderData });
        }
      } catch {}
      sessionStorage.removeItem('pendingOrder');
    }
  }, [clearCart]);

  return (
    <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-md px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8 flex justify-center"
        >
          <CheckCircle className="w-16 h-16 text-primary" />
        </motion.div>

        <h1 className="font-display text-4xl lg:text-5xl mb-4">Commande confirmée</h1>
        <p className="font-body text-muted-foreground mb-2">
          Merci pour votre confiance. Votre commande a été reçue.
        </p>
        <p className="font-body text-sm text-muted-foreground mb-10">
          Un email de confirmation vous a été envoyé.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/account"
            className="inline-block px-8 py-3 font-body text-xs uppercase tracking-[0.3em] rounded transition-all duration-300"
            style={{ border: '1px solid rgba(196,149,106,0.4)', color: '#C4956A' }}
          >
            Voir mes commandes
          </Link>
          <Link
            to="/collections"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-body text-xs uppercase tracking-[0.3em] rounded hover:bg-primary/90 transition-all duration-300 btn-ripple"
          >
            Continuer à explorer
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
