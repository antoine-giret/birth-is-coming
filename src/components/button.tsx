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
    default: [
      'bg-gray-500',
      disabled ? '' : 'hover:bg-gray-400 focus-visible:outline-gray-500',
    ].join(' '),
    error: ['bg-red-500', disabled ? '' : 'hover:bg-red-400 focus-visible:outline-red-500'].join(
      ' ',
    ),
    primary: [
      'bg-indigo-500',
      disabled ? '' : 'hover:bg-indigo-400 focus-visible:outline-indigo-500',
    ].join(' '),
  };
  const outlinedColors = {
    default: ['ring-gray-300', disabled ? '' : 'hover:bg-black/10'].join(' '),
    error: ['ring-red-300 text-red-500', disabled ? '' : 'hover:bg-red/10'].join(' '),
    primary: ['ring-indigo-300 text-indigo-500', disabled ? '' : 'hover:bg-indigo/10'].join(' '),
  };
  const commonsClassName = 'flex gap-2 items-center justify-center rounded-md font-semibold';
  const variantClassName =
    variant === 'contained'
      ? `${containedColors[color || 'default']} text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`
      : `ring-1 ring-inset ${outlinedColors[color || 'default']}`;
  const commonsProps = {
    className: [
      commonsClassName,
      variantClassName,
      fullWidth ? 'w-full' : '',
      size === 'small'
        ? 'px-2.5 py-1.5 text-sm'
        : size === 'large'
          ? 'px-3.5 py-2.5 text-base'
          : 'px-3 py-2 text-base',
    ].join(' '),
    style: {
      filter: disabled ? 'grayscale(1)' : undefined,
      opacity: disabled ? 0.5 : 1,
    },
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
