import Card from './card';

export type TCardsListItem = {
  description: React.ReactNode;
  href?: string;
  key: string;
  title: React.ReactNode;
};

export default function CardsList({
  title,
  items,
}: {
  items: TCardsListItem[];
  title: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-indigo-500">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {items?.map(({ key, ...props }) => (
          <div className="w-full max-w-sm" key={key}>
            <Card {...props} />
          </div>
        ))}
      </div>
    </div>
  );
}
