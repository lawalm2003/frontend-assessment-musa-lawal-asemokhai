import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import './globals.css';
import Providers from './provider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | MovieDB',
    default: 'MovieDB — Discover Movies',
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
          <div className='pt-1 md:pt-0'>
            <main>{children}</main>
            <footer className='text-center py-8 text-xs text-neutral-600 border-t border-neutral-800 mt-12'>
              Data provided by TMDB
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
