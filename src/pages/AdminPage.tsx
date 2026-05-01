import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, TrendingUp, Clock, CheckCircle, Truck, XCircle, ChevronDown, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string;

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: any }> = {
  pending:   { label: 'En attente',  color: '#EAB308', bg: 'rgba(234,179,8,0.12)',   icon: Clock },
  confirmed: { label: 'Confirmée',   color: '#C4956A', bg: 'rgba(196,149,106,0.12)', icon: CheckCircle },
  shipped:   { label: 'Expédiée',    color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  icon: Truck },
  delivered: { label: 'Livrée',      color: '#22C55E', bg: 'rgba(34,197,94,0.12)',   icon: CheckCircle },
  cancelled: { label: 'Annulée',     color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   icon: XCircle },
};

const allStatuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const AdminPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [rlsError, setRlsError] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/login'); return; }
    if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) { navigate('/'); return; }
    fetchOrders();
  }, [user, loading]);

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

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingStatus(orderId);
    const { error } = await supabase.from('commandes').update({ statut: status }).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, statut: status } : o));
    }
    setUpdatingStatus(null);
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
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 30% at 50% 0%, rgba(196,149,106,0.05) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex items-center justify-between">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-foreground/40 mb-2">Administration</p>
            <h1 className="font-display text-3xl lg:text-4xl italic font-light">Tableau de bord</h1>
          </div>
          <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 font-body text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors border border-white/8 rounded">
            <RefreshCw className="w-3 h-3" /> Actualiser
          </button>
        </motion.div>

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
              border: `1px solid ${filter === 'all' ? 'rgba(196,149,106,0.4)' : 'rgba(255,255,255,0.08)'}`,
              color: filter === 'all' ? '#C4956A' : 'rgba(255,255,255,0.4)',
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
                  border: `1px solid ${filter === s ? cfg.color + '60' : 'rgba(255,255,255,0.08)'}`,
                  color: filter === s ? cfg.color : 'rgba(255,255,255,0.4)',
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
                        onChange={e => updateStatus(cmd.id, e.target.value as OrderStatus)}
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

      </div>
    </div>
  );
};

export default AdminPage;
