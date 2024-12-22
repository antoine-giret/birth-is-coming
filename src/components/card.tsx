import Link from 'next/link';

export default function Card({
  href,
  title,
  description,
}: {
  description: React.ReactNode;
  href?: string;
  title: React.ReactNode;
}) {
  const className =
    'flex flex-col gap-1 w-full px-6 py-3 rounded overflow-hidden border border-gray-200 rounded-2xl bg-white';

  if (href) {
    return (
      <Link className={[className, 'hover:bg-gray-50'].join(' ')} href={href}>
        <CardContent description={description} title={title} />
      </Link>
    );
  }

  return (
    <div className={className}>
      <CardContent description={description} title={title} />
    </div>
  );
}

function CardContent({
  title,
  description,
}: {
  description: React.ReactNode;
  href?: string;
  title: React.ReactNode;
}) {
  return (
    <>
      <div className="font-bold text-lg">{title}</div>
      <p className="text-gray-500 text-sm">{description}</p>
    </>
  );
}
