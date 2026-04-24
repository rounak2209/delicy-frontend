import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('delicy-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('delicy-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, restaurantId) => {
    //  RESTRICTION LOGIC: Check if cart has items from another restaurant
    if (cart.length > 0 && cart[0].restaurantId !== restaurantId) {
      const confirmClear = window.confirm(
        "Your cart contains items from another restaurant. Would you like to clear the cart and add items from this restaurant instead?"
      );

      if (confirmClear) {
        // Cart khali karke naya item add kar rahe hain
        setCart([{ ...item, restaurantId, quantity: 1 }]);
      }
      return; // Agar cancel kiya ya clear kiya, dono cases mein aage ka default logic skip hoga
    }

    // Default logic: Add or update quantity
    setCart((prev) => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, restaurantId, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};