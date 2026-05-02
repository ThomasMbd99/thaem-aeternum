import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

export interface RelayPoint {
  id: string;
  name: string;
  adresse: string;
  code_postal: string;
  ville: string;
}

interface Props {
  onSelect: (relay: RelayPoint) => void;
  selected: RelayPoint | null;
}

const BRAND = import.meta.env.VITE_MONDIAL_RELAY_BRAND as string;

const RelayPointPicker = ({ onSelect, selected }: Props) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [widgetError, setWidgetError] = useState(false);

  useEffect(() => {
    if (!BRAND) {
      setLoading(false);
      return;
    }

    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load: ${src}`));
        document.head.appendChild(s);
      });

    const init = async () => {
      try {
        await loadScript('https://code.jquery.com/jquery-3.6.0.min.js');
        await loadScript('https://widget.mondialrelay.com/parcelshop-picker/v4_0/fr/jQuery.ParcelShopPicker.min.js');
        // Vérifier que le plugin est bien enregistré
        const $ = (window as any).jQuery;
        if (!$ || typeof $.fn?.MRParcelShopPicker !== 'function') {
          throw new Error('Plugin MR non chargé');
        }
        setWidgetReady(true);
      } catch (e) {
        console.error('Mondial Relay widget error:', e);
        setWidgetError(true);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!widgetReady || !widgetRef.current || !BRAND) return;

    const $ = (window as any).jQuery;
    if (!$ || typeof $.fn?.MRParcelShopPicker !== 'function') return;

    $('#MRWidget').MRParcelShopPicker({
      Target: '#MRTargetHidden',
      Brand: BRAND,
      Country: 'FR',
      EnableGeolocalisationButton: true,
      OnParcelShopSelected: (data: any) => {
        onSelect({
          id: data.ID,
          name: data.Nom,
          adresse: data.Adresse1,
          code_postal: data.CP,
          ville: data.Ville,
        });
      },
    });
  }, [widgetReady]);

  if (!BRAND) {
    return (
      <div
        className="p-6 rounded border text-center"
        style={{ background: 'rgba(196,149,106,0.05)', borderColor: 'rgba(196,149,106,0.15)' }}
      >
        <MapPin className="w-6 h-6 mx-auto mb-3" style={{ color: '#C4956A' }} />
        <p className="font-display italic text-foreground/60 mb-2">Point relais à configurer</p>
        <p className="font-body text-xs text-foreground/40">
          Ajoutez votre code marchand Mondial Relay dans la variable{' '}
          <code className="text-primary">VITE_MONDIAL_RELAY_BRAND</code> pour activer cette fonctionnalité.
        </p>
      </div>
    );
  }

  if (widgetError) {
    return (
      <div className="p-6 rounded border text-center" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
        <p className="font-body text-xs text-red-400">Le widget Mondial Relay n'a pas pu se charger. Vérifiez votre code enseigne.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center justify-center py-8 gap-2 text-foreground/40">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-body text-xs">Chargement de la carte...</span>
        </div>
      )}

      <input type="hidden" id="MRTargetHidden" />
      <div id="MRWidget" ref={widgetRef} className="rounded overflow-hidden" style={{ minHeight: loading ? 0 : 400 }} />

      {selected && (
        <div
          className="p-4 rounded border"
          style={{ background: 'rgba(196,149,106,0.08)', borderColor: 'rgba(196,149,106,0.25)' }}
        >
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#C4956A' }} />
            <div>
              <p className="font-display italic text-foreground">{selected.name}</p>
              <p className="font-body text-xs text-foreground/50 mt-0.5">
                {selected.adresse}, {selected.code_postal} {selected.ville}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelayPointPicker;
