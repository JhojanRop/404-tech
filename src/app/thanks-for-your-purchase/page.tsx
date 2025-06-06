'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ThanksForYourPurchasePage() {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          setTimeout(() => router.push('/'), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Thank You for Your Purchase!</h1>
      <p className="text-lg text-gray-700 mb-6">Your order has been successfully placed.</p>
      <p className="text-md text-gray-500 mb-4">We appreciate your business and hope you enjoy your purchase!</p>
      <p className="text-sm text-gray-400">
        Redirecting to home in {countdown} seconds...
      </p>
    </div>
  );
}