'use client';

import { Field as HeadlessuiField, Input, Legend } from '@headlessui/react';
import { HTMLInputTypeAttribute } from 'react';

export default function Field({
  id,
  label,
  action,
  required,
  disabled,
  type,
  autoComplete,
  value,
  onChange,
}: {
  action?: React.ReactNode;
  autoComplete?: string;
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  value: string;
}) {
  return (
    <HeadlessuiField className="space-y-1">
      <div className="flex items-center justify-between px-2">
        <Legend className="block text-sm/6 font-medium" htmlFor="email">
          {label}
        </Legend>
        {action}
      </div>
      <Input
        autoComplete={autoComplete}
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
        disabled={disabled}
        id={id}
        name={id}
        onChange={({ currentTarget: { value } }) => onChange(value)}
        required={required}
        type={type}
        value={value}
      />
    </HeadlessuiField>
  );
}
