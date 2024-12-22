import Loader from '../loader';

import DefaultLayout from './default';

export default function Loading() {
  return (
    <DefaultLayout justifyCenter>
      <div className="flex flex-col items-center gap-5">
        <Loader />
        <p className="text-md text-center">Chargement en cours...</p>
      </div>
    </DefaultLayout>
  );
}