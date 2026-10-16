import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toast = useToast();

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Could not save cart to localStorage", e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product === product._id);

      if (existing) {
        const newQty = existing.quantity + qtyToAdd;
        if (newQty > product.stock) {
          toast.warning(
            `Only ${product.stock} items available in stock. Cart updated to maximum available.`
          );
          return prevItems.map((item) =>
            item.product === product._id
              ? { ...item, quantity: product.stock }
              : item
          );
        }

        toast.success(`Updated "${product.title}" quantity in cart!`);
        return prevItems.map((item) =>
          item.product === product._id
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        if (qtyToAdd > product.stock) {
          toast.warning(
            `Cannot add more than available stock (${product.stock}).`
          );
          return prevItems;
        }

        toast.success(`Added "${product.title}" to cart!`);
        return [
          ...prevItems,
          {
            product: product._id,
            title: product.title,
            image: product.image,
            price: Number(product.price),
            stock: Number(product.stock),
            quantity: qtyToAdd,
          },
        ];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product === productId) {
          if (qty > item.stock) {
            toast.warning(`Maximum available stock is ${item.stock}`);
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cartItems.find((i) => i.product === productId);
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product !== productId)
    );
    if (itemToRemove) {
      toast.info(`Removed "${itemToRemove.title}" from cart`);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  // Calculations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const rawItemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const itemsPrice = Number(rawItemsPrice.toFixed(2));

  // Free shipping over $100, otherwise $10 flat; $0 if empty
  const shippingPrice =
    cartItems.length === 0 ? 0 : itemsPrice >= 100 ? 0 : 10.0;

  // 8% estimated tax
  const taxPrice =
    cartItems.length === 0 ? 0 : Number((itemsPrice * 0.08).toFixed(2));

  const totalPrice = Number(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

