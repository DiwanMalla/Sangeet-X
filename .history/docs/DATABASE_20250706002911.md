# Database Setup for SangeetX

## Database Schema

### Songs Table

```sql
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  album VARCHAR(255),
  duration INTEGER NOT NULL, -- in seconds
  genre VARCHAR(100),
  year INTEGER,
  cover_url TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  popularity INTEGER DEFAULT 0,
  is_liked BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Indexes for better performance
  INDEX idx_songs_title (title),
  INDEX idx_songs_artist (artist),
  INDEX idx_songs_genre (genre),
  INDEX idx_songs_popularity (popularity DESC),
  INDEX idx_songs_play_count (play_count DESC),
  INDEX idx_songs_created_at (created_at DESC)
);
```

### Artists Table

```sql
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  bio TEXT,
  image_url TEXT,
  genres JSON, -- Array of genre strings
  popularity INTEGER DEFAULT 0,
  followers INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_artists_name (name),
  INDEX idx_artists_popularity (popularity DESC)
);
```

### Albums Table

```sql
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist_id UUID NOT NULL,
  artist_name VARCHAR(255) NOT NULL,
  release_date DATE,
  cover_url TEXT,
  genre VARCHAR(100),
  total_tracks INTEGER DEFAULT 0,
  duration INTEGER DEFAULT 0, -- total duration in seconds
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
  INDEX idx_albums_title (title),
  INDEX idx_albums_artist (artist_id),
  INDEX idx_albums_release_date (release_date DESC)
);
```

### Playlists Table

```sql
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID NOT NULL,
  cover_url TEXT,
  is_public BOOLEAN DEFAULT false,
  followers INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_playlists_user (user_id),
  INDEX idx_playlists_public (is_public),
  INDEX idx_playlists_name (name)
);
```

### Playlist Songs (Junction Table)

```sql
CREATE TABLE playlist_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL,
  song_id UUID NOT NULL,
  position INTEGER NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_playlist_song (playlist_id, song_id),
  INDEX idx_playlist_songs_playlist (playlist_id),
  INDEX idx_playlist_songs_position (playlist_id, position)
);
```

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  subscription_type ENUM('free', 'premium') DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_users_username (username),
  INDEX idx_users_email (email)
);
```

### Genres Table

```sql
CREATE TABLE genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7), -- Hex color code
  image_url TEXT,
  popularity INTEGER DEFAULT 0,
  song_count INTEGER DEFAULT 0,

  INDEX idx_genres_name (name),
  INDEX idx_genres_popularity (popularity DESC)
);
```

### User Liked Songs

```sql
CREATE TABLE user_liked_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  song_id UUID NOT NULL,
  liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_song_like (user_id, song_id),
  INDEX idx_user_liked_songs_user (user_id),
  INDEX idx_user_liked_songs_song (song_id)
);
```

### Play History

```sql
CREATE TABLE play_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  song_id UUID NOT NULL,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duration_played INTEGER, -- how long the song was played in seconds
  completed BOOLEAN DEFAULT false, -- whether the song was played to completion

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  INDEX idx_play_history_user (user_id),
  INDEX idx_play_history_song (song_id),
  INDEX idx_play_history_played_at (played_at DESC)
);
```

## Database Setup Options

### Option 1: PostgreSQL with Prisma (Recommended)

1. **Install dependencies:**

```bash
npm install prisma @prisma/client
npm install -D prisma
```

2. **Initialize Prisma:**

```bash
npx prisma init
```

3. **Update `prisma/schema.prisma`:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Song {
  id          String   @id @default(cuid())
  title       String
  artist      String
  album       String?
  duration    Int
  genre       String?
  year        Int?
  coverUrl    String   @map("cover_url")
  audioUrl    String   @map("audio_url")
  popularity  Int      @default(0)
  isLiked     Boolean  @default(false) @map("is_liked")
  playCount   Int      @default(0) @map("play_count")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("songs")
}

// Add other models here...
```

4. **Environment variables (.env.local):**

```env
DATABASE_URL="postgresql://username:password@localhost:5432/sangeetx"
```

### Option 2: MongoDB with Mongoose

1. **Install dependencies:**

```bash
npm install mongoose
npm install -D @types/mongoose
```

2. **Create models:**

```typescript
// lib/models/Song.ts
import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: String,
    duration: { type: Number, required: true },
    genre: String,
    year: Number,
    coverUrl: { type: String, required: true },
    audioUrl: { type: String, required: true },
    popularity: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false },
    playCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Song = mongoose.models.Song || mongoose.model("Song", songSchema);
```

### Option 3: Supabase (Free PostgreSQL)

1. **Create account:** [supabase.com](https://supabase.com)
2. **Create new project**
3. **Run SQL commands** in Supabase SQL editor
4. **Get connection string** from project settings

## Free Database Hosting Options

1. **Supabase** - 500MB free, PostgreSQL
2. **PlanetScale** - 5GB free, MySQL
3. **Neon** - 3GB free, PostgreSQL
4. **MongoDB Atlas** - 512MB free
5. **Railway** - $5/month, multiple databases
6. **Vercel Postgres** - Free tier available

## Migration Commands

```bash
# Prisma
npx prisma migrate dev --name init
npx prisma generate

# For production
npx prisma migrate deploy
```

## Best Practices

1. **Use transactions** for data consistency
2. **Implement proper indexing** for search performance
3. **Add data validation** at database level
4. **Use connection pooling** for production
5. **Implement caching** (Redis) for frequently accessed data
6. **Regular backups** and monitoring
7. **Use environment variables** for sensitive data
