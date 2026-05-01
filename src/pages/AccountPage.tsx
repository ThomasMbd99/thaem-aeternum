import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, Heart, LogOut, Save, ChevronRight, Trash2, ChevronDown, KeyRound, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type Tab = 'profil' | 'commandes' | 'favoris';

const inputClass =
  'w-full px-4 py-3 bg-white/5 border border-white/10 rounded font-body text-sm text-foreground focus:outline-none focus:border-white/25 transition-colors';
const labelClass = 'block font-body text-xs uppercase tracking-widest text-foreground/40 mb-1.5';

const AccountPage = () => {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profil');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [commandes, setCommandes] = useState<any[]>([]);
  const [favoris, setFavoris] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Password change
  const [passwordForm, setPasswordForm] = useState({ nouveau: '', confirm: '' });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'France',
  });

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading]);

  useEffect(() => {
    if (profile) {
      setForm({
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

  useEffect(() => {
    if (user && tab === 'commandes') fetchCommandes();
    if (user && tab === 'favoris') fetchFavoris();
  }, [tab, user]);

  const fetchCommandes = async () => {
    setFetchError(null);
    const { data, error } = await supabase
      .from('commandes')
      .select('*, commande_items(*)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    if (error) {
      setFetchError('Impossible de charger vos commandes.');
    } else if (data) {
      setCommandes(data);
    }
  };

  const fetchFavoris = async () => {
    setFetchError(null);
    const { data, error } = await supabase
      .from('favoris')
      .select('*, parfums(*)')
      .eq('user_id', user!.id);
    if (error) {
      setFetchError('Impossible de charger vos favoris.');
    } else if (data) {
      setFavoris(data);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update(form).eq('id', user!.id);
    if (!error) {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);
    if (passwordForm.nouveau !== passwordForm.confirm) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (passwordForm.nouveau.length < 6) {
      setPasswordError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    setPasswordSaving(true);
    const { error } = await supabase.auth.updateUser({ password: passwordForm.nouveau });
    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSaved(true);
      setPasswordForm({ nouveau: '', confirm: '' });
      setTimeout(() => setPasswordSaved(false), 3000);
    }
    setPasswordSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    await supabase.from('favoris').delete().eq('user_id', user!.id);
    await supabase.from('profiles').delete().eq('id', user!.id);
    await signOut();
    navigate('/');
  };

  const tabs = [
    { id: 'profil' as Tab, label: 'Profil', icon: User },
    { id: 'commandes' as Tab, label: 'Commandes', icon: Package },
    { id: 'favoris' as Tab, label: 'Favoris', icon: Heart },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-display italic text-foreground/40">Chargement...</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(196,149,106,0.05) 0%, transparent 70%)' }}
      />

      <div className="container mx-auto px-4 lg:px-8 max-w-5xl relative z-10">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-2">Espace client</p>
          <h1 className="font-display text-3xl lg:text-4xl italic font-light text-foreground">
            {profile?.prenom ? `Bonjour, ${profile.prenom}.` : 'Mon compte.'}
          </h1>
          <p className="font-body text-sm text-foreground/40 mt-1">{user?.email}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-white/8 rounded-lg overflow-hidden">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="w-full flex items-center justify-between px-5 py-4 font-body text-xs uppercase tracking-widest transition-all duration-300 border-b border-white/5 last:border-0"
                  style={{
                    background: tab === id ? 'rgba(196,149,106,0.08)' : 'transparent',
                    color: tab === id ? '#C4956A' : 'rgba(255,255,255,0.45)',
                  }}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                  {tab === id && <ChevronRight className="w-3 h-3" />}
                </button>
              ))}

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-5 py-4 font-body text-xs uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors border-t border-white/5"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >

              {/* ── PROFIL ── */}
              {tab === 'profil' && (
                <div className="space-y-6">
                  {/* Infos personnelles */}
                  <div className="border border-white/8 rounded-lg p-6 space-y-5">
                    <h2 className="font-display italic text-xl text-foreground">Mes informations</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Prénom', key: 'prenom', type: 'text' },
                        { label: 'Nom', key: 'nom', type: 'text' },
                        { label: 'Téléphone', key: 'telephone', type: 'tel' },
                        { label: 'Pays', key: 'pays', type: 'text' },
                      ].map(({ label, key, type }) => (
                        <div key={key}>
                          <label className={labelClass}>{label}</label>
                          <input
                            type={type}
                            value={form[key as keyof typeof form]}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                            className={inputClass}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className={labelClass}>Adresse</label>
                      <input
                        type="text"
                        value={form.adresse}
                        onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))}
                        className={inputClass}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Ville', key: 'ville' },
                        { label: 'Code postal', key: 'code_postal' },
                      ].map(({ label, key }) => (
                        <div key={key}>
                          <label className={labelClass}>{label}</label>
                          <input
                            type="text"
                            value={form[key as keyof typeof form]}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                            className={inputClass}
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 font-body text-xs uppercase tracking-widest rounded transition-all duration-300"
                      style={{
                        background: saved ? 'rgba(74,163,84,0.15)' : 'rgba(196,149,106,0.15)',
                        border: saved ? '1px solid rgba(74,163,84,0.3)' : '1px solid rgba(196,149,106,0.3)',
                        color: saved ? '#4aa354' : '#C4956A',
                      }}
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Sauvegarde...' : saved ? 'Sauvegardé ✓' : 'Sauvegarder'}
                    </button>
                  </div>

                  {/* Changement de mot de passe */}
                  <div className="border border-white/8 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <KeyRound className="w-4 h-4 text-foreground/40" />
                      <h2 className="font-display italic text-xl text-foreground">Mot de passe</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Nouveau mot de passe</label>
                        <input
                          type="password"
                          value={passwordForm.nouveau}
                          onChange={e => setPasswordForm(p => ({ ...p, nouveau: e.target.value }))}
                          className={inputClass}
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Confirmer</label>
                        <input
                          type="password"
                          value={passwordForm.confirm}
                          onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
                          className={inputClass}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {passwordError && (
                      <p className="font-body text-xs text-red-400">{passwordError}</p>
                    )}

                    <button
                      onClick={handlePasswordChange}
                      disabled={passwordSaving || !passwordForm.nouveau}
                      className="flex items-center gap-2 px-6 py-3 font-body text-xs uppercase tracking-widest rounded transition-all duration-300"
                      style={{
                        background: passwordSaved ? 'rgba(74,163,84,0.15)' : 'rgba(196,149,106,0.15)',
                        border: passwordSaved ? '1px solid rgba(74,163,84,0.3)' : '1px solid rgba(196,149,106,0.3)',
                        color: passwordSaved ? '#4aa354' : '#C4956A',
                        opacity: (!passwordForm.nouveau || passwordSaving) ? 0.5 : 1,
                      }}
                    >
                      <KeyRound className="w-4 h-4" />
                      {passwordSaving ? 'Mise à jour...' : passwordSaved ? 'Mot de passe modifié ✓' : 'Modifier le mot de passe'}
                    </button>
                  </div>

                  {/* Zone danger */}
                  <div className="border border-white/8 rounded-lg p-6">
                    <p className="font-body text-[10px] uppercase tracking-widest text-red-400/50 mb-4">Zone de danger</p>
                    {!confirmDelete ? (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="flex items-center gap-2 px-5 py-2.5 font-body text-xs uppercase tracking-widest rounded transition-all duration-300"
                        style={{ border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.5)' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Supprimer mon compte
                      </button>
                    ) : (
                      <div className="border border-red-500/20 rounded p-4 space-y-3">
                        <p className="font-body text-xs text-red-400/80">Cette action est irréversible. Toutes vos données seront supprimées.</p>
                        <div className="flex gap-3">
                          <button
                            onClick={handleDeleteAccount}
                            disabled={deleting}
                            className="px-5 py-2 font-body text-xs uppercase tracking-widest rounded transition-all duration-300"
                            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
                          >
                            {deleting ? 'Suppression...' : 'Confirmer'}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(false)}
                            className="px-5 py-2 font-body text-xs uppercase tracking-widest rounded text-foreground/40 hover:text-foreground transition-colors"
                            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── COMMANDES ── */}
              {tab === 'commandes' && (
                <div className="border border-white/8 rounded-lg p-6">
                  <h2 className="font-display italic text-xl text-foreground mb-6">Mes commandes</h2>

                  {fetchError && (
                    <p className="font-body text-xs text-red-400 mb-4">{fetchError}</p>
                  )}

                  {commandes.length === 0 && !fetchError ? (
                    <div className="text-center py-16">
                      <Package className="w-8 h-8 mx-auto mb-4 text-foreground/20" />
                      <p className="font-body text-sm text-foreground/40">Aucune commande pour le moment.</p>
                      <Link
                        to="/collections"
                        className="inline-block mt-4 font-body text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
                      >
                        Découvrir nos gammes →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {commandes.map(cmd => (
                        <div key={cmd.id} className="border border-white/8 rounded">
                          {/* Header commande */}
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === cmd.id ? null : cmd.id)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/2 transition-colors rounded"
                          >
                            <div>
                              <p className="font-body text-xs uppercase tracking-widest text-foreground/40">
                                Commande #{String(cmd.id).slice(0, 8)}
                              </p>
                              <p className="font-body text-xs text-foreground/30 mt-0.5">
                                {new Date(cmd.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className="font-body text-[10px] uppercase tracking-widest px-2.5 py-1 rounded"
                                style={{ background: 'rgba(196,149,106,0.1)', color: '#C4956A', border: '1px solid rgba(196,149,106,0.2)' }}
                              >
                                {cmd.statut ?? 'En cours'}
                              </span>
                              <span className="font-display italic text-foreground/60 text-sm">{cmd.total}€</span>
                              <Link
                                to={`/invoice/${cmd.id}`}
                                onClick={e => e.stopPropagation()}
                                className="p-1.5 rounded hover:bg-white/5 transition-colors"
                                title="Télécharger la facture"
                              >
                                <FileText className="w-3.5 h-3.5 text-foreground/30 hover:text-foreground/60" />
                              </Link>
                              <ChevronDown
                                className="w-4 h-4 text-foreground/30 transition-transform duration-200"
                                style={{ transform: expandedOrder === cmd.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                              />
                            </div>
                          </button>

                          {/* Détail items */}
                          <AnimatePresence>
                            {expandedOrder === cmd.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-2">
                                  {cmd.commande_items && cmd.commande_items.length > 0 ? (
                                    cmd.commande_items.map((item: any, i: number) => (
                                      <div key={item.id ?? i} className="flex justify-between items-center py-1.5">
                                        <div>
                                          <p className="font-display italic text-sm text-foreground/80">
                                            {item.parfum_nom ?? item.name ?? item.nom ?? 'Article'}
                                          </p>
                                          <p className="font-body text-xs text-foreground/40">
                                            {item.format ?? ''}{item.quantite || item.quantity ? ` × ${item.quantite ?? item.quantity}` : ''}
                                          </p>
                                        </div>
                                        <span className="font-body text-sm text-primary">
                                          {item.prix_unitaire ?? item.price ?? item.prix ?? '—'}€
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="font-body text-xs text-foreground/30">Détail non disponible.</p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── FAVORIS ── */}
              {tab === 'favoris' && (
                <div className="border border-white/8 rounded-lg p-6">
                  <h2 className="font-display italic text-xl text-foreground mb-6">Mes favoris</h2>

                  {fetchError && (
                    <p className="font-body text-xs text-red-400 mb-4">{fetchError}</p>
                  )}

                  {favoris.length === 0 && !fetchError ? (
                    <div className="text-center py-16">
                      <Heart className="w-8 h-8 mx-auto mb-4 text-foreground/20" />
                      <p className="font-body text-sm text-foreground/40">Aucun favori pour le moment.</p>
                      <Link
                        to="/collections"
                        className="inline-block mt-4 font-body text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
                      >
                        Explorer les parfums →
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favoris.map(fav => (
                        <Link
                          key={fav.id}
                          to={`/produit/${fav.parfums?.nom?.toLowerCase().replace(/æ/g, 'ae').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                          className="border border-white/8 rounded p-4 hover:border-white/15 transition-colors"
                        >
                          <p className="font-display italic text-foreground">{fav.parfums?.nom}</p>
                          <p className="font-body text-xs text-foreground/40 mt-1">{fav.parfums?.famille}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
