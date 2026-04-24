import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-4xl lg:text-5xl">Contact</h1>
          <p className="font-body text-muted-foreground mt-4">Une question ? Écrivez-nous.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground block mb-2">Nom</label>
            <input
              type="text"
              required
              className="w-full bg-secondary/50 border border-border rounded px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground block mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full bg-secondary/50 border border-border rounded px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="font-body text-xs uppercase tracking-widest text-muted-foreground block mb-2">Message</label>
            <textarea
              required
              rows={5}
              className="w-full bg-secondary/50 border border-border rounded px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              placeholder="Votre message..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-primary text-primary-foreground font-body text-xs uppercase tracking-[0.3em] rounded hover:bg-primary/90 transition-all duration-300 btn-ripple flex items-center justify-center gap-2"
          >
            {submitted ? 'Message envoyé ✓' : <><Send className="w-4 h-4" /> Envoyer</>}
          </button>
        </motion.form>

        <div className="mt-12 text-center space-y-2">
          <p className="font-body text-sm text-muted-foreground">contact@thaem-aeternum.com</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">Instagram</a>
            <a href="#" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">TikTok</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
