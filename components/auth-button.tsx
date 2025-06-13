"use client";

import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function AuthButton() {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Consider loading complete once we get the initial response
    setIsLoading(false);
  }, [user]);

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <User className="h-4 w-4" />
      </Button>
    );
  }

  if (!user) {
    return (
      <Link href="/handler/sign-in">
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </Link>
    );
  }

  // For logged-in users, show a simple account button
  return (
    <Link href="/handler/account-settings">
      <Button variant="outline" size="sm" title={user.displayName || user.primaryEmail || 'Account'}>
        <User className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Account</span>
      </Button>
    </Link>
  );
} 