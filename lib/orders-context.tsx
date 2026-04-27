'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Order, OrderItem } from './types';

interface OrdersContextType {
  orders: Order[];
  createOrder: (userId: string, items: OrderItem[], total: number) => Order;
  getOrdersByUser: (userId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem('cartify_orders');
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (error) {
        console.error('Failed to parse stored orders:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('cartify_orders', JSON.stringify(orders));
    }
  }, [orders, isHydrated]);

  // Order status updates now handled by admin only - removed auto-updates

  const createOrder = (userId: string, items: OrderItem[], total: number): Order => {
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      userId,
      items,
      total,
      status: 'Processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    return newOrder;
  };

  const getOrdersByUser = (userId: string): Order[] => {
    return orders.filter((order) => order.userId === userId);
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        getOrdersByUser,
        getOrderById,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
