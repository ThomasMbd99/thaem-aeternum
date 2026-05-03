import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Loader2, MapPin, Truck, Tag, X, Home, LogIn, UserPlus, Store } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import RelayPointPicker, { type RelayPoint } from '@/components/RelayPointPicker';

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

// ── Étapes ──────────────────────────────────────────
const Steps = ({ current }: { current: number }) => (
  <div className="flex items-center justify-center gap-3 mb-10">
    {['Panier', 'Livraison', 'Paiement'].map((label, i) => {
      const step = i + 1;
      const active = step === current;
      const done = step < current;
      return (
        <div key={label} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center font-body text-[10px] transition-all"
              style={{
                background: done ? 'rgba(196,149,106,0.3)' : active ? '#C4956A' : 'rgba(255,255,255,0.05)',
                color: active ? '#000' : done ? '#C4956A' : 'rgba(255,255,255,0.3)',
                border: done ? '1px solid rgba(196,149,106,0.4)' : active ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {done ? '✓' : step}
            </div>
            <span className="font-body text-xs uppercase tracking-widest" style={{ color: active ? '#C4956A' : 'rgba(255,255,255,0.3)' }}>
              {label}
            </span>
          </div>
          {i < 2 && <div className="w-8 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />}
        </div>
      );
    })}
  </div>
);

// ── Gate de connexion ─────────────────────────────
const LoginGate = ({ onContinueAsGuest }: { onContinueAsGuest: () => void }) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
      <Steps current={2} />
      <div className="border border-white/8 rounded-lg p-8 space-y-6">
        <div className="text-center mb-2">
          <h2 className="font-display italic text-2xl mb-2">Avant de continuer</h2>
          <p className="font-body text-sm text-foreground/40">Connectez-vous pour sauvegarder votre commande et accéder à votre historique.</p>
        </div>

        <button
          onClick={() => navigate('/login', { state: { from: '/checkout' } })}
          className="w-full flex items-center justify-center gap-3 py-4 font-body text-xs uppercase tracking-widest rounded transition-all duration-300"
          style={{ background: 'rgba(196,149,106,0.15)', border: '1px solid rgba(196,149,106,0.3)', color: '#C4956A' }}
        >
          <LogIn className="w-4 h-4" />
          Se connecter
        </button>

        <button
          onClick={() => navigate('/login', { state: { from: '/checkout', mode: 'register' } })}
          className="w-full flex items-center justify-center gap-3 py-4 font-body text-xs uppercase tracking-widest rounded transition-all duration-300"
          style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
        >
          <UserPlus className="w-4 h-4" />
          Créer un compte
        </button>

        <div className="text-center pt-2 border-t border-white/5">
          <button
            onClick={onContinueAsGuest}
            className="font-body text-xs text-foreground/30 hover:text-foreground/60 transition-colors underline underline-offset-2"
          >
            Continuer en tant qu'invité
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Page principale ───────────────────────────────
const CheckoutPage = () => {
  const { items, totalPrice, bundleDiscount, finalPrice: cartFinalPrice } = useCart();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestMode, setGuestMode] = useState(false);
  const [cgvAccepted, setCgvAccepted] = useState(false);

  const [address, setAddress] = useState<DeliveryAddress>({
    prenom: '', nom: '', telephone: '', adresse: '', ville: '', code_postal: '', pays: 'France',
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

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<'home' | 'relay' | 'click_collect'>('home');
  const [selectedRelay, setSelectedRelay] = useState<RelayPoint | null>(null);

  const shippingCost = deliveryMode === 'click_collect' ? 0 : cartFinalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const finalTotal = cartFinalPrice + shippingCost;

  const isAddressComplete = deliveryMode === 'click_collect'
    ? true
    : deliveryMode === 'relay'
    ? selectedRelay !== null
    : !!(address.prenom.trim() && address.nom.trim() && address.adresse.trim() && address.ville.trim() && address.code_postal.trim());

  const set = (key: keyof DeliveryAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress(a => ({ ...a, [key]: e.target.value }));

  const saveOrderToSupabase = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      const { data: commande, error: cmdError } = await supabase
        .from('commandes')
        .insert({ user_id: user.id, email: user.email, statut: 'pending', total: finalTotal, mode_livraison: deliveryMode })
        .select()
        .single();

      if (cmdError || !commande) return null;

      await supabase.from('commande_items').insert(
        items.map(item => ({
          commande_id: commande.id,
          parfum_nom: item.name,
          format: item.isDiscoveryBox ? `Coffret 5×10ml` : item.format,
          quantite: item.quantity,
          prix_unitaire: item.price,
        }))
      );

      // Décrémentation du stock
      const { data: parfumsData } = await supabase.from('parfums').select('nom, stock');
      if (!parfumsData) return;

      const slugToNom = new Map<string, string>();
      const nomToStock = new Map<string, number>();
      for (const p of parfumsData) {
        const slug = (p.nom as string).toLowerCase()
          .replace(/æ/g, 'ae')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        slugToNom.set(slug, p.nom as string);
        nomToStock.set(p.nom as string, p.stock as number);
      }

      const decrements = new Map<string, number>();
      for (const item of items) {
        if (item.isDiscoveryBox && item.selectedPerfumes) {
          for (const slug of item.selectedPerfumes) {
            const nom = slugToNom.get(slug);
            if (nom) decrements.set(nom, (decrements.get(nom) ?? 0) + item.quantity);
          }
        } else {
          decrements.set(item.name, (decrements.get(item.name) ?? 0) + item.quantity);
        }
      }

      await Promise.all(
        Array.from(decrements.entries()).map(([nom, qty]) => {
          const newStock = Math.max(0, (nomToStock.get(nom) ?? 0) - qty);
          return supabase.from('parfums').update({ stock: newStock }).eq('nom', nom);
        })
      );

      return commande.id as string;
    } catch (e) {
      return null;
    }
  };

  const handleCheckout = async () => {
    if (!isAddressComplete) {
      setError('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    if (!cgvAccepted) {
      setError('Veuillez accepter les conditions générales de vente.');
      return;
    }
    setLoading(true);
    setError(null);
    setPromoError(null);

    try {
      sessionStorage.setItem('pendingOrder', JSON.stringify({
        items,
        address: deliveryMode === 'relay' ? selectedRelay : deliveryMode === 'click_collect' ? null : address,
        shippingCost,
        bundleDiscount,
        finalTotal,
        userEmail: user?.email ?? '',
        mode_livraison: deliveryMode,
      }));

      const commandeId = await saveOrderToSupabase();

      const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items,
          shippingCost,
          address: deliveryMode === 'relay' ? selectedRelay : deliveryMode === 'click_collect' ? null : address,
          promoCode: promoCode.trim() || undefined,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/checkout`,
          commandeId: commandeId ?? undefined,
          mode_livraison: deliveryMode,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error?.includes('coupon')) { setPromoError('Code promo invalide ou expiré.'); return; }
      if (data?.url) window.location.href = data.url;
      else throw new Error('URL de paiement non reçue.');
    } catch (e: any) {
      if (e?.message?.toLowerCase().includes('coupon')) {
        setPromoError('Code promo invalide ou expiré.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center">
        <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
        <p className="font-body text-muted-foreground mb-6">Votre panier est vide.</p>
        <Link to="/collections" className="font-body text-xs uppercase tracking-widest text-primary hover:opacity-70 transition-opacity">
          Découvrir les collections →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-3 h-3" /> Retour
          </Link>
          <h1 className="font-display text-4xl lg:text-5xl">Votre commande</h1>
        </motion.div>

        {/* Gate connexion si non connecté et pas en mode invité */}
        {!user && !guestMode ? (
          <LoginGate onContinueAsGuest={() => setGuestMode(true)} />
        ) : (
          <>
            <Steps current={2} />

            <div className={`grid grid-cols-1 gap-8 ${deliveryMode === 'relay' ? '' : 'lg:grid-cols-5'}`}>

              {/* Formulaire livraison */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={`space-y-5 ${deliveryMode === 'relay' ? '' : 'lg:col-span-3'}`}>

                {/* Mode de livraison */}
                <div>
                  <p className={labelClass}>Mode de livraison</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { mode: 'home' as const, icon: Home, label: 'À domicile', sub: 'Livraison chez vous' },
                      { mode: 'relay' as const, icon: MapPin, label: 'Point relais', sub: 'Mondial Relay' },
                      { mode: 'click_collect' as const, icon: Store, label: 'Click & Collect', sub: 'Retrait à Lorient · Gratuit' },
                    ].map(({ mode, icon: Icon, label, sub }) => (
                      <button
                        key={mode}
                        onClick={() => setDeliveryMode(mode)}
                        className="flex items-center gap-3 p-4 rounded border transition-all duration-300 text-left"
                        style={{
                          background: deliveryMode === mode ? 'rgba(196,149,106,0.08)' : 'rgba(255,255,255,0.02)',
                          borderColor: deliveryMode === mode ? 'rgba(196,149,106,0.4)' : 'rgba(255,255,255,0.08)',
                        }}
                      >
                        <Icon className="w-4 h-4 shrink-0" style={{ color: deliveryMode === mode ? '#C4956A' : 'rgba(255,255,255,0.3)' }} />
                        <div>
                          <p className="font-body text-xs uppercase tracking-widest" style={{ color: deliveryMode === mode ? '#C4956A' : 'rgba(255,255,255,0.5)' }}>{label}</p>
                          <p className="font-body text-[10px] text-foreground/30 mt-0.5">{sub}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h2 className="font-display italic text-lg">{deliveryMode === 'relay' ? 'Choisir un point relais' : 'Adresse de livraison'}</h2>
                </div>

                {deliveryMode === 'click_collect' && (
                  <div className="flex items-start gap-3 p-5 rounded border" style={{ background: 'rgba(196,149,106,0.05)', borderColor: 'rgba(196,149,106,0.2)' }}>
                    <Store className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#C4956A' }} />
                    <div>
                      <p className="font-body text-xs uppercase tracking-widest mb-2" style={{ color: '#C4956A' }}>Retrait à Lorient</p>
                      <p className="font-body text-xs text-foreground/60 leading-relaxed">
                        Après validation de votre paiement, contactez-nous sur Instagram pour organiser votre retrait.
                        Nous vous répondrons pour convenir d'un créneau.
                      </p>
                    </div>
                  </div>
                )}

                {deliveryMode === 'relay' && (
                  <RelayPointPicker selected={selectedRelay} onSelect={setSelectedRelay} />
                )}

                {deliveryMode === 'home' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelClass}>Prénom *</label><input className={inputClass} value={address.prenom} onChange={set('prenom')} /></div>
                      <div><label className={labelClass}>Nom *</label><input className={inputClass} value={address.nom} onChange={set('nom')} /></div>
                    </div>
                    <div><label className={labelClass}>Adresse *</label><input className={inputClass} value={address.adresse} onChange={set('adresse')} placeholder="Numéro et nom de rue" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelClass}>Code postal *</label><input className={inputClass} value={address.code_postal} onChange={set('code_postal')} /></div>
                      <div><label className={labelClass}>Ville *</label><input className={inputClass} value={address.ville} onChange={set('ville')} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelClass}>Pays</label><input className={inputClass} value={address.pays} onChange={set('pays')} /></div>
                      <div><label className={labelClass}>Téléphone</label><input className={inputClass} value={address.telephone} onChange={set('telephone')} type="tel" /></div>
                    </div>
                  </>
                )}

                {/* Livraison info */}
                {deliveryMode !== 'click_collect' && (
                  <div className="flex items-center gap-3 p-4 rounded border" style={{ background: 'rgba(196,149,106,0.05)', borderColor: 'rgba(196,149,106,0.15)' }}>
                    <Truck className="w-4 h-4 shrink-0" style={{ color: '#C4956A' }} />
                    <div>
                      <p className="font-body text-xs text-foreground/60">
                        {shippingCost === 0 ? 'Livraison offerte' : `Livraison standard : ${SHIPPING_COST.toFixed(2).replace('.', ',')}€ — gratuite dès 80€`}
                      </p>
                      <p className="font-body text-[10px] text-foreground/30 mt-0.5">Délai estimé : 3 à 5 jours ouvrés</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Récapitulatif */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`space-y-3 ${deliveryMode === 'relay' ? '' : 'lg:col-span-2'}`}>
                <h2 className="font-display italic text-lg mb-4">Récapitulatif</h2>

                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.format}`} className="flex items-start justify-between p-3 bg-secondary/50 rounded border border-border">
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm">{item.name}</p>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">
                          {item.isDiscoveryBox ? 'Coffret 5 × 10ml' : item.format === 'recharge' ? 'Recharge 50ml ♻️' : item.format} × {item.quantity}
                        </p>
                        {item.isDiscoveryBox && item.selectedPerfumes && (
                          <p className="font-body text-[10px] text-foreground/30 mt-1 leading-relaxed">{item.selectedPerfumes.join(', ')}</p>
                        )}
                      </div>
                      <span className="font-body text-sm text-primary ml-2 shrink-0">{(item.price * item.quantity).toFixed(2).replace('.', ',')}€</span>
                    </div>
                  ))}
                </div>

                {/* Code promo */}
                <div>
                  <label className={labelClass}><Tag className="w-3 h-3 inline mr-1" />Code promo</label>
                  <div className="flex gap-2">
                    <input className={inputClass} value={promoCode} onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(null); }} placeholder="WELCOME10" />
                    {promoCode && <button onClick={() => { setPromoCode(''); setPromoError(null); }} className="px-3 text-foreground/30 hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>}
                  </div>
                  {promoError && <p className="font-body text-xs text-red-400 mt-1">{promoError}</p>}
                  {promoCode && !promoError && <p className="font-body text-xs mt-1" style={{ color: '#C4956A' }}>Le code sera appliqué lors du paiement.</p>}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between font-body text-sm text-foreground/60"><span>Sous-total</span><span>{totalPrice.toFixed(2).replace('.', ',')}€</span></div>
                  {bundleDiscount > 0 && (
                    <div className="flex justify-between font-body text-sm" style={{ color: '#C4956A' }}>
                      <span>Offre duo parfums</span>
                      <span>-{bundleDiscount.toFixed(2).replace('.', ',')}€</span>
                    </div>
                  )}
                  <div className="flex justify-between font-body text-sm text-foreground/60"><span>Livraison</span><span>{deliveryMode === 'click_collect' ? 'Click & Collect' : shippingCost === 0 ? 'Offerte' : `${SHIPPING_COST.toFixed(2).replace('.', ',')}€`}</span></div>
                  {promoCode && <div className="flex justify-between font-body text-sm" style={{ color: '#C4956A' }}><span>Code promo ({promoCode})</span><span>Appliqué sur Stripe</span></div>}
                  <div className="flex justify-between font-display text-xl pt-2 border-t border-border"><span>Total</span><span className="text-primary">{finalTotal.toFixed(2).replace('.', ',')}€</span></div>
                </div>

                {/* CGV */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    onClick={() => setCgvAccepted(!cgvAccepted)}
                    className="w-4 h-4 mt-0.5 rounded shrink-0 border flex items-center justify-center transition-all"
                    style={{ background: cgvAccepted ? '#C4956A' : 'transparent', borderColor: cgvAccepted ? '#C4956A' : 'rgba(255,255,255,0.2)' }}
                  >
                    {cgvAccepted && <span className="text-black text-[10px] font-bold">✓</span>}
                  </div>
                  <span className="font-body text-xs text-foreground/40 leading-relaxed">
                    J'ai lu et j'accepte les{' '}
                    <Link to="/cgv" target="_blank" className="text-primary hover:underline">conditions générales de vente</Link>
                    {' '}ainsi que la{' '}
                    <Link to="/confidentialite" target="_blank" className="text-primary hover:underline">politique de confidentialité</Link>.
                  </span>
                </label>

                {error && <p className="font-body text-xs text-destructive text-center">{error}</p>}

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-4 bg-primary text-primary-foreground font-body text-xs uppercase tracking-[0.3em] rounded hover:bg-primary/90 transition-all duration-300 btn-ripple flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Chargement…</> : 'Procéder au paiement'}
                </button>

                <p className="font-body text-xs text-muted-foreground text-center">
                  Paiement sécurisé par Stripe. Vos données sont chiffrées.
                </p>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
