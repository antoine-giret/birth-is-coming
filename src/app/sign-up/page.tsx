'use client';

import { Fieldset } from '@headlessui/react';
import Image from 'next/image';
import { useState } from 'react';

import Button from '@/components/button';
import Divider from '@/components/divider';
import Field from '@/components/field';
import GuestPage from '@/components/guest-page';
import SignInLayout from '@/components/layouts/sign-in';
import PageTitle from '@/components/page-title';
import useAuth from '@/hooks/auth';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const { auth, db, isSubmitting, isEmail, signUp, signInWithGoogle } = useAuth();

  return (
    <GuestPage>
      <SignInLayout>
        <PageTitle backPath="/sign-in" text="Inscrivez-vous" />
        <div className="flex flex-col gap-8">
          <div className="flex gap-3 flex-wrap items-center">
            <Button
              disabled={!auth || !db}
              icon={<Image src="/google.svg" height={24} width={24} alt="Google" />}
              label="S'inscrire avec Google"
              onClick={signInWithGoogle}
            />
          </div>
          <Divider text="Ou créez un compte avec votre adresse e-mail" />
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
                autoComplete="new-password"
                type="password"
                id="password"
                label="Mot de passe"
                onChange={setPassword}
                value={password}
              />
              <Field
                required
                id="firstName"
                label="Prénom"
                onChange={setFirstName}
                value={firstName}
              />
            </Fieldset>
            <div>
              <Button
                fullWidth
                disabled={
                  !auth ||
                  !db ||
                  !email ||
                  !isEmail(email) ||
                  !password ||
                  !firstName ||
                  isSubmitting
                }
                label="S'inscrire"
                onClick={() => signUp(email, password, firstName)}
                variant="contained"
              />
            </div>
          </form>
        </div>
      </SignInLayout>
    </GuestPage>
  );
}
