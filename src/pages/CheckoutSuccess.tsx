import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const CheckoutSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
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
          Un email de confirmation vous sera envoyé sous peu.
        </p>

        <Link
          to="/collections"
          className="inline-block px-8 py-3 bg-primary text-primary-foreground font-body text-xs uppercase tracking-[0.3em] rounded hover:bg-primary/90 transition-all duration-300 btn-ripple"
        >
          Continuer à explorer
        </Link>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
