// User type
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  role?: 'admin' | 'customer';
}

// Product type
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
}

// Cart item type
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

// Order type
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}
