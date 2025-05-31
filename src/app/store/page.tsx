'use client'
import ContentLayout from "@/components/ContentLayout";
import ProductCard from "@/components/ui/ProductCard";
import { getProducts } from "@/services/products";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts(1, 20);
      setProducts(data.products);
    };

    fetchProducts();
  }, []);

  return (
    <ContentLayout>
      <h1>Store</h1>
      <p className="text-gray-500 mb-6">Explore our collection of products.</p>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </ContentLayout>
  );
}