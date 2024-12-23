'use client';

import { useContext } from 'react';

import AppContext from '../context';

import CardsList, { TCardsListItem } from '@/components/cards-list';

export default function DoneBets() {
  const {
    user: { joinedBets },
  } = useContext(AppContext);

  const betsDone = joinedBets?.filter(({ results }) => Boolean(results));

  if (!betsDone || betsDone.length === 0) return <></>;

  return (
    <CardsList
      items={betsDone.reduce<TCardsListItem[]>((res, { id: key, results }) => {
        if (results) {
          const { firstName, gender, birthDate, size, weight } = results;

          res.push({
            key,
            href: `/bets/${key}`,
            title: `${firstName}`,
            description: [
              `${gender === 'male' ? 'Né' : 'Née'} le ${new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(birthDate)}`,
              `${size}cm`,
              `${weight}kg`,
            ].join(` • `),
          });
        }

        return res;
      }, [])}
      title="Paris terminés"
    />
  );
}
