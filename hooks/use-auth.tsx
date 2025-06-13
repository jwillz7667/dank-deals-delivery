'use client';

import { useUser as useStackUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
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