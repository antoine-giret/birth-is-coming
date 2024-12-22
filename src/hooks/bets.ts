import {
  DocumentReference,
  DocumentSnapshot,
  Query,
  QueryDocumentSnapshot,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { useContext } from 'react';

import AppContext from '@/app/context';
import TBet, { TBetResults } from '@/models/bet';
import TUser from '@/models/user';

export type TFirebaseBetResults = Partial<{
  birthDate: Timestamp;
  firstName: string;
  gender: string;
  size: number;
  weight: number;
}>;

export type TFirebaseBet = Partial<{
  config: Partial<{
    fatherFirstName: string;
    gender: string;
    motherFirstName: string;
    scheduledDate: Timestamp;
  }>;
  results: TFirebaseBetResults;
}>;

export type TFirebaseInvitationStatus = 'pending' | 'accepted' | 'rejected';

export type TFirebaseInvitation = {
  betId: string;
  isAdmin?: boolean;
  status: TFirebaseInvitationStatus;
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
    const { fatherFirstName, motherFirstName, gender, scheduledDate } = config;
    if (!fatherFirstName || !motherFirstName || !scheduledDate) return null;

    return {
      id,
      config: {
        fatherFirstName,
        motherFirstName,
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
    status: TFirebaseInvitationStatus;
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

  async function updateInvitation({
    user: { email },
    invitationId,
    data,
  }: {
    invitationId: string;
    data: { status?: TFirebaseInvitationStatus };
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

  return { getBets, updateInvitation };
}
