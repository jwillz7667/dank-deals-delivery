# DankDeals Cannabis Delivery

A modern cannabis delivery platform built with Next.js 15, featuring real-time ordering, age verification, and comprehensive product management.

## 🚀 Features

- **Age Verification**: Secure 21+ verification system
- **Product Catalog**: Browse cannabis flower, edibles, and vapes
- **Real-time Cart**: Dynamic shopping cart with persistence
- **Delivery Areas**: Coverage across Twin Cities metro area
- **Responsive Design**: Optimized for mobile and desktop
- **Performance Optimized**: Fast loading with modern web standards

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Stack Auth
- **Deployment**: Netlify
- **Performance**: Optimized images, lazy loading, code splitting

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── styles/               # Global styles and Tailwind config
└── public/               # Static assets
```

## 🔧 Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/jwillz7667/dank-deals-delivery.git
cd dank-deals-delivery
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Create a `.env.local` file with:
```env
DATABASE_URL=your_neon_database_url
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_client_key
STACK_SECRET_SERVER_KEY=your_stack_server_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Run development server**
```bash
npm run dev
```

## 📦 Image Assets

The following optimized images are used throughout the application:
- Product images (WebP/AVIF format)
- Logo assets
- Optimized hero backgrounds

## 🎯 Performance Features

- Image optimization with Next.js Image component
- Lazy loading for non-critical components
- Code splitting and dynamic imports
- Efficient bundle management
- Service worker caching

## 🔒 Security

- Content Security Policy (CSP) implementation
- Age verification compliance
- Secure authentication flows
- Input validation and sanitization

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- Touch-friendly interfaces
- Bottom navigation for mobile

## 🚀 Deployment

The application is configured for Netlify deployment with:
- Automatic builds from Git
- Environment variable management
- Edge function support
- CDN optimization

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support, please contact the development team.
