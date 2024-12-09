import { Button as HeadlessUIButton } from '@headlessui/react';
import Link from 'next/link';

export default function Button({
  fullWidth,
  size,
  variant,
  disabled,
  icon,
  label,
  ...otherProps
}: {
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  label: React.ReactNode;
  size?: 'small';
  variant?: 'outlined' | 'contained';
} & ({ isRouterLink: true; href: string } | { onClick?: () => void })) {
  const className =
    variant === 'contained'
      ? 'flex gap-2 items-center justify-center rounded-md bg-indigo-500 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
      : 'flex gap-2 items-center justify-center rounded-md text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-black/10';
  const commonsProps = {
    className: [
      className,
      fullWidth ? 'w-full' : '',
      size === 'small' ? 'px-2.5 py-1.5' : 'px-3.5 py-2.5',
    ].join(' '),
    disabled,
  };

  return 'isRouterLink' in otherProps ? (
    <HeadlessUIButton {...commonsProps} as={Link} href={otherProps.href}>
      {icon}
      {label}
    </HeadlessUIButton>
  ) : (
    <HeadlessUIButton {...commonsProps} onClick={otherProps.onClick}>
      {icon}
      {label}
    </HeadlessUIButton>
  );
}
