// Netlify Edge Function types
interface NetlifyContext {
  next: () => Promise<Response>;
  requestStart?: number;
  geo?: {
    city?: string;
    country?: { code: string; name: string };
    subdivision?: { code: string; name: string };
  };
  ip?: string;
  params?: Record<string, string>;
  site?: { id: string; name: string; url: string };
}

export default async function handler(request: Request, context: NetlifyContext) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Get the response from the origin
  const response = await context.next();
  
  // Clone the response to modify headers
  const modifiedResponse = new Response(response.body, response);
  
  // Cache control for different paths
  if (path === '/menu' || path.startsWith('/product/')) {
    // Set cache headers for ISR-like behavior
    modifiedResponse.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=86400');
    modifiedResponse.headers.set('Netlify-CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=86400');
    modifiedResponse.headers.set('Netlify-Cache-Tag', path.startsWith('/product/') ? 'product' : 'menu');
  }
  
  // Add performance headers
  modifiedResponse.headers.set('X-Content-Type-Options', 'nosniff');
  modifiedResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
  modifiedResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add timing headers for performance monitoring
  const startTime = context.requestStart || Date.now();
  modifiedResponse.headers.set('Server-Timing', `edge;dur=${Date.now() - startTime}`);
  
  return modifiedResponse;
}

export const config = {
  path: ["/menu", "/product/*"],
}; 