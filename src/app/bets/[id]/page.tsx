'use client';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import AppContext from '../../context';

import AuthPage from '@/components/auth-page';
import DefaultLayout from '@/components/layouts/default';
import Loading from '@/components/layouts/loading';
import PageTitle from '@/components/page-title';
import useBets from '@/hooks/bets';
import TBet from '@/models/bet';

export default function BetPage({ params }: { params: Promise<{ id: string }> }) {
  const [initialized] = useState(true);
  const [bet, setBet] = useState<TBet | null>();
  const {
    user: { current: currentUser },
  } = useContext(AppContext);
  const { getBet: _getBet } = useBets();

  useEffect(() => {
    if (initialized) getBet();
  }, [initialized]);

  async function getBet() {
    try {
      const id = (await params).id;
      const bet = await _getBet(id);
      setBet(bet);
    } catch (err) {
      console.error(err);
      toast.error(
        <span className="text-sm">
          Vous n&apos;avez pas accès à ce pari ou il n&apos;existe pas
        </span>,
        {
          icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
        },
      );
    }
  }

  if (!bet) return <Loading />;

  const {
    config: { motherFirstName, fatherFirstName },
    results,
  } = bet;

  return (
    <AuthPage>
      {currentUser && (
        <DefaultLayout>
          <PageTitle
            backPath="/bets"
            text={
              results
                ? `${results.firstName} est ${results.gender === 'male' ? 'né' : 'née'}`
                : `Bébé de ${motherFirstName} et ${fatherFirstName}`
            }
          />
        </DefaultLayout>
      )}
    </AuthPage>
  );
}
