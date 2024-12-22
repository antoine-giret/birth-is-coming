import { Button as HeadlessUIButton } from '@headlessui/react';

type TColor = 'success' | 'error';

export default function IconButton({
  color,
  icon,
  title,
  onClick,
}: {
  color: TColor;
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  const colors: { [key in TColor]: string } = {
    success: 'ring-green-500 hover:bg-green-50',
    error: 'ring-red-500 hover:bg-red-50',
  };

  return (
    <HeadlessUIButton
      className={`h-6 w-6 flex items-center justify-center rounded-full ring-1 ring-inset ${colors[color]}`}
      onClick={onClick}
      title={title}
    >
      {icon}
    </HeadlessUIButton>
  );
}
