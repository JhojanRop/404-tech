import { api } from "@/lib/api";
import { DiscountCode } from "@/types/discountCode";

const consumeDiscountCode = async (code: string): Promise<DiscountCode> => {
  if (!code) {
    throw new Error("Discount code is required");
  }

  try {
    const discountCode: DiscountCode = await api.get(`/discount_codes/${code.toUpperCase()}`);
    if (!discountCode) {
      throw new Error("Invalid discount code");
    }
    const consumedCode = await api.post(`/discount_codes/${discountCode.id}/consume`, {});

    return consumedCode as DiscountCode;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Invalid discount code");
    }
    throw error;
  }
};

export { consumeDiscountCode };