'use client'

import { useEffect, useState } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { Product } from '@/types/product'
import { useParams } from 'next/navigation'
import { getProductById } from '@/services/products'
import Image from 'next/image'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import { useCart } from '@/context/CartContext'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product>()
  const { id } = useParams()
  const isLoading = !product
  const { dispatch, state } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      if (typeof id === 'string' || typeof id === 'number') {
        const data = await getProductById(id)
        setProduct(data)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault()
    if (product) {
      dispatch({ type: 'ADD_TO_CART', product })
    }
  }

  const isInCart = product && state.cart.some(item => item.id === product.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-gray-500">Loading product...</span>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6">
                {product?.images?.map((imgUrl, idx) => (
                  <Tab
                    key={idx}
                    className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:ring-3 focus:ring-viridian-500/50 focus:ring-offset-4 focus:outline-hidden"
                  >
                    <span className="sr-only">Product image {idx + 1}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <Image alt={`Product image ${idx + 1}`} src={imgUrl} fill className="object-contain" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-viridian-500"
                    />
                  </Tab>
                ))}
              </TabList>
            </div>
            <TabPanels>
              {product?.images?.map((imgUrl, idx) => (
                <TabPanel key={idx}>
                  <div className="relative aspect-square w-full sm:rounded-lg overflow-hidden">
                    <Image alt={`Product image ${idx + 1}`} src={imgUrl} fill className="object-contain" />
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product?.name}</h1>
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">${product?.price}</p>
            </div>
            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        (product?.rating ?? 0) > rating ? 'text-viridian-500' : 'text-gray-300',
                        'size-5 shrink-0',
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{product?.rating} out of 5 stars</p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                dangerouslySetInnerHTML={{ __html: product?.description || '' }}
                className="space-y-6 text-base text-gray-700"
              />
            </div>
            <form className="mt-6" onSubmit={handleAddToCart}>
              <div className="mt-10 flex">
                <button
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-viridian-600 px-8 py-3 text-base font-medium text-white hover:bg-viridian-700 focus:ring-2 focus:ring-viridian-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden sm:w-full disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isInCart}
                >
                  {isInCart ? 'Added to cart' : 'Add to cart'}
                </button>
                <button
                  type="button"
                  className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <HeartIcon aria-hidden="true" className="size-6 shrink-0" />
                  <span className="sr-only">Add to favorites</span>
                </button>
              </div>
            </form>
            <section aria-labelledby="specs-heading" className="mt-12">
              <h2 id="specs-heading" className="sr-only">
                Specifications
              </h2>
              <div className="divide-y divide-gray-200 border-t">
                <div className="py-6">
                  <ul className="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300">
                    {product && Object.entries(product.specs).map(([key, value]) => (
                      <li key={key} className="pl-2">
                        <span className="font-medium text-gray-900">{key}:</span> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
