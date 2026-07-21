import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Package, TrendingUp, Clock, CheckCircle, Truck, XCircle, ChevronDown, RefreshCw, AlertTriangle, Droplets, Save, Plus, X, Trash2, Upload, Loader2, BookOpen, Eye, EyeOff, Tag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, type ParfumDB } from '@/lib/supabase';

const FAMILLES = ['SACRÆ', 'VITÆA', 'UMBRÆ', 'NEROLÆ', 'ÆRA'];
const inputCls = 'w-full px-3 py-2 bg-white/5 border border-white/10 rounded font-body text-sm text-foreground focus:outline-none focus:border-white/25 transition-colors';
const labelCls = 'block font-body text-[10px] uppercase tracking-widest text-foreground/40 mb-1';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string;

type OrderStatus = 'pending' | 'paid' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: any }> = {
  pending:   { label: 'En attente',  color: '#EAB308', bg: 'rgba(234,179,8,0.12)',   icon: Clock },
  paid:      { label: 'Payée',       color: '#C4956A', bg: 'rgba(196,149,106,0.12)', icon: CheckCircle },
  confirmed: { label: 'Confirmée',   color: '#C4956A', bg: 'rgba(196,149,106,0.12)', icon: CheckCircle },
  shipped:   { label: 'Expédiée',    color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  icon: Truck },
  delivered: { label: 'Livrée',      color: '#22C55E', bg: 'rgba(34,197,94,0.12)',   icon: CheckCircle },
  cancelled: { label: 'Annulée',     color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   icon: XCircle },
};

const allStatuses: OrderStatus[] = ['pending', 'paid', 'confirmed', 'shipped', 'delivered', 'cancelled'];

type AdminTab = 'commandes' | 'parfums' | 'articles' | 'promos';

interface PromoCodeDB {
  id: string;
  code: string;
  percentage: number;
  valid_from: string;
  valid_until: string | null;
  active: boolean;
  max_uses: number | null;
  used_count: number;
  created_at: string;
}

interface ArticleDB {
  id: string;
  titre: string;
  slug: string;
  extrait: string | null;
  contenu: string | null;
  image_url: string | null;
  categorie: string;
  publie: boolean;
  created_at: string;
  published_at: string | null;
}

const ARTICLE_CATEGORIES = ['actualité', 'collection', 'événement', 'collaboration', 'conseil'];

const emptyArticle = (): Partial<ArticleDB> => ({
  titre: '', slug: '', extrait: null, contenu: null,
  image_url: null, categorie: 'actualité', publie: false, published_at: null,
});

const statutParfumConfig: Record<string, { label: string; color: string }> = {
  disponible:    { label: 'Disponible',    color: '#22C55E' },
  prochainement: { label: 'Prochainement', color: '#EAB308' },
  epuise:        { label: 'Épuisé',        color: '#EF4444' },
};

const AdminPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('commandes');

  // Commandes
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [rlsError, setRlsError] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [shippingModal, setShippingModal] = useState<{ orderId: string; email: string } | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  // Parfums
  const [parfums, setParfums] = useState<ParfumDB[]>([]);
  const [fetchingParfums, setFetchingParfums] = useState(false);
  const [savingParfum, setSavingParfum] = useState<string | null>(null);
  const [parfumEdits, setParfumEdits] = useState<Record<string, { statut: string; stock: number }>>({});
  const [editingParfum, setEditingParfum] = useState<Partial<ParfumDB> | null>(null);
  const [isNewParfum, setIsNewParfum] = useState(false);
  const [savingForm, setSavingForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingExtraImage, setUploadingExtraImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraImgRef = useRef<HTMLInputElement>(null);
  const articleImgRef = useRef<HTMLInputElement>(null);

  // Articles
  const [articles, setArticles] = useState<ArticleDB[]>([]);
  const [fetchingArticles, setFetchingArticles] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<ArticleDB> | null>(null);
  const [isNewArticle, setIsNewArticle] = useState(false);
  const [savingArticle, setSavingArticle] = useState(false);
  const [uploadingArticleImg, setUploadingArticleImg] = useState(false);
  const [uploadArticleError, setUploadArticleError] = useState<string | null>(null);

  // Codes promo
  const [promoCodes, setPromoCodes] = useState<PromoCodeDB[]>([]);
  const [fetchingPromos, setFetchingPromos] = useState(false);
  const [savingPromo, setSavingPromo] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoRlsError, setPromoRlsError] = useState<string | null>(null);
  const [newPromo, setNewPromo] = useState({ code: '', percentage: 10, valid_from: '', valid_until: '', max_uses: '' });

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/login'); return; }
    if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) { navigate('/'); return; }
    fetchOrders();
  }, [user, loading]);

  useEffect(() => {
    if (activeTab === 'parfums' && parfums.length === 0) fetchParfums();
    if (activeTab === 'articles' && articles.length === 0) fetchArticles();
    if (activeTab === 'promos' && promoCodes.length === 0) fetchPromoCodes();
  }, [activeTab]);

  const fetchPromoCodes = async () => {
    setFetchingPromos(true);
    setPromoRlsError(null);
    const { data, error } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    if (error) {
      setPromoRlsError(error.message);
    } else if (data) {
      setPromoCodes(data as PromoCodeDB[]);
    }
    setFetchingPromos(false);
  };

  const createPromoCode = async () => {
    if (!newPromo.code.trim() || newPromo.percentage <= 0 || newPromo.percentage > 100) return;
    setSavingPromo(true);
    setPromoError(null);
    const { error } = await supabase.from('promo_codes').insert({
      code: newPromo.code.trim().toUpperCase(),
      percentage: newPromo.percentage,
      valid_from: newPromo.valid_from ? new Date(newPromo.valid_from).toISOString() : new Date().toISOString(),
      valid_until: newPromo.valid_until ? new Date(newPromo.valid_until).toISOString() : null,
      max_uses: newPromo.max_uses ? parseInt(newPromo.max_uses, 10) : null,
    });
    if (error) {
      setPromoError(error.message);
    } else {
      setNewPromo({ code: '', percentage: 10, valid_from: '', valid_until: '', max_uses: '' });
      fetchPromoCodes();
    }
    setSavingPromo(false);
  };

  const togglePromoActive = async (id: string, active: boolean) => {
    setPromoCodes(prev => prev.map(p => p.id === id ? { ...p, active } : p));
    const { error } = await supabase.from('promo_codes').update({ active }).eq('id', id);
    if (error) fetchPromoCodes();
  };

  const deletePromoCode = async (id: string) => {
    setPromoCodes(prev => prev.filter(p => p.id !== id));
    await supabase.from('promo_codes').delete().eq('id', id);
  };

  const fetchOrders = async () => {
    setFetching(true);
    setRlsError(false);
    const { data, error } = await supabase
      .from('commandes')
      .select('*, commande_items(*)')
      .order('created_at', { ascending: false });
    if (error) {
      setRlsError(true);
    } else {
      setOrders(data ?? []);
    }
    setFetching(false);
  };

  const updateStatus = async (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setUpdatingStatus(orderId);
    setUpdateError(null);
    const updates: any = { statut: status };
    if (trackingNumber) updates.numero_suivi = trackingNumber;
    const { error } = await supabase.from('commandes').update(updates).eq('id', orderId);
    if (error) {
      setUpdateError(`Erreur : ${error.message} — vérifiez la politique RLS dans Supabase.`);
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, statut: status, numero_suivi: trackingNumber ?? o.numero_suivi } : o));
      if (status === 'shipped' && trackingNumber) {
        const order = orders.find(o => o.id === orderId);
        if (order?.email) {
          supabase.functions.invoke('send-shipping-email', {
            body: { userEmail: order.email, orderId, trackingNumber, items: order.commande_items },
          });
        }
      }
    }
    setUpdatingStatus(null);
  };

  const handleStatusChange = (orderId: string, email: string, newStatus: OrderStatus) => {
    if (newStatus === 'shipped') {
      setShippingModal({ orderId, email });
      setTrackingInput('');
    } else {
      updateStatus(orderId, newStatus);
    }
  };

  const confirmShipping = async () => {
    if (!shippingModal) return;
    await updateStatus(shippingModal.orderId, 'shipped', trackingInput.trim() || undefined);
    setShippingModal(null);
  };

  const fetchParfums = async () => {
    setFetchingParfums(true);
    const { data } = await supabase.from('parfums').select('*').order('famille').order('nom');
    if (data) {
      setParfums(data as ParfumDB[]);
      const edits: Record<string, { statut: string; stock: number }> = {};
      data.forEach((p: any) => {
        edits[p.nom] = { statut: (p.statut ?? 'disponible').trim().toLowerCase(), stock: p.stock ?? 0 };
      });
      setParfumEdits(edits);
    }
    setFetchingParfums(false);
  };

  const saveParfum = async (nom: string) => {
    setSavingParfum(nom);
    const edit = parfumEdits[nom];
    await supabase.from('parfums').update({ statut: edit.statut, stock: edit.stock }).eq('nom', nom);
    setSavingParfum(null);
  };

  const openNew = () => {
    setIsNewParfum(true);
    setEditingParfum({ famille: 'SACRÆ', type: 'creation', statut: 'disponible', stock: 0, flagship: false });
  };

  const saveParfumFull = async () => {
    if (!editingParfum) return;
    setSavingForm(true);
    if (isNewParfum) {
      const { data } = await supabase.from('parfums').insert(editingParfum).select().single();
      if (data) setParfums(prev => [...prev, data as ParfumDB]);
    } else {
      await supabase.from('parfums').update(editingParfum).eq('id', (editingParfum as ParfumDB).id);
      setParfums(prev => prev.map(p => p.id === (editingParfum as ParfumDB).id ? { ...p, ...editingParfum } as ParfumDB : p));
    }
    setSavingForm(false);
    setEditingParfum(null);
    setIsNewParfum(false);
  };

  const deleteParfum = async () => {
    if (!editingParfum || isNewParfum) return;
    if (!confirm(`Supprimer "${(editingParfum as ParfumDB).nom}" ?`)) return;
    await supabase.from('parfums').delete().eq('id', (editingParfum as ParfumDB).id);
    setParfums(prev => prev.filter(p => p.id !== (editingParfum as ParfumDB).id));
    setEditingParfum(null);
  };

  const setField = (key: keyof ParfumDB, val: any) =>
    setEditingParfum(prev => prev ? { ...prev, [key]: val } : prev);

  const uploadImage = async (file: File) => {
    setUploadingImage(true);
    setUploadError(null);
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('parfums').upload(path, file, { upsert: true });
    if (error) {
      setUploadError(`Erreur upload : ${error.message}`);
    } else {
      const { data } = supabase.storage.from('parfums').getPublicUrl(path);
      setField('image_url', data.publicUrl);
    }
    setUploadingImage(false);
  };

  const uploadExtraImage = async (file: File) => {
    setUploadingExtraImage(true);
    setUploadError(null);
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('parfums').upload(path, file, { upsert: true });
    if (error) {
      setUploadError(`Erreur upload : ${error.message}`);
    } else {
      const { data } = supabase.storage.from('parfums').getPublicUrl(path);
      const current = editingParfum?.images ?? [];
      setField('images', [...current, data.publicUrl]);
    }
    setUploadingExtraImage(false);
  };

  const removeExtraImage = (index: number) => {
    const current = editingParfum?.images ?? [];
    setField('images', current.filter((_, i) => i !== index));
  };

  const fetchArticles = async () => {
    setFetchingArticles(true);
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (data) setArticles(data as ArticleDB[]);
    setFetchingArticles(false);
  };

  const setArticleField = (key: keyof ArticleDB, val: any) =>
    setEditingArticle(prev => prev ? { ...prev, [key]: val } : prev);

  const slugify = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const saveArticle = async () => {
    if (!editingArticle) return;
    setSavingArticle(true);
    const payload = { ...editingArticle };
    if (payload.publie && !payload.published_at) payload.published_at = new Date().toISOString();
    if (isNewArticle) {
      const { data } = await supabase.from('articles').insert(payload).select().single();
      if (data) setArticles(prev => [data as ArticleDB, ...prev]);
    } else {
      await supabase.from('articles').update(payload).eq('id', (editingArticle as ArticleDB).id);
      setArticles(prev => prev.map(a => a.id === (editingArticle as ArticleDB).id ? { ...a, ...payload } as ArticleDB : a));
    }
    setSavingArticle(false);
    setEditingArticle(null);
    setIsNewArticle(false);
  };

  const deleteArticle = async () => {
    if (!editingArticle || isNewArticle) return;
    if (!confirm(`Supprimer "${editingArticle.titre}" ?`)) return;
    await supabase.from('articles').delete().eq('id', (editingArticle as ArticleDB).id);
    setArticles(prev => prev.filter(a => a.id !== (editingArticle as ArticleDB).id));
    setEditingArticle(null);
  };

  const uploadArticleImage = async (file: File) => {
    setUploadingArticleImg(true);
    setUploadArticleError(null);
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `art-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('parfums').upload(path, file, { upsert: true });
    if (error) {
      setUploadArticleError(`Erreur : ${error.message}`);
    } else {
      const { data } = supabase.storage.from('parfums').getPublicUrl(path);
      setArticleField('image_url', data.publicUrl);
    }
    setUploadingArticleImg(false);
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => (o.statut ?? 'pending') === filter);
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  const pendingCount = orders.filter(o => !o.statut || o.statut === 'pending').length;
  const shippedCount = orders.filter(o => o.statut === 'shipped').length;

  if (loading || fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-display italic text-foreground/40">Chargement...</p>
    </div>
  );

  return (
    <>
    <Helmet>
      <title>Administration, THÆM ÆTERNUM</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(196,149,106,0.05) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-2">Administration</p>
            <h1 className="font-display text-3xl lg:text-4xl italic font-light">Tableau de bord</h1>
          </div>
          <button
            onClick={() => {
              if (activeTab === 'commandes') fetchOrders();
              else if (activeTab === 'parfums') fetchParfums();
              else if (activeTab === 'articles') fetchArticles();
              else if (activeTab === 'promos') fetchPromoCodes();
            }}
            className="flex items-center gap-2 px-4 py-2 font-body text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors border border-white/8 rounded"
          >
            <RefreshCw className="w-3 h-3" /> Actualiser
          </button>
        </motion.div>

        {/* Onglets */}
        <div className="flex gap-2 mb-8 border-b border-white/8 pb-0">
          {([
            { id: 'commandes', label: 'Commandes', icon: Package },
            { id: 'parfums',   label: 'Parfums',   icon: Droplets },
            { id: 'articles',  label: 'Sillages',  icon: BookOpen },
            { id: 'promos',    label: 'Codes promo', icon: Tag },
          ] as { id: AdminTab; label: string; icon: any }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-5 py-3 font-body text-xs uppercase tracking-widest transition-all duration-200 border-b-2 -mb-px"
              style={{
                borderColor: activeTab === id ? '#C4956A' : 'transparent',
                color: activeTab === id ? '#C4956A' : 'var(--c-w40)',
              }}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* Banner RLS si besoin */}
        {rlsError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-5 rounded border border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-500/70 mt-0.5" />
              <div>
                <p className="font-body text-sm text-yellow-500/80 mb-2">Politique de sécurité Supabase à configurer</p>
                <p className="font-body text-xs text-foreground/40 mb-3">Exécutez ce SQL dans votre dashboard Supabase → SQL Editor :</p>
                <pre className="font-mono text-xs text-foreground/60 bg-white/5 rounded p-3 overflow-x-auto">
{`CREATE POLICY "Admin full access" ON commandes
FOR ALL USING (auth.email() = '${user?.email}');`}
                </pre>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'parfums' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-end mb-6">
              <button
                onClick={openNew}
                className="flex items-center gap-2 px-4 py-2.5 font-body text-xs uppercase tracking-widest rounded transition-all duration-200"
                style={{ background: 'rgba(196,149,106,0.12)', border: '1px solid rgba(196,149,106,0.3)', color: '#C4956A' }}
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter un parfum
              </button>
            </div>

            {fetchingParfums ? (
              <p className="font-body text-sm text-foreground/40 text-center py-10">Chargement...</p>
            ) : (
              Object.entries(
                parfums.reduce((acc: any, p) => {
                  const f = p.famille ?? 'Autres';
                  if (!acc[f]) acc[f] = [];
                  acc[f].push(p);
                  return acc;
                }, {})
              ).map(([famille, items]: [string, any]) => (
                <div key={famille} className="mb-8">
                  <p className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground/30 mb-3">{famille}</p>
                  <div className="space-y-2">
                    {items.map((p: ParfumDB) => {
                      const edit = parfumEdits[p.nom] ?? { statut: (p.statut ?? 'disponible').trim().toLowerCase(), stock: p.stock ?? 0 };
                      const cfg = statutParfumConfig[edit.statut] ?? statutParfumConfig.disponible;
                      return (
                        <div key={p.nom} className="flex items-center gap-4 p-4 border border-white/8 rounded-lg hover:border-white/15 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="font-display italic text-foreground/80">{p.nom}</p>
                            <p className="font-body text-[10px] text-foreground/30 mt-0.5">{p.texte_court ?? ''}</p>
                          </div>
                          <select
                            value={edit.statut}
                            onChange={e => setParfumEdits(prev => ({ ...prev, [p.nom]: { ...edit, statut: e.target.value } }))}
                            className="px-3 py-1.5 font-body text-[10px] uppercase tracking-widest rounded border border-white/10 bg-white/5 focus:outline-none cursor-pointer"
                            style={{ color: cfg.color }}
                          >
                            {Object.entries(statutParfumConfig).map(([val, c]) => (
                              <option key={val} value={val}>{c.label}</option>
                            ))}
                          </select>
                          <div className="flex items-center gap-2">
                            <span className="font-body text-xs text-foreground/40">Stock</span>
                            <input
                              type="number" min={0} value={edit.stock}
                              onChange={e => setParfumEdits(prev => ({ ...prev, [p.nom]: { ...edit, stock: parseInt(e.target.value) || 0 } }))}
                              className="w-16 px-2 py-1.5 bg-white/5 border border-white/10 rounded font-body text-sm text-center text-foreground focus:outline-none focus:border-white/25"
                            />
                          </div>
                          <button
                            onClick={() => saveParfum(p.nom)}
                            disabled={savingParfum === p.nom}
                            className="flex items-center gap-1.5 px-3 py-1.5 font-body text-[10px] uppercase tracking-widest rounded transition-all duration-200 disabled:opacity-50"
                            style={{ background: 'rgba(196,149,106,0.1)', border: '1px solid rgba(196,149,106,0.25)', color: '#C4956A' }}
                          >
                            <Save className="w-3 h-3" /> {savingParfum === p.nom ? '...' : 'Sauver'}
                          </button>
                          <button
                            onClick={() => { setIsNewParfum(false); setEditingParfum({ ...p }); }}
                            className="px-3 py-1.5 font-body text-[10px] uppercase tracking-widest rounded border border-white/10 text-foreground/40 hover:text-foreground hover:border-white/25 transition-all"
                          >
                            Modifier tout
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'articles' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => { setIsNewArticle(true); setEditingArticle(emptyArticle()); }}
                className="flex items-center gap-2 px-4 py-2.5 font-body text-xs uppercase tracking-widest rounded transition-all duration-200"
                style={{ background: 'rgba(196,149,106,0.12)', border: '1px solid rgba(196,149,106,0.3)', color: '#C4956A' }}
              >
                <Plus className="w-3.5 h-3.5" /> Nouvel article
              </button>
            </div>

            {fetchingArticles ? (
              <p className="font-body text-sm text-foreground/40 text-center py-10">Chargement...</p>
            ) : articles.length === 0 ? (
              <div className="text-center py-16 border border-white/8 rounded-lg">
                <BookOpen className="w-8 h-8 mx-auto mb-4 text-foreground/20" />
                <p className="font-body text-sm text-foreground/40">Aucun article. Créez le premier sillage.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {articles.map(a => (
                  <div key={a.id} className="flex items-center gap-4 p-4 border border-white/8 rounded-lg hover:border-white/15 transition-colors">
                    {a.image_url && (
                      <div className="w-14 h-14 rounded overflow-hidden shrink-0 border border-white/8">
                        <img src={a.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-display italic text-foreground/80">{a.titre}</p>
                      <p className="font-body text-[10px] text-foreground/30 mt-0.5 uppercase tracking-widest">{a.categorie}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{ background: a.publie ? 'rgba(34,197,94,0.1)' : 'var(--c-w05)' }}>
                      {a.publie ? <Eye className="w-3 h-3" style={{ color: '#22C55E' }} /> : <EyeOff className="w-3 h-3 text-foreground/30" />}
                      <span className="font-body text-[9px] uppercase tracking-widest" style={{ color: a.publie ? '#22C55E' : 'var(--c-w30)' }}>
                        {a.publie ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                    <button
                      onClick={() => { setIsNewArticle(false); setEditingArticle({ ...a }); }}
                      className="px-3 py-1.5 font-body text-[10px] uppercase tracking-widest rounded border border-white/10 text-foreground/40 hover:text-foreground hover:border-white/25 transition-all"
                    >
                      Modifier
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'promos' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {promoRlsError && (
              <div className="mb-8 p-5 rounded border border-yellow-500/20 bg-yellow-500/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-500/70 mt-0.5" />
                  <div>
                    <p className="font-body text-sm text-yellow-500/80 mb-2">Table "promo_codes" absente ou politique de sécurité manquante</p>
                    <p className="font-body text-xs text-foreground/40 mb-1">Erreur : {promoRlsError}</p>
                    <p className="font-body text-xs text-foreground/40 mb-3">Exécutez ce SQL dans votre dashboard Supabase → SQL Editor (voir le message fourni par Claude pour le script complet).</p>
                  </div>
                </div>
              </div>
            )}
            {/* Formulaire de création */}
            <div className="border border-white/8 rounded-lg p-5 mb-8">
              <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-4">Créer un code promo</p>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Code</label>
                  <input
                    type="text"
                    value={newPromo.code}
                    onChange={e => setNewPromo(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="AETERNUM10"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Réduction (%)</label>
                  <input
                    type="number" min={1} max={100}
                    value={newPromo.percentage}
                    onChange={e => setNewPromo(prev => ({ ...prev, percentage: parseInt(e.target.value, 10) || 0 }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Valide à partir du</label>
                  <input
                    type="date"
                    value={newPromo.valid_from}
                    onChange={e => setNewPromo(prev => ({ ...prev, valid_from: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Valide jusqu'au</label>
                  <input
                    type="date"
                    value={newPromo.valid_until}
                    onChange={e => setNewPromo(prev => ({ ...prev, valid_until: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Utilisations max (optionnel)</label>
                  <input
                    type="number" min={1}
                    value={newPromo.max_uses}
                    onChange={e => setNewPromo(prev => ({ ...prev, max_uses: e.target.value }))}
                    placeholder="Illimité"
                    className={inputCls}
                  />
                </div>
              </div>
              {promoError && <p className="font-body text-xs text-red-400 mb-3">{promoError}</p>}
              <button
                onClick={createPromoCode}
                disabled={savingPromo || !newPromo.code.trim()}
                className="flex items-center gap-2 px-4 py-2.5 font-body text-xs uppercase tracking-widest rounded transition-all duration-200 disabled:opacity-40"
                style={{ background: 'rgba(196,149,106,0.12)', border: '1px solid rgba(196,149,106,0.3)', color: '#C4956A' }}
              >
                <Plus className="w-3.5 h-3.5" /> {savingPromo ? 'Création...' : 'Créer le code'}
              </button>
            </div>

            {/* Liste des codes */}
            {fetchingPromos ? (
              <p className="font-body text-sm text-foreground/40 text-center py-10">Chargement...</p>
            ) : promoCodes.length === 0 ? (
              <p className="font-body text-sm text-foreground/40 text-center py-10">Aucun code promo créé pour le moment.</p>
            ) : (
              <div className="space-y-2">
                {promoCodes.map(promo => {
                  const expired = promo.valid_until && new Date(promo.valid_until) < new Date();
                  const exhausted = promo.max_uses !== null && promo.used_count >= promo.max_uses;
                  return (
                    <div key={promo.id} className="flex items-center gap-4 p-4 border border-white/8 rounded-lg hover:border-white/15 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-display italic text-foreground/80">{promo.code}</p>
                          <span className="font-body text-xs" style={{ color: '#C4956A' }}>-{promo.percentage}%</span>
                          {(expired || exhausted) && (
                            <span className="font-body text-[9px] uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>
                              {expired ? 'Expiré' : 'Épuisé'}
                            </span>
                          )}
                        </div>
                        <p className="font-body text-[10px] text-foreground/30 mt-0.5">
                          Du {new Date(promo.valid_from).toLocaleDateString('fr-FR')}
                          {promo.valid_until ? ` au ${new Date(promo.valid_until).toLocaleDateString('fr-FR')}` : ' — sans date de fin'}
                          {' · '}
                          {promo.used_count} utilisation{promo.used_count > 1 ? 's' : ''}{promo.max_uses ? ` / ${promo.max_uses}` : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => togglePromoActive(promo.id, !promo.active)}
                        className="px-3 py-1.5 font-body text-[10px] uppercase tracking-widest rounded border transition-all"
                        style={promo.active
                          ? { borderColor: 'rgba(34,197,94,0.3)', color: '#22C55E', background: 'rgba(34,197,94,0.08)' }
                          : { borderColor: 'rgba(255,255,255,0.1)', color: 'var(--c-w40)' }}
                      >
                        {promo.active ? 'Actif' : 'Inactif'}
                      </button>
                      <button
                        onClick={() => deletePromoCode(promo.id)}
                        className="p-2 rounded border border-white/10 text-foreground/30 hover:text-red-400 hover:border-red-500/30 transition-all"
                        aria-label="Supprimer le code"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'commandes' && <>
        {updateError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded border border-red-500/20 bg-red-500/5 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div>
              <p className="font-body text-sm text-red-400 mb-2">{updateError}</p>
              <p className="font-body text-xs text-foreground/40">Exécutez ce SQL dans Supabase → SQL Editor :</p>
              <pre className="font-mono text-xs text-foreground/60 bg-white/5 rounded p-3 mt-2 overflow-x-auto">{`CREATE POLICY "Admin update" ON commandes\nFOR UPDATE USING (auth.email() = '${user?.email}');`}</pre>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Commandes', value: orders.length, icon: Package, color: '#C4956A' },
            { label: 'Chiffre d\'affaires', value: `${totalRevenue.toFixed(2)}€`, icon: TrendingUp, color: '#22C55E' },
            { label: 'En attente', value: pendingCount, icon: Clock, color: '#EAB308' },
            { label: 'En transit', value: shippedCount, icon: Truck, color: '#3B82F6' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="border border-white/8 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-body text-xs uppercase tracking-widest text-foreground/40">{label}</p>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="font-display italic text-2xl" style={{ color }}>{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Filtres statut */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setFilter('all')}
            className="px-4 py-2 font-body text-xs uppercase tracking-widest rounded transition-all duration-200"
            style={{
              background: filter === 'all' ? 'rgba(196,149,106,0.15)' : 'transparent',
              border: `1px solid ${filter === 'all' ? 'rgba(196,149,106,0.4)' : 'var(--c-w08)'}`,
              color: filter === 'all' ? '#C4956A' : 'var(--c-w40)',
            }}
          >
            Toutes ({orders.length})
          </button>
          {allStatuses.map(s => {
            const count = orders.filter(o => (o.statut ?? 'pending') === s).length;
            const cfg = statusConfig[s];
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-4 py-2 font-body text-xs uppercase tracking-widest rounded transition-all duration-200"
                style={{
                  background: filter === s ? cfg.bg : 'transparent',
                  border: `1px solid ${filter === s ? cfg.color + '60' : 'var(--c-w08)'}`,
                  color: filter === s ? cfg.color : 'var(--c-w40)',
                }}
              >
                {cfg.label} ({count})
              </button>
            );
          })}
        </motion.div>

        {/* Liste commandes */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 border border-white/8 rounded-lg">
              <Package className="w-8 h-8 mx-auto mb-4 text-foreground/20" />
              <p className="font-body text-sm text-foreground/40">Aucune commande.</p>
            </div>
          ) : (
            filtered.map(cmd => {
              const status = (cmd.statut ?? 'pending') as OrderStatus;
              const cfg = statusConfig[status] ?? statusConfig.pending;
              const StatusIcon = cfg.icon;
              const isExpanded = expandedOrder === cmd.id;

              return (
                <div key={cmd.id} className="border border-white/8 rounded-lg overflow-hidden">
                  {/* Row */}
                  <div className="flex items-center gap-4 p-4">
                    {/* Expand btn */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : cmd.id)}
                      className="flex items-center gap-4 flex-1 text-left"
                    >
                      <ChevronDown
                        className="w-4 h-4 text-foreground/30 transition-transform duration-200 shrink-0"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs uppercase tracking-widest text-foreground/50">
                          #{String(cmd.id).slice(0, 8).toUpperCase()}
                        </p>
                        <p className="font-body text-xs text-foreground/50 mt-0.5">{cmd.email ?? ''}</p>
                        <p className="font-body text-xs text-foreground/30 mt-0.5">
                          {new Date(cmd.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className="font-display italic text-lg" style={{ color: '#C4956A' }}>{cmd.total}€</p>
                    </button>

                    {/* Status selector */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ background: cfg.bg }}>
                        <StatusIcon className="w-3 h-3" style={{ color: cfg.color }} />
                        <span className="font-body text-[10px] uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</span>
                      </div>
                      <select
                        value={status}
                        onChange={e => handleStatusChange(cmd.id, cmd.email ?? '', e.target.value as OrderStatus)}
                        disabled={updatingStatus === cmd.id}
                        className="px-3 py-1.5 font-body text-[10px] uppercase tracking-widest rounded border border-white/10 bg-white/5 text-foreground/60 focus:outline-none focus:border-white/20 cursor-pointer"
                      >
                        {allStatuses.map(s => (
                          <option key={s} value={s}>{statusConfig[s].label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Détail expandé */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/5 px-12 pb-5 pt-4 space-y-2">
                          {cmd.commande_items && cmd.commande_items.length > 0 ? (
                            cmd.commande_items.map((item: any, i: number) => (
                              <div key={item.id ?? i} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                                <div>
                                  <p className="font-display italic text-sm text-foreground/80">
                                    {item.parfum_nom ?? item.name ?? item.nom ?? 'Article'}
                                  </p>
                                  <p className="font-body text-xs text-foreground/40">
                                    {item.format ?? ''}{(item.quantite ?? item.quantity) ? ` × ${item.quantite ?? item.quantity}` : ''}
                                  </p>
                                </div>
                                <span className="font-body text-sm" style={{ color: '#C4956A' }}>
                                  {item.prix_unitaire ?? item.price ?? item.prix ?? '—'}€
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="font-body text-xs text-foreground/30">Détail non disponible.</p>
                          )}
                          {cmd.numero_suivi && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                              <Truck className="w-3 h-3 shrink-0" style={{ color: '#3B82F6' }} />
                              <p className="font-body text-xs text-foreground/50">Suivi :</p>
                              <p className="font-mono text-xs" style={{ color: '#3B82F6' }}>{cmd.numero_suivi}</p>
                            </div>
                          )}
                          <div className="flex justify-end pt-2">
                            <Link
                              to={`/invoice/${cmd.id}`}
                              className="font-body text-xs uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors"
                            >
                              Voir la facture →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </motion.div>

      </>}

      </div>

      {/* Panneau édition parfum */}
      <AnimatePresence>
        {editingParfum && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60" onClick={() => setEditingParfum(null)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-xl z-50 overflow-y-auto"
              style={{ background: 'hsl(var(--background))', borderLeft: '1px solid var(--c-w08)' }}
            >
              <div className="p-6 space-y-5">
                {/* Header panneau */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display italic text-2xl">{isNewParfum ? 'Nouveau parfum' : (editingParfum as ParfumDB).nom}</h2>
                  <button onClick={() => setEditingParfum(null)} className="text-foreground/40 hover:text-foreground transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nom */}
                <div><label className={labelCls}>Nom</label><input className={inputCls} value={editingParfum.nom ?? ''} onChange={e => setField('nom', e.target.value)} /></div>

                {/* Gamme + Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Gamme</label>
                    <select className={inputCls} value={editingParfum.famille ?? 'SACRÆ'} onChange={e => setField('famille', e.target.value)}>
                      {FAMILLES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Type</label>
                    <select className={inputCls} value={editingParfum.type ?? 'creation'} onChange={e => setField('type', e.target.value as any)}>
                      <option value="creation">Création</option>
                      <option value="inspiration">Inspiration</option>
                    </select>
                  </div>
                </div>

                {/* Marque + Inspiration (si type = inspiration) */}
                {editingParfum.type === 'inspiration' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Marque inspirée</label><input className={inputCls} value={editingParfum.marque ?? ''} onChange={e => setField('marque', e.target.value)} /></div>
                    <div><label className={labelCls}>Parfum inspiré</label><input className={inputCls} value={editingParfum.inspiration ?? ''} onChange={e => setField('inspiration', e.target.value)} /></div>
                  </div>
                )}

                {/* Statut + Stock + Note */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Statut</label>
                    <select className={inputCls} value={(editingParfum.statut ?? 'disponible').trim().toLowerCase()} onChange={e => setField('statut', e.target.value)}>
                      {Object.entries(statutParfumConfig).map(([val, c]) => <option key={val} value={val}>{c.label}</option>)}
                    </select>
                  </div>
                  <div><label className={labelCls}>Stock</label><input type="number" min={0} className={inputCls} value={editingParfum.stock ?? 0} onChange={e => setField('stock', parseInt(e.target.value) || 0)} /></div>
                  <div><label className={labelCls}>Note (/5)</label><input type="number" min={0} max={5} step={0.1} className={inputCls} value={editingParfum.note ?? ''} onChange={e => setField('note', parseFloat(e.target.value) || null)} /></div>
                </div>

                {/* Image principale */}
                <div>
                  <label className={labelCls}>Photo principale</label>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                  {editingParfum.image_url ? (
                    <div className="space-y-2">
                      <div className="relative rounded overflow-hidden border border-white/10" style={{ height: 160 }}>
                        <img src={editingParfum.image_url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setField('image_url', null)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded border border-white/8 text-foreground/30 hover:text-foreground/50 transition-all text-xs font-body disabled:opacity-50"
                      >
                        {uploadingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        Changer la photo
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded border border-dashed border-white/15 text-foreground/30 hover:text-foreground/50 hover:border-white/25 transition-all disabled:opacity-50"
                    >
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span className="font-body text-xs">{uploadingImage ? 'Envoi en cours...' : 'Choisir une photo depuis ton PC'}</span>
                    </button>
                  )}
                  {uploadError && <p className="font-body text-xs text-red-400 mt-1">{uploadError}</p>}
                  <div className="mt-2">
                    <p className="font-body text-[10px] text-foreground/30 mb-1">Ou colle une URL directement :</p>
                    <input
                      className={inputCls}
                      placeholder="https://www.thaem-aeternum.com/almae.jpg"
                      value={editingParfum.image_url ?? ''}
                      onChange={e => setField('image_url', e.target.value || null)}
                    />
                  </div>
                </div>

                {/* Photos supplémentaires */}
                <div>
                  <label className={labelCls}>Photos supplémentaires (galerie)</label>
                  <input ref={extraImgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadExtraImage(e.target.files[0])} />
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {(editingParfum.images ?? []).map((url, i) => (
                      <div key={i} className="relative rounded overflow-hidden border border-white/10" style={{ height: 90 }}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeExtraImage(i)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {(editingParfum.images ?? []).length < 5 && (
                      <button
                        onClick={() => extraImgRef.current?.click()}
                        disabled={uploadingExtraImage}
                        className="flex flex-col items-center justify-center gap-1 rounded border border-dashed border-white/15 text-foreground/30 hover:text-foreground/50 hover:border-white/25 transition-all disabled:opacity-50"
                        style={{ height: 90 }}
                      >
                        {uploadingExtraImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        <span className="font-body text-[10px]">{uploadingExtraImage ? 'Envoi...' : 'Ajouter'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Promo */}
                <div className="p-4 rounded border border-white/8 space-y-4" style={{ background: 'rgba(196,149,106,0.04)' }}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setField('en_promo', !editingParfum.en_promo)}
                      className="w-4 h-4 rounded border flex items-center justify-center transition-all"
                      style={{ background: editingParfum.en_promo ? '#C4956A' : 'transparent', borderColor: editingParfum.en_promo ? '#C4956A' : 'var(--c-w20)' }}
                    >
                      {editingParfum.en_promo && <span className="text-black text-[10px] font-bold">✓</span>}
                    </div>
                    <span className="font-body text-xs text-foreground/50">Mettre en promotion (Les Offres Æ)</span>
                  </label>
                  {editingParfum.en_promo && (
                    <div><label className={labelCls}>Prix promo 50ml (€)</label><input type="number" min={0} step={0.01} className={inputCls} value={editingParfum.prix_promo ?? ''} onChange={e => setField('prix_promo', parseFloat(e.target.value) || null)} placeholder="ex: 34.99" /></div>
                  )}
                </div>

                {/* Flagship */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setField('flagship', !editingParfum.flagship)}
                    className="w-4 h-4 rounded border flex items-center justify-center transition-all"
                    style={{ background: editingParfum.flagship ? '#C4956A' : 'transparent', borderColor: editingParfum.flagship ? '#C4956A' : 'var(--c-w20)' }}
                  >
                    {editingParfum.flagship && <span className="text-black text-[10px] font-bold">✓</span>}
                  </div>
                  <span className="font-body text-xs text-foreground/50">Best seller (affiché sur la page d'accueil)</span>
                </label>

                {/* Phrase signature */}
                <div><label className={labelCls}>Phrase signature</label><input className={inputCls} value={editingParfum.phrase_signature ?? ''} onChange={e => setField('phrase_signature', e.target.value)} /></div>

                {/* Texte court */}
                <div><label className={labelCls}>Texte court (tagline)</label><textarea rows={2} className={inputCls + ' resize-none'} value={editingParfum.texte_court ?? ''} onChange={e => setField('texte_court', e.target.value)} /></div>

                {/* Texte long */}
                <div><label className={labelCls}>Texte long (description)</label><textarea rows={5} className={inputCls + ' resize-none'} value={editingParfum.texte_long ?? ''} onChange={e => setField('texte_long', e.target.value)} /></div>

                {/* Notes olfactives */}
                <div>
                  <label className={labelCls}>Notes de tête (séparées par virgule)</label>
                  <input className={inputCls} value={editingParfum.notes_tete ?? ''} onChange={e => setField('notes_tete', e.target.value)} placeholder="Bergamote, Citron*1.5, Poivre..." />
                </div>
                <div>
                  <label className={labelCls}>Notes de cœur (séparées par virgule)</label>
                  <input className={inputCls} value={editingParfum.notes_coeur ?? ''} onChange={e => setField('notes_coeur', e.target.value)} placeholder="Rose, Jasmin*2, Iris..." />
                </div>
                <div>
                  <label className={labelCls}>Notes de fond (séparées par virgule)</label>
                  <input className={inputCls} value={editingParfum.notes_fond ?? ''} onChange={e => setField('notes_fond', e.target.value)} placeholder="Santal, Musc, Ambre*1.5..." />
                  <p className="font-body text-[10px] text-foreground/30 mt-1">
                    Astuce : ajoutez "*1.5" ou "*2" après une note (ex. "Vanille*2") pour l'afficher plus grande dans la pyramide, selon son importance.
                  </p>
                </div>
                <div>
                  <label className={labelCls}>Notes olfactives (séparées par virgule, optionnel)</label>
                  <input className={inputCls} value={editingParfum.notes_olfactives ?? ''} onChange={e => setField('notes_olfactives', e.target.value)} placeholder="Cuir, Fumée*1.5, Épices..." />
                  <p className="font-body text-[10px] text-foreground/30 mt-1">
                    4ème section affichée sous la pyramide, pour des notes au même niveau (sans hiérarchie tête/cœur/fond).
                  </p>
                </div>

                <div>
                  <label className={labelCls}>3 notes clés (séparées par virgule)</label>
                  <input className={inputCls} value={editingParfum.notes_teaser ?? ''} onChange={e => setField('notes_teaser', e.target.value)} placeholder="Oud, Vanille, Cuir..." />
                  <p className="font-body text-[10px] text-foreground/30 mt-1">
                    Affichées sur la carte du parfum quand le statut est "Prochainement", pour donner un avant-goût.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/8">
                  {!isNewParfum && (
                    <button onClick={deleteParfum} className="flex items-center gap-2 px-4 py-3 font-body text-xs uppercase tracking-widest rounded border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  )}
                  <button
                    onClick={saveParfumFull}
                    disabled={savingForm}
                    className="flex-1 flex items-center justify-center gap-2 py-3 font-body text-xs uppercase tracking-widest rounded transition-all duration-200 disabled:opacity-50"
                    style={{ background: 'rgba(196,149,106,0.15)', border: '1px solid rgba(196,149,106,0.4)', color: '#C4956A' }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {savingForm ? 'Sauvegarde...' : isNewParfum ? 'Créer le parfum' : 'Sauvegarder'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Panneau édition article */}
      <AnimatePresence>
        {editingArticle && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60" onClick={() => setEditingArticle(null)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-xl z-50 overflow-y-auto"
              style={{ background: 'hsl(var(--background))', borderLeft: '1px solid var(--c-w08)' }}
            >
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display italic text-2xl">{isNewArticle ? 'Nouvel article' : editingArticle.titre}</h2>
                  <button onClick={() => setEditingArticle(null)} className="text-foreground/40 hover:text-foreground transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Titre */}
                <div>
                  <label className={labelCls}>Titre</label>
                  <input className={inputCls} value={editingArticle.titre ?? ''} onChange={e => {
                    const titre = e.target.value;
                    setArticleField('titre', titre);
                    if (isNewArticle) setArticleField('slug', slugify(titre));
                  }} />
                </div>

                {/* Slug */}
                <div>
                  <label className={labelCls}>Slug (URL)</label>
                  <input className={inputCls} value={editingArticle.slug ?? ''} onChange={e => setArticleField('slug', e.target.value)} placeholder="mon-premier-article" />
                </div>

                {/* Catégorie */}
                <div>
                  <label className={labelCls}>Catégorie</label>
                  <select className={inputCls} value={editingArticle.categorie ?? 'actualité'} onChange={e => setArticleField('categorie', e.target.value)}>
                    {ARTICLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Image */}
                <div>
                  <label className={labelCls}>Image de couverture</label>
                  <input ref={articleImgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadArticleImage(e.target.files[0])} />
                  {editingArticle.image_url ? (
                    <div className="space-y-2">
                      <div className="relative rounded overflow-hidden border border-white/10" style={{ height: 140 }}>
                        <img src={editingArticle.image_url} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => setArticleField('image_url', null)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button onClick={() => articleImgRef.current?.click()} disabled={uploadingArticleImg} className="w-full flex items-center justify-center gap-2 py-2 rounded border border-white/8 text-foreground/30 hover:text-foreground/50 transition-all text-xs font-body disabled:opacity-50">
                        {uploadingArticleImg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />} Changer
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => articleImgRef.current?.click()} disabled={uploadingArticleImg} className="w-full flex items-center justify-center gap-2 py-4 rounded border border-dashed border-white/15 text-foreground/30 hover:text-foreground/50 hover:border-white/25 transition-all disabled:opacity-50">
                      {uploadingArticleImg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span className="font-body text-xs">{uploadingArticleImg ? 'Envoi...' : 'Choisir une image'}</span>
                    </button>
                  )}
                  {uploadArticleError && (
                    <p className="font-body text-xs text-red-400 mt-2">{uploadArticleError}</p>
                  )}
                  <div className="mt-2">
                    <p className="font-body text-[10px] text-foreground/30 mb-1">Ou colle une URL :</p>
                    <input className={inputCls} placeholder="https://..." value={editingArticle.image_url ?? ''} onChange={e => setArticleField('image_url', e.target.value || null)} />
                  </div>
                </div>

                {/* Extrait */}
                <div>
                  <label className={labelCls}>Extrait (accroche)</label>
                  <textarea rows={2} className={inputCls + ' resize-none'} value={editingArticle.extrait ?? ''} onChange={e => setArticleField('extrait', e.target.value || null)} placeholder="Une phrase qui donne envie de lire..." />
                </div>

                {/* Contenu */}
                <div>
                  <label className={labelCls}>Contenu (double saut de ligne = nouveau paragraphe)</label>
                  <textarea rows={12} className={inputCls + ' resize-none'} value={editingArticle.contenu ?? ''} onChange={e => setArticleField('contenu', e.target.value || null)} placeholder="Votre texte ici..." />
                </div>

                {/* Publier */}
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded border border-white/8" style={{ background: 'rgba(34,197,94,0.03)' }}>
                  <div
                    onClick={() => setArticleField('publie', !editingArticle.publie)}
                    className="w-4 h-4 rounded border flex items-center justify-center transition-all"
                    style={{ background: editingArticle.publie ? '#22C55E' : 'transparent', borderColor: editingArticle.publie ? '#22C55E' : 'var(--c-w20)' }}
                  >
                    {editingArticle.publie && <span className="text-black text-[10px] font-bold">✓</span>}
                  </div>
                  <div>
                    <span className="font-body text-xs text-foreground/50">Publier l'article</span>
                    <p className="font-body text-[10px] text-foreground/25 mt-0.5">La date de publication sera définie automatiquement</p>
                  </div>
                </label>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/8">
                  {!isNewArticle && (
                    <button onClick={deleteArticle} className="flex items-center gap-2 px-4 py-3 font-body text-xs uppercase tracking-widest rounded border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  )}
                  <button
                    onClick={saveArticle}
                    disabled={savingArticle}
                    className="flex-1 flex items-center justify-center gap-2 py-3 font-body text-xs uppercase tracking-widest rounded transition-all duration-200 disabled:opacity-50"
                    style={{ background: 'rgba(196,149,106,0.15)', border: '1px solid rgba(196,149,106,0.4)', color: '#C4956A' }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {savingArticle ? 'Sauvegarde...' : isNewArticle ? 'Créer l\'article' : 'Sauvegarder'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modale numéro de suivi */}
      <AnimatePresence>
        {shippingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setShippingModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-lg border border-white/10 p-6 space-y-5"
              style={{ background: 'hsl(var(--background))' }}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5" style={{ color: '#3B82F6' }} />
                <h3 className="font-display italic text-xl">Marquer comme expédiée</h3>
              </div>
              <p className="font-body text-xs text-foreground/40">
                Entrez le numéro de suivi — un email sera envoyé automatiquement au client.
              </p>
              <div>
                <label className="block font-body text-xs uppercase tracking-widest text-foreground/40 mb-1.5">
                  Numéro de suivi
                </label>
                <input
                  autoFocus
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded font-mono text-sm text-foreground focus:outline-none focus:border-white/25 transition-colors"
                  placeholder="ex: 6A12345678901"
                  value={trackingInput}
                  onChange={e => setTrackingInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && confirmShipping()}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShippingModal(null)}
                  className="flex-1 py-3 font-body text-xs uppercase tracking-widest rounded border border-white/10 text-foreground/40 hover:text-foreground transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmShipping}
                  disabled={updatingStatus === shippingModal.orderId}
                  className="flex-1 py-3 font-body text-xs uppercase tracking-widest rounded transition-all duration-200 disabled:opacity-50"
                  style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.4)', color: '#3B82F6' }}
                >
                  {updatingStatus === shippingModal.orderId ? 'Envoi...' : 'Confirmer l\'expédition'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
    </>
  );
};

export default AdminPage;
