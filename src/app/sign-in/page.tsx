'use client';

import { Fieldset } from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import AppContext from '../context';

import Button from '@/components/button';
import Field from '@/components/field';
import GuestPage from '@/components/guest-page';
import SignInLayout from '@/components/layouts/sign-in';
import PageTitle from '@/components/page-title';

const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.addScope('');

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth, db, setCurrentUser } = useContext(AppContext);

  async function handleGoogleSignIn() {
    try {
      if (!auth) throw new Error('auth is undefined');
      if (!db) throw new Error('db is undefined');

      const { user } = await signInWithPopup(auth, googleAuthProvider);
      const { email: _email } = user;
      if (!_email) throw new Error('email is undefined');

      const email = _email.toLowerCase();
      const firstName = user.displayName?.split(' ')[0] || `Utilisateur ${new Date().getTime()}`;
      const userDocRef = doc(db, 'users', email);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(doc(db, 'users', email), {
          firstName,
          pseudo: firstName,
          joinedBets: [],
        });
      } else {
        const data = userDocSnap.data();
        if (!data.firstName && !data.pseudo)
          setDoc(userDocRef, { firstName, pseudo: firstName }, { merge: true });
        else if (!data.firstName) setDoc(userDocRef, { firstName }, { merge: true });
        else if (!data.pseudo) setDoc(userDocRef, { pseudo: firstName }, { merge: true });
      }

      setCurrentUser(user);
    } catch (err) {
      console.error(err);
      toast.error('La connexion a échoué', {
        icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
      });
    }
  }

  async function handleSignIn() {
    try {
      if (!auth) throw new Error('auth is undefined');

      setIsSubmitting(true);

      const { user } = await signInWithEmailAndPassword(auth, email, password);

      setCurrentUser(user);
    } catch (err) {
      console.error(err);
      toast.error('Identifiants invalides', {
        icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
      });
    }

    setIsSubmitting(false);
  }

  return (
    <GuestPage>
      <SignInLayout>
        <PageTitle text="Connectez-vous" />
        <div className="flex flex-col gap-8">
          <div className="flex gap-3 flex-wrap items-center">
            <Button
              disabled={!auth || !db}
              icon={<Image src="/google.svg" height={24} width={24} alt="Google" />}
              label="Se connecter avec Google"
              onClick={handleGoogleSignIn}
            />
          </div>
          <div className="relative border-t border-gray-100">
            <div className="absolute left-0 -top-3 w-full flex justify-center">
              <div className="bg-white px-2.5 text-sm text-gray-500">
                Ou avec votre adresse e-mail
              </div>
            </div>
          </div>
          <form className="space-y-4">
            <Fieldset className="space-y-4">
              <Field
                required
                autoComplete="email"
                type="email"
                id="email"
                label="Adresse e-mail"
                onChange={setEmail}
                value={email}
              />
              <Field
                required
                action={
                  <Link
                    className="font-semibold text-sm text-indigo-500 hover:text-indigo-400"
                    href="/forgot-password"
                  >
                    Mot de passe oublié ?
                  </Link>
                }
                autoComplete="current-password"
                type="password"
                id="password"
                label="Mot de passe"
                onChange={setPassword}
                value={password}
              />
            </Fieldset>
            <div>
              <Button
                fullWidth
                disabled={!auth || isSubmitting}
                label="Se connecter"
                onClick={handleSignIn}
                variant="contained"
              />
            </div>
          </form>
          <div className="text-center text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <a href="#" className="font-semibold text-indigo-500 hover:text-indigo-400">
              Inscrivez-vous
            </a>
          </div>
        </div>
      </SignInLayout>
    </GuestPage>
  );
}
