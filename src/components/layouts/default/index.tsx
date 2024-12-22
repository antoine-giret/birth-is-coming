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
            'flex flex-col grow gap-6 lg:gap-9 mx-auto w-full max-w-7xl px-3 py-6 sm:py-9 lg:py-12 sm:px-6 lg:px-9',
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
