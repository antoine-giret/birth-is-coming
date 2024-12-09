import NextLink from 'next/link';
import React from 'react';

export default function Link({ href, text }: { href: string; text: React.ReactNode }) {
  return (
    <NextLink className="font-semibold text-sm text-indigo-500 hover:text-indigo-400" href={href}>
      {text}
    </NextLink>
  );
}
