'use client';

import { Field, Select as HeadlessuiSelect, Label } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Select<T extends string>({
  id,
  label,
  required,
  disabled,
  value,
  options,
  onChange,
}: {
  id: string;
  disabled?: boolean;
  label: string;
  onChange: (value: T) => void;
  options: Array<{ label: React.ReactNode; value: T }>;
  required?: boolean;
  value: T;
}) {
  return (
    <Field className="space-y-1">
      <Label className="block text-sm/6 font-medium" htmlFor="email">
        {label}
      </Label>
      <div className="relative">
        <HeadlessuiSelect
          className="appearance-none block w-full rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          disabled={disabled}
          id={id}
          name={id}
          onChange={({ currentTarget: { value } }) => onChange(value as T)}
          required={required}
          value={value}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </HeadlessuiSelect>
        <ChevronDownIcon
          className="group pointer-events-none absolute top-2.5 right-2.5 size-4"
          aria-hidden="true"
        />
      </div>
    </Field>
  );
}
