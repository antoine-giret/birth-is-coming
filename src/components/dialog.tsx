import { DialogPanel, DialogTitle, Dialog as HeadlessuiDialog } from '@headlessui/react';

export default function Dialog({
  loading,
  open,
  title,
  children,
  actions,
  toggle,
}: {
  actions: React.ReactNode;
  children: React.ReactNode;
  loading: boolean;
  open: boolean;
  title: React.ReactNode;
  toggle: (open: boolean) => void;
}) {
  return (
    <HeadlessuiDialog
      open={open}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => !loading && toggle(false)}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 bg-black/50">
          <DialogPanel
            transition
            className="flex flex-col gap-3 w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-lg font-bold">
              {title}
            </DialogTitle>
            {children}
            <div className="flex justify-end gap-3">{actions}</div>
          </DialogPanel>
        </div>
      </div>
    </HeadlessuiDialog>
  );
}
