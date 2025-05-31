import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from '@/context/CartContext'

export default function ProductCard({ product }: { product: Product }) {
  const { state, dispatch } = useCart();
  const isInCart = state.cart.some(item => item.id === product.id);
  const [productQuantity, setProductQuantity] = useState(0);

  const handleAddToCart = () => {
    if (!isInCart) {
      dispatch({ type: 'ADD_TO_CART', product });
    }
  };

  useEffect(() => {
    if (productQuantity === 0) {
      setProductQuantity(0);
    }
  }, [productQuantity]);

  return (
    <div className="h-full border">
      <Link href={`/product/${product.id}`} className="">
        <div className="relative aspect-square w-full overflow-hidden group">
          {product.discount && (<span className="absolute top-0 left-0 bg-viridian-600 text-white text-xs px-6 py-1.5 uppercase z-20">Sale</span>)}
          <Image
            src={product.images?.[0]}
            alt={product.name}
            fill
            className="object-contain rounded-xl group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        <div className="text-center mt-2 mb-3">
          <h3 className="font-medium">{product.name?.slice(0, 20)}</h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            {product.discount && product.oldPrice && (<p className="text-sm line-through text-porcelain">{product.oldPrice}</p>)}
            <p className="text-sm">{product.price}</p>
          </div>
        </div>
      </Link>

      <div>
        <button
          className="block w-full py-1 bg-viridian-600 text-white rounded-md uppercase cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={isInCart}
        >
          {isInCart ? 'Added to cart' : 'Add to cart'}
        </button>
      </div>
    </div>
  )
}