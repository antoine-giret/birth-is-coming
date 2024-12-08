import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { GiftIcon } from '@heroicons/react/24/outline';

const now = new Date();

export default function Home() {
  return (
    <div className="flex flex-col min-h-full font-[family-name:var(--font-geist-sans)]">
      <Disclosure as="header">
        <div className="shrink-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            <div className="flex items-center">
              <a className="flex items-center gap-3 shrink-0" href="#">
                <GiftIcon className="w-5" />
                <span className="text-xl font-bold">Bébé arrive</span>
              </a>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 justify-center w-8 h-8 overflow-hidden">
                      <span className="absolute -inset-1.5"></span>
                      <span className="sr-only">Open user menu</span>
                      <span className="font-medium text-gray-600 dark:text-gray-300">AG</span>
                      {/* <img
                        alt=""
                        className="size-8 rounded-full"
                        src="
                      /> */}
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <MenuItem>
                      <a
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        href="#"
                      >
                        Mon profil
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </Disclosure>
      <main className="grow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">Hello World</div>
      </main>
      <footer className="shrink-0">
        <div className="flex items-center justify-center mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <span className="text-sm">© {now.getFullYear()} Giret</span>
        </div>
      </footer>
    </div>
  );
}
