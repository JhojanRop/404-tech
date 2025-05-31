'use client'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

interface DropdownProps {
  name: string
  options: {
    label: string
    action: () => void
    active?: boolean
    disabled?: boolean
  }[],
  icon?: React.ReactNode
}

export default function Dropdown({ name, options, icon }: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
          {icon && <span className="w-5">{icon}</span>}
          {name}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in"
      >
        <div className="py-1">
          {options.map((option, index) => (
            <MenuItem key={index}>
              <button
                className={`block w-full px-4 py-2 text-sm text-left ${option.active
                  ? 'bg-gray-300 text-gray-900 cursor-not-allowed'
                  : 'text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                  } data-[focus]:outline-hidden cursor-pointer ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                onClick={(e) => {
                  e.preventDefault()
                  option.action()
                }}
                disabled={option.disabled}
              >
                {option.label}
              </button>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  )
}