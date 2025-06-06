import { api } from "@/lib/api";
import { Order } from "@/types/order";

export const createOrder = async (
  products: Order["products"],
  shipping: Order["shipping"],
  userID: string = "000"
): Promise<Order> => {
  if (!products || products.length === 0) {
    throw new Error("Order must contain at least one product");
  }

  if (!shipping.address || !shipping.city || !shipping.state || !shipping.zipcode) {
    throw new Error("Complete shipping information is required");
  }

  const orderData = {
    user_id: userID,
    total: products.reduce((sum, product) => sum + product.price * product.quantity, 0),
    products,
    shipping: {
      address: shipping.address,
      city: shipping.city,
      state: shipping.state,
      zipcode: shipping.zipcode
    }
  };

  return api.post<Order>("/orders", orderData);
};