import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from '@/components/providers';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'SystemSketch - Speak System Design, See Architecture',
    template: '%s | SystemSketch',
  },
  description:
    'Build system architecture through natural language using Tambo Generative UI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}