import { Product } from "@/types/product";

export function getProducts() {
  return fetch("/api/products")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      return res.json();
    })
}

export function createProduct(product: Product) {
  return fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to create product");
      }
      return res.json();
    })
}