export interface Order {
  id?: string;
  createdAt?: string;
  products: Array<{
    price: number;
    productID: string;
    quantity: number;
  }>;
  shipping: {
    address: string;
    city: string;
    state: string;
    zipcode: string;
  };
  status: "paid" | "pending" | "shipped" | "delivered" | "cancelled";
  total: number;
  userID: string;
}

export interface OrderRequest {
  user_id: string;
  total: number;
  products: Array<{
    productID: string;
    price: number;
    quantity: number;
  }>;
  shipping: {
    address: string;
    city: string;
    state: string;
    zipcode: string;
  };
}