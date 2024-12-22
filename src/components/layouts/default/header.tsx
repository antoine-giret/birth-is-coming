'use client';

import {
  Disclosure,
  Button as HeadlessUIButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { GiftIcon, UserIcon } from '@heroicons/react/24/outline';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useContext } from 'react';

import Button from '../../button';

import AppContext from '@/app/context';

export default function Header() {
  const {
    auth,
    user: { current: currentUser },
    setCurrentUser,
    setJoinedBets,
    setPendingInvitations,
  } = useContext(AppContext);

  async function handleSignOut() {
    try {
      if (!auth) throw new Error('auth is undefined');

      await signOut(auth);
      setCurrentUser(null);
      setJoinedBets(undefined);
      setPendingInvitations(undefined);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Disclosure as="header">
      <div className="bg-white flex justify-center w-full shrink-0">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            <div className="flex items-center">
              <Link className="flex items-center gap-3 shrink-0" href="/">
                <GiftIcon className="w-5" />
                <span className="text-xl font-bold">Bébé arrive</span>
              </Link>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {currentUser === null ? (
                <Button
                  isRouterLink
                  color="primary"
                  href="/sign-in"
                  label="Se connecter"
                  variant="contained"
                />
              ) : (
                currentUser && (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton
                        className="relative flex max-w-xs items-center rounded-full bg-indigo-500 hover:bg-indigo-400 text-sm justify-center w-8 h-8 overflow-hidden"
                        disabled={currentUser === undefined}
                      >
                        <span className="absolute -inset-1.5"></span>
                        <span className="sr-only">Open user menu</span>
                        <UserIcon className="w-4 text-white" />
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <MenuItem>
                        <Link
                          className="block px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none"
                          href="/bets"
                        >
                          Mon profil
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <HeadlessUIButton
                          disabled={!auth}
                          onClick={handleSignOut}
                          className="flex w-full px-4 py-2 justify-start text-sm hover:bg-gray-100 hover:outline-none"
                        >
                          Se déconnecter
                        </HeadlessUIButton>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
