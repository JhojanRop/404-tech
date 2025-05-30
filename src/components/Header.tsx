'use client'
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BuildingStorefrontIcon, HomeIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/solid'
import { Dialog, DialogPanel } from '@headlessui/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/../public/Logo.svg'

const navigation = [
  { name: 'Home', icon: <HomeIcon width={18} />, href: '/' },
  { name: 'Store', icon: <BuildingStorefrontIcon width={18} />, href: '/store' },
  { name: 'Search', icon: <MagnifyingGlassIcon width={18} />, href: '/search' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pathname = usePathname();
  const activePath = `/${pathname.split('/')[1] || ''}`;

  return (
    <header className="w-full bg-white h-20 flex items-center fixed top-0 z-50 shadow-sm">
      <nav aria-label="Global" className="w-full flex items-center px-6 justify-between">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">404 Tech Store</span>
            <Logo className="h-5 w-auto" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name} href={item.href}
              className="text-sm/6 font-semibold px-4 py-2 text-gray-900 flex items-center gap-2 rounded-4xl data-[active]:bg-viridian-600 hover:bg-viridian-600 data-[active]:text-black hover:text-black data-[active]:inset-shadow-sm hover:inset-shadow-sm transition-colors duration-200"
              {...item.href === activePath ? { 'data-active': true } : {}}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
          <Link href="/cart" data-count="1" className="group flex items-center p-2 border rounded-full relative after:content-[attr(data-count)] after:absolute after:-top-2.5 after:-right-2.5 after:bg-viridian-500 after:text-black after:text-xs after:font-bold after:rounded-full after:w-6 after:h-6 after:flex after:items-center after:justify-center">
            <ShoppingCartIcon
              aria-hidden="true"
              className="size-5 shrink-0 text-black"
            />
            <span className="sr-only">items in cart, view cart</span>
          </Link>
          <Link href="/" className="group flex items-center p-2 border rounded-full">
            <UserIcon
              aria-hidden="true"
              className="size-5 shrink-0 text-black"
            />
            <span className="sr-only">Your account</span>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">404 Tech Store</span>
              <Logo className="h-5 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="py-6">
                <Link
                  href="/cart"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  <div className='flex items-center justify-between gap-2'>
                    <p>Cart</p>
                    <p>1</p>
                  </div>
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  My account
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
