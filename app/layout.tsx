import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Providers from './provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | MovieVerse',
    default: 'MovieVerse — Discover Movies',
  },
  description: 'Browse trending, popular, and top rated movies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={inter.variable}>
      <body className='bg-neutral-950 text-neutral-100 antialiased min-h-screen'>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <footer className='text-center py-8 text-xs text-neutral-600 border-t border-neutral-800 mt-12'>
            Data provided by TMDB
          </footer>
        </Providers>
      </body>
    </html>
  );
}
