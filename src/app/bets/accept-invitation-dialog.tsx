import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import AppContext from '../context';

import Button from '@/components/button';
import Dialog from '@/components/dialog';
import Loader from '@/components/loader';
import useBets from '@/hooks/bets';
import TBet from '@/models/bet';

export default function AcceptInvitationDialog({
  pendingInvitation,
  open,
  onClose,
}: {
  open: boolean;
  pendingInvitation: TBet;
  onClose: (accepted: boolean) => void;
}) {
  const {
    id: invitationId,
    config: { motherFirstName, fatherFirstName, gender },
  } = pendingInvitation;
  const [loading, setLoading] = useState(false);
  const {
    user: { current: currentUser },
  } = useContext(AppContext);
  const { updateInvitation } = useBets();

  async function handleAccept() {
    if (!currentUser) return;

    setLoading(true);

    try {
      await updateInvitation({ user: currentUser, invitationId, data: { status: 'accepted' } });

      onClose(true);
    } catch (err) {
      console.error(err);
      toast.error(
        <span className="text-sm">L&apos;invitation n&apos;a pas pu être acceptée</span>,
        {
          icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
        },
      );
    }

    // setLoading(false);
  }

  return (
    <Dialog
      actions={
        <>
          <Button
            disabled={loading}
            variant="outlined"
            label="Annuler"
            onClick={() => onClose(false)}
          />
          <Button
            color="primary"
            disabled={loading}
            icon={loading && <Loader color="#fff" size={16} />}
            variant="contained"
            label="Accepter"
            onClick={handleAccept}
          />
        </>
      }
      loading={loading}
      open={open}
      title={`Accepter l'invitation de ${motherFirstName} et ${fatherFirstName} ?`}
      toggle={() => onClose(false)}
    >
      <p className="text-base text-gray-500">
        Vous pourrez participer aux paris pour la naissance de leur{' '}
        {gender === 'male'
          ? 'futur garçon'
          : gender === 'female'
            ? 'future fille'
            : 'futur enfant'!}{' '}
        !
      </p>
    </Dialog>
  );
}
