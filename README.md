# 🎵 SangeetX - Modern Music Streaming Platform

<div align="center">
  <h2>Experience Music Like Never Before</h2>
  <p>A modern, responsive music streaming platform built with Next.js 15, React 19, and Tailwind CSS</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC)](https://tailwindcss.com/)
</div>

---

## ✨ Features

### 🎶 Core Features

- **🔍 Advanced Search** - Find songs, artists, and albums instantly
- **🎵 Music Player** - Full-featured audio player with controls
- **📱 Responsive Design** - Works perfectly on all devices
- **🌓 Dark/Light Theme** - Beautiful themes for any preference
- **🎨 Modern UI** - Glassmorphism design with smooth animations

### 🎯 Genre & Discovery

- **🎼 Genre Browsing** - Explore music by categories
- **🔥 Popular Songs** - Trending tracks updated in real-time
- **⏰ Recently Played** - Your music history at a glance
- **❤️ Favorites** - Save and manage your favorite songs

### 👤 Admin Features

- **� Admin Dashboard** - Comprehensive overview with analytics
- **�📤 Song Upload** - Upload new songs with metadata and file validation
- **🎵 Song Management** - Edit, delete, and organize all songs
- **👥 User Management** - Manage user accounts and permissions
- **🖼️ Cover Management** - Upload and preview album covers
- **� Analytics** - Track song performance, user activity, and system stats
- **⚙️ Settings** - Configure app settings and preferences
- **🔐 Secure Access** - Protected admin routes with authentication

### 🌐 Cloud Integration

- **☁️ Cloud Storage** - Multiple cloud storage options
- **🚀 CDN Delivery** - Fast global content delivery
- **💾 Auto-backup** - Automatic file backup and recovery
- **🔄 Real-time Sync** - Instant updates across devices

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A cloud storage account (Cloudinary recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sangeetx.git
cd sangeetx

# Run the setup script
npm run setup

# Or install manually
npm install
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🛠️ Technology Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://reactjs.org/)** - Latest React with concurrent features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework

### UI Components

- **[Lucide React](https://lucide.dev/)** - Modern icon library
- **[Radix UI](https://radix-ui.com/)** - Headless UI components
- **[Class Variance Authority](https://cva.style/)** - CSS-in-JS variants

### Backend & Storage

- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless API
- **[Cloudinary](https://cloudinary.com/)** - Media management (recommended)
- **[Prisma](https://prisma.io/)** - Database ORM (optional)
- **[Supabase](https://supabase.com/)** - Database & Auth (optional)

---

## 🌤️ Cloud Storage Options

### 🥇 Cloudinary (Recommended)

- **Free Tier**: 25GB storage, 25GB bandwidth
- **Features**: Audio optimization, CDN delivery, transformations
- **Setup**: Create account → Get credentials → Configure environment

### 🔥 Firebase Storage

- **Free Tier**: 1GB storage, 10GB bandwidth
- **Features**: Real-time sync, offline support, Google integration
- **Setup**: Create project → Enable storage → Configure SDK

### 🛡️ AWS S3

- **Free Tier**: 5GB storage, 20K requests
- **Features**: Highly scalable, reliable, extensive ecosystem
- **Setup**: Create bucket → Configure IAM → Set up credentials

### 🚀 Supabase

- **Free Tier**: 1GB storage, 2GB bandwidth
- **Features**: Built-in database, auth, real-time subscriptions
- **Setup**: Create project → Enable storage → Configure client

### ▲ Vercel Blob

- **Free Tier**: 1GB storage per month
- **Features**: Optimized for Vercel, simple API, fast CDN
- **Setup**: Install SDK → Get token → Configure environment

---

## 📁 Project Structure

```
SangeetX/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 admin/              # Admin dashboard
│   │   │   ├── 📄 page.tsx        # Admin dashboard home
│   │   │   ├── 📄 layout.tsx      # Admin layout with sidebar
│   │   │   ├── 📁 upload/         # Song upload page
│   │   │   ├── 📁 songs/          # Songs management
│   │   │   ├── 📁 users/          # User management
│   │   │   ├── 📁 analytics/      # Analytics dashboard
│   │   │   └── 📁 settings/       # Admin settings
│   │   ├── 📁 api/                # API routes
│   │   │   ├── 📁 songs/          # Songs CRUD
│   │   │   └── 📁 upload/         # File upload
│   │   ├── 📄 layout.tsx          # Root layout
│   │   ├── 📄 page.tsx            # Homepage
│   │   └── 📄 globals.css         # Global styles
│   ├── 📁 components/             # React components
│   │   ├── 📁 ui/                 # Reusable UI components
│   │   └── 📁 layout/             # Layout components
│   ├── 📁 lib/                    # Utilities & services
│   │   ├── 📄 utils.ts            # Helper functions
│   │   ├── 📄 storage.ts          # Cloud storage service
│   │   └── 📄 middleware.ts       # API middleware
│   └── 📁 data/                   # Mock data
│       ├── 📄 songs.ts            # Sample songs
│       └── 📄 genres.ts           # Music genres
├── 📁 docs/                       # Documentation
├── 📁 public/                     # Static assets
├── 📄 package.json                # Dependencies
└── 📄 .env.example                # Environment variables
```

---

## 🎯 Key Components

### 🏠 Homepage (`src/app/page.tsx`)

- Hero section with search
- Popular songs grid
- Genre categories
- Recently played list
- Integrated audio player

### 🎵 Audio Player (`src/components/layout/audio-player.tsx`)

- Play/pause controls
- Volume adjustment
- Progress bar
- Shuffle & repeat modes
- Like/unlike functionality

### 📤 Admin Upload (`src/app/admin/upload/page.tsx`)

- Drag & drop file upload
- Real-time preview
- Form validation
- Progress tracking
- Error handling

---

## 🚀 API Endpoints

### Songs API (`/api/songs`)

- `GET /api/songs` - Fetch all songs
- `POST /api/songs` - Create new song
- `PUT /api/songs/:id` - Update song
- `DELETE /api/songs/:id` - Delete song

### Upload API (`/api/upload`)

- `POST /api/upload` - Upload audio/image files
- `DELETE /api/upload` - Delete uploaded files

---

## 🎨 Design System

### 🎨 Colors

- **Primary**: Purple gradient (`purple-600` to `pink-600`)
- **Secondary**: Gray tones for text and backgrounds
- **Accent**: Blue for interactive elements
- **Success**: Green for positive actions
- **Error**: Red for warnings and errors

### 📏 Typography

- **Headings**: Font weight 600-700, various sizes
- **Body**: Font weight 400-500, readable line height
- **Captions**: Smaller text for metadata

### 🎭 Components

- **Glassmorphism**: Backdrop blur with transparency
- **Rounded Corners**: Consistent border radius
- **Shadows**: Subtle drop shadows for depth
- **Transitions**: Smooth animations for interactions

---

## 🚀 Deployment

### ▲ Vercel (Recommended)

```bash
# Deploy to Vercel
npm install -g vercel
vercel --prod
```

### 🌐 Netlify

```bash
# Build and deploy
npm run build
# Upload dist folder to Netlify
```

### 🚂 Railway

```bash
# Connect GitHub repo
# Set environment variables
# Deploy automatically
```

### 📋 Environment Variables

```env
# Cloud Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset

# Database (optional)
DATABASE_URL=your_database_url

# Authentication (optional)
NEXTAUTH_URL=your_app_url
NEXTAUTH_SECRET=your_secret
```

---

## 📚 Documentation

- **[Setup Guide](./docs/SETUP.md)** - Detailed setup instructions
- **[API Documentation](./docs/API.md)** - Complete API reference
- **[Database Schema](./docs/DATABASE.md)** - Database structure
- **[Storage Guide](./docs/STORAGE.md)** - Cloud storage options
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deployment instructions

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **Tailwind CSS** for the utility-first approach
- **Cloudinary** for media management
- **React Community** for continuous innovation

---

<div align="center">
  <p>Made with ❤️ by the SangeetX team</p>
  <p>🎵 <strong>Music for everyone, everywhere</strong> 🎵</p>
</div>
