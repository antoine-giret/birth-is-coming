'use client';

import { useContext } from 'react';

import AppContext from '../context';

import Button from '@/components/button';
import CardsList from '@/components/cards-list';
import EmptyState from '@/components/empty-state';

export default function OngoingBets() {
  const {
    user: { current: currentUser, joinedBets },
  } = useContext(AppContext);

  const betsInProgress = joinedBets?.filter(({ results }) => !results);

  if (!betsInProgress || betsInProgress.length === 0) {
    return (
      <EmptyState
        actions={
          <>
            <Button
              color="primary"
              href="/bets/new"
              icon={<span>🚀</span>}
              label="Lancez un pari"
              size="large"
              variant="contained"
            />
          </>
        }
        description={
          <>
            Lancez les paris pour la naissance de votre futur bébé
            <br />
            ou demandez à vous faire inviter sur votre email {currentUser?.email} pour participer à
            un pari.
          </>
        }
        title="Aucun pari en cours"
      />
    );
  }

  return (
    <>
      <EmptyState
        actions={
          <>
            <Button
              color="primary"
              href="/bets/new"
              icon={<span>🚀</span>}
              label="Lancez un pari"
              size="large"
              variant="contained"
            />
          </>
        }
        description="Lancez les paris pour la naissance de votre futur bébé"
        title="Vous attendez un bébé ?"
      />
      <CardsList
        items={betsInProgress.map(
          ({ id: key, config: { fatherFirstName, motherFirstName, scheduledDate } }) => ({
            key,
            href: `/bets/${key}`,
            title: `Bébé de ${motherFirstName} et ${fatherFirstName}`,
            description: `Naissance prévue le ${new Intl.DateTimeFormat('fr-FR').format(scheduledDate)}`,
          }),
        )}
        title="Paris en cours"
      />
    </>
  );
}
