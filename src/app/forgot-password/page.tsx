'use client';

import { Fieldset } from '@headlessui/react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import AppContext from '../context';

import Button from '@/components/button';
import Field from '@/components/field';
import GuestPage from '@/components/guest-page';
import SignInLayout from '@/components/layouts/sign-in';
import PageTitle from '@/components/page-title';

export default function ForgotPasswordInPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useContext(AppContext);
  const router = useRouter();

  async function handleSubmit() {
    try {
      if (!auth) throw new Error('auth is undefined');

      setIsSubmitting(true);

      await sendPasswordResetEmail(auth, email);

      toast.success(`L'e-mail de réinitialisation a bien été envoyé à ${email}`, {
        icon: () => <CheckCircleIcon style={{ color: '#07bc0c' }} />,
      });
      router.push('/sign-in');
    } catch (err) {
      console.error(err);
      toast.error("L'e-mail de réinitialisation n'a pas pu être envoyé", {
        icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
      });
      setIsSubmitting(false);
    }
  }

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
              fullWidth
              disabled={!auth || isSubmitting}
              label="Envoyer un e-mail de réinitialisation"
              onClick={handleSubmit}
              variant="contained"
            />
          </div>
        </form>
      </SignInLayout>
    </GuestPage>
  );
}
