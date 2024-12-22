'use client';

import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import AppContext from '../context';

import AcceptInvitationDialog from './accept-invitation-dialog';
import PendingInvitation from './pending-invitation';
import RejectInvitationDialog from './reject-invitation-dialog';

import TBet from '@/models/bet';

export default function PendingInvitations() {
  const [acceptDialogOpen, toggleAcceptDialog] = useState(false);
  const [invitationToAccept, setInvitationToAccept] = useState<TBet | null>(null);
  const [rejectDialogOpen, toggleRejectDialog] = useState(false);
  const [invitationToReject, setInvitationToReject] = useState<TBet | null>(null);
  const {
    user: { pendingInvitations, joinedBets },
    setPendingInvitations,
    setJoinedBets,
  } = useContext(AppContext);
  const router = useRouter();

  function handleInvitationAccept(invitation: TBet) {
    setInvitationToAccept(invitation);
    toggleAcceptDialog(true);
  }

  function handleInvitationReject(invitation: TBet) {
    setInvitationToReject(invitation);
    toggleRejectDialog(true);
  }

  function onAcceptInvitationDialogClose(accepted: boolean) {
    toggleAcceptDialog(false);

    setTimeout(() => {
      if (accepted && invitationToAccept) {
        const { id: invitationId } = invitationToAccept;

        if (pendingInvitations)
          setPendingInvitations([...pendingInvitations].filter(({ id }) => id !== invitationId));
        if (joinedBets && !joinedBets.find(({ id }) => id === invitationId))
          setJoinedBets([...joinedBets, invitationToAccept]);

        toast.success(<span className="text-sm">L&apos;invitation a bien été acceptée</span>, {
          icon: () => <CheckCircleIcon style={{ color: '#07bc0c' }} />,
        });

        router.push(`/bets/${invitationId}`);
      } else {
        setInvitationToAccept(null);
      }
    }, 300);
  }

  function onRejectInvitationDialogClose(rejected: boolean) {
    toggleRejectDialog(false);

    setTimeout(() => {
      if (rejected && invitationToReject) {
        if (pendingInvitations)
          setPendingInvitations(
            [...pendingInvitations].filter(({ id }) => id !== invitationToReject.id),
          );

        toast.success(<span className="text-sm">L&apos;invitation a bien été refusée</span>, {
          icon: () => <CheckCircleIcon style={{ color: '#07bc0c' }} />,
        });
      }

      setInvitationToReject(null);
    }, 300);
  }

  return (
    <>
      {pendingInvitations && pendingInvitations.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-base font-semibold text-gray-700">
            Invitations en attente ({pendingInvitations.length})
          </p>
          <div className="flex flex-col w-full rounded overflow-hidden border border-gray-200 rounded-2xl bg-white">
            <ul role="list" className="divide-y divide-gray-100">
              {pendingInvitations.map((pendingInvitation) => (
                <PendingInvitation
                  handleInvitationAccept={handleInvitationAccept}
                  handleInvitationReject={handleInvitationReject}
                  key={pendingInvitation.id}
                  pendingInvitation={pendingInvitation}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      {invitationToAccept && (
        <AcceptInvitationDialog
          open={acceptDialogOpen}
          pendingInvitation={invitationToAccept}
          onClose={onAcceptInvitationDialogClose}
        />
      )}
      {invitationToReject && (
        <RejectInvitationDialog
          open={rejectDialogOpen}
          pendingInvitation={invitationToReject}
          onClose={onRejectInvitationDialogClose}
        />
      )}
    </>
  );
}
