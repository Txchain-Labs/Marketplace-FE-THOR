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
  usdceTokenAddress,
} from '../utils/constants';

import thorAbi from '../../public/abi/Thor.json';
import { useMarketplaceAddress } from './Marketplace';
import { useChain } from '../utils/web3Utils';

// Global cache time
export function useBalance(
  tokenName: TokenNameType,
  inputAddress?: string | undefined
) {
  const { address: connectedAddress } = useAccount();
  const address = (inputAddress || connectedAddress) as AddressString;
  const provider = useProvider();
  const tokens =
    provider._network.chainId === 43_113 ? tokensFuji : tokensMainnet;

  let balance;

  const { data: avaxBalance } = useWagmiBalance({
    address: address,
    enabled: Boolean(address && tokenName === 'AVAX'),
    watch: true,
  });

  const { data: tokenBalance } = useContractRead({
    address: tokens[tokenName],
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
    enabled: Boolean(address && tokenName === 'THOR'),
  });

  const { data: usdceBalance } = useContractRead({
    address: tokens[tokenName],
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
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
    enabled: Boolean(marketplaceAddress && ownerAddress),
  });
};

export const useSetApprovalUSDCE = () => {
  const chain = useChain();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: usdceTokenAddress(chain),
    abi: erc20ABI,
    functionName: 'approve',
  });
};

export const useGetApprovalUSDCE = (ownerAddress: string) => {
  const marketplaceAddress = useMarketplaceAddress();
  const chain = useChain();
  return useContractRead({
    address: usdceTokenAddress(chain),
    abi: erc20ABI,
    functionName: 'allowance',
    args: [ownerAddress as `0x${string}`, marketplaceAddress],
    watch: true,
    enabled: Boolean(marketplaceAddress && ownerAddress),
  });
};
