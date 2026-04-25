import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError('Email ou mot de passe incorrect.');
      else navigate('/account');
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { prenom, nom },
        },
      });
      if (error) setError(error.message);
      else setSuccess('Compte créé. Vérifiez votre email pour confirmer.');
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account` },
    });
  };

  const handleApple = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${window.location.origin}/account` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-background">
      {/* Glow ambiance */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(196,149,106,0.06) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="block text-center mb-10">
          <p className="font-display text-2xl tracking-widest text-foreground">
            TH<span style={{ fontStyle: 'italic' }}>Æ</span>M <span style={{ fontStyle: 'italic' }}>Æ</span>TERNUM
          </p>
        </Link>

        {/* Toggle */}
        <div className="flex mb-8 border border-white/10 rounded p-1">
          {(['login', 'register'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); setSuccess(null); }}
              className="flex-1 py-2 font-body text-xs uppercase tracking-widest transition-all duration-300 rounded"
              style={{
                background: mode === m ? 'rgba(196,149,106,0.15)' : 'transparent',
                color: mode === m ? '#C4956A' : 'rgba(255,255,255,0.4)',
              }}
            >
              {m === 'login' ? 'Connexion' : 'Créer un compte'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={prenom}
                    onChange={e => setPrenom(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded font-body text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-white/25 transition-colors"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                  <input
                    type="text"
                    placeholder="Nom"
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded font-body text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-white/25 transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded font-body text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full pl-9 pr-10 py-3 bg-white/5 border border-white/10 rounded font-body text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-white/25 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-body text-xs text-red-400 text-center"
            >
              {error}
            </motion.p>
          )}

          {success && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-body text-xs text-green-400 text-center"
            >
              {success}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-body text-xs uppercase tracking-widest transition-all duration-300 rounded"
            style={{
              background: 'rgba(196,149,106,0.15)',
              border: '1px solid rgba(196,149,106,0.3)',
              color: '#C4956A',
            }}
          >
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        {/* Séparateur */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="font-body text-xs text-foreground/30 uppercase tracking-widest">ou</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* OAuth */}
        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            className="w-full py-3 flex items-center justify-center gap-3 font-body text-xs uppercase tracking-widest rounded border border-white/10 bg-white/5 text-foreground/60 hover:text-foreground hover:border-white/20 transition-all duration-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          <button
            onClick={handleApple}
            className="w-full py-3 flex items-center justify-center gap-3 font-body text-xs uppercase tracking-widest rounded border border-white/10 bg-white/5 text-foreground/60 hover:text-foreground hover:border-white/20 transition-all duration-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continuer avec Apple
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
