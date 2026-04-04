import type { Metadata } from 'next';
import HomeClient from '@/components/Clients/HomeClient';

export const metadata: Metadata = {
  title: 'MovieDB — Discover Movies',
};

export default function HomePage() {
  return <HomeClient />;
}
