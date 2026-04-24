import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { collections, getProduct, type Collection } from '@/data/products';

const collectionBackgrounds: Record<Collection, string> = {
  sacrae: 'linear-gradient(180deg, #1A1610 0%, #0D0B08 100%)',
  vitae: 'linear-gradient(180deg, #0A0F08 0%, #080A06 100%)',
  umbrae: 'linear-gradient(180deg, #080404 0%, #0A0505 100%)',
  nerolae: 'linear-gradient(180deg, #140A10 0%, #0D0608 100%)',
  aera: 'linear-gradient(180deg, #05080F 0%, #080C14 100%)',
};

const defaultBg = '#0A0A0A';

const DynamicBackground = () => {
  const { pathname } = useLocation();

  const collectionId = useMemo<Collection | null>(() => {
    // /collection/:id
    const colMatch = pathname.match(/^\/collection\/(\w+)/);
    if (colMatch) {
      const id = colMatch[1] as Collection;
      if (collections.find(c => c.id === id)) return id;
    }
    // /produit/:id
    const prodMatch = pathname.match(/^\/produit\/(\w+)/);
    if (prodMatch) {
      const product = getProduct(prodMatch[1]);
      if (product) return product.collection;
    }
    return null;
  }, [pathname]);

  useEffect(() => {
    const body = document.body;
    body.style.transition = 'background 0.8s ease-in-out';

    if (collectionId) {
      body.style.background = collectionBackgrounds[collectionId];
    } else {
      body.style.background = defaultBg;
    }

    return () => {
      body.style.background = defaultBg;
      body.style.transition = '';
    };
  }, [collectionId]);

  // Ambient overlay for collection pages
  if (!collectionId) return null;

  const col = collections.find(c => c.id === collectionId);
  if (!col) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{
        background: `radial-gradient(ellipse at 50% 20%, ${col.colors.accent}0A 0%, transparent 70%)`,
      }}
    />
  );
};

export default DynamicBackground;
