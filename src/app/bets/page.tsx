'use client';

import { useContext } from 'react';

import AppContext from '../context';

import DoneBets from './done-bets';
import OngoingBets from './ongoing-bets';
import PendingInvitations from './pending-invitations';

import AuthPage from '@/components/auth-page';
import DefaultLayout from '@/components/layouts/default';
import PageTitle from '@/components/page-title';

export default function BetsPage() {
  const {
    user: { current: currentUser },
  } = useContext(AppContext);

  return (
    <AuthPage>
      {currentUser && (
        <DefaultLayout>
          <PageTitle text={`Bienvenue ${currentUser.firstName || currentUser.pseudo} 👋`} />
          <PendingInvitations />
          <OngoingBets />
          <DoneBets />
        </DefaultLayout>
      )}
    </AuthPage>
  );
}
