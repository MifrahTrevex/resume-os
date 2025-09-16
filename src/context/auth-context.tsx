'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type UserType = 'admin' | 'guest' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType;
  login: (user: string, pass: string) => boolean;
  guestLogin: () => boolean;
  logout: () => void;
  promptLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);
  const router = useRouter();

  useEffect(() => {
    // On initial load, check if the user is authenticated from session storage
    const storedUserType = sessionStorage.getItem('userType') as UserType;
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);
  
  const isAuthenticated = userType !== null;

  const login = (user: string, pass: string) => {
    // Hardcoded credentials for simplicity
    if (user === 'admin' && pass === 'password') {
      setUserType('admin');
      sessionStorage.setItem('userType', 'admin');
      return true;
    }
    return false;
  };
  
  const guestLogin = () => {
    setUserType('guest');
    sessionStorage.setItem('userType', 'guest');
    return true;
  }

  const logout = () => {
    setUserType(null);
    sessionStorage.removeItem('userType');
    router.push('/');
  };
  
  const promptLogin = () => {
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, guestLogin, logout, promptLogin }}>
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
