
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Variation } from '../types.ts';

export interface CartItem extends Product {
  quantity: number;
  selectedModel?: string;
  selectedAroma?: string;
  displayPrice: number; // Preço efetivo da variação
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, variation?: Variation) => void;
  removeFromCart: (uniqueId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cheiadearte_cart_v2');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cheiadearte_cart_v2', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number, variation?: Variation) => {
    setCart(prev => {
      // Identificador único considerando id + modelo + aroma
      const itemKey = `${product.id}-${variation?.model || 'none'}-${variation?.aroma || 'none'}`;
      
      const existingIndex = prev.findIndex(item => 
        `${item.id}-${item.selectedModel || 'none'}-${item.selectedAroma || 'none'}` === itemKey
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }

      return [...prev, { 
        ...product, 
        quantity, 
        selectedModel: variation?.model,
        selectedAroma: variation?.aroma,
        displayPrice: variation ? variation.price : product.price
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (uniqueId: string) => {
    setCart(prev => prev.filter(item => 
      `${item.id}-${item.selectedModel || 'none'}-${item.selectedAroma || 'none'}` !== uniqueId
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.displayPrice * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, 
      cartTotal, cartCount, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
