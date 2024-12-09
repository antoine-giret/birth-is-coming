import DefaultLayout from '@/components/layouts/default';
import PageTitle from '@/components/page-title';

export default function HomePage() {
  return (
    <DefaultLayout isPublic>
      <PageTitle text="Accueil" />
    </DefaultLayout>
  );
}
