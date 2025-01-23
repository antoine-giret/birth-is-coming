import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function useQueryParams() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (pairs: Array<{ key: string; value: string }>) => {
      const params = new URLSearchParams(searchParams.toString());
      pairs.forEach(({ key, value }) => params.set(key, value));

      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  return { createQueryString };
}
