import {
  DocumentReference,
  DocumentSnapshot,
  Query,
  QueryDocumentSnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useContext } from 'react';

import AppContext from '@/app/context';
import TBet, { TBetConfig, TBetResults, TBetUser, TUserStatus } from '@/models/bet';
import TUser from '@/models/user';

export type TFirebaseBetResults = Partial<{
  birthDate: Timestamp;
  firstName: string;
  gender: string;
  size: number;
  weight: number;
}>;

type TFirebaseBetConfig = Partial<{
  firstParentFirstName: string;
  gender: string;
  secondParentFirstName: string;
  scheduledDate: Timestamp;
}>;

export type TFirebaseBet = Partial<{
  config: TFirebaseBetConfig;
  results: TFirebaseBetResults;
}>;

export type TFirebaseInvitation = {
  betId: string;
  isAdmin?: boolean;
  status: TUserStatus;
  userEmail: string;
};

export default function useBets() {
  const { db } = useContext(AppContext);

  function parseResults(results: TFirebaseBetResults | undefined): TBetResults {
    if (!results) return null;

    const { birthDate, firstName, gender, size, weight } = results;
    if (!birthDate || !firstName || (gender !== 'male' && gender !== 'female') || !size || !weight)
      return null;

    return {
      birthDate: birthDate.toDate(),
      firstName,
      gender,
      size,
      weight,
    };
  }

  function parseBet(id: string, { config, results }: TFirebaseBet): TBet | null {
    if (!config) return null;
    const { firstParentFirstName, secondParentFirstName, gender, scheduledDate } = config;
    if (!firstParentFirstName || !secondParentFirstName || !scheduledDate) return null;

    return {
      id,
      config: {
        firstParentFirstName,
        secondParentFirstName,
        gender: gender === 'male' ? 'male' : gender === 'female' ? 'female' : 'unknown',
        scheduledDate: scheduledDate.toDate(),
      },
      results: parseResults(results),
    };
  }

  async function getBets({
    user: { email },
    status,
  }: {
    status: TUserStatus;
    user: TUser;
  }): Promise<TBet[]> {
    if (!db) throw new Error('db is undefined');

    const invitationsRef = query(
      collection(db, 'invitations'),
      where('userEmail', '==', email),
      where('status', '==', status),
    ) as Query<TFirebaseInvitation, TFirebaseInvitation>;
    const _invitationsSnaps = await getDocs(invitationsRef);

    const invitationsSnaps: QueryDocumentSnapshot<TFirebaseInvitation, TFirebaseInvitation>[] = [];
    _invitationsSnaps.forEach((invitationSnap) => invitationsSnaps.push(invitationSnap));

    const betsDocsSnaps = await Promise.all(
      invitationsSnaps.map<Promise<DocumentSnapshot<TFirebaseBet, TFirebaseBet>> | null>(
        (invitationSnap) => {
          if (invitationSnap.exists()) {
            const { betId } = invitationSnap.data();
            const betDocRef = doc(db, 'bets', betId) as DocumentReference<
              TFirebaseBet,
              TFirebaseBet
            >;

            return getDoc(betDocRef);
          }

          return null;
        },
        [],
      ),
    );

    return betsDocsSnaps.reduce<TBet[]>((res, betDocSnap) => {
      if (betDocSnap?.exists()) {
        const bet = parseBet(betDocSnap.id, betDocSnap.data());
        if (bet) res.push(bet);
      }

      return res;
    }, []);
  }

  async function getBet(id: string): Promise<TBet> {
    if (!db) throw new Error('db is undefined');

    const betDocRef = doc(db, 'bets', id) as DocumentReference<TFirebaseBet, TFirebaseBet>;
    const betDocSnap = await getDoc(betDocRef);

    if (!betDocSnap.exists()) throw new Error('bet not found');

    const data = betDocSnap.data();

    const bet = parseBet(id, data);
    if (!bet) throw new Error('invalid bet');

    const invitationsRef = query(
      collection(db, 'invitations'),
      where('betId', '==', bet.id),
    ) as Query<TFirebaseInvitation, TFirebaseInvitation>;
    const invitationsSnaps = await getDocs(invitationsRef);
    const users: TBetUser[] = [];

    invitationsSnaps.forEach((invitationSnap) => {
      if (invitationSnap.exists()) {
        const { isAdmin, userEmail: email, status } = invitationSnap.data();

        users.push({ isAdmin: isAdmin || false, email, status });
      }
    });

    bet.users = users;

    return bet;
  }

  async function updateInvitation({
    user: { email },
    invitationId,
    data,
  }: {
    invitationId: string;
    data: { status?: TUserStatus };
    user: TUser;
  }): Promise<boolean> {
    if (!db) throw new Error('db is undefined');

    const invitationsRef = query(
      collection(db, 'invitations'),
      where('userEmail', '==', email),
      where('betId', '==', invitationId),
      limit(1),
    ) as Query<TFirebaseInvitation, TFirebaseInvitation>;
    const invitationsSnaps = await getDocs(invitationsRef);

    let invitationSnap: QueryDocumentSnapshot<TFirebaseInvitation, TFirebaseInvitation> | undefined;
    invitationsSnaps.forEach((snap) => (invitationSnap = snap));

    if (!invitationSnap?.exists()) throw new Error('invitation document not found');

    setDoc(invitationSnap.ref, data, { merge: true });

    return true;
  }

  async function createBet({
    firstParentFirstName,
    secondParentFirstName,
    gender,
    scheduledDate,
    userEmail,
  }: { scheduledDate: string; userEmail: string } & Omit<
    TBetConfig,
    'scheduledDate'
  >): Promise<TBet> {
    if (!db) throw new Error('db is undefined');

    const betDocRef = await addDoc<TFirebaseBet, TFirebaseBet>(collection(db, 'bets'), {
      config: {
        firstParentFirstName,
        secondParentFirstName,
        gender,
        scheduledDate: Timestamp.fromDate(new Date(scheduledDate)),
      },
    });

    await addDoc(collection(db, 'invitations'), {
      betId: betDocRef.id,
      isAdmin: true,
      status: 'accepted',
      userEmail,
    });

    const betDocSnap = await getDoc(betDocRef);
    if (!betDocSnap.exists()) throw new Error('bet not found');

    const data = betDocSnap.data();

    const bet = parseBet(betDocRef.id, data);
    if (!bet) throw new Error('invalid bet');

    return bet;
  }

  async function updateBet(
    id: string,
    {
      updatedConfig,
    }: { updatedConfig?: Partial<{ scheduledDate: string } & Omit<TBetConfig, 'scheduledDate'>> },
  ): Promise<TBet> {
    if (!db) throw new Error('db is undefined');

    const betDocRef = doc(db, 'bets', id) as DocumentReference<TFirebaseBet, TFirebaseBet>;

    const data: { [key: string]: string | Timestamp } = {};
    if (updatedConfig) {
      const { firstParentFirstName, secondParentFirstName, scheduledDate, gender } = updatedConfig;

      if (firstParentFirstName) data['config.firstParentFirstName'] = firstParentFirstName;
      if (secondParentFirstName) data['config.secondParentFirstName'] = secondParentFirstName;
      if (scheduledDate) data['config.scheduledDate'] = Timestamp.fromDate(new Date(scheduledDate));
      if (gender) data['config.gender'] = gender;
    }

    await updateDoc(betDocRef, data);

    return getBet(id);
  }

  async function removeBet(id: string): Promise<boolean> {
    if (!db) throw new Error('db is undefined');

    const betDocRef = doc(db, 'bets', id) as DocumentReference<TFirebaseBet, TFirebaseBet>;

    await deleteDoc(betDocRef);

    return true;
  }

  return { getBet, getBets, updateInvitation, createBet, updateBet, removeBet };
}
