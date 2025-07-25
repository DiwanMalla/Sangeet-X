# Deployment Guide - SangeetX

## 🚀 Deployment Options

### 1. Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

#### Prerequisites

- Vercel account
- GitHub repository

#### Steps

1. **Push code to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel**

```bash
npm i -g vercel
vercel
```

3. **Configure Environment Variables**

```bash
# In Vercel dashboard
NEXT_PUBLIC_API_URL=https://api.sangeetx.com
NEXT_PUBLIC_AUDIO_CDN=https://cdn.sangeetx.com
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

#### Custom Domain

```bash
vercel domains add sangeetx.com
vercel domains add www.sangeetx.com
```

### 2. Netlify

Alternative static hosting platform.

#### Steps

1. **Build the project**

```bash
npm run build
npm run export
```

2. **Deploy to Netlify**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=out
```

#### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. AWS Amplify

#### Steps

1. **Install Amplify CLI**

```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. **Initialize Amplify**

```bash
amplify init
amplify add hosting
amplify publish
```

### 4. Docker Deployment

#### Dockerfile

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/sangeetx
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=sangeetx
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://sangeetx.com
NEXT_PUBLIC_API_URL=https://api.sangeetx.com

# Database
DATABASE_URL=postgresql://username:password@host:port/database
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secure-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://sangeetx.com

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=sangeetx-assets

# External APIs
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
LASTFM_API_KEY=your-lastfm-api-key

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
MIXPANEL_TOKEN=your-mixpanel-token

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password
```

## 📊 Performance Optimization

### Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "cdn.sangeetx.com"],
    formats: ["image/webp", "image/avif"],
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### CDN Configuration

```javascript
// Cloudflare CDN settings
const cdnConfig = {
  caching: {
    // Cache static assets for 1 year
    "*.{js,css,png,jpg,jpeg,gif,webp,svg}": "31536000",
    // Cache HTML for 1 hour
    "*.html": "3600",
    // Cache API responses for 5 minutes
    "/api/*": "300",
  },

  compression: {
    gzip: true,
    brotli: true,
  },

  minification: {
    html: true,
    css: true,
    js: true,
  },
};
```

## 🔒 Security Configuration

### Security Headers

```javascript
// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );

  return response;
}
```

### SSL/TLS Configuration

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name sangeetx.com;

    ssl_certificate /etc/ssl/certs/sangeetx.crt;
    ssl_certificate_key /etc/ssl/private/sangeetx.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📈 Monitoring & Analytics

### Application Monitoring

```javascript
// lib/monitoring.js
import { init } from "@sentry/nextjs";

init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

```javascript
// lib/analytics.js
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export { Analytics, SpeedInsights };
```

### Health Check Endpoint

```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Build application
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🔧 Database Migration

### PostgreSQL Setup

```sql
-- Create database
CREATE DATABASE sangeetx;

-- Create tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  artist VARCHAR(100) NOT NULL,
  album VARCHAR(100),
  duration INTEGER NOT NULL,
  genre VARCHAR(50),
  year INTEGER,
  cover_url TEXT,
  audio_url TEXT NOT NULL,
  popularity INTEGER DEFAULT 0,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_songs_title ON songs(title);
CREATE INDEX idx_songs_artist ON songs(artist);
CREATE INDEX idx_songs_genre ON songs(genre);
CREATE INDEX idx_songs_popularity ON songs(popularity DESC);
```

## 🚀 Go Live Checklist

### Pre-deployment

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] CDN setup
- [ ] Analytics tracking implemented
- [ ] Error monitoring configured

### Post-deployment

- [ ] Health check endpoint responding
- [ ] All pages loading correctly
- [ ] Audio playback working
- [ ] Search functionality working
- [ ] Mobile responsiveness verified
- [ ] Performance metrics within targets
- [ ] Security headers configured

### Monitoring

- [ ] Uptime monitoring setup
- [ ] Performance monitoring active
- [ ] Error tracking working
- [ ] Log aggregation configured
- [ ] Backup strategy implemented

## 📱 Mobile App Deployment

### React Native (Future)

```bash
# iOS
cd ios && pod install
npx react-native run-ios --configuration Release

# Android
cd android
./gradlew assembleRelease
```

### PWA Configuration

```javascript
// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // Next.js config
});
```

This deployment guide covers all major platforms and configurations for deploying SangeetX successfully.
