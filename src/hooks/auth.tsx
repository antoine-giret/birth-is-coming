import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import {
  GoogleAuthProvider,
  sendPasswordResetEmail as _sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import useBets from './bets';
import useUsers from './users';

import AppContext from '@/app/context';
import Button from '@/components/button';

const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.addScope('');

export default function useAuth() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth, db, setCurrentUser, setJoinedBets, setPendingInvitations } = useContext(AppContext);
  const router = useRouter();
  const { createOrUpdateUserDoc } = useUsers();
  const { getBets } = useBets();

  function isEmail(email: string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  }

  async function signUp(_email: string, password: string, firstName: string) {
    try {
      if (!auth) throw new Error('auth is undefined');

      setIsSubmitting(true);

      const email = _email.toLowerCase();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await createOrUpdateUserDoc(email, firstName);
      await sendEmailVerification(user);

      toast.success(
        <span className="text-sm">Un e-mail de vérification a été envoyé à {email}</span>,
        {
          icon: () => <CheckCircleIcon style={{ color: '#07bc0c' }} />,
        },
      );
      router.push('/sign-in');
    } catch (err) {
      console.error(err);
      toast.error(<span className="text-sm">Identifiants invalides</span>, {
        icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
      });
    }

    setIsSubmitting(false);
  }

  async function signInWithEmail(_email: string, password: string) {
    try {
      if (!auth) throw new Error('auth is undefined');
      if (!db) throw new Error('db is undefined');

      setIsSubmitting(true);

      const email = _email.toLowerCase();
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const user = await createOrUpdateUserDoc(email);

      if (firebaseUser.emailVerified) {
        const [pendingInvitations, joinedBets] = await Promise.all([
          getBets({ user, status: 'pending' }),
          getBets({ user, status: 'accepted' }),
        ]);

        setCurrentUser(user);
        setJoinedBets(joinedBets);
        setPendingInvitations(pendingInvitations);
      } else {
        const toastId = toast.error(
          <div className="flex items-center gap-2">
            <span className="text-sm">Votre adresse e-mail n&apos;a pas été vérifiée</span>
            <Button
              label="Renvoyer l'e-mail de vérification"
              onClick={() => {
                sendEmailVerification(firebaseUser);
                toast.dismiss(toastId);
                toast.success(
                  <span className="text-sm">Un e-mail de vérification a été envoyé à {email}</span>,
                  {
                    icon: () => <CheckCircleIcon style={{ color: '#07bc0c' }} />,
                  },
                );
              }}
              size="small"
              variant="outlined"
            />
          </div>,
          {
            icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
          },
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(<span className="text-sm">Identifiants invalides</span>, {
        icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
      });
    }

    setIsSubmitting(false);
  }

  async function signInWithGoogle() {
    try {
      if (!auth) throw new Error('auth is undefined');
      if (!db) throw new Error('db is undefined');

      const {
        user: { email, displayName },
      } = await signInWithPopup(auth, googleAuthProvider);
      if (!email) throw new Error('email is undefined');

      const firstName = displayName?.split(' ')[0] || `Utilisateur ${new Date().getTime()}`;
      const user = await createOrUpdateUserDoc(email, firstName);
      const [pendingInvitations, joinedBets] = await Promise.all([
        getBets({ user, status: 'pending' }),
        getBets({ user, status: 'accepted' }),
      ]);

      setCurrentUser(user);
      setJoinedBets(joinedBets);
      setPendingInvitations(pendingInvitations);
    } catch (err) {
      console.error(err);
      toast.error(<span className="text-sm">La connexion a échoué</span>, {
        icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
      });
    }
  }

  async function sendPasswordResetEmail(email: string) {
    try {
      if (!auth) throw new Error('auth is undefined');

      setIsSubmitting(true);

      await _sendPasswordResetEmail(auth, email);

      toast.success(
        <span className="text-sm">
          L&apos;e-mail de réinitialisation a bien été envoyé à {email}
        </span>,
        {
          icon: () => <CheckCircleIcon style={{ color: '#07bc0c' }} />,
        },
      );
      router.push('/sign-in');
    } catch (err) {
      console.error(err);
      toast.error(
        <span className="text-sm">
          L&apos;e-mail de réinitialisation n&apos;a pas pu être envoyé
        </span>,
        {
          icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
        },
      );
      setIsSubmitting(false);
    }
  }

  return {
    auth,
    db,
    isSubmitting,
    isEmail,
    signUp,
    signInWithEmail,
    signInWithGoogle,
    sendPasswordResetEmail,
  };
}
