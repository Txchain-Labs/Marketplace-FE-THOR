import { useContractRead } from 'wagmi';
import { getOracleAddress } from '../utils/constants';
import oracleAbi from '../../public/abi/Oracle.json';
import { BigNumber, ethers } from 'ethers';
import { numberExponentToLarge } from '../utils/common';

export const useGetUsdFromThor = (amount: string, chain: any) => {
  const oracleAddress = chain ? getOracleAddress(chain) : '';

  return useContractRead<any, any, BigNumber>({
    address: oracleAddress,
    abi: oracleAbi,
    functionName: 'thor2Usd',
    args: [ethers.utils.parseEther(numberExponentToLarge(amount))],
    enabled: !!amount && amount !== '0' && !!chain,
  });
};
export const useGetUsdFromAvax = (amount: string, chain: any) => {
  const oracleAddress = chain ? getOracleAddress(chain) : '';

  return useContractRead<any, any, BigNumber>({
    address: oracleAddress,
    abi: oracleAbi,
    functionName: 'avax2usd',
    args: [ethers.utils.parseEther(numberExponentToLarge(amount))],
    enabled: !!amount && amount !== '0' && !!chain,
  });
};
export const useGetAvaxFromUsd = (amount: string, chain: any) => {
  return useContractRead<any, any, BigNumber>({
    address: getOracleAddress(chain),
    abi: oracleAbi,
    functionName: 'usd2avax',
    args: [ethers.utils.parseEther(numberExponentToLarge(amount))],
    enabled: !!amount && amount !== '0' && !!chain,
  });
};
export const useGetThorFromUsd = (amount: string, chain: any) => {
  return useContractRead({
    address: getOracleAddress(chain),
    abi: oracleAbi,
    functionName: 'usd2thor',
    args: [ethers.utils.parseEther(numberExponentToLarge(amount))],
    enabled: !!amount && amount !== '0' && !!chain,
  });
};
export const useGetAvaxFromThor = (amount: string, chain: any) => {
  return useContractRead<any, any, BigNumber>({
    address: getOracleAddress(chain),
    abi: oracleAbi,
    functionName: 'thor2Avax',
    args: [ethers.utils.parseEther(numberExponentToLarge(amount))],
    enabled: !!amount && amount !== '0' && !!chain,
  });
};
export const useGetThorFromAvax = (amount: string, chain: any) => {
  return useContractRead<any, any, BigNumber>({
    address: getOracleAddress(chain),
    abi: oracleAbi,
    functionName: 'avax2thor',
    args: [ethers.utils.parseEther(numberExponentToLarge(amount))],
    enabled: !!amount && amount !== '0' && !!chain,
  });
};
