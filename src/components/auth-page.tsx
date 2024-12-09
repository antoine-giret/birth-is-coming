'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

import Loading from './layouts/loading';

import AppContext from '@/app/context';

export default function AuthPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    navigation: { requestedPath },
    user: { current: currentUser },
  } = useContext(AppContext);

  useEffect(() => {
    if (currentUser === null) {
      requestedPath.current = pathname;
      router.replace('/sign-in');
    }
  }, [currentUser]);

  if (currentUser === null) return <></>;

  if (currentUser === undefined) return <Loading />;

  return <>{children}</>;
}
