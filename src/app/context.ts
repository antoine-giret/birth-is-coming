'use client';

import { Auth, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Dispatch, SetStateAction, createContext } from 'react';

type TUserContext = {
  current: User | null | undefined;
};

type TAppContext = {
  auth?: Auth;
  db?: Firestore;
  user: TUserContext;
  setCurrentUser: Dispatch<SetStateAction<User | null | undefined>>;
};

const AppContext = createContext<TAppContext>({
  user: { current: undefined },
  setCurrentUser: () => undefined,
});

export default AppContext;
