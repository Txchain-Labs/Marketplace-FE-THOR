import { formatPriceByDefaultCurrency } from '@/utils/helper';
import { BigNumberish } from 'ethers';
import { useCallback } from 'react';

export const useFormatedPrice = (
  priceInWei: BigNumberish,
  paymentType: string,
  user: any,
  avaxPrice: any,
  thorPrice: any
) => {
  const formatedPrice = useCallback(() => {
    if (priceInWei) {
      return formatPriceByDefaultCurrency(
        priceInWei,
        paymentType,
        user?.default_currency,
        avaxPrice,
        thorPrice
      );
    } else {
      return 0;
    }
  }, [avaxPrice, thorPrice, user?.default_currency, paymentType, priceInWei]);

  return formatedPrice;
};
