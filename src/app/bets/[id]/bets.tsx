import { TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

import Button from '@/components/button';
import EmptyState from '@/components/empty-state';
import Table, { THeader, TRow, sortDates, sortNumbers, sortStrings } from '@/components/table';
import useQueryParams from '@/hooks/query-params';
import TBet from '@/models/bet';

const columns = [
  'updateDate',
  'pseudo',
  'gender',
  'firstName',
  'firstNames',
  'birthDate',
  'size',
  'weight',
] as const;
type TColumn = (typeof columns)[number];

const headersMap: { [key in TColumn]: THeader } = {
  updateDate: { label: 'Date de pari', sortable: true },
  pseudo: { label: 'Pseudo', sortable: true },
  gender: { label: 'Sexe' },
  firstName: { label: 'Prénom' },
  firstNames: { label: 'Prénoms' },
  birthDate: { label: 'Date de naissance', sortable: true },
  size: { label: 'Taille', sortable: true },
  weight: { label: 'Poids', sortable: true },
};

export default function Bets({
  isAdmin,
  bet,
  toggleRemoveDialog,
}: {
  bet: TBet;
  isAdmin: boolean;
  toggleRemoveDialog: (open: boolean) => void;
}) {
  const [orderBy, setOrderBy] = useState<TColumn>('updateDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [rows, setRows] = useState<TRow<TColumn>[]>([]);
  const [, toggleBetDialog] = useState(false);

  useEffect(() => {
    setRows(
      bet.participants
        ?.sort((a, b) => {
          if (orderBy === 'pseudo') return sortStrings(a.pseudo, b.pseudo, order);
          if (orderBy === 'birthDate') return sortDates(a.bet?.birthDate, b.bet?.birthDate, order);
          if (orderBy === 'size') return sortNumbers(a.bet?.size, b.bet?.size, order);
          if (orderBy === 'weight') return sortNumbers(a.bet?.weight, b.bet?.weight, order);

          return sortDates(a.bet?.updateDate, b.bet?.updateDate, order);
        })
        .reduce<TRow<TColumn>[]>((res, { pseudo, bet }) => {
          if (pseudo && bet) {
            const { updateDate, birthDate, size, weight, ...otherBetProps } = bet;

            res.push({
              key: pseudo,
              values: {
                updateDate: new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(
                  updateDate,
                ),
                pseudo,
                birthDate: new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(
                  birthDate,
                ),
                gender: ('gender' in otherBetProps && otherBetProps.gender) || '/',
                firstName: ('firstName' in otherBetProps && otherBetProps.firstName) || '/',
                firstNames:
                  ('gender' in otherBetProps &&
                    [otherBetProps.girlFirstName, otherBetProps.boyFirstName].join(', ')) ||
                  '/',
                size: `${size} cm`,
                weight: `${weight} kg`,
              },
            });
          }

          return res;
        }, []) || [],
    );
  }, [bet, order, orderBy]);

  function handleSort(key: TColumn) {
    if (orderBy === key) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setOrderBy(key);
      setOrder('asc');
    }
  }

  const participants = bet.participants?.filter(({ bet }) => Boolean(bet)) || [];

  return (
    <>
      {participants.length === 0 ? (
        <ParticipantsEmptyState
          bet={bet}
          isAdmin={isAdmin}
          toggleBetDialog={toggleBetDialog}
          toggleRemoveDialog={toggleRemoveDialog}
        />
      ) : (
        <Table
          columns={columns.filter((key) =>
            bet.config.gender === 'unknown'
              ? key !== 'firstName'
              : key !== 'gender' && key !== 'firstNames',
          )}
          handleSort={handleSort}
          headersMap={headersMap}
          rows={rows}
        />
      )}
    </>
  );
}

function ParticipantsEmptyState({
  isAdmin,
  bet,
  toggleBetDialog,
  toggleRemoveDialog,
}: {
  bet: TBet;
  isAdmin: boolean;
  toggleBetDialog: (open: boolean) => void;
  toggleRemoveDialog: (open: boolean) => void;
}) {
  const { createQueryString } = useQueryParams();

  return bet.results ? (
    isAdmin ? (
      <EmptyState
        actions={
          <>
            <Button
              color="error"
              icon={<TrashIcon className="w-5 text-red-500" />}
              label="Supprimer"
              onClick={() => toggleRemoveDialog(true)}
              size="large"
              variant="outlined"
            />
          </>
        }
        description="Aucun participant n'a parié sur la naissance de votre bébé."
        title="Aucun pari effectué"
      />
    ) : (
      <EmptyState
        actions={
          <>
            <Button
              isRouterLink
              color="primary"
              href="/bets"
              label="Voir les autres paris"
              size="large"
              variant="outlined"
            />
          </>
        }
        description="Aucun participant n'a parié sur la naissance du bébé."
        title="Aucun pari effectué"
      />
    )
  ) : isAdmin ? (
    <EmptyState
      actions={
        <>
          <Button
            color="primary"
            label="Faire mon propre pari"
            onClick={() => toggleBetDialog(true)}
            size="large"
            variant="outlined"
          />
          <Button
            isRouterLink
            color="primary"
            icon={<span>🚀</span>}
            label="Lancez des invitations"
            href={createQueryString([{ key: 'tab', value: 'participants' }])}
            size="large"
            variant="contained"
          />
        </>
      }
      description={
        <>
          Aucun participant n&apos;a encore parié sur la naissance de votre futur bébé.
          <br />
          Lancez de nouvelles invitations !
        </>
      }
      title="Aucun pari effectué"
    />
  ) : (
    <EmptyState
      actions={
        <>
          <Button
            color="primary"
            icon={<span>🚀</span>}
            label="Faîtes votre pari"
            onClick={() => toggleBetDialog(true)}
            size="large"
            variant="contained"
          />
        </>
      }
      description={
        <>
          Aucun participant n&apos;a encore parié sur la naissance du futur bébé.
          <br />
          Soyez la·le premier·ère !
        </>
      }
      title="Aucun pari effectué"
    />
  );
}
