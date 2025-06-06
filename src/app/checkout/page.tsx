'use client'
import { useCart } from '@/context/CartContext'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { LockClosedIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useState } from 'react'
import { COLOMBIA_LOCATIONS } from '@/utils/constants'
import Link from 'next/link'
import { consumeDiscountCode } from '@/services/discountCodes'
import { createOrder } from '@/services/orders'

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const products = state.cart;

  const removeFromCart = (productId: number | string) => {
    dispatch({ type: "REMOVE_FROM_CART", id: productId });
  };

  const subtotal = products.reduce((total, item) => {
    const price = Number(item.price);
    return total + (isNaN(price) ? 0 : price * (item.quantity || 1));
  }, 0);

  const [discountCode, setDiscountCode] = useState({ code: "", amount: 0 });
  const [discountError, setDiscountError] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);

  const handleDiscountCode = async (code: string) => {
    if (!code.trim()) {
      setDiscountError("Please add a discount code");
      return;
    }

    setDiscountLoading(true);
    setDiscountError("");

    try {
      const discount = await consumeDiscountCode(code);
      setDiscountCode({
        code: discount.code,
        amount: discount.amount,
      });
      setDiscountError("");
    } catch (error) {
      setDiscountError(error instanceof Error ? error.message : "Invalid discount code");
      setDiscountCode({ code: "", amount: 0 });
    } finally {
      setDiscountLoading(false);
    }
  };

  const discount = Number((subtotal * (discountCode.amount || 0)).toFixed(2));
  const taxes = Number((subtotal * 0.19).toFixed(2));
  const shipping = 5.99;
  const total = (subtotal - discount + taxes + shipping).toFixed(2);

  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const states = Object.keys(COLOMBIA_LOCATIONS) as Array<keyof typeof COLOMBIA_LOCATIONS>;
  const cities = selectedState && states.includes(selectedState as keyof typeof COLOMBIA_LOCATIONS)
    ? COLOMBIA_LOCATIONS[selectedState as keyof typeof COLOMBIA_LOCATIONS]
    : [];

  const [formData, setFormData] = useState({
    email: '',
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    address: '',
    postalCode: '',
    sameAsShipping: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (products.length === 0) {
      setOrderError("No products in cart");
      return;
    }

    if (!selectedState || !selectedCity || !formData.address || !formData.postalCode) {
      setOrderError("Please complete all shipping information");
      return;
    }

    setIsSubmitting(true);
    setOrderError("");

    try {
      const orderProducts = products.map(product => ({
        productID: product.id.toString(),
        price: Number(product.price),
        quantity: product.quantity || 1
      }));

      // Preparar información de envío
      const shippingInfo = {
        address: formData.address,
        city: selectedCity,
        state: selectedState,
        zipcode: formData.postalCode
      };

      const order = await createOrder(orderProducts, shippingInfo, "000");

      dispatch({ type: "CLEAR_CART" });
      alert(`Order created successfully! ID: ${order.id}`);

    } catch (error) {
      console.error("Error creating order:", error);
      setOrderError(error instanceof Error ? error.message : "Error creating order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="w-full max-w-full lg:flex lg:min-h-full lg:overflow-hidden overflow-x-hidden">
        <h1 className="sr-only">Checkout</h1>

        {/* Mobile order summary */}
        <section aria-labelledby="order-heading" className="bg-gray-50 px-4 py-6 sm:px-6 lg:hidden">
          <Disclosure as="div" className="mx-auto max-w-lg">
            <div className="flex items-center justify-between">
              <h2 id="order-heading" className="text-lg font-medium text-gray-900">
                Your Order
              </h2>
              <DisclosureButton className="group font-medium text-viridian-600 hover:text-viridian-500">
                <span className="group-not-data-open:hidden">Hide full summary</span>
                <span className="group-data-open:hidden">Show full summary</span>
              </DisclosureButton>
            </div>

            <DisclosurePanel>
              <ul role="list" className="divide-y divide-gray-200 border-b border-gray-200">
                {(products.length > 0) ? (
                  products.map((product) => (
                    <li key={product.id} className="flex space-x-6 py-6">
                      <div className="relative w-40 h-40 flex-none rounded-md bg-white">
                        <Image
                          alt={product.name}
                          src={product.images[0]}
                          fill
                          className="p-1.5 object-contain object-center rounded-md"
                        />
                      </div>
                      <div className="flex flex-col justify-between space-y-4">
                        <div className="space-y-1 text-sm font-medium">
                          <h3 className="text-gray-900">{product.name}</h3>
                          <p className="text-gray-700 font-light">${product.price}</p>
                        </div>
                        <div className="flex space-x-4">
                          <Link href="/cart" className="block text-sm font-medium text-viridian-600 hover:text-viridian-500">
                            Edit
                          </Link>
                          <div className="flex border-l border-gray-300 pl-4">
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              className="text-sm font-medium text-viridian-600 hover:text-viridian-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-6 text-center text-gray-500">
                    No items in your cart.
                  </li>
                )}
              </ul>

              <form className="mt-10">
                <label htmlFor="discount-code-mobile" className="block text-sm/6 font-medium text-gray-700">
                  Discount code
                </label>
                <div className="mt-2 flex space-x-4">
                  <input
                    id="discount-code-mobile"
                    name="discount-code-mobile"
                    type="text"
                    disabled={products.length === 0 || discountLoading}
                    value={discountCode.code}
                    onChange={(e) => {
                      setDiscountCode({ ...discountCode, code: e.target.value });
                      if (discountError) setDiscountError(""); // Limpiar error al escribir
                    }}
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-viridian-600 sm:text-sm/6"
                  />
                  <button
                    type="button"
                    disabled={products.length === 0 || discountLoading || !discountCode.code.trim()}
                    onClick={() => handleDiscountCode(discountCode.code)}
                    className="rounded-md bg-gray-200 px-4 text-sm font-medium text-gray-600 hover:bg-gray-300 focus:ring-2 focus:ring-viridian-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {discountLoading ? "Aplicando..." : "Apply"}
                  </button>
                </div>
                {discountError && (
                  <p className="mt-2 text-sm text-red-600">{discountError}</p>
                )}
              </form>

              <dl className="mt-10 space-y-6 text-sm font-medium text-gray-500">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">${subtotal}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="flex">
                    Discount
                    {discountCode.code && (
                      <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                        {discountCode.code} ({discountCode.amount * 100}%)
                      </span>
                    )}
                  </dt>
                  <dd className="text-gray-900">{discount ? `-$${discount}` : 0}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>
                    Taxes
                    <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                      19%
                    </span>
                  </dt>
                  <dd className="text-gray-900">${taxes ?? 0}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd className="text-gray-900">${shipping ?? 0}</dd>
                </div>
              </dl>
            </DisclosurePanel>

            <p className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6 text-sm font-medium text-gray-900">
              <span className="text-base">Total</span>
              <span className="text-base">${total}</span>
            </p>
          </Disclosure>
        </section>

        {/* Checkout form */}
        <section
          aria-labelledby="payment-heading"
          className="flex-auto overflow-y-auto px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-0 lg:pb-24 lg:min-w-0"
        >
          <h2 id="payment-heading" className="sr-only">
            Payment and shipping details
          </h2>

          <div className="mx-auto max-w-lg lg:pt-16">
            <form className="mt-6" onSubmit={handleCreateOrder}>
              <div className="grid grid-cols-12 gap-x-4 gap-y-6">
                <div className="col-span-full">
                  <label htmlFor="email-address" className="block text-sm/6 font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-viridian-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="name-on-card" className="block text-sm/6 font-medium text-gray-700">
                    Name on card
                  </label>
                  <div className="mt-2">
                    <input
                      id="name-on-card"
                      name="nameOnCard"
                      type="text"
                      autoComplete="cc-name"
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-viridian-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="card-number" className="block text-sm/6 font-medium text-gray-700">
                    Card number
                  </label>
                  <div className="mt-2">
                    <input
                      id="card-number"
                      name="cardNumber"
                      type="text"
                      pattern="[0-9\s]{13,19}"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-viridian-600 sm:text-sm/6 invalid:outline-red-500 invalid:focus:outline-red-500"
                    />
                  </div>
                </div>

                <div className="col-span-8 sm:col-span-9">
                  <label htmlFor="expiration-date" className="block text-sm/6 font-medium text-gray-700">
                    Expiration date (MM/YY)
                  </label>
                  <div className="mt-2">
                    <input
                      id="expiration-date"
                      name="expirationDate"
                      type="month"
                      pattern="\d{2}/\d{2}"
                      autoComplete="cc-exp"
                      value={formData.expirationDate}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-viridian-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="col-span-4 sm:col-span-3">
                  <label htmlFor="cvc" className="block text-sm/6 font-medium text-gray-700">
                    CVC
                  </label>
                  <div className="mt-2">
                    <input
                      id="cvc"
                      name="cvc"
                      type="text"
                      pattern="[0-9]{3,4}"
                      inputMode="numeric"
                      autoComplete="csc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-viridian-600 sm:text-sm/6 invalid:outline-red-500 invalid:focus:outline-red-500"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="address" className="block text-sm/6 font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-2">
                    <input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-viridian-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="col-span-full sm:col-span-4">
                  <label htmlFor="region" className="block text-sm/6 font-medium text-gray-700">
                    State / Province
                  </label>
                  <div className="mt-2">
                    <select
                      id="region"
                      name="region"
                      value={selectedState}
                      onChange={e => {
                        setSelectedState(e.target.value);
                        setSelectedCity('');
                      }}
                      required
                      className="mt-2 block w-full rounded-md bg-white px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-viridian-600 sm:text-sm/6"
                    >
                      <option value="">Selecciona un estado</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-full sm:col-span-4">
                  <label htmlFor="city" className="block text-sm/6 font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-2">
                    <select
                      id="city"
                      name="city"
                      value={selectedCity}
                      onChange={e => setSelectedCity(e.target.value)}
                      disabled={!selectedState}
                      required
                      className="mt-2 block w-full rounded-md bg-white px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-viridian-600 sm:text-sm/6 disabled:bg-gray-100"
                    >
                      <option value="">Selecciona una ciudad</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-span-full sm:col-span-4">
                  <label htmlFor="postal-code" className="block text-sm/6 font-medium text-gray-700">
                    Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      id="postal-code"
                      name="postalCode"
                      type="text"
                      autoComplete="postal-code"
                      pattern="^\d{6}$"
                      inputMode="numeric"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-viridian-600 sm:text-sm/6 invalid:outline-red-500 invalid:focus:outline-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <div className="flex h-5 shrink-0 items-center">
                  <div className="group grid size-4 grid-cols-1">
                    <input
                      id="same-as-shipping"
                      name="sameAsShipping"
                      type="checkbox"
                      checked={formData.sameAsShipping}
                      onChange={handleInputChange}
                      className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-viridian-600 checked:bg-viridian-600 indeterminate:border-viridian-600 indeterminate:bg-viridian-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-viridian-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                    />
                    <svg
                      fill="none"
                      viewBox="0 0 14 14"
                      className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                    >
                      <path
                        d="M3 8L6 11L11 3.5"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-has-checked:opacity-100"
                      />
                      <path
                        d="M3 7H11"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-has-indeterminate:opacity-100"
                      />
                    </svg>
                  </div>
                </div>
                <label htmlFor="same-as-shipping" className="text-sm font-medium text-gray-900">
                  Billing address is the same as shipping address
                </label>
              </div>

              {orderError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{orderError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || products.length === 0}
                className="mt-6 w-full rounded-md border border-transparent bg-viridian-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-viridian-700 focus:ring-2 focus:ring-viridian-500 focus:ring-offset-2 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Procesando..." : `Pay $${total}`}
              </button>

              <p className="mt-6 flex justify-center text-sm font-medium text-gray-500">
                <LockClosedIcon aria-hidden="true" className="mr-1.5 size-5 text-gray-400" />
                Payment details stored in plain text
              </p>
            </form>
          </div>
        </section>

        {/* Order summary - Desktop */}
        <section aria-labelledby="summary-heading" className="hidden w-full max-w-md flex-col bg-gray-50 lg:flex lg:flex-shrink-0">
          <h2 id="summary-heading" className="sr-only">
            Order summary
          </h2>

          <ul role="list" className="flex-auto h-64 divide-y divide-gray-200 overflow-y-auto px-6">
            {products.length > 0 ? (
              products.map((product) => (
                <li key={product.id} className="flex space-x-6 py-6">
                  <div className="relative w-40 h-40 flex-none rounded-lg bg-white">
                    <Image
                      alt={product.name}
                      src={product.images[0]}
                      fill
                      className="p-1.5 object-contain object-center rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col justify-between space-y-4">
                    <div className="space-y-1 text-sm font-medium">
                      <h3 className="text-gray-900">{product.name}</h3>
                      <p className="text-gray-700 font-light">${product.price}</p>
                    </div>
                    <div className="flex space-x-4">
                      <Link href="/cart" className="block text-sm font-medium text-viridian-600 hover:text-viridian-500">
                        Edit
                      </Link>
                      <div className="flex border-l border-gray-300 pl-4">
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-sm font-medium text-viridian-600 hover:text-viridian-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="py-6 text-center text-gray-500">
                No items in your cart.
              </li>
            )}
          </ul>

          <div className="sticky bottom-0 flex-none border-t border-gray-200 bg-gray-50 p-6">
            <form>
              <label htmlFor="discount-code" className="block text-sm/6 font-medium text-gray-700">
                Discount code
              </label>
              <div className="mt-2 flex space-x-4">
                <input
                  id="discount-code"
                  name="discount-code"
                  type="text"
                  disabled={products.length === 0 || discountLoading}
                  value={discountCode.code}
                  onChange={(e) => {
                    setDiscountCode({ ...discountCode, code: e.target.value });
                    if (discountError) setDiscountError("");
                  }}
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-viridian-600 sm:text-sm/6"
                />
                <button
                  type="button"
                  disabled={products.length === 0 || discountLoading || !discountCode.code.trim()}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDiscountCode(discountCode.code);
                  }}
                  className="rounded-md bg-viridian-600 text-white disabled:bg-gray-200 px-4 text-sm font-medium disabled:text-gray-600 hover:bg-viridian-700 focus:ring-2 focus:ring-viridian-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {discountLoading ? "Applying..." : "Apply"}
                </button>
              </div>
              {discountError && (
                <p className="mt-2 text-sm text-red-600">{discountError}</p>
              )}
            </form>

            <dl className="mt-10 space-y-6 text-sm font-medium text-gray-500">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="text-gray-900">{subtotal}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex">
                  Discount
                  {discountCode.code && (
                    <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                      {discountCode.code} ({discountCode.amount * 100}%)
                    </span>
                  )}
                </dt>
                <dd className="text-gray-900">{discount ? `-$${discount}` : 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt>
                  Taxes
                  <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                    19%
                  </span>
                </dt>
                <dd className="text-gray-900">${taxes}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="text-gray-900">${shipping}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                <dt>Total</dt>
                <dd className="text-base">${total}</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
    </>
  )
}