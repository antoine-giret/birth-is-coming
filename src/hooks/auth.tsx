import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import {
  GoogleAuthProvider,
  sendPasswordResetEmail as _sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { DocumentReference, doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import AppContext from '@/app/context';
import Button from '@/components/button';
import TUser from '@/models/user';

const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.addScope('');

export default function useAuth() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth, db, setCurrentUser } = useContext(AppContext);
  const router = useRouter();

  function isEmail(email: string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  }

  async function createOrUpdateUserDoc(email: string, firstName?: string) {
    if (!db) throw new Error('db is undefined');

    const userDocRef = doc(db, 'users', email) as DocumentReference<TUser, TUser>;
    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      await setDoc(doc(db, 'users', email), {
        firstName,
        pseudo: firstName,
        joinedBets: [],
        pendingInvitations: [],
      });
    } else {
      const data = userDocSnap.data();
      if (
        (firstName !== undefined && !data.firstName) ||
        (firstName !== undefined && !data.pseudo) ||
        !data.joinedBets ||
        !data.pendingInvitations
      ) {
        const data: Partial<TUser> = {};
        if (firstName !== undefined && !data.firstName) data.firstName = firstName;
        if (firstName !== undefined && !data.pseudo) data.pseudo = firstName;
        if (!data.joinedBets) data.joinedBets = [];
        if (!data.pendingInvitations) data.pendingInvitations = [];

        setDoc(userDocRef, data, { merge: true });
      }
    }
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
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await createOrUpdateUserDoc(email);

      if (user.emailVerified) {
        setCurrentUser(user);
      } else {
        const toastId = toast.error(
          <div className="flex items-center gap-2">
            <span className="text-sm">Votre adresse e-mail n&apos;a pas été vérifiée</span>
            <Button
              label="Renvoyer l'e-mail de vérification"
              onClick={() => {
                sendEmailVerification(user);
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

      const { user } = await signInWithPopup(auth, googleAuthProvider);
      const { email } = user;
      if (!email) throw new Error('email is undefined');

      const firstName = user.displayName?.split(' ')[0] || `Utilisateur ${new Date().getTime()}`;
      createOrUpdateUserDoc(email, firstName);

      setCurrentUser(user);
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
