import { useEffect, useState } from 'react';

import Table, { THeader, TRow } from '@/components/table';
import TBet, { TUserStatus } from '@/models/bet';

const columns = ['email', 'pseudo', 'status', 'bets'] as const;
type TColumn = (typeof columns)[number];

const headersMap: { [key in TColumn]: THeader } = {
  email: { label: 'E-mail', sortable: true },
  pseudo: { label: 'Pseudo', sortable: true },
  status: { label: 'Statut' },
  bets: { label: 'Paris effectués' },
};

export default function Participants({ bet }: { bet: TBet }) {
  const [orderBy, setOrderBy] = useState<TColumn>('email');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [rows, setRows] = useState<TRow<TColumn>[]>([]);

  useEffect(() => {
    setRows(
      (
        bet.participants?.map(({ email, pseudo, status, bet }) => ({
          key: email,
          values: {
            email,
            pseudo: pseudo || '/',
            status: <StatusBadge status={status} />,
            bets: <BetsStatusBadge hasBet={Boolean(bet)} />,
          },
        })) || []
      ).sort((a, b) => {
        if (orderBy === 'pseudo')
          return order === 'asc'
            ? a.values.pseudo.toLowerCase().localeCompare(b.values.pseudo.toLowerCase())
            : b.values.pseudo.toLowerCase().localeCompare(a.values.pseudo.toLowerCase());

        return order === 'asc'
          ? a.values.email.toLowerCase().localeCompare(b.values.email.toLowerCase())
          : b.values.email.toLowerCase().localeCompare(a.values.email.toLowerCase());
      }),
    );
  }, [bet, order, orderBy]);

  function handleSort(key: TColumn) {
    if (orderBy === key) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setOrderBy(key);
      setOrder('asc');
    }
  }

  return <Table columns={columns} handleSort={handleSort} headersMap={headersMap} rows={rows} />;
}

function StatusBadge({ status }: { status: TUserStatus }) {
  return status === 'accepted' ? (
    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded whitespace-nowrap">
      Accepté
    </span>
  ) : status === 'rejected' ? (
    <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded whitespace-nowrap">
      Refusé
    </span>
  ) : (
    <span className="bg-orange-100 text-orange-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded whitespace-nowrap">
      En attente de validation
    </span>
  );
}

function BetsStatusBadge({ hasBet }: { hasBet: boolean }) {
  return hasBet ? (
    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded whitespace-nowrap">
      Oui
    </span>
  ) : (
    <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded whitespace-nowrap">
      Non
    </span>
  );
}
