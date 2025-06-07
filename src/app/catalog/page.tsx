'use client'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import { generatePaginationArray } from '@/utils/pagination'
import { getProducts, getCategories } from '@/services/products'
import { Product } from '@/types/product'
import { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import ProductCard from '@/components/ui/ProductCard'
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton'

type SortOption = {
  name: string;
  current: boolean;
}

const defaultSortOptions: SortOption[] = [
  { name: 'Best Rating', current: false },
  { name: 'Newest', current: false },
  { name: 'Price: Low to High', current: false },
  { name: 'Price: High to Low', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function StorePage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(1);
  const [sortOptions, setSortOptions] = useState<SortOption[]>(defaultSortOptions);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked ? [...prev, category] : prev.filter(cat => cat !== category)
    );
    setPage(1);
    setLoading(true);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(
          page,
          15,
          sortOptions.find(option => option.current)?.name,
          selectedCategories.length > 0 ? selectedCategories : undefined
        );
        setProducts(data.products);
        setPagesCount(Math.ceil(data.total / data.limit));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, sortOptions, selectedCategories]);


  const handleSortChange = (optionName: string) => {
    const updatedSortOptions = sortOptions.map(option => ({
      ...option,
      current: option.name === optionName,
    }));
    setSortOptions(updatedSortOptions);
    setLoading(true);
    setPage(1);
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>
                <Disclosure as="div" className="border-t border-gray-200 px-4 py-6" defaultOpen>
                  <h3 className="-mx-2 -my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">Category</span>
                      <span className="ml-6 flex items-center">
                        <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                        <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                      </span>
                    </DisclosureButton>
                  </h3>
                  <DisclosurePanel className="pt-6">
                    <div className="space-y-6">
                      {categories.map((cat, idx) => (
                        <div key={cat} className="flex gap-3">
                          <div className="flex h-5 shrink-0 items-center">
                            <div className="group grid size-4 grid-cols-1">
                              <input
                                value={cat}
                                id={`filter-mobile-category-${idx}`}
                                name="category[]"
                                type="checkbox"
                                checked={selectedCategories.includes(cat)}
                                onChange={e =>
                                  handleCategoryChange(cat, e.target.checked)
                                }
                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              />
                            </div>
                          </div>
                          <label
                            htmlFor={`filter-mobile-category-${idx}`}
                            className="min-w-0 flex-1 text-gray-500"
                          >
                            {cat}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-gray-200 py-5">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Catalog</h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left z-20">
                <div>
                  <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <button
                          onClick={() => handleSortChange(option.name)}
                          className={classNames(
                            option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                            'block w-full text-left px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
                          )}
                        >
                          {option.name}
                        </button>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filtro lateral solo de categorías */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                <Disclosure as="div" className="border-b border-gray-200 py-6" defaultOpen>
                  <h3 className="-my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">Category</span>
                      <span className="ml-6 flex items-center">
                        <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                        <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                      </span>
                    </DisclosureButton>
                  </h3>
                  <DisclosurePanel className="pt-6">
                    <div className="space-y-4">
                      {categories.map((cat, idx) => (
                        <div key={cat} className="flex gap-3">
                          <div className="flex h-5 shrink-0 items-center">
                            <div className="group grid size-4 grid-cols-1">
                              <input
                                value={cat}
                                id={`filter-category-${idx}`}
                                name="category[]"
                                type="checkbox"
                                checked={selectedCategories.includes(cat)}
                                onChange={e =>
                                  handleCategoryChange(cat, e.target.checked)
                                }
                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              />
                            </div>
                          </div>
                          <label htmlFor={`filter-category-${idx}`} className="text-sm text-gray-600">
                            {cat}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              </form>
              {/* Product grid */}
              <section className="lg:col-span-3">
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:col-span-3 lg:grid-cols-3">
                  {loading && [1, 2, 3, 4, 5, 6].map(id => (
                    <ProductCardSkeleton key={`skeleton-${id}`} />
                  ))}

                  {!loading && products.length === 0 && (
                    <div className="col-span-3 text-center text-gray-500">
                      No products found.
                    </div>
                  )}
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>

                <nav aria-label="Pagination" className="w-full mx-auto mt-10 flex max-w-7xl justify-between text-sm font-medium text-gray-700 dark:text-foreground">
                  <div className="min-w-0 flex-1">
                    <button onClick={() => page > 1 && setPage(prev => prev - 1)} className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-background text-foreground px-4 hover:bg-viridian-700 hover:border-viridian-700 focus:border-viridian-700 focus:ring-2 focus:ring-viridan-600/25 focus:ring-offset-1 focus:ring-offset-viridan-600 focus:outline-hidden cursor-pointer">Previous</button>
                  </div>
                  <div className="hidden space-x-2 sm:flex">
                    {generatePaginationArray(page, pagesCount).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => typeof pageNumber === 'number' && setPage(pageNumber)}
                        disabled={typeof pageNumber === 'string'}
                        className={classNames(
                          'inline-flex h-10 items-center rounded-md border px-4 focus:outline-hidden',
                          typeof pageNumber === 'string'
                            ? 'border-transparent cursor-default'
                            : 'border-gray-300 hover:bg-viridian-600 hover:border-viridian-800 focus:border-viridian-700 focus:ring-2 focus:ring-viridian-600/25 focus:ring-offset-1 focus:ring-offset-viridian-600',
                          pageNumber === page
                            ? 'bg-viridian-600 border-viridian-800 text-white'
                            : 'bg-transparent'
                        )}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                  <div className="flex min-w-0 flex-1 justify-end">
                    <button onClick={() => page < pagesCount && setPage(prev => prev + 1)} className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-background text-foreground px-4 hover:bg-viridian-700 hover:border-viridian-700 focus:border-viridian-700 focus:ring-2 focus:ring-viridan-600/25 focus:ring-offset-1 focus:ring-offset-viridan-600 focus:outline-hidden cursor-pointer">Next</button>
                  </div>
                </nav>
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
