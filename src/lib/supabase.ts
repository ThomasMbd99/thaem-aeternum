import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface ParfumDB {
  id: number;
  nom: string;
  famille: string;
  inspiration: string | null;
  marque: string | null;
  note: number | null;
  statut: string;
  type: 'creation' | 'inspiration';
  notes_tete: string | null;
  notes_coeur: string | null;
  notes_fond: string | null;
  texte_long: string | null;
  texte_court: string | null;
  phrase_signature: string | null;
  flagship: boolean;
}