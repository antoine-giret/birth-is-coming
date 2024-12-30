'use client';

import { useContext } from 'react';

import AppContext from '../../context';

import AuthPage from '@/components/auth-page';
import DefaultLayout from '@/components/layouts/default';
import PageTitle from '@/components/page-title';

export default function NewBetPage() {
  const {
    user: { current: currentUser },
  } = useContext(AppContext);

  return (
    <AuthPage>
      {currentUser && (
        <DefaultLayout>
          <PageTitle backPath="/bets" text="Lancez les paris" />
        </DefaultLayout>
      )}
    </AuthPage>
  );
}
