import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const inputClass = 'w-full bg-secondary/50 border border-border rounded px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors';
const labelClass = 'font-body text-xs uppercase tracking-widest text-muted-foreground block mb-2';

const Contact = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: fnError } = await supabase.functions.invoke('send-contact-email', {
        body: { nom, email, message },
      });
      if (fnError) throw new Error(fnError.message);
      setSubmitted(true);
      setNom(''); setEmail(''); setMessage('');
    } catch {
      setError('Une erreur est survenue. Réessayez ou écrivez-nous directement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-20">
      <Helmet>
        <title>Contact, THÆM ÆTERNUM</title>
        <meta name="description" content="Contactez THÆM ÆTERNUM pour toute question sur nos parfums artisanaux, commandes ou collaborations." />
      </Helmet>
      <div className="container mx-auto px-4 lg:px-8 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-4xl lg:text-5xl">Contact</h1>
          <p className="font-body text-muted-foreground mt-4">Une question ? Écrivez-nous.</p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 space-y-4"
          >
            <CheckCircle className="w-12 h-12 mx-auto" style={{ color: '#C4956A' }} />
            <p className="font-display italic text-2xl">Message envoyé</p>
            <p className="font-body text-sm text-muted-foreground">Nous vous répondrons dans les plus brefs délais.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 font-body text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors"
            >
              Envoyer un autre message
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className={labelClass}>Nom</label>
              <input type="text" required className={inputClass} placeholder="Votre nom" value={nom} onChange={e => setNom(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" required className={inputClass} placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Message</label>
              <textarea required rows={5} className={`${inputClass} resize-none`} placeholder="Votre message..." value={message} onChange={e => setMessage(e.target.value)} />
            </div>

            {error && <p className="font-body text-xs text-destructive text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-primary-foreground font-body text-xs uppercase tracking-[0.3em] rounded hover:bg-primary/90 transition-all duration-300 btn-ripple flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Envoi…' : <><Send className="w-4 h-4" /> Envoyer</>}
            </button>
          </motion.form>
        )}

        <div className="mt-12 text-center space-y-2">
          <p className="font-body text-sm text-muted-foreground">contact@thaem-aeternum.com</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="https://www.instagram.com/thaem_aeternum/" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
