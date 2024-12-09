import { Button } from '@headlessui/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PageTitle({
  backPath,
  text,
}: {
  backPath?: string;
  text: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      {backPath && (
        <Button
          as={Link}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/10"
          href={backPath}
          title="Retour"
        >
          <ArrowLeftIcon className="w-5" />
        </Button>
      )}
      <h1 className="text-2xl font-bold">{text}</h1>
    </div>
  );
}
