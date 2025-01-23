'use client';

import {
  CheckCircleIcon,
  Cog6ToothIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import AppContext from '../../context';
import BetForm from '../new/form';

import Bets from './bets';
import Participants from './participants';
import RemoveDialog from './remove-dialog';

import AuthPage from '@/components/auth-page';
import Button from '@/components/button';
import DefaultLayout from '@/components/layouts/default';
import Loading from '@/components/layouts/loading';
import PageTitle from '@/components/page-title';
import Tabs from '@/components/tabs';
import useBets from '@/hooks/bets';
import TBet from '@/models/bet';
import TUser from '@/models/user';

const tabs = ['bets', 'participants', 'config'] as const;
type TTab = (typeof tabs)[number];

const tabsMap: {
  [key in TTab]: {
    Icon?: React.ForwardRefExoticComponent<
      React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
        title?: string;
        titleId?: string;
      } & React.RefAttributes<SVGSVGElement>
    >;
    label: React.ReactNode;
  };
} = {
  bets: { label: 'Paris' },
  participants: { label: 'Participants' },
  config: { label: 'Configuration', Icon: Cog6ToothIcon },
};

export default function BetPage({ params }: { params: Promise<{ id: string }> }) {
  const [initialized] = useState(true);
  const [bet, setBet] = useState<TBet | null>();
  const [isAdmin, setIsAdmin] = useState(false);
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [selectedTab, selectTab] = useState<TTab>(getTabQueryParam());
  const [removeDialogOpen, toggleRemoveDialog] = useState(false);
  const {
    user: { current: currentUser, joinedBets },
    setJoinedBets,
  } = useContext(AppContext);
  const router = useRouter();
  const { getBet: _getBet } = useBets();

  useEffect(() => {
    if (initialized && currentUser) getBet(currentUser);
  }, [initialized, currentUser]);

  useEffect(() => {
    selectTab(getTabQueryParam());
  }, [tabParam]);

  function getTabQueryParam(): TTab {
    if (tabParam === 'participants' || tabParam === 'config') return tabParam;
    return 'bets';
  }

  async function getBet(currentUser: TUser) {
    try {
      const id = (await params).id;
      const bet = await _getBet(id);
      setBet(bet);
      setIsAdmin(
        bet.participants?.find(({ email }) => currentUser.email.localeCompare(email) === 0)
          ?.isAdmin || false,
      );
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
      router.push(`/bets`);
    }
  }

  function handleRemoveDialogClose(removed: boolean) {
    toggleRemoveDialog(false);

    if (removed) {
      setTimeout(() => {
        if (bet && joinedBets) {
          const newBets = [...joinedBets];
          const index = newBets.findIndex(({ id }) => bet.id === id);
          newBets.splice(index, 1);

          setJoinedBets(newBets);
        }

        toast.success(<span className="text-sm">Le pari a bien été supprimé</span>, {
          icon: () => <CheckCircleIcon style={{ color: '#07bc0c' }} />,
        });
        router.push(`/bets`);
      }, 300);
    }
  }

  if (!bet) return <Loading />;

  const {
    config: { firstParentFirstName, secondParentFirstName },
    results,
  } = bet;

  return (
    <>
      <AuthPage>
        {currentUser && (
          <DefaultLayout>
            <PageTitle
              backPath="/bets"
              text={
                results
                  ? `${results.firstName} est ${results.gender === 'male' ? 'né' : 'née'}`
                  : `Bébé de ${firstParentFirstName} et ${secondParentFirstName}`
              }
            />
            {isAdmin && (
              <Tabs
                selectedKey={selectedTab}
                items={tabs.map((key) => ({ key, ...tabsMap[key] }))}
              />
            )}
            {!isAdmin || selectedTab === 'bets' ? (
              <Bets bet={bet} isAdmin={isAdmin} toggleRemoveDialog={toggleRemoveDialog} />
            ) : selectedTab === 'participants' ? (
              <Participants bet={bet} />
            ) : selectedTab === 'config' ? (
              <>
                <BetForm bet={bet} />
                <div className="flex flex-col items-center">
                  <Button
                    color="error"
                    icon={<TrashIcon className="w-5 text-red-500" />}
                    label="Supprimer"
                    onClick={() => toggleRemoveDialog(true)}
                    variant="outlined"
                    size="small"
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </DefaultLayout>
        )}
      </AuthPage>
      <RemoveDialog bet={bet} open={removeDialogOpen} onClose={handleRemoveDialogClose} />
    </>
  );
}
