'use client';

import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

import AppContext from '@/app/context';

export default function AuthPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const {
    user: { current: currentUser },
  } = useContext(AppContext);

  useEffect(() => {
    if (currentUser === null) router.replace('/sign-in');
  }, [currentUser]);

  if (currentUser === null) return <></>;

  return <>{children}</>;
}
