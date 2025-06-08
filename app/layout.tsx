import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://willaireplace.me"),
  title: "Career Guard - Will AI Replace Your Career?",
  description: "Get your AI replacement risk assessment with personalized strategies to future-proof your career",
  keywords: ["AI career risk", "career assessment", "AI replacement", "future-proof career", "career protection"],
  authors: [{ name: "Career Guard" }],
  creator: "Career Guard",
  publisher: "Career Guard",
  openGraph: {
    title: "Career Guard - Will AI Replace Your Career?",
    description: "Get your AI replacement risk assessment with personalized strategies to future-proof your career",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://willaireplace.me",
    siteName: "Career Guard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Career Guard - AI Career Risk Assessment",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Guard - Will AI Replace Your Career?",
    description: "Get your AI replacement risk assessment with personalized strategies to future-proof your career",
    images: ["/twitter-card.png"],
  },
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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Add debug logging
  console.log('Clerk publishable key available:', !!publishableKey);
  console.log('Clerk key prefix:', publishableKey?.substring(0, 7));

  if (!publishableKey) {
    console.error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
    // If no Clerk key is available (e.g., during build), render without ClerkProvider
    return (
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 mb-4">Configuration Error</h1>
              <p className="text-slate-600">Authentication is not properly configured.</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
          socialButtonsBlockButton: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50',
          socialButtonsBlockButtonText: 'font-medium',
          formFieldInput: 'border border-slate-300 rounded-md',
          footerActionLink: 'text-primary hover:text-primary/90'
        }
      }}
    >
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
} 