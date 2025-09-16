'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase-config';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';


type UserType = 'admin' | 'guest' | null;

interface AuthContextType {
  isAuthenticated: boolean;
  userType: UserType;
  login: (email: string, pass: string) => Promise<boolean>;
  guestLogin: () => boolean;
  logout: () => void;
  promptLogin: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserType('admin');
        sessionStorage.setItem('userType', 'admin');
      } else {
        const storedUserType = sessionStorage.getItem('userType') as UserType;
        if (storedUserType === 'guest') {
            setUserType('guest');
        } else {
            setUserType(null);
            sessionStorage.removeItem('userType');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const isAuthenticated = userType !== null;

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setUserType('admin');
      sessionStorage.setItem('userType', 'admin');
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
  
  const guestLogin = () => {
    setUserType('guest');
    sessionStorage.setItem('userType', 'guest');
    return true;
  }

  const logout = async () => {
    if (userType === 'admin') {
      await signOut(auth);
    }
    setUserType(null);
    sessionStorage.removeItem('userType');
    router.push('/');
  };
  
  const promptLogin = () => {
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, guestLogin, logout, promptLogin, loading }}>
      {loading ? <div>Loading...</div> : children}
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
