'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

import IconButton from '@/components/icon-button';
import TBet from '@/models/bet';

export default function PendingInvitation({
  pendingInvitation,
  handleInvitationAccept,
  handleInvitationReject,
}: {
  handleInvitationAccept: (invitation: TBet) => void;
  handleInvitationReject: (invitation: TBet) => void;
  pendingInvitation: TBet;
}) {
  const {
    config: { scheduledDate, motherFirstName, fatherFirstName },
  } = pendingInvitation;

  return (
    <li className="flex items-center gap-3 px-3 py-2">
      <div className="flex-grow">
        <p className="text-base font-semibold">
          Bébé de {motherFirstName} et {fatherFirstName}
        </p>
        <p className="text-sm text-gray-500">
          Naissance prévue le{' '}
          {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(scheduledDate)}
        </p>
      </div>
      <div className=" shrink-0 flex items-center gap-1">
        <IconButton
          color="error"
          icon={<XMarkIcon className="w-3 text-red-500" />}
          onClick={() => handleInvitationReject({ ...pendingInvitation })}
          title="Refuser l'invitation"
        />
        <IconButton
          color="success"
          icon={<CheckIcon className="w-3 text-green-500" />}
          onClick={() => handleInvitationAccept({ ...pendingInvitation })}
          title="Accepter l'invitation"
        />
      </div>
    </li>
  );
}
