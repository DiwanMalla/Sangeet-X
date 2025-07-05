export interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number // in seconds
  genre: string
  year: number
  coverUrl: string
  audioUrl: string
  popularity: number
  isLiked: boolean
  playCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Artist {
  id: string
  name: string
  bio: string
  imageUrl: string
  genres: string[]
  popularity: number
  followers: number
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Album {
  id: string
  title: string
  artist: string
  artistId: string
  releaseDate: Date
  coverUrl: string
  genre: string
  totalTracks: number
  duration: number
  popularity: number
  createdAt: Date
  updatedAt: Date
}

export interface Playlist {
  id: string
  name: string
  description: string
  userId: string
  songs: Song[]
  coverUrl: string
  isPublic: boolean
  followers: number
  createdAt: Date
  updatedAt: Date
}

export interface Genre {
  id: string
  name: string
  description: string
  color: string
  imageUrl: string
  popularity: number
  songCount: number
}

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  isVerified: boolean
  playlists: Playlist[]
  likedSongs: Song[]
  following: Artist[]
  createdAt: Date
  updatedAt: Date
}

export interface PlayerState {
  currentSong: Song | null
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  queue: Song[]
  currentIndex: number
  isShuffling: boolean
  isRepeating: 'none' | 'one' | 'all'
  isLoading: boolean
}

export interface SearchFilters {
  genre?: string
  year?: number
  duration?: {
    min?: number
    max?: number
  }
  popularity?: number
}

export interface SearchParams {
  query: string
  type?: 'song' | 'artist' | 'album' | 'playlist' | 'all'
  limit?: number
  offset?: number
  filters?: SearchFilters
}

export interface SearchResults {
  songs: Song[]
  artists: Artist[]
  albums: Album[]
  playlists: Playlist[]
  total: number
  limit: number
  offset: number
}

export interface AudioContextState {
  audioContext: AudioContext | null
  gainNode: GainNode | null
  analyser: AnalyserNode | null
  isInitialized: boolean
}

export type RepeatMode = 'none' | 'one' | 'all'
export type PlayerAction = 
  | { type: 'PLAY_SONG'; song: Song }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'SEEK'; time: number }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' }
  | { type: 'SET_QUEUE'; songs: Song[] }
  | { type: 'UPDATE_TIME'; currentTime: number; duration: number }
  | { type: 'SET_LOADING'; isLoading: boolean }
