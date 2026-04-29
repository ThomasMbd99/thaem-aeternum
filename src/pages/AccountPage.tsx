import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, Heart, LogOut, Save, ChevronRight, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type Tab = 'profil' | 'commandes' | 'favoris';

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
    const { data } = await supabase
      .from('commandes')
      .select('*, commande_items(*)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    if (data) setCommandes(data);
  };

  const fetchFavoris = async () => {
    const { data } = await supabase
      .from('favoris')
      .select('*, parfums(*)')
      .eq('user_id', user!.id);
    if (data) setFavoris(data);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('profiles').update(form).eq('id', user!.id);
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
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
                        <label className="block font-body text-xs uppercase tracking-widest text-foreground/40 mb-1.5">{label}</label>
                        <input
                          type={type}
                          value={form[key as keyof typeof form]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded font-body text-sm text-foreground focus:outline-none focus:border-white/25 transition-colors"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block font-body text-xs uppercase tracking-widest text-foreground/40 mb-1.5">Adresse</label>
                    <input
                      type="text"
                      value={form.adresse}
                      onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded font-body text-sm text-foreground focus:outline-none focus:border-white/25 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Ville', key: 'ville' },
                      { label: 'Code postal', key: 'code_postal' },
                    ].map(({ label, key }) => (
                      <div key={key}>
                        <label className="block font-body text-xs uppercase tracking-widest text-foreground/40 mb-1.5">{label}</label>
                        <input
                          type="text"
                          value={form[key as keyof typeof form]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded font-body text-sm text-foreground focus:outline-none focus:border-white/25 transition-colors"
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
                    {saving ? 'Sauvegarde...' : saved ? 'Sauvegardé' : 'Sauvegarder'}
                  </button>

                  {/* Zone danger */}
                  <div className="mt-8 pt-8 border-t border-white/5">
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
                  {commandes.length === 0 ? (
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
                    <div className="space-y-4">
                      {commandes.map(cmd => (
                        <div key={cmd.id} className="border border-white/8 rounded p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-body text-xs uppercase tracking-widest text-foreground/40">
                                Commande #{cmd.id}
                              </p>
                              <p className="font-body text-xs text-foreground/30 mt-0.5">
                                {new Date(cmd.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <span
                              className="font-body text-[10px] uppercase tracking-widest px-2.5 py-1 rounded"
                              style={{ background: 'rgba(196,149,106,0.1)', color: '#C4956A', border: '1px solid rgba(196,149,106,0.2)' }}
                            >
                              {cmd.statut}
                            </span>
                          </div>
                          <p className="font-display italic text-foreground/60 text-sm">Total : {cmd.total}€</p>
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
                  {favoris.length === 0 ? (
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
                          to={`/product/${fav.parfums?.nom?.toLowerCase().replace(/æ/g, 'ae').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
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
