// Database schema for SangeetX
// This can be used with Prisma, SQL, or as a reference for other databases

// Songs table
interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  year?: number;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  popularity: number; // 0-100
  playCount: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Users table (for future implementation)
interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Playlists table (for future implementation)
interface Playlist {
  id: string;
  name: string;
  description?: string;
  userId: string;
  isPublic: boolean;
  coverUrl?: string;
  songIds: string[]; // Array of song IDs
  createdAt: Date;
  updatedAt: Date;
}

// Favorites table (for future implementation)
interface Favorite {
  id: string;
  userId: string;
  songId: string;
  createdAt: Date;
}

// Play history table (for future implementation)
interface PlayHistory {
  id: string;
  userId: string;
  songId: string;
  playedAt: Date;
  completedPercentage: number; // 0-100
}

// Genres table (for future implementation)
interface Genre {
  id: string;
  name: string;
  description?: string;
  color: string;
  songCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// SQL Schema (PostgreSQL/MySQL)
const SQL_SCHEMA = `
-- Songs table
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  album VARCHAR(255),
  genre VARCHAR(100),
  year INTEGER,
  duration INTEGER NOT NULL,
  cover_url TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  popularity INTEGER DEFAULT 0,
  play_count INTEGER DEFAULT 0,
  is_liked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  avatar TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Playlists table
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,
  cover_url TEXT,
  song_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, song_id)
);

-- Play history table
CREATE TABLE play_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_percentage INTEGER DEFAULT 0
);

-- Genres table
CREATE TABLE genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) NOT NULL, -- Hex color code
  song_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_songs_artist ON songs(artist);
CREATE INDEX idx_songs_genre ON songs(genre);
CREATE INDEX idx_songs_popularity ON songs(popularity DESC);
CREATE INDEX idx_songs_created_at ON songs(created_at DESC);
CREATE INDEX idx_play_history_user_id ON play_history(user_id);
CREATE INDEX idx_play_history_played_at ON play_history(played_at DESC);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
`;

// Prisma Schema
const PRISMA_SCHEMA = `
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

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
  genre       String?
  year        Int?
  duration    Int
  coverUrl    String
  audioUrl    String
  popularity  Int      @default(0)
  playCount   Int      @default(0)
  isLiked     Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  favorites    Favorite[]
  playHistory  PlayHistory[]

  @@map("songs")
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String   @unique
  displayName String
  avatar      String?
  isAdmin     Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  playlists   Playlist[]
  favorites   Favorite[]
  playHistory PlayHistory[]

  @@map("users")
}

model Playlist {
  id          String   @id @default(cuid())
  name        String
  description String?
  userId      String
  isPublic    Boolean  @default(false)
  coverUrl    String?
  songIds     String[] @default([])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("playlists")
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  songId    String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  song      Song     @relation(fields: [songId], references: [id], onDelete: Cascade)

  @@unique([userId, songId])
  @@map("favorites")
}

model PlayHistory {
  id                   String   @id @default(cuid())
  userId               String
  songId               String
  playedAt             DateTime @default(now())
  completedPercentage  Int      @default(0)

  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  song                 Song     @relation(fields: [songId], references: [id], onDelete: Cascade)

  @@map("play_history")
}

model Genre {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  color       String
  songCount   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("genres")
}
`;

// MongoDB Schema (using Mongoose)
const MONGOOSE_SCHEMA = `
import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: String,
  genre: String,
  year: Number,
  duration: { type: Number, required: true },
  coverUrl: { type: String, required: true },
  audioUrl: { type: String, required: true },
  popularity: { type: Number, default: 0 },
  playCount: { type: Number, default: 0 },
  isLiked: { type: Boolean, default: false },
}, {
  timestamps: true
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  avatar: String,
  isAdmin: { type: Boolean, default: false },
}, {
  timestamps: true
});

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  coverUrl: String,
  songIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
}, {
  timestamps: true
});

export const Song = mongoose.model('Song', songSchema);
export const User = mongoose.model('User', userSchema);
export const Playlist = mongoose.model('Playlist', playlistSchema);
`;

export { SQL_SCHEMA, PRISMA_SCHEMA, MONGOOSE_SCHEMA };
export type { Song, User, Playlist, Favorite, PlayHistory, Genre };
