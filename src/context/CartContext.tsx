import React, { createContext, useContext, useState, useCallback } from 'react';
import { FormatId } from '@/data/products';

export interface CartItem {
  productId: string;
  format: FormatId;
  quantity: number;
  price: number;
  name: string;
  // For discovery box
  isDiscoveryBox?: boolean;
  selectedPerfumes?: string[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, format: FormatId) => void;
  updateQuantity: (productId: string, format: FormatId, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.format === item.format);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId && i.format === item.format
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, format: FormatId) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.format === format)));
  }, []);

  const updateQuantity = useCallback((productId: string, format: FormatId, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, format);
      return;
    }
    setItems(prev => prev.map(i =>
      i.productId === productId && i.format === format ? { ...i, quantity } : i
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
};
