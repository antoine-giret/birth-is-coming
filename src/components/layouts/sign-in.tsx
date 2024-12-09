import DefaultLayout from './default';

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DefaultLayout justifyCenter>
      <div className="flex flex-col gap-8 mx-auto w-full max-w-xl border border-gray-100 rounded-xl p-6 bg-white">
        {children}
      </div>
    </DefaultLayout>
  );
}
