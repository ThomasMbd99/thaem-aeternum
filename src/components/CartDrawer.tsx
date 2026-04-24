import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl">Votre Panier ({totalItems})</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <ShoppingBag className="w-12 h-12 opacity-30" />
                <p className="font-body text-sm">Votre panier est vide</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map(item => (
                    <div key={`${item.productId}-${item.format}`} className="flex gap-4 p-4 bg-secondary/50 rounded">
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <span className="font-display text-xs text-primary">{item.name.slice(0, 3)}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display text-sm">{item.name}</h4>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">
                          {item.format === 'recharge' ? 'Recharge 50ml ♻️' : item.format}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.productId, item.format, item.quantity - 1)}
                              className="w-6 h-6 rounded border border-border flex items-center justify-center hover:border-primary transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.format, item.quantity + 1)}
                              className="w-6 h-6 rounded border border-border flex items-center justify-center hover:border-primary transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-body text-sm text-primary">{item.price * item.quantity}€</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.format)}
                        className="text-muted-foreground hover:text-destructive transition-colors self-start"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex justify-between font-display text-lg">
                    <span>Total</span>
                    <span className="text-primary">{totalPrice}€</span>
                  </div>
                  <Link
                    to="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center py-3 bg-primary text-primary-foreground font-body text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors rounded btn-ripple"
                  >
                    Commander
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
