export interface Product {
  id: number | string;
  title: string;
  description?: string;
  price: number;
  onSale?: boolean;
  discountPercentage?: number;
  oldPrice?: number;
  rating?: number;
  category?: string[];
  brand?: string[];
  stock?: number;
  images?: string[];
  thumbnail: { '128x128': string, '256x256': string, '512x512': string };
}