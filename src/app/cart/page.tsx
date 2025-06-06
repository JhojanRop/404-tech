"use client";
import { CheckIcon, ClockIcon } from "@heroicons/react/20/solid";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();

  const removeFromCart = (productId: number | string) => {
    dispatch({ type: "REMOVE_FROM_CART", id: productId });
  };

  const subtotal = state.cart.reduce((total, item) => {
    const price = Number(item.price);
    return total + (isNaN(price) ? 0 : price * (item.quantity || 1));
  }, 0);

  const updateCartQuantity = (productId: number | string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", id: productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/checkout");
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          {state.cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-sm font-medium text-red-600 hover:text-red-500 cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        <form onSubmit={handleCheckout} className="mt-12">
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              {state.cart.map((product) => (
                <li key={product.id} className="flex py-6">
                  <div className="shrink-0">
                    <Image
                      alt={product.name}
                      src={product.images?.[0] || ''}
                      width={128}
                      height={128}
                      className="size-24 rounded-md object-contain sm:size-32"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                    <div>
                      <div className="flex justify-between">
                        <h4 className="text-sm">
                          <Link
                            href={`/product/${product.id}`}
                            className="font-medium text-gray-700 hover:text-gray-800"
                          >
                            {product.name}
                          </Link>
                        </h4>
                        <p className="ml-4 text-sm font-medium text-gray-900">
                          ${product.price}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center space-x-3">
                        <span className="sr-only">Quantity:</span>
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            type="button"
                            disabled={product.quantity === 1}
                            className="px-1 cursor-pointer"
                            onClick={() => updateCartQuantity(product.id, product.quantity - 1)}
                          >
                            <MinusIcon className="h-5 w-5 text-gray-500" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium text-gray-900">
                            {product.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={product.quantity === product.stock}
                            className="px-1 cursor-pointer"
                            onClick={() => updateCartQuantity(product.id, product.quantity + 1)}
                          >
                            <PlusIcon className="h-5 w-5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-1 items-end justify-between">
                      <p className="flex items-center space-x-2 text-sm text-gray-700">
                        {product.stock > 0 ? (
                          <CheckIcon
                            aria-hidden="true"
                            className="size-5 shrink-0 text-green-500"
                          />
                        ) : (
                          <ClockIcon
                            aria-hidden="true"
                            className="size-5 shrink-0 text-gray-300"
                          />
                        )}
                        <span>
                          {product.stock > 0 ? "In stock" : "Out of stock"}
                        </span>
                      </p>
                      <div className="ml-4">
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                        >
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section aria-labelledby="summary-heading" className="mt-10">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <div>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">
                    Subtotal
                  </dt>
                  <dd className="ml-4 text-base font-medium text-gray-900">
                    ${subtotal.toFixed(2)}
                  </dd>
                </div>
              </dl>
              <p className="mt-1 text-sm text-gray-500">
                Shipping and taxes will be calculated at checkout.
              </p>
            </div>

            <div className="mt-10">
              <Link
                href="/checkout"
                className="block w-full text-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-none cursor-pointer"
              >
                Checkout
              </Link>
            </div>

            <div className="mt-6 text-center text-sm">
              <p>
                or{" "}
                <Link
                  href="/catalog"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}