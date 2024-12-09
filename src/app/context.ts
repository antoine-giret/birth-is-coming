'use client';

import { Auth, User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Dispatch, SetStateAction, createContext, createRef } from 'react';

type TUserContext = {
  current: User | null | undefined;
};

type TAppContext = {
  auth?: Auth;
  db?: Firestore;
  navigation: { requestedPath: React.RefObject<string | null> };
  user: TUserContext;
  setCurrentUser: Dispatch<SetStateAction<User | null | undefined>>;
};

const AppContext = createContext<TAppContext>({
  navigation: { requestedPath: createRef() },
  user: { current: undefined },
  setCurrentUser: () => undefined,
});

export default AppContext;
