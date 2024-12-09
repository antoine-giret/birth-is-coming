'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

import AppContext from '@/app/context';

export default function GuestPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const {
    user: { current: currentUser },
  } = useContext(AppContext);

  useEffect(() => {
    if (currentUser) router.replace('/bets');
  }, [currentUser]);

  if (currentUser) return <></>;

  return <>{children}</>;
}
