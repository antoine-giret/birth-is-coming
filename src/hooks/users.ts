import { DocumentReference, doc, getDoc, setDoc } from 'firebase/firestore';
import { useContext } from 'react';

import AppContext from '@/app/context';
import TUser from '@/models/user';

export type TFirebaseUser = Partial<{
  firstName: string | undefined;
  pseudo: string | undefined;
}>;

export default function useUsers() {
  const { auth, db } = useContext(AppContext);

  async function parseUser(
    email: string,
    { firstName, pseudo }: Partial<TFirebaseUser>,
  ): Promise<TUser> {
    return {
      email,
      firstName: firstName || '',
      pseudo: pseudo || '',
    };
  }

  async function getUser(email: string): Promise<{
    data: TFirebaseUser;
    docRef: DocumentReference<TFirebaseUser, TFirebaseUser>;
    user: TUser | null;
  }> {
    if (!db) throw new Error('db is undefined');

    const userDocRef = doc(db, 'users', email) as DocumentReference<TFirebaseUser, TFirebaseUser>;
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) return { docRef: userDocRef, data: {}, user: null };

    const data = userDocSnap.data();
    const user = await parseUser(email, data);

    return { docRef: userDocRef, data, user };
  }

  async function createOrUpdateUserDoc(email: string, firstName?: string): Promise<TUser> {
    if (!db) throw new Error('db is undefined');

    const { docRef: userDocRef, data, user } = await getUser(email);
    if (!user) {
      await setDoc(doc(db, 'users', email), {
        firstName,
        pseudo: firstName,
        joinedBets: [],
      });

      return { email, firstName, pseudo: firstName };
    } else {
      if (
        (firstName !== undefined && !data.firstName) ||
        (firstName !== undefined && !data.pseudo)
      ) {
        const newData: Partial<TFirebaseUser> = {};
        if (firstName !== undefined && !data.firstName) newData.firstName = firstName;
        if (firstName !== undefined && !data.pseudo) newData.pseudo = firstName;

        setDoc(userDocRef, newData, { merge: true });

        return parseUser(email, { ...data, ...newData });
      }

      return user;
    }
  }

  async function getCurrentUser(): Promise<TUser | null> {
    if (!auth) throw new Error('db is undefined');

    await auth.authStateReady();
    if (auth.currentUser?.email) {
      const { user } = await getUser(auth.currentUser.email);

      return user;
    }

    return null;
  }

  return { createOrUpdateUserDoc, getCurrentUser };
}
