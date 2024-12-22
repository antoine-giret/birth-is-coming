export default function EmptyState({
  title,
  description,
  actions,
}: {
  actions: React.ReactNode;
  description: React.ReactNode;
  title: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 items-center p-6 w-full rounded overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-3 items-center">
        <p className="font-semibold text-xl text-center text-indigo-500">{title}</p>
        <p className="text-md text-center text-gray-700 max-w-prose">{description}</p>
      </div>
      <div className="flex flex-wrap gap-3">{actions}</div>
    </div>
  );
}
