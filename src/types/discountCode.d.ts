export interface DiscountCode {
  id: string;
  code: string;
  amount: number;
  expirationDate: Date;
  uses: number;
}