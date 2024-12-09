'use client';

import { useContext, useEffect } from 'react';

import Footer from './footer';
import Header from './header';

import AppContext from '@/app/context';

export default function DefaultLayout({
  isPublic,
  justifyCenter,
  children,
}: Readonly<{
  children: React.ReactNode;
  justifyCenter?: boolean;
  isPublic?: boolean;
}>) {
  const {
    navigation: { requestedPath },
  } = useContext(AppContext);

  useEffect(() => {
    if (isPublic) requestedPath.current = null;
  }, [isPublic]);

  return (
    <div className="flex flex-col min-h-full font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="flex flex-col grow">
        <div
          className={[
            'flex flex-col grow mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8',
            justifyCenter ? 'md:justify-center' : '',
          ].join(' ')}
        >
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
