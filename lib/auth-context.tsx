"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';

interface AuthContextType {
  user: ReturnType<typeof useUser>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  
  // Stack Auth v2 returns the user directly, not an object with isLoading
  // We'll manage loading state ourselves
  useEffect(() => {
    // User is considered loaded once we get the initial response (either user object or null)
    setIsLoading(false);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 