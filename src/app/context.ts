'use client';

import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Dispatch, SetStateAction, createContext, createRef } from 'react';

import TBet from '@/models/bet';
import TUser from '@/models/user';

type TUserContext = {
  current: TUser | null | undefined;
  joinedBets: TBet[] | undefined;
  pendingInvitations: TBet[] | undefined;
};

type TAppContext = {
  auth?: Auth;
  db?: Firestore;
  navigation: { requestedPath: React.RefObject<string | null> };
  user: TUserContext;
  setCurrentUser: Dispatch<SetStateAction<TUser | null | undefined>>;
  setJoinedBets: Dispatch<SetStateAction<TBet[] | undefined>>;
  setPendingInvitations: Dispatch<SetStateAction<TBet[] | undefined>>;
};

const AppContext = createContext<TAppContext>({
  navigation: { requestedPath: createRef() },
  user: { current: undefined, joinedBets: undefined, pendingInvitations: undefined },
  setCurrentUser: () => undefined,
  setJoinedBets: () => undefined,
  setPendingInvitations: () => undefined,
});

export default AppContext;
