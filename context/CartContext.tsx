
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Variation, ShippingOption } from '../types.ts';

export interface CartItem extends Product {
  quantity: number;
  selectedModel?: string;
  selectedAroma?: string;
  displayPrice: number;
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
  selectedShipping: ShippingOption | null;
  setSelectedShipping: (option: ShippingOption | null) => void;
  destinationCep: string;
  setDestinationCep: (cep: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [destinationCep, setDestinationCep] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('cheiadearte_cart_v2');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    const savedCep = localStorage.getItem('cheiadearte_cep');
    if (savedCep) setDestinationCep(savedCep);
  }, []);

  useEffect(() => {
    localStorage.setItem('cheiadearte_cart_v2', JSON.stringify(cart));
    // Se o carrinho ficar vazio, limpa o frete selecionado
    if (cart.length === 0) setSelectedShipping(null);
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cheiadearte_cep', destinationCep);
  }, [destinationCep]);

  const addToCart = (product: Product, quantity: number, variation?: Variation) => {
    setCart(prev => {
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

  const clearCart = () => {
    setCart([]);
    setSelectedShipping(null);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.displayPrice * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, clearCart, 
      cartTotal, cartCount, isCartOpen, setIsCartOpen,
      selectedShipping, setSelectedShipping,
      destinationCep, setDestinationCep
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
