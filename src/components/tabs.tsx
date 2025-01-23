import Link from 'next/link';

import useQueryParams from '@/hooks/query-params';

export default function Tabs<T extends string>({
  items,
  selectedKey,
}: {
  items: Array<{
    key: T;
    Icon?: React.ForwardRefExoticComponent<
      React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
        title?: string;
        titleId?: string;
      } & React.RefAttributes<SVGSVGElement>
    >;
    label: React.ReactNode;
  }>;
  selectedKey: T;
}) {
  const { createQueryString } = useQueryParams();

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
      <ul className="flex flex-wrap h-11 -mb-px">
        {items.map(({ key, label, Icon }) => {
          const active = key === selectedKey;
          const className = `flex gap-2 items-center px-4 h-11 border-b-2 rounded-t-lg ${active ? 'text-indigo-500 border-indigo-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300'}`;

          return (
            <li className="me-2 h-11" key={key}>
              <Link
                aria-current={active ? 'page' : undefined}
                href={createQueryString([{ key: 'tab', value: key }])}
                className={className}
              >
                {Icon && <Icon className={`w-6 ${active ? 'text-indigo-500' : 'text-gray-500'}`} />}
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
