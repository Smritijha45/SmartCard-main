import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://smartcard.app'),
  title: "SmartCard — Your Professional Identity, In One Link",
  description: "Create, customize and share your professional digital business card with SmartCard.",
  keywords: ["digital business card", "smartcard", "virtual card", "vCard", "networking", "QR code business card", "contact sharing"],
  authors: [{ name: "SmartCard" }],
  creator: "SmartCard",
  openGraph: {
    title: "SmartCard — Your Professional Identity, In One Link",
    description: "Create, customize and share your professional digital business card with SmartCard.",
    url: "https://smartcard.app",
    siteName: "SmartCard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SmartCard — Your Professional Identity, In One Link",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartCard — Your Professional Identity, In One Link",
    description: "Create a beautiful digital business card, share it anywhere, and make every connection count.",
    images: ["/og-image.png"],
    creator: "@smartcard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('smartcard_theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var theme = (!saved || saved === 'system') ? (prefersDark ? 'dark' : 'light') : saved;
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
                document.documentElement.setAttribute('data-theme', theme);
                document.documentElement.setAttribute('data-theme-mode', saved || 'system');
                document.documentElement.style.colorScheme = theme;
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased transition-colors duration-150">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
