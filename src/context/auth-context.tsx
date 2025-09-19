
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User, Auth } from 'firebase/auth';
import { initializeFirebaseApp } from '@/lib/firebase-config';
import { toast } from '@/hooks/use-toast';


type UserType = 'admin' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  promptLogin: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const app = initializeFirebaseApp();
    if (app) {
      const authInstance = getAuth(app);
      setAuth(authInstance);
      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        if (user) {
          setUserType('admin');
        } else {
          setUserType(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
        setLoading(false);
    }
  }, []);
  
  const isAuthenticated = userType !== null;

  const login = async (email: string, pass: string) => {
    if (!auth) return false;
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setUserType('admin');
      return true;
    } catch (error: any) {
      console.error("Firebase login error:", error);
      let errorMessage = 'An unknown error occurred.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password.';
          break;
      }
       toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setUserType(null);
    router.push('/');
  };
  
  const promptLogin = () => {
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout, promptLogin, loading }}>
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
