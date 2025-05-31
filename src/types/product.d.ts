export interface Product {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  oldPrice?: number;
  rating?: number;
  category?: string[];
  brand?: string[];
  stock: number;
  images: string[];
  specs: Record<string, string>;
  usage?: string;
  createdAt: Date;
}