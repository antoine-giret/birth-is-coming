'use client';

import { FirebaseOptions, initializeApp } from 'firebase/app';
import { User, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppContext from './context';

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
  const [initialized] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null | undefined>();
  const requestedPath = useRef(null);

  useEffect(() => {
    getCurrentUser();
  }, [initialized]);

  async function getCurrentUser() {
    try {
      await auth.authStateReady();
      setCurrentUser(auth.currentUser);
    } catch (err) {
      console.error(err);
      setCurrentUser(null);
    }
  }

  return (
    <AppContext.Provider
      value={{
        auth,
        db,
        navigation: { requestedPath },
        user: { current: currentUser },
        setCurrentUser,
      }}
    >
      {children}
      <ToastContainer closeButton={false} position="bottom-center" style={{ width: 500 }} />
    </AppContext.Provider>
  );
}
