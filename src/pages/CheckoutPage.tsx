import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Loader2, MapPin, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const SHIPPING_THRESHOLD = 80;
const SHIPPING_COST = 5.9;

interface DeliveryAddress {
  prenom: string;
  nom: string;
  telephone: string;
  adresse: string;
  ville: string;
  code_postal: string;
  pays: string;
}

const inputClass =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded font-body text-sm text-foreground focus:outline-none focus:border-white/25 transition-colors';
const labelClass = 'block font-body text-xs uppercase tracking-widest text-foreground/40 mb-1.5';

const CheckoutPage = () => {
  const { items, totalPrice } = useCart();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [address, setAddress] = useState<DeliveryAddress>({
    prenom: '',
    nom: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'France',
  });

  useEffect(() => {
    if (profile) {
      setAddress({
        prenom: profile.prenom ?? '',
        nom: profile.nom ?? '',
        telephone: profile.telephone ?? '',
        adresse: profile.adresse ?? '',
        ville: profile.ville ?? '',
        code_postal: profile.code_postal ?? '',
        pays: profile.pays ?? 'France',
      });
    }
  }, [profile]);

  const shippingCost = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const finalTotal = totalPrice + shippingCost;

  const isAddressComplete =
    address.prenom.trim() &&
    address.nom.trim() &&
    address.adresse.trim() &&
    address.ville.trim() &&
    address.code_postal.trim();

  const set = (key: keyof DeliveryAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress(a => ({ ...a, [key]: e.target.value }));

  const handleCheckout = async () => {
    if (!isAddressComplete) {
      setError('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items,
          shippingCost,
          address,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout`,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.url) window.location.href = data.url;
      else throw new Error('URL de paiement non reçue.');
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
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> Retour
          </Link>
          <h1 className="font-display text-4xl lg:text-5xl">Votre commande</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Formulaire adresse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-3 space-y-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="font-display italic text-lg">Adresse de livraison</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Prénom *</label>
                <input className={inputClass} value={address.prenom} onChange={set('prenom')} />
              </div>
              <div>
                <label className={labelClass}>Nom *</label>
                <input className={inputClass} value={address.nom} onChange={set('nom')} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Adresse *</label>
              <input className={inputClass} value={address.adresse} onChange={set('adresse')} placeholder="Numéro et nom de rue" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Code postal *</label>
                <input className={inputClass} value={address.code_postal} onChange={set('code_postal')} />
              </div>
              <div>
                <label className={labelClass}>Ville *</label>
                <input className={inputClass} value={address.ville} onChange={set('ville')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Pays</label>
                <input className={inputClass} value={address.pays} onChange={set('pays')} />
              </div>
              <div>
                <label className={labelClass}>Téléphone</label>
                <input className={inputClass} value={address.telephone} onChange={set('telephone')} type="tel" />
              </div>
            </div>

            {/* Livraison info */}
            <div
              className="flex items-center gap-3 p-4 rounded border"
              style={{ background: 'rgba(196,149,106,0.05)', borderColor: 'rgba(196,149,106,0.15)' }}
            >
              <Truck className="w-4 h-4 shrink-0" style={{ color: '#C4956A' }} />
              <p className="font-body text-xs text-foreground/60">
                {shippingCost === 0
                  ? 'Livraison offerte à partir de 80€'
                  : `Livraison standard : ${SHIPPING_COST.toFixed(2).replace('.', ',')}€ — gratuite dès 80€`}
              </p>
            </div>
          </motion.div>

          {/* Récap commande */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-3"
          >
            <h2 className="font-display italic text-lg mb-4">Récapitulatif</h2>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.format}`}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded border border-border"
                >
                  <div>
                    <p className="font-display text-sm">{item.name}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">
                      {item.format} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-body text-sm text-primary">{(item.price * item.quantity).toFixed(2).replace('.', ',')}€</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between font-body text-sm text-foreground/60">
                <span>Sous-total</span>
                <span>{totalPrice.toFixed(2).replace('.', ',')}€</span>
              </div>
              <div className="flex justify-between font-body text-sm text-foreground/60">
                <span>Livraison</span>
                <span>{shippingCost === 0 ? 'Offerte' : `${SHIPPING_COST.toFixed(2).replace('.', ',')}€`}</span>
              </div>
              <div className="flex justify-between font-display text-xl pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{finalTotal.toFixed(2).replace('.', ',')}€</span>
              </div>
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
    </div>
  );
};

export default CheckoutPage;
