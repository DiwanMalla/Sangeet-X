export const GENRES = [
  { id: '1', name: 'Pop', color: '#FF6B6B' },
  { id: '2', name: 'Rock', color: '#4ECDC4' },
  { id: '3', name: 'Hip-Hop', color: '#45B7D1' },
  { id: '4', name: 'Electronic', color: '#96CEB4' },
  { id: '5', name: 'Jazz', color: '#FECA57' },
  { id: '6', name: 'Classical', color: '#A8E6CF' },
  { id: '7', name: 'R&B', color: '#FF8B94' },
  { id: '8', name: 'Country', color: '#C7CEEA' },
  { id: '9', name: 'Reggae', color: '#FFD93D' },
  { id: '10', name: 'Folk', color: '#6BCF7F' },
] as const

export const PLAYER_VOLUME_STEP = 0.1
export const PLAYER_SEEK_STEP = 10 // seconds

export const SEARCH_DEBOUNCE_MS = 300
export const SEARCH_MIN_CHARACTERS = 2

export const TOAST_DURATION = 4000

export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const

export const AUDIO_FORMATS = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/flac',
] as const

export const THEME_COLORS = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
} as const

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  LIBRARY: '/library',
  LIKED: '/liked',
  PLAYLIST: '/playlist',
  GENRE: '/genre',
  ARTIST: '/artist',
  ALBUM: '/album',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const

export const STORAGE_KEYS = {
  THEME: 'sangeetx-theme',
  VOLUME: 'sangeetx-volume',
  PLAYER_STATE: 'sangeetx-player-state',
  RECENT_SEARCHES: 'sangeetx-recent-searches',
  LIKED_SONGS: 'sangeetx-liked-songs',
  PLAYLISTS: 'sangeetx-playlists',
} as const
