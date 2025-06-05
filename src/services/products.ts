import { api } from "@/lib/api";
import { Product } from "@/types/product";

const getProducts = async (page: number, limit: number, sort?: string, categories?: string | string[]) => {
  const sortOptions: Record<string, string> = {
    "Best Rating": "best_rating",
    "Newest": "newest",
    "Price: Low to High": "price_low_to_high",
    "Price: High to Low": "price_high_to_low",
  };

  const sortValue = sort && sortOptions[sort] ? sortOptions[sort] : "";

  // Construir query params
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (sortValue) params.append("sort", sortValue);

  if (categories) {
    if (Array.isArray(categories)) {
      categories.forEach((cat) => params.append("categories[]", cat));
    } else {
      params.append("categories", categories);
    }
  }

  return api.get(`/products?${params.toString()}`) as Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    filters?: { categories?: string[] };
  }>;
};

const getProductById = async (id: number | string) => {
  return api.get(`/products/${id}`) as Promise<Product>;
};

const getCategories = async () => {
  return api.get("/products/categories") as Promise<{
    categories: string[];
    total: number;
  }>;
};

export { getProducts, getProductById, getCategories };