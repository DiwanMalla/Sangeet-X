import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/layout/app-layout";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SangeetX - Modern Music Streaming Platform",
  description:
    "Discover, stream, and enjoy unlimited music with SangeetX. A modern music streaming platform featuring high-quality audio, curated playlists, artist discovery, and social music sharing. Join millions of music lovers worldwide.",
  keywords: [
    "music streaming",
    "online music player",
    "free music",
    "music platform",
    "audio streaming",
    "playlist creator",
    "music discovery",
    "song player",
    "music library",
    "artist discovery",
    "music sharing",
    "high quality audio",
    "music collection",
    "streaming service",
    "digital music",
    "music app",
    "web music player",
    "music community",
    "karaoke",
    "subtitles",
    "lyrics",
    "music search",
    "trending songs",
    "new releases",
    "popular music",
    "indie music",
    "electronic music",
    "hip hop",
    "rock music",
    "pop music",
    "classical music",
    "world music",
  ],
  authors: [{ name: "SangeetX Team", url: "https://sangeetx.online" }],
  creator: "SangeetX",
  publisher: "SangeetX",
  category: "Entertainment",
  classification: "Music Streaming Platform",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_GB", "en_CA", "en_AU"],
    url: "https://sangeetx.online",
    title: "SangeetX - Stream Music Like Never Before",
    description:
      "Experience the future of music streaming with SangeetX. Discover new artists, create playlists, enjoy high-quality audio, and connect with a global music community.",
    siteName: "SangeetX",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SangeetX - Modern Music Streaming Platform",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sangeetx",
    creator: "@sangeetx",
    title: "SangeetX - Stream Music Like Never Before",
    description:
      "Discover unlimited music, create playlists, and enjoy high-quality streaming on SangeetX. Join the music revolution today!",
    images: ["/twitter-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://sangeetx.online",
  },
  verification: {
    // Add your Google Search Console verification code here when you get it
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="coverage" content="worldwide" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SangeetX" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="SangeetX" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Structured Data for Music Platform */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "SangeetX",
              description:
                "Modern music streaming platform for discovering, playing, and sharing music",
              url: "https://sangeetx.online",
              applicationCategory: "MusicApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "SangeetX Team",
              },
              featureList: [
                "Music Streaming",
                "Playlist Creation",
                "Artist Discovery",
                "High Quality Audio",
                "Social Sharing",
                "Karaoke Features",
                "Music Search",
              ],
            }),
          }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Preload critical resources */}
        <link rel="dns-prefetch" href="//sangeetx.online" />
        <link rel="preconnect" href="https://sangeetx.online" />
      </head>
      <body className={inter.className}>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          signInUrl="/login"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          afterSignUpUrl="/"
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: "#8B5CF6",
              colorBackground: "#0F172A",
              colorInputBackground: "#1E293B",
              colorInputText: "#F8FAFC",
            },
          }}
        >
          <AppLayout>
            <div className="min-h-screen bg-background text-foreground">
              {children}
            </div>
          </AppLayout>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
