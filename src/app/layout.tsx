import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/layout/app-layout";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SangeetX - Modern Music Streaming Platform",
  description:
    "Discover, play, and enjoy music with SangeetX - a modern, responsive music streaming platform built with Next.js.",
  keywords: ["music", "streaming", "audio", "player", "playlist", "songs"],
  authors: [{ name: "SangeetX Team" }],
  creator: "SangeetX",
  publisher: "SangeetX",
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
    url: "https://sangeetx.com",
    title: "SangeetX - Modern Music Streaming Platform",
    description:
      "Discover, play, and enjoy music with SangeetX - a modern, responsive music streaming platform built with Next.js.",
    siteName: "SangeetX",
  },
  twitter: {
    card: "summary_large_image",
    title: "SangeetX - Modern Music Streaming Platform",
    description:
      "Discover, play, and enjoy music with SangeetX - a modern, responsive music streaming platform built with Next.js.",
    creator: "@sangeetx",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
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
        </ClerkProvider>
      </body>
    </html>
  );
}
