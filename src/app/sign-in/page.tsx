'use client';

import { Fieldset } from '@headlessui/react';
import Image from 'next/image';
import { useState } from 'react';

import Button from '@/components/button';
import Divider from '@/components/divider';
import Field from '@/components/field';
import GuestPage from '@/components/guest-page';
import SignInLayout from '@/components/layouts/sign-in';
import Link from '@/components/link';
import PageTitle from '@/components/page-title';
import useAuth from '@/hooks/auth';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { auth, db, isSubmitting, isEmail, signInWithEmail, signInWithGoogle } = useAuth();

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
              onClick={signInWithGoogle}
            />
          </div>
          <Divider text="Ou avec votre adresse e-mail" />
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
                action={<Link href="/forgot-password" text="Mot de passe oublié ?" />}
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
                disabled={!auth || !db || !email || !isEmail(email) || !password || isSubmitting}
                label="Se connecter"
                onClick={() => signInWithEmail(email, password)}
                variant="contained"
              />
            </div>
          </form>
          <div className="text-center text-sm text-gray-500">
            Pas encore de compte ? <Link href="/sign-up" text="Inscrivez-vous" />
          </div>
        </div>
      </SignInLayout>
    </GuestPage>
  );
}
