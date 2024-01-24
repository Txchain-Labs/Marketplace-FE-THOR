import {
  erc20ABI,
  useAccount,
  useBalance as useWagmiBalance,
  useContractRead,
  useContractWrite,
  useProvider,
} from 'wagmi';

import {
  AddressString,
  thorTokenAddress,
  TokenNameType,
  tokensFuji,
  tokensMainnet,
} from '../utils/constants';

import thorAbi from '../../public/abi/Thor.json';
import { useMarketplaceAddress } from './Marketplace';
import { useChain } from '../utils/web3Utils';

// Global cache time
const balanceCacheTime = 5_000;

export function useBalance(
  tokenName: TokenNameType,
  inputAddress?: string | undefined
) {
  const { address: connectedAddress } = useAccount();
  const provider = useProvider();
  const address = (inputAddress || connectedAddress) as AddressString;
  const tokens =
    provider._network.chainId === 43_113 ? tokensFuji : tokensMainnet;

  let balance;

  const { data: avaxBalance } = useWagmiBalance({
    address: address,
    enabled: Boolean(address && tokenName === 'AVAX'),
    cacheTime: balanceCacheTime,
  });

  const { data: tokenBalance } = useContractRead({
    address: tokens[tokenName],
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
    cacheTime: balanceCacheTime,
    enabled: Boolean(address && tokenName === 'THOR'),
  });

  const { data: usdceBalance } = useContractRead({
    address: tokens[tokenName],
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
    cacheTime: balanceCacheTime,
    enabled: Boolean(address && tokenName === 'USDCE'),
  });

  switch (tokenName) {
    case 'AVAX':
      balance = avaxBalance?.value;
      break;
    case 'THOR':
      balance = tokenBalance;
      break;
    case 'USDCE':
      balance = usdceBalance;
      break;
    default:
      break;
  }

  return balance;
}

export const useSetApprovalThor = () => {
  const chain = useChain();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: thorTokenAddress(chain),
    abi: thorAbi,
    functionName: 'approve',
  });
};

export const useGetApprovalThor = (ownerAddress: string) => {
  const marketplaceAddress = useMarketplaceAddress();
  const chain = useChain();
  return useContractRead({
    address: thorTokenAddress(chain),
    abi: thorAbi,
    functionName: 'allowance',
    args: [ownerAddress, marketplaceAddress],
    watch: true,
    cacheTime: 60_000,
    enabled: Boolean(marketplaceAddress && ownerAddress),
  });
};
