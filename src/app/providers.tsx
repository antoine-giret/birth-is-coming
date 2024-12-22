'use client';

import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppContext from './context';

import useBets from '@/hooks/bets';
import useUsers from '@/hooks/users';
import TBet from '@/models/bet';
import TUser from '@/models/user';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_Id,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [currentUser, setCurrentUser] = useState<TUser | null | undefined>();
  const [joinedBets, setJoinedBets] = useState<TBet[] | undefined>();
  const [pendingInvitations, setPendingInvitations] = useState<TBet[] | undefined>();
  const requestedPath = useRef(null);

  return (
    <AppContext.Provider
      value={{
        auth,
        db,
        navigation: { requestedPath },
        user: { current: currentUser, joinedBets, pendingInvitations },
        setCurrentUser,
        setJoinedBets,
        setPendingInvitations,
      }}
    >
      <App>{children}</App>
    </AppContext.Provider>
  );
}

function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setCurrentUser, setJoinedBets, setPendingInvitations } = useContext(AppContext);
  const [initialized] = useState(true);
  const { getCurrentUser: _getCurrentUser } = useUsers();
  const { getBets } = useBets();

  useEffect(() => {
    if (initialized) getCurrentUser();
  }, [initialized]);

  async function getCurrentUser() {
    try {
      const user = await _getCurrentUser();
      setCurrentUser(user);
      if (user) {
        const [pendingInvitations, joinedBets] = await Promise.all([
          getBets({ user, status: 'pending' }),
          getBets({ user, status: 'accepted' }),
        ]);

        setJoinedBets(joinedBets);
        setPendingInvitations(pendingInvitations);
      }
    } catch (err) {
      console.error(err);
      setCurrentUser(null);
    }
  }

  return (
    <>
      {children}
      <ToastContainer closeButton={false} position="bottom-center" style={{ width: 500 }} />
    </>
  );
}
