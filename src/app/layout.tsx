import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';
import { Providers } from './providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Bébé arrive',
  description: '🚀 Lancez les paris sur la naissance de votre futur bébé.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full bg-gray-100" lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
