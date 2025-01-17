'use client';

import {
  Button as HeadlessUIButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import {
  CheckCircleIcon,
  Cog6ToothIcon,
  ExclamationCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import AppContext from '../../context';

import RemoveDialog from './remove-dialog';

import AuthPage from '@/components/auth-page';
import DefaultLayout from '@/components/layouts/default';
import Loading from '@/components/layouts/loading';
import PageTitle from '@/components/page-title';
import useBets from '@/hooks/bets';
import TBet from '@/models/bet';
import TUser from '@/models/user';

export default function BetPage({ params }: { params: Promise<{ id: string }> }) {
  const [initialized] = useState(true);
  const [bet, setBet] = useState<TBet | null>();
  const [isAdmin, setIsAdmin] = useState<boolean>();
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

  async function getBet(currentUser: TUser) {
    try {
      const id = (await params).id;
      const bet = await _getBet(id);
      setBet(bet);
      setIsAdmin(
        bet.users?.find(({ email }) => currentUser.email.localeCompare(email) === 0)?.isAdmin ||
          false,
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
              actions={
                isAdmin && (
                  <Menu as="div" className="relative ml-3">
                    <MenuButton
                      className="relative px-2.5 py-1.5 flex gap-2 items-center justify-center rounded-md font-semibold ring-1 ring-inset ring-indigo-300 hover:bg-indigo/10"
                      disabled={currentUser === undefined}
                    >
                      <span className="absolute -inset-1.5"></span>
                      <span className="sr-only">Ouvrir le menu de configuration</span>
                      <span className="text-sm">Configurer</span>
                      <Cog6ToothIcon className="w-6 text-indigo-500" />
                    </MenuButton>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <MenuItem>
                        <Link
                          className="flex gap-2 items-center justify-start w-full px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none"
                          href={`/bets/${bet.id}/update`}
                        >
                          <PencilIcon className="w-5" />
                          Modifier
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <HeadlessUIButton
                          className="flex gap-2 items-center justify-start w-full px-4 py-2 text-sm hover:bg-gray-100 hover:outline-none"
                          onClick={() => toggleRemoveDialog(true)}
                        >
                          <TrashIcon className="w-5 text-red-500" />
                          Supprimer
                        </HeadlessUIButton>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                )
              }
              backPath="/bets"
              text={
                results
                  ? `${results.firstName} est ${results.gender === 'male' ? 'né' : 'née'}`
                  : `Bébé de ${firstParentFirstName} et ${secondParentFirstName}`
              }
            />
          </DefaultLayout>
        )}
      </AuthPage>
      <RemoveDialog bet={bet} open={removeDialogOpen} onClose={handleRemoveDialogClose} />
    </>
  );
}
