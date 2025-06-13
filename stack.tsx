import "server-only";

import { StackServerApp } from "@stackframe/stack";

// Create Stack Auth instance with proper error handling for build time
const createStackApp = () => {
  // During build time, we might not have access to all env vars
  const publishableClientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;
  const secretServerKey = process.env.STACK_SECRET_SERVER_KEY;
  
  // If we're in a build environment without keys, return a dummy instance
  if (!publishableClientKey || !secretServerKey) {
    console.warn("Stack Auth keys not found. This is expected during build time.");
    // Return a minimal configuration that won't break the build
    return new StackServerApp({
      tokenStore: "nextjs-cookie",
      // Use dummy values during build
      publishableClientKey: "pk_dummy_build_key",
      secretServerKey: "sk_dummy_build_key",
      appDomain: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    });
  }
  
  return new StackServerApp({
    tokenStore: "nextjs-cookie",
    publishableClientKey,
    secretServerKey,
    appDomain: process.env.NEXT_PUBLIC_STACK_APP_DOMAIN || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  });
};

export const stackServerApp = createStackApp();
