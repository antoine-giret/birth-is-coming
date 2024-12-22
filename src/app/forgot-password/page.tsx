'use client';

import { Fieldset } from '@headlessui/react';
import { useState } from 'react';

import Button from '@/components/button';
import Field from '@/components/field';
import GuestPage from '@/components/guest-page';
import SignInLayout from '@/components/layouts/sign-in';
import PageTitle from '@/components/page-title';
import useAuth from '@/hooks/auth';

export default function ForgotPasswordInPage() {
  const [email, setEmail] = useState('');
  const { auth, isSubmitting, isEmail, sendPasswordResetEmail } = useAuth();

  return (
    <GuestPage>
      <SignInLayout>
        <PageTitle backPath="/sign-in" text="Mot de passe oublié" />
        <form className="space-y-4">
          <Fieldset>
            <Field
              required
              autoComplete="email"
              type="email"
              id="email"
              label="Adresse e-mail"
              onChange={setEmail}
              value={email}
            />
          </Fieldset>
          <div>
            <Button
              color="primary"
              fullWidth
              disabled={!auth || !email || !isEmail(email) || isSubmitting}
              label="Envoyer un e-mail de réinitialisation"
              onClick={() => sendPasswordResetEmail(email)}
              variant="contained"
            />
          </div>
        </form>
      </SignInLayout>
    </GuestPage>
  );
}
