import { Product } from "@/types/product";
import { TrashIcon } from "@heroicons/react/24/outline";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const [addedToCart, setAddedToCart] = useState(false);
  const [productQuantity, setProductQuantity] = useState(0);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setProductQuantity(productQuantity + 1);
  };

  const handleRemoveFromCart = () => {
    setProductQuantity(0)
  }

  useEffect(() => {
    if (productQuantity === 0) {
      setAddedToCart(false);
    }
  }, [productQuantity]);

  return (
    <div className="h-full">
      <Link href={`/product/${product.id}`} className="">
        <div className="relative aspect-square w-full overflow-hidden group">
          {product.onSale && (<span className="absolute top-0 left-0 bg-viridian-600 text-white text-xs px-6 py-1.5 uppercase z-20">Sale</span>)}
          <Image
            src={product.thumbnail["512x512"]}
            alt={product.title}
            fill
            className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        <div className="text-center mt-2 mb-3">
          <h3 className="font-medium">{product.title}</h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            {product.onSale && product.oldPrice && (<p className="text-sm line-through text-porcelain">${product.oldPrice}</p>)}
            <p className="text-sm">${product.price}</p>
          </div>
        </div>
      </Link>

      <div>
        {addedToCart ? (
          <div className="flex items-center justify-between gap-4">
            <div className="w-full bg-white flex items-center border border-gray-300 rounded-md shadow-sm">
              <button
                className="w-6 h-6 p-1 m-1 flex items-center justify-center cursor-pointer text-viridian-700 disabled:text-gray-500"
                disabled={productQuantity === 1}
                onClick={() => setProductQuantity(productQuantity - 1)}
              >
                <MinusIcon width={20} height={20} />
              </button>

              <span className="block grow w-11 text-sm text-center font-semibold">{productQuantity}</span>

              <button
                className="w-6 h-6 p-1 m-1 flex items-center justify-center cursor-pointer text-viridian-700 disabled:text-gray-400"
                disabled={productQuantity === product.stock}
                onClick={() => setProductQuantity(productQuantity + 1)}
              >
                <PlusIcon width={20} height={20} />
              </button>
            </div>
            <button className="block text-red-500 p-1.5 cursor-pointer hover:text-red-600" onClick={handleRemoveFromCart}>
              <TrashIcon className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <button className="block w-full py-1 bg-viridian-600 text-white rounded-md uppercase cursor-pointer" onClick={handleAddToCart}>Add to cart</button>
        )}

      </div>
    </div>
  )
}