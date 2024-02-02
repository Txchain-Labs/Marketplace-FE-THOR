import { useDispatch } from '@/redux/store';
import { SupportedChains, getSubgraphUrl4Gameloop } from '@/utils/constants';
import { useChain } from '@/utils/web3Utils';
import { useContractRead, useContractWrite, useQuery } from 'wagmi';
import ThorGamificationAbi from '@/../public/abi/ThorGamification.json';
import {
  ToastSeverity,
  showToast,
  toastOptions,
} from '@/redux/slices/toastSlice';
import { fetchStakedDriftNodes } from '@/utils/graphqlQueries';
import axios from 'axios';
import nftAbi from '../../public/abi/IERC721Enumerable.json';

export function useThorGamificationContract() {
  const chain = useChain();
  switch (chain?.id) {
    case SupportedChains.Fuji:
      return '0x55cFD0C5388efE6c519b1aACc3bc4Bf0D222678a';
    case SupportedChains.Avalanche:
      return '0x64ecd0E998DA4285387d330ffeDB45D9F8553A9d';
    default:
      throw new Error('Chain not supported');
  }
}

export const useNodePerk = (toastData?: toastOptions) => {
  const dispatch = useDispatch();
  const address = useThorGamificationContract();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: address,
    abi: ThorGamificationAbi,
    functionName: 'useNodePerk',
    onSuccess: () => {
      if (toastData) {
        dispatch(
          showToast({
            message: toastData?.message,
            severity: toastData?.severity,
            image: toastData?.image,
          })
        );
      }
    },
    onError: () => {
      if (toastData) {
        dispatch(
          showToast({
            message: 'Error in Claiming Voucher',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
          })
        );
      }
    },
  });
};

export const useGetStakedDriftNodes = (ownerAddress: string) => {
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl4Gameloop(chain?.id);
  const stakedDriftsQuery = fetchStakedDriftNodes(ownerAddress);

  const getStakedDriftNodes = async () => {
    try {
      const res = await axios({
        url: subgraphUrl,
        method: 'post',
        headers: { 'content-type': 'application/json' },
        data: {
          query: stakedDriftsQuery,
        },
      });
      return res?.data?.data?.stakedNFTs ? res?.data?.data?.stakedNFTs : [];
    } catch (error) {
      console.log(error);
      // return [];
    }
    return [];
  };

  return useQuery(
    ['getStakedDriftNodes', chain, ownerAddress],
    getStakedDriftNodes,
    {
      refetchInterval: 30_000,
      enabled: !!ownerAddress,
    }
  );
};

export const useGetGameloopApproval = (
  ownerAddress: string,
  nftAddress: string
) => {
  const gameloopAddress = useThorGamificationContract();
  return useContractRead({
    address: nftAddress,
    abi: nftAbi,
    functionName: 'isApprovedForAll',
    args: [ownerAddress, gameloopAddress],
    watch: true,
    cacheTime: 60_000,
    enabled: Boolean(gameloopAddress && ownerAddress),
  });
};

export const useSetGameloopApproval = (nftAddress: any) => {
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: nftAddress,
    abi: nftAbi,
    functionName: 'setApprovalForAll',
    onSuccess: (e) => {
      console.log(e, 'setApprovalForAll success');
    },
    onError: (e) => {
      console.log(e, 'setApprovalForAll error');
    },
  });
};
