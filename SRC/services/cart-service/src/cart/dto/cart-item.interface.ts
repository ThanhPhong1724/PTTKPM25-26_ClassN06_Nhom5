// src/cart/interfaces/cart-item.interface.ts
export interface CakeCustomization {
  size?: { id: string; name: string; price: number };
  cakeBase?: { id: string; name: string; price: number };
  frosting?: { id: string; name: string; price: number };
  flavor?: { id: string; name: string; price: number };
  decoration?: { id: string; name: string; price: number };
  specialInstructions?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  name: string; // Cho phép undefined
  price: number;
  img: string | null;
  customization?: CakeCustomization; // For custom cake orders
  isCustomCake?: boolean; // Flag to identify custom cakes
}
