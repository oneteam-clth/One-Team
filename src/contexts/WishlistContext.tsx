import React, { createContext, useContext, useState, useEffect } from "react";

interface WishlistContextType {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("oneteam-wishlist");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("oneteam-wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = (productId: string) => {
    setItems((prev) => [...new Set([...prev, productId])]);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((id) => id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, isInWishlist, itemCount: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
