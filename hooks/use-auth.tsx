'use client';

import { useUser as useStackUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Optional authentication hook - doesn't force sign-in
 * Use this for browsing, viewing products, etc.
 */
export function useAuth() {
  const user = useStackUser(); // Don't force authentication - returns null if not authenticated
  const router = useRouter();

  const signOut = useCallback(async () => {
    await user?.signOut();
    router.push('/');
  }, [user, router]);

  const requireAuth = useCallback((redirectTo?: string) => {
    if (!user) {
      const currentPath = window.location.pathname;
      const afterParam = redirectTo || currentPath;
      router.push(`/handler/sign-in?after=${encodeURIComponent(afterParam)}`);
      return false;
    }
    return true;
  }, [user, router]);

  return {
    user,
    isAuthenticated: !!user,
    userId: user?.id,
    email: user?.primaryEmail,
    displayName: user?.displayName,
    signOut,
    requireAuth,
  };
}

/**
 * Required authentication hook - forces sign-in if not authenticated
 * Use this for protected pages like profile, checkout, etc.
 */
export function useRequiredAuth() {
  const user = useStackUser({ or: 'redirect' });
  const router = useRouter();

  const signOut = useCallback(async () => {
    await user?.signOut();
    router.push('/');
  }, [user, router]);

  return {
    user,
    isAuthenticated: !!user,
    userId: user?.id,
    email: user?.primaryEmail,
    displayName: user?.displayName,
    signOut,
  };
} 