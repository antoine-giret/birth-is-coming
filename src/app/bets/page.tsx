import AuthPage from '@/components/auth-page';
import DefaultLayout from '@/components/layouts/default';
import PageTitle from '@/components/page-title';

export default function BetsPage() {
  return (
    <AuthPage>
      <DefaultLayout>
        <PageTitle text="Liste des paris" />
      </DefaultLayout>
    </AuthPage>
  );
}
