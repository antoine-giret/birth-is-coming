'use client';

import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { toast } from 'react-toastify';

import Button from '@/components/button';
import Dialog from '@/components/dialog';
import Loader from '@/components/loader';
import useBets from '@/hooks/bets';
import TBet from '@/models/bet';

export default function RemoveDialog({
  bet,
  open,
  onClose,
}: {
  bet: TBet;
  open: boolean;
  onClose: (removed: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { removeBet } = useBets();

  async function handleRemove() {
    setLoading(true);

    try {
      await removeBet(bet.id);

      onClose(true);
    } catch (err) {
      console.error(err);
      toast.error(<span className="text-sm">Le pari n&apos;a pas pu être supprimé</span>, {
        icon: () => <ExclamationCircleIcon style={{ color: '#e74c3c' }} />,
      });
    }

    setLoading(false);
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
            color="error"
            disabled={loading}
            icon={loading && <Loader color="#fff" size={16} />}
            variant="contained"
            label="Supprimer"
            onClick={handleRemove}
          />
        </>
      }
      loading={loading}
      open={open}
      title={`Supprimer le pari ?`}
      toggle={() => onClose(false)}
    >
      <p className="text-base text-red-500">
        Attention cette action est irréversible. Vous ne pourrez plus retrouver les paris ni les
        résultats.
      </p>
    </Dialog>
  );
}
