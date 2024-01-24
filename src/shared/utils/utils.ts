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
  const result = ethers.utils.formatUnits(weiAmount, decis.toString());
  return result;
};
