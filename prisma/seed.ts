import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.favorite.deleteMany();
  await prisma.playHistory.deleteMany();
  await prisma.playlistSong.deleteMany();
  await prisma.playlist.deleteMany();
  await prisma.song.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();
  await prisma.genre.deleteMany();

  // Create genres
  const genres = await Promise.all([
    prisma.genre.create({
      data: {
        name: "Pop",
        description: "Popular music",
        color: "#FF6B6B",
        songCount: 0,
      },
    }),
    prisma.genre.create({
      data: {
        name: "Rock",
        description: "Rock music",
        color: "#4ECDC4",
        songCount: 0,
      },
    }),
    prisma.genre.create({
      data: {
        name: "Hip-Hop",
        description: "Hip-hop and rap music",
        color: "#45B7D1",
        songCount: 0,
      },
    }),
    prisma.genre.create({
      data: {
        name: "Electronic",
        description: "Electronic and dance music",
        color: "#96CEB4",
        songCount: 0,
      },
    }),
    prisma.genre.create({
      data: {
        name: "Jazz",
        description: "Jazz music",
        color: "#FFEAA7",
        songCount: 0,
      },
    }),
    prisma.genre.create({
      data: {
        name: "Classical",
        description: "Classical music",
        color: "#DDA0DD",
        songCount: 0,
      },
    }),
  ]);

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "user_admin_seed_id",
        email: "admin@sangeetx.com",
        username: "admin",
        displayName: "Admin User",
        isAdmin: true,
      },
    }),
    prisma.user.create({
      data: {
        id: "user_john_seed_id",
        email: "john@example.com",
        username: "john_doe",
        displayName: "John Doe",
        isAdmin: false,
      },
    }),
    prisma.user.create({
      data: {
        id: "user_jane_seed_id",
        email: "jane@example.com",
        username: "jane_smith",
        displayName: "Jane Smith",
        isAdmin: false,
      },
    }),
  ]);

  // Create sample artists
  const artists = await Promise.all([
    prisma.artist.create({
      data: {
        name: "Queen",
        bio: "Legendary British rock band formed in London in 1970.",
        avatar:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        verified: true,
        songCount: 1,
        playCount: 1234567,
      },
    }),
    prisma.artist.create({
      data: {
        name: "Ed Sheeran",
        bio: "English singer-songwriter known for his acoustic pop songs.",
        avatar:
          "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
        verified: true,
        songCount: 1,
        playCount: 987654,
      },
    }),
    prisma.artist.create({
      data: {
        name: "The Weeknd",
        bio: "Canadian singer, songwriter, and record producer.",
        avatar:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
        verified: true,
        songCount: 1,
        playCount: 876543,
      },
    }),
    prisma.artist.create({
      data: {
        name: "Adele",
        bio: "English singer-songwriter known for her powerful vocals.",
        avatar:
          "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
        verified: true,
        songCount: 1,
        playCount: 765432,
      },
    }),
    prisma.artist.create({
      data: {
        name: "Eagles",
        bio: "American rock band formed in Los Angeles in 1971.",
        avatar:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        verified: true,
        songCount: 1,
        playCount: 654321,
      },
    }),
  ]);

  // Create sample songs
  const songs = await Promise.all([
    prisma.song.create({
      data: {
        title: "Bohemian Rhapsody",
        artistId: artists[0].id,
        album: "A Night at the Opera",
        genre: "Rock",
        year: 1975,
        duration: 355,
        coverUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        popularity: 95,
        playCount: 1234567,
      },
    }),
    prisma.song.create({
      data: {
        title: "Shape of You",
        artistId: artists[1].id,
        album: "÷ (Divide)",
        genre: "Pop",
        year: 2017,
        duration: 233,
        coverUrl:
          "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400",
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        popularity: 88,
        playCount: 987654,
      },
    }),
    prisma.song.create({
      data: {
        title: "Blinding Lights",
        artistId: artists[2].id,
        album: "After Hours",
        genre: "Pop",
        year: 2019,
        duration: 200,
        coverUrl:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400",
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        popularity: 92,
        playCount: 876543,
      },
    }),
    prisma.song.create({
      data: {
        title: "Someone Like You",
        artistId: artists[3].id,
        album: "21",
        genre: "Pop",
        year: 2011,
        duration: 285,
        coverUrl:
          "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        popularity: 90,
        playCount: 765432,
      },
    }),
    prisma.song.create({
      data: {
        title: "Hotel California",
        artistId: artists[4].id,
        album: "Hotel California",
        genre: "Rock",
        year: 1976,
        duration: 391,
        coverUrl:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        popularity: 94,
        playCount: 654321,
      },
    }),
  ]);

  // Create sample playlists
  const playlist1 = await prisma.playlist.create({
    data: {
      name: "My Favorites",
      description: "My favorite songs of all time",
      userId: users[1].id,
      isPublic: true,
    },
  });

  const playlist2 = await prisma.playlist.create({
    data: {
      name: "Road Trip Mix",
      description: "Perfect songs for a long drive",
      userId: users[2].id,
      isPublic: true,
    },
  });

  // Add songs to playlists
  await Promise.all([
    // Add songs to "My Favorites"
    prisma.playlistSong.create({
      data: {
        playlistId: playlist1.id,
        songId: songs[0].id,
        position: 1,
      },
    }),
    prisma.playlistSong.create({
      data: {
        playlistId: playlist1.id,
        songId: songs[2].id,
        position: 2,
      },
    }),
    prisma.playlistSong.create({
      data: {
        playlistId: playlist1.id,
        songId: songs[4].id,
        position: 3,
      },
    }),
    // Add songs to "Road Trip Mix"
    prisma.playlistSong.create({
      data: {
        playlistId: playlist2.id,
        songId: songs[1].id,
        position: 1,
      },
    }),
    prisma.playlistSong.create({
      data: {
        playlistId: playlist2.id,
        songId: songs[3].id,
        position: 2,
      },
    }),
    prisma.playlistSong.create({
      data: {
        playlistId: playlist2.id,
        songId: songs[4].id,
        position: 3,
      },
    }),
  ]);

  // Create sample favorites
  await Promise.all([
    prisma.favorite.create({
      data: {
        userId: users[1].id,
        songId: songs[0].id,
      },
    }),
    prisma.favorite.create({
      data: {
        userId: users[1].id,
        songId: songs[2].id,
      },
    }),
    prisma.favorite.create({
      data: {
        userId: users[2].id,
        songId: songs[1].id,
      },
    }),
  ]);

  // Update genre song counts
  for (const genre of genres) {
    const songCount = await prisma.song.count({
      where: { genre: genre.name },
    });
    await prisma.genre.update({
      where: { id: genre.id },
      data: { songCount },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`📊 Created ${genres.length} genres`);
  console.log(`🎤 Created ${artists.length} artists`);
  console.log(`👥 Created ${users.length} users`);
  console.log(`🎵 Created ${songs.length} songs`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
