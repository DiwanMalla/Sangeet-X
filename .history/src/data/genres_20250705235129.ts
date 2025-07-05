import { Genre } from '@/lib/types'

export const mockGenres: Genre[] = [
  {
    id: '1',
    name: 'Pop',
    description: 'Popular music with catchy melodies and mainstream appeal',
    color: '#FF6B6B',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    popularity: 95,
    songCount: 1250,
  },
  {
    id: '2',
    name: 'Rock',
    description: 'Guitar-driven music with strong rhythms and powerful vocals',
    color: '#4ECDC4',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    popularity: 88,
    songCount: 980,
  },
  {
    id: '3',
    name: 'Hip-Hop',
    description: 'Rhythmic and rhyming speech over strong beats',
    color: '#45B7D1',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    popularity: 92,
    songCount: 1100,
  },
  {
    id: '4',
    name: 'Electronic',
    description: 'Music produced using electronic instruments and technology',
    color: '#96CEB4',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    popularity: 78,
    songCount: 750,
  },
  {
    id: '5',
    name: 'Jazz',
    description: 'Improvisational music with complex harmonies and rhythms',
    color: '#FECA57',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    popularity: 65,
    songCount: 520,
  },
  {
    id: '6',
    name: 'Classical',
    description: 'Traditional orchestral music with complex compositions',
    color: '#A8E6CF',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    popularity: 58,
    songCount: 480,
  },
  {
    id: '7',
    name: 'R&B',
    description: 'Rhythm and blues with soulful vocals and smooth melodies',
    color: '#FF8B94',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    popularity: 82,
    songCount: 680,
  },
  {
    id: '8',
    name: 'Country',
    description: 'Folk-influenced music with storytelling lyrics',
    color: '#C7CEEA',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    popularity: 72,
    songCount: 620,
  },
  {
    id: '9',
    name: 'Reggae',
    description: 'Jamaican music with distinctive rhythm and social themes',
    color: '#FFD93D',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    popularity: 68,
    songCount: 380,
  },
  {
    id: '10',
    name: 'Folk',
    description: 'Traditional acoustic music with storytelling elements',
    color: '#6BCF7F',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    popularity: 55,
    songCount: 420,
  },
  {
    id: '11',
    name: 'Blues',
    description: 'Melancholic music with twelve-bar structure and emotional expression',
    color: '#74B9FF',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    popularity: 62,
    songCount: 350,
  },
  {
    id: '12',
    name: 'Alternative',
    description: 'Non-mainstream rock music with experimental elements',
    color: '#FD79A8',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    popularity: 75,
    songCount: 580,
  },
  {
    id: '13',
    name: 'Indie',
    description: 'Independent music with artistic freedom and creativity',
    color: '#FDCB6E',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    popularity: 71,
    songCount: 490,
  },
  {
    id: '14',
    name: 'Punk',
    description: 'Fast, aggressive music with anti-establishment themes',
    color: '#E84393',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    popularity: 59,
    songCount: 320,
  },
  {
    id: '15',
    name: 'Soul',
    description: 'Emotionally expressive music with gospel influences',
    color: '#00B894',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    popularity: 67,
    songCount: 410,
  },
  {
    id: '16',
    name: 'Metal',
    description: 'Heavy, aggressive music with powerful instrumentation',
    color: '#636E72',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    popularity: 64,
    songCount: 440,
  },
]

export const getPopularGenres = (): Genre[] => {
  return mockGenres.sort((a, b) => b.popularity - a.popularity).slice(0, 8)
}

export const getGenreByName = (name: string): Genre | undefined => {
  return mockGenres.find(genre => genre.name.toLowerCase() === name.toLowerCase())
}

export const getGenreById = (id: string): Genre | undefined => {
  return mockGenres.find(genre => genre.id === id)
}
