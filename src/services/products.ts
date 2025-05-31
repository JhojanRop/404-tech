import { api } from "@/lib/api";
import { Product } from "@/types/product";

const getProducts = async (page: number, limit: number) => {
  return api.get(`/products?page=${page}&limit=${limit}`) as Promise<Product[]>;
};

const getProductById = async (id: number | string) => {
  return api.get(`/products/${id}`) as Promise<Product>;
};


export { getProducts, getProductById }