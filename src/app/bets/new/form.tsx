import { Fieldset } from '@headlessui/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import AppContext from '@/app/context';
import Button from '@/components/button';
import Field from '@/components/field';
import Loader from '@/components/loader';
import Select from '@/components/select';
import useBets from '@/hooks/bets';
import { TGender } from '@/models/bet';

const genders: Array<{ label: React.ReactNode; value: TGender }> = [
  { value: 'male', label: 'Garçon' },
  { value: 'female', label: 'Fille' },
  { value: 'unknown', label: 'Surprise !' },
];

export default function BetForm() {
  const [firstParentFirstName, setFirstParentFirstName] = useState('');
  const [secondParentFirstName, setSecondParentFirstName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [gender, setGender] = useState<TGender>('female');
  const [submitting, setSubmitting] = useState(false);
  const {
    user: { current: currentUser, joinedBets },
    setJoinedBets,
  } = useContext(AppContext);
  const router = useRouter();
  const { createBet } = useBets();

  async function handleSubmit() {
    if (!joinedBets || !currentUser) return;

    setSubmitting(true);

    try {
      const newBet = await createBet({
        firstParentFirstName,
        secondParentFirstName,
        gender,
        scheduledDate,
        userEmail: currentUser.email,
      });

      setJoinedBets([...joinedBets, newBet]);
      router.push(`/bets/${newBet.id}`);
    } catch (err) {
      console.error(err);
      toast.error(<span className="text-sm">Les paris n&apos;ont pas pu être lancés</span>, {
        icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
      });
    }

    setSubmitting(false);
  }

  return (
    <form>
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-6 w-full max-w-sm bg-white p-6 rounded-2xl border-gray-200">
          <Fieldset className="space-y-4 w-full">
            <Field
              required
              autoComplete="email"
              disabled={submitting}
              type="email"
              id="email"
              label="Prénom du 1er parent"
              onChange={setFirstParentFirstName}
              value={firstParentFirstName}
            />
            <Field
              required
              autoComplete="email"
              disabled={submitting}
              type="email"
              id="email"
              label="Prénom du 2e parent"
              onChange={setSecondParentFirstName}
              value={secondParentFirstName}
            />
            <Field
              required
              disabled={submitting}
              type="date"
              id="scheduledDate"
              label="Date de naissance prévue"
              onChange={setScheduledDate}
              value={scheduledDate}
            />
            <Select
              required
              disabled={submitting}
              id="gender"
              label="Sexe"
              options={genders}
              onChange={setGender}
              value={gender}
            />
          </Fieldset>
          <div className="flex justify-end">
            <Button
              color="primary"
              disabled={!firstParentFirstName || !secondParentFirstName || !scheduledDate}
              variant="contained"
              icon={submitting ? <Loader color="#fff" size={16} /> : <span>🚀</span>}
              label="Lancer les paris"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
