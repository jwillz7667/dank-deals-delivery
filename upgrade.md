# Cannabis Delivery Site Upgrade Guide

## Overview
This document outlines the migration steps to upgrade dankdealsmn.com for top 5 SERP rankings and Lighthouse scores ≥90.

## Pre-Migration Checklist

- [ ] Backup current production database
- [ ] Create staging environment on Netlify
- [ ] Obtain necessary API keys:
  - [ ] Google Maps API key
  - [ ] Stripe publishable key
  - [ ] Google Cloud service account for BigQuery
  - [ ] VAPID keys for push notifications
- [ ] DNS records ready for pl.dankdealsmn.com (Plausible)
- [ ] SSL certificate for analytics subdomain

## Migration Steps

### Phase 1: Core Performance Optimizations (2 hours)

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Variables**
   Create `.env.local` with:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_key
   GOOGLE_CLOUD_PROJECT_ID=your_project
   GOOGLE_CLOUD_KEYFILE=./service-account.json
   BIGQUERY_DATASET=web_analytics
   BIGQUERY_TABLE=web_vitals
   REVIEWS_WEBHOOK_TOKEN=secure_random_token
   ```

3. **Build and Test Locally**
   ```bash
   pnpm build
   pnpm start
   ```

4. **Deploy to Staging**
   ```bash
   git push origin main
   # Netlify auto-deploys to staging
   ```

### Phase 2: PWA & Service Worker (1 hour)

1. **Test Service Worker Registration**
   - Open Chrome DevTools > Application > Service Workers
   - Verify SW is registered and active
   - Test offline functionality

2. **Install Prompt Testing**
   - Clear browser data
   - Visit site on mobile
   - Verify install prompt appears
   - Test installation flow

3. **Push Notification Setup**
   ```bash
   # Generate VAPID keys
   npx web-push generate-vapid-keys
   ```

### Phase 3: SEO & Content (1 hour)

1. **Initialize Blog Content**
   ```bash
   # Content will auto-generate on first build
   pnpm build
   ```

2. **Verify Structured Data**
   - Use Google's Rich Results Test
   - Check each product page
   - Validate organization schema

3. **Submit Sitemap**
   - Google Search Console
   - Bing Webmaster Tools
   - Submit: https://dankdealsmn.com/sitemap.xml

### Phase 4: Analytics Setup (30 minutes)

1. **Deploy Plausible**
   ```bash
   # On your analytics server
   docker-compose up -d plausible
   ```

2. **Configure DNS**
   - A record: pl.dankdealsmn.com → analytics server IP
   - Configure SSL with Let's Encrypt

3. **BigQuery Setup**
   ```sql
   -- Create dataset
   CREATE SCHEMA web_analytics;
   
   -- Tables will auto-create on first metric
   ```

### Phase 5: Production Deploy (30 minutes)

1. **Final Checks**
   - Run Lighthouse on staging (target: ≥90 all metrics)
   - Test all critical user flows
   - Verify age verification compliance

2. **Deploy to Production**
   ```bash
   # Merge to production branch
   git checkout production
   git merge main
   git push origin production
   ```

3. **Post-Deploy Verification**
   - [ ] Service worker active
   - [ ] Analytics tracking pageviews
   - [ ] Structured data valid
   - [ ] All images loading via CDN
   - [ ] Cart functionality working
   - [ ] Age verification active

## Rollback Plan

### Immediate Rollback (< 5 minutes)
1. **Netlify Instant Rollback**
   - Go to Netlify dashboard
   - Click "Deploys" tab
   - Find last working deploy
   - Click "Publish deploy"

### Manual Rollback (10-15 minutes)
1. **Git Revert**
   ```bash
   git revert --no-commit HEAD~1..HEAD
   git commit -m "Rollback upgrade"
   git push origin production
   ```

2. **Database Rollback**
   ```bash
   # Restore from backup
   pg_restore -d dankdeals backup_pre_upgrade.sql
   ```

3. **Clear CDN Cache**
   - Netlify: Deploy → Clear cache and deploy site
   - Cloudflare (if used): Purge everything

### Rollback Triggers
- Lighthouse scores drop below 80
- Cart/checkout functionality broken
- Age verification fails
- Analytics not tracking
- 500+ errors spike

## Performance Benchmarks

### Pre-Upgrade Baseline
- Lighthouse Performance: 72
- Lighthouse Accessibility: 85
- Lighthouse SEO: 83
- FCP: 2.1s
- LCP: 3.8s
- CLS: 0.15

### Post-Upgrade Targets
- Lighthouse Performance: ≥90
- Lighthouse Accessibility: ≥90
- Lighthouse SEO: ≥90
- FCP: <1.5s
- LCP: <2.5s
- CLS: <0.1

## Monitoring Post-Deploy

1. **Real User Monitoring**
   - Plausible dashboard: https://pl.dankdealsmn.com
   - Custom events firing correctly
   - Web Vitals within targets

2. **Error Monitoring**
   - Check Netlify Functions logs
   - Monitor 404 rates
   - Watch for JS errors in Plausible

3. **SEO Monitoring**
   - Google Search Console for errors
   - Rankings for "cannabis delivery Minneapolis"
   - Click-through rates improving

## Support Contacts

- **Netlify Support**: support@netlify.com
- **Stripe Support**: support@stripe.com
- **Google Cloud**: cloud.google.com/support
- **Emergency Rollback**: [Your Phone]

## Backlink Targets

Post-deployment, pursue backlinks from:

1. **Local Minneapolis Sites**
   - Minneapolis.org
   - Twin Cities Business Journal
   - Minnesota Monthly
   - City Pages alternatives
   - Mpls.St.Paul Magazine

2. **Cannabis Industry**
   - Leafly (business listing)
   - Weedmaps (claimed listing)
   - High Times (PR submission)
   - Cannabis Business Times
   - MJBizDaily

3. **Local Directories**
   - Yelp (optimize listing)
   - Google My Business
   - Bing Places
   - Apple Maps
   - NextDoor

4. **Health & Wellness**
   - Minnesota wellness blogs
   - Alternative medicine directories
   - Pain management resources
   - Anxiety/stress relief sites
   - Local health newsletters

5. **Tech/Startup**
   - Minnesota startup directories
   - Tech.mn coverage
   - Startup genome listing

Remember: Quality > Quantity. Focus on relevant, high-authority local links.

## Success Metrics (30 days post-launch)

- [ ] Top 5 ranking for "cannabis delivery Minneapolis"
- [ ] 20%+ increase in organic traffic
- [ ] Cart abandonment rate <25%
- [ ] Page speed <2s on mobile
- [ ] 15+ quality backlinks acquired 