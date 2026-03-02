import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'THELAIM',
  description: 'Global Fashion Export Specialist',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
