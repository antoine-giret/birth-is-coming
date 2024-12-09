'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

import Loading from './layouts/loading';

import AppContext from '@/app/context';

export default function GuestPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const {
    navigation: { requestedPath },
    user: { current: currentUser },
  } = useContext(AppContext);

  useEffect(() => {
    if (currentUser) {
      router.replace(requestedPath.current || '/bets');
      requestedPath.current = null;
    }
  }, [currentUser]);

  if (currentUser) return <></>;

  if (currentUser === undefined) return <Loading />;

  return <>{children}</>;
}
