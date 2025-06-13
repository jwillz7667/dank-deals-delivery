# Stack Auth Setup Guide

## Required Environment Variables

To deploy this application, you need to set up Stack Auth and configure the following environment variables in your deployment platform (Netlify, Vercel, etc.):

### 1. Create a Stack Auth Project

1. Go to [Stack Auth Dashboard](https://app.stack-auth.com)
2. Sign up or log in
3. Create a new project
4. Copy your project credentials

### 2. Required Environment Variables

Add these environment variables to your deployment platform:

```bash
# Stack Auth Configuration (Required)
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_client_key
STACK_SECRET_SERVER_KEY=your_secret_server_key

# Optional: Custom domain for Stack Auth (defaults to NEXT_PUBLIC_SITE_URL)
NEXT_PUBLIC_STACK_APP_DOMAIN=https://your-domain.com
```

### 3. Netlify Setup

1. Go to your Netlify project dashboard
2. Navigate to "Site configuration" → "Environment variables"
3. Add the following variables:
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`
   - `NEXT_PUBLIC_STACK_APP_DOMAIN` (optional, will use NEXT_PUBLIC_SITE_URL if not set)

### 4. Local Development

For local development, add these to your `.env.local` file:

```bash
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_dev_publishable_key
STACK_SECRET_SERVER_KEY=your_dev_secret_key
```

### 5. Stack Auth Features Used

This application uses Stack Auth for:
- User authentication (sign up, sign in, sign out)
- Protected routes
- User profile management
- Session management with cookies

### Important Notes

- The `NEXT_PUBLIC_` prefix is required for client-side environment variables
- Never commit your secret keys to version control
- Use different Stack Auth projects for development and production
- The app domain should match your deployment URL for proper OAuth redirects 