import { Fieldset } from '@headlessui/react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import AppContext from '@/app/context';
import Button from '@/components/button';
import Field from '@/components/field';
import Loader from '@/components/loader';
import Select from '@/components/select';
import useBets from '@/hooks/bets';
import TBet, { TBetConfig, TGender } from '@/models/bet';

const genders: Array<{ label: React.ReactNode; value: TGender }> = [
  { value: 'male', label: 'Garçon' },
  { value: 'female', label: 'Fille' },
  { value: 'unknown', label: 'Surprise !' },
];

export default function BetForm({ bet }: { bet?: TBet }) {
  const [firstParentFirstName, setFirstParentFirstName] = useState(
    bet?.config.firstParentFirstName || '',
  );
  const [secondParentFirstName, setSecondParentFirstName] = useState(
    bet?.config.secondParentFirstName || '',
  );
  const [scheduledDate, setScheduledDate] = useState(
    bet?.config.scheduledDate
      ? new Intl.DateTimeFormat('fr-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(bet.config.scheduledDate)
      : '',
  );
  const [gender, setGender] = useState<TGender>(bet?.config.gender || 'female');
  const [submitting, setSubmitting] = useState(false);
  const {
    user: { current: currentUser, joinedBets },
    setJoinedBets,
  } = useContext(AppContext);
  const router = useRouter();
  const { createBet, updateBet } = useBets();

  async function handleSubmit() {
    if (!joinedBets || !currentUser) return;

    setSubmitting(true);

    if (bet) {
      try {
        const {
          config: {
            firstParentFirstName: prevFirstParentFirstName,
            secondParentFirstName: prevSecondParentFirstName,
            scheduledDate: _prevScheduledDate,
            gender: prevGender,
          },
        } = bet;
        const prevScheduledDate = new Intl.DateTimeFormat('fr-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(_prevScheduledDate);
        const updatedConfig: Partial<
          { scheduledDate: string } & Omit<TBetConfig, 'scheduledDate'>
        > = {};

        if (firstParentFirstName.localeCompare(prevFirstParentFirstName) !== 0)
          updatedConfig.firstParentFirstName = firstParentFirstName;
        if (secondParentFirstName.localeCompare(prevSecondParentFirstName) !== 0)
          updatedConfig.secondParentFirstName = secondParentFirstName;
        if (scheduledDate.localeCompare(prevScheduledDate) !== 0)
          updatedConfig.scheduledDate = scheduledDate;
        if (gender.localeCompare(prevGender) !== 0) updatedConfig.gender = gender;

        if (Object.keys(updatedConfig).length > 0) {
          const updatedBet = await updateBet(bet.id, { updatedConfig });
          const newBets = [...joinedBets];
          const index = newBets.findIndex(({ id }) => bet.id === id);
          newBets.splice(index, 1, updatedBet);

          setJoinedBets(newBets);
        }

        toast.success(
          <span className="text-sm">Les modifications ont bien été enregistrées</span>,
          {
            icon: () => <CheckCircleIcon style={{ color: '#07bc0c' }} />,
          },
        );
        router.push(`/bets/${bet.id}`);
      } catch (err) {
        console.error(err);
        toast.error(
          <span className="text-sm">Les modifications n&apos;ont pas pu être enregistrées</span>,
          {
            icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
          },
        );
      }
    } else {
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
              icon={submitting ? <Loader color="#fff" size={16} /> : !bet && <span>🚀</span>}
              label={bet ? 'Enregistrer les modifications' : 'Lancer les paris'}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
