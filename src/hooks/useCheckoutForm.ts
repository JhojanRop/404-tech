import { useState } from 'react';

export interface CheckoutFormData {
  email: string;
  nameOnCard: string;
  cardNumber: string;
  expirationDate: string;
  cvc: string;
  address: string;
  postalCode: string;
  sameAsShipping: boolean;
}

export function useCheckoutForm(initialState?: Partial<CheckoutFormData>) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    address: '',
    postalCode: '',
    sameAsShipping: true,
    ...initialState,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    orderError,
    setOrderError,
    handleInputChange,
  };
}