import { FC } from 'react';

import UsdceIcon from '@/components/icons/currencies/Usdce';
import AvaxIcon from '@/components/icons/currencies/Avax';
import ThorIcon from '@/components/icons/currencies/Thor';

interface CurrencyIconProps {
  defaultCurrency?: string;
}

export const CurrencyIcon: FC<CurrencyIconProps> = ({ defaultCurrency }) => {
  return !defaultCurrency || defaultCurrency.startsWith('USD') ? (
    <UsdceIcon viewBox={'0 0 15 14'} sx={{ width: '14px', height: '11px' }} />
  ) : defaultCurrency === 'AVAX' ? (
    <AvaxIcon viewBox={'0 0 18 15'} sx={{ width: '14px', height: '11px' }} />
  ) : defaultCurrency === 'THOR' ? (
    <ThorIcon viewBox={'0 0 25 20'} sx={{ width: '14px', height: '11px' }} />
  ) : (
    <></>
  );
};
