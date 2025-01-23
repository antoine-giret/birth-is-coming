export type THeader = { label: React.ReactNode; sortable?: boolean };

export type TRow<T extends string> = { key: string; values: { [key in T]: React.ReactNode } };

export default function Table<T extends string>({
  columns,
  headersMap,
  rows,
  handleSort,
}: {
  columns: readonly T[];
  handleSort: (key: T) => void;
  headersMap: { [key in T]: THeader };
  rows: TRow<T>[];
}) {
  return (
    <div className="relative overflow-x-auto bg-white rounded-2xl">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs uppercase">
          <tr>
            {columns.map((key) => {
              const { label, sortable } = headersMap[key];

              return (
                <th key={key} scope="col">
                  <div className="flex items-center px-6 py-4">
                    {label}
                    {sortable && (
                      <a href="#" onClick={() => handleSort(key)}>
                        <svg
                          className="w-3 h-3 ms-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, values }) => (
            <tr key={key} className="border-t">
              {columns.map((key) => (
                <td className="px-6 py-3" key={key}>
                  {values[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
