'use client';

import { Suspense } from 'react';

export default function Loading() {
  // Optimized loading component with better performance
  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-app-green-600"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
