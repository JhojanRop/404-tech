import { HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Product } from "@/types/product";
import { useCart } from '@/context/CartContext'
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  const { state, dispatch } = useCart();
  const [productQuantity, setProductQuantity] = useState(state.cart.find(item => item.id === product.id)?.quantity || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", product });
    setProductQuantity(prev => prev + 1);
  };

  const handleButtonClick = (e: React.MouseEvent, callback?: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    if (callback) callback();
  };

  return (
    <Link href={`/product/${product.id}`} className="block">
      <div className="border border-gray-300 rounded-lg bg-white">
        <div className="relative aspect-square w-full px-6 overflow-hidden rounded-lg bg-white group">
          {product.discount && <span className="block absolute top-2.5 left-2.5 bg-viridian-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md z-10">Sale {product.discount}%</span>}
          <button
            className="block absolute top-4 right-4 text-gray-700 cursor-pointer z-10"
            onClick={e => handleButtonClick(e, () => setIsLiked(!isLiked))}
          >
            <HeartIcon className={`h-6 w-6 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
          </button>

          <Image
            src={product.images?.[0] || '/placeholder.png'}
            alt={product.name}
            fill
            className="px-6 py-4 object-contain rounded-lg group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        <div className="px-6 pb-6 flex flex-col gap-2">
          <h3 className="font-semibold whitespace-nowrap overflow-x-hidden overflow-ellipsis">{product.name}</h3>

          <div className="group">
            <div className="space-y-2 group-hover:hidden">
              <p className="text-gray-400 font-medium">{product.category?.[0]}</p>
              <span className="flex gap-3">
                <p className="font-semibold before:content-['$']">{product.price}</p>
                {product.oldPrice && (
                  <span className="line-through text-gray-500 font-medium before:content-['$']">{product.oldPrice}</span>
                )}
              </span>
            </div>

            <div className="hidden group-hover:flex justify-between items-center py-2">
              <button
                className="w-4/5 py-2 font-medium bg-viridian-600 text-white rounded-lg cursor-pointer"
                onClick={e => handleButtonClick(e)}
              >
                Buy ${product.price}
              </button>
              <button
                className="p-2 border relative border-viridian-600 text-viridian-600 rounded-lg cursor-pointer"
                onClick={e => handleButtonClick(e, handleAddToCart)}
              >
                {productQuantity > 0 && (<span className="flex justify-center items-center absolute -top-1.5 -right-1.5 text-white font-medium bg-viridian-600 text-xs w-5 h-5 rounded-full">{productQuantity}</span>)}
                <ShoppingBagIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}