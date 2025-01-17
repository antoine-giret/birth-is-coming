'use client';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import BetForm from '../../new/form';

import AppContext from '@/app/context';
import AuthPage from '@/components/auth-page';
import DefaultLayout from '@/components/layouts/default';
import Loading from '@/components/layouts/loading';
import PageTitle from '@/components/page-title';
import useBets from '@/hooks/bets';
import TBet from '@/models/bet';
import TUser from '@/models/user';

export default function UpdateBetPage({ params }: { params: Promise<{ id: string }> }) {
  const [initialized] = useState(true);
  const [bet, setBet] = useState<TBet | null>();
  const {
    user: { current: currentUser },
  } = useContext(AppContext);
  const router = useRouter();
  const { getBet: _getBet } = useBets();

  useEffect(() => {
    if (initialized && currentUser) getBet(currentUser);
  }, [initialized, currentUser]);

  async function getBet(currentUser: TUser) {
    try {
      const id = (await params).id;
      const bet = await _getBet(id);
      const isAdmin =
        bet.users?.find(({ email }) => currentUser.email.localeCompare(email) === 0)?.isAdmin ||
        false;

      if (!isAdmin) throw new Error('user is not admin');

      setBet(bet);
    } catch (err) {
      console.error(err);
      toast.error(
        <span className="text-sm">Vous n&apos;avez pas accès à la configuration de ce pari</span>,
        {
          icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
        },
      );
      router.push(`/bets`);
    }
  }

  if (!bet) return <Loading />;

  return (
    <AuthPage>
      {currentUser && (
        <DefaultLayout>
          <PageTitle backPath="/bets" text="Configurez votre pari" />
          <BetForm bet={bet} />
        </DefaultLayout>
      )}
    </AuthPage>
  );
}
