'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    // Initialize admin and demo accounts if they don't exist
    const storedUsers = JSON.parse(localStorage.getItem('cartify_users') || '{}');
    
    if (!storedUsers['admin@cartify.com']) {
      storedUsers['admin@cartify.com'] = {
        id: 'admin_001',
        password: 'admin123',
        name: 'Admin User',
        createdAt: new Date().toISOString(),
        role: 'admin',
      };
    }
    
    if (!storedUsers['demo@example.com']) {
      storedUsers['demo@example.com'] = {
        id: 'user_demo',
        password: 'demo123',
        name: 'Demo User',
        createdAt: new Date().toISOString(),
        role: 'customer',
      };
    }
    
    localStorage.setItem('cartify_users', JSON.stringify(storedUsers));

    const storedUser = localStorage.getItem('cartify_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call with validation
    const storedUsers = JSON.parse(localStorage.getItem('cartify_users') || '{}');

    if (!storedUsers[email]) {
      throw new Error('User not found');
    }

    if (storedUsers[email].password !== password) {
      throw new Error('Invalid password');
    }

    const userData: User = {
      id: storedUsers[email].id,
      email,
      name: storedUsers[email].name,
      createdAt: storedUsers[email].createdAt,
      role: storedUsers[email].role || 'customer',
    };

    setUser(userData);
    localStorage.setItem('cartify_user', JSON.stringify(userData));
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call
    const storedUsers = JSON.parse(localStorage.getItem('cartify_users') || '{}');

    if (storedUsers[email]) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      createdAt: new Date().toISOString(),
      role: 'customer',
    };

    storedUsers[email] = {
      id: newUser.id,
      password,
      name,
      createdAt: newUser.createdAt,
      role: 'customer',
    };

    localStorage.setItem('cartify_users', JSON.stringify(storedUsers));
    setUser(newUser);
    localStorage.setItem('cartify_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cartify_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
