import { BigNumber, ethers } from 'ethers';
import { useNetwork } from 'wagmi';
import { defaultChain } from './constants';

// wei to deci
export const formatWei = (
  weiAmount: BigNumber | string,
  decis = 18,
  precision = 4
) => {
  let formated = '';
  try {
    formated = Number(ethers.utils.formatUnits(weiAmount, decis)).toFixed(
      precision
    );
  } catch (e) {
    console.log('web3Utils: error in formatWei');
  }
  return formated;
};

export const useChain = () => {
  let { chain } = useNetwork();
  if (chain === undefined) {
    chain = defaultChain;
  }
  return chain;
};
