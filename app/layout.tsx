import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AICareerShield - Will AI Replace Your Career?",
  description: "Get your AI replacement risk assessment with personalized strategies to future-proof your career",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    // If no Clerk key is available (e.g., during build), render without ClerkProvider
    return (
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          {children}
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