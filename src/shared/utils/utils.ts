import { ethers } from 'ethers';

export const dottedAddress = (address: string | any) => {
  const firstDigit = address?.slice(0, 7);
  const lastDigit = address?.slice(-4);
  return `${firstDigit}...${lastDigit}`;
};
export const formatDecimals = (
  weiAmount: bigint | any,
  decis = 18,
  auto = false,
  prec = 4
) => {
  if (!weiAmount) {
    return Number(0).toString();
  }
  // if (weiAmount === '0,0001') return '0.0001';
  if (typeof weiAmount === 'string' && weiAmount?.includes(',')) {
    const amount = weiAmount.replace(',', '.');
    console.log(amount, 'list price check formatDecimal');
    return amount;
  }

  const result = Number(ethers.utils.formatUnits(weiAmount, decis.toString()));
  if (auto) {
    return result.toString();
  }
  return result.toFixed(prec);
};

export const formatDecimalsV2 = (weiAmount: bigint | any, decis = 18) => {
  if (!weiAmount) {
    return Number(0).toString();
  }
  // if (weiAmount === '0,0001') return '0.0001';
  if (typeof weiAmount === 'string' && weiAmount?.includes(',')) {
    const amount = weiAmount.replace(',', '.');
    console.log(amount, 'list price check formatDecimalV2');
    return amount;
  }

  const result = ethers.utils.formatUnits(weiAmount, decis.toString());
  return result;
};
