import { Button as HeadlessUIButton } from '@headlessui/react';
import Link from 'next/link';

export default function Button({
  fullWidth,
  color,
  size,
  variant,
  disabled,
  icon,
  label,
  ...otherProps
}: {
  color?: 'primary' | 'error';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  label: React.ReactNode;
  size?: 'small' | 'large';
  variant?: 'outlined' | 'contained';
} & ({ isRouterLink: true; href: string } | { onClick?: () => void })) {
  const containedColors = {
    default: 'bg-gray-500 hover:bg-gray-400 focus-visible:outline-gray-500',
    disabled: 'bg-gray-400',
    error: 'bg-red-500 hover:bg-red-400 focus-visible:outline-red-500',
    primary: 'bg-indigo-500 hover:bg-indigo-400 focus-visible:outline-indigo-500',
  };
  const outlinedColors = {
    default: 'ring-gray-300 hover:bg-black/10',
    disabled: 'ring-gray-300 text-gray-500',
    error: 'ring-red-300 hover:bg-red/10',
    primary: 'ring-indigo-300 hover:bg-indigo/10',
  };
  const className =
    variant === 'contained'
      ? `flex gap-2 items-center justify-center rounded-md ${containedColors[disabled ? 'disabled' : color || 'default']} font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`
      : `flex gap-2 items-center justify-center rounded-md font-semibold ring-1 ring-inset ${outlinedColors[disabled ? 'disabled' : color || 'default']}`;
  const commonsProps = {
    className: [
      className,
      fullWidth ? 'w-full' : '',
      size === 'small'
        ? 'px-2.5 py-1.5 text-sm'
        : size === 'large'
          ? 'px-3.5 py-2.5 text-base'
          : 'px-3 py-2 text-base',
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
