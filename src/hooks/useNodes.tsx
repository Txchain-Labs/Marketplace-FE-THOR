import { useQuery } from '@tanstack/react-query';
import { useContractRead } from 'wagmi';
import axios from 'axios';

import OGAbi from '../../public/abi/OG.json';
import DriftAbi from '../../public/abi/Drift.json';
import { useChain } from '../utils/web3Utils';
import { NFTItemType } from './useNFTDetail';

export const useGetNodeRewards = (
  collectionAddress: any,
  nft: any,
  type: string | undefined
) => {
  return useContractRead({
    address: collectionAddress,
    abi: type === 'OG' ? OGAbi : DriftAbi,
    functionName: 'getRewardAmountOf',
    args: [Number(nft)],
    cacheTime: 60_000,
    enabled: Boolean(collectionAddress && nft),
  });
};

export const useGetTokenURI = (
  collectionAddress: any,
  nft: any,
  type: string | undefined
) => {
  return useContractRead({
    address: collectionAddress,
    abi: type === 'OG' ? OGAbi : DriftAbi,
    functionName: 'tokenURI',
    args: [Number(nft)],
    cacheTime: 60_000,
    enabled: Boolean(collectionAddress && nft),
  });
};

// export const useGetNodesListed = (
//   collectionAddress: any,
//   nft: any,
//   type: string | undefined
// ) => {
//   return useContractRead({
//     address: collectionAddress,
//     abi: type === 'OG' ? OGAbi : DriftAbi,
//     functionName: 'tokenURI',
//     args: [Number(nft)],
//     cacheTime: 60_000,
//     enabled: Boolean(collectionAddress && nft),
//   });
// };

// export const useGetDaysSinceActive = (
//     collectionAddress: any,
//     nft: any,
//     type: string
//   ) => {
//     const nodeIndex = useContractRead({
//         address: collectionAddress,
//         abi: type === 'OG' ? OGAbi : DriftAbi,
//         functionName: '_tokenId',
//         args: [Number(nft)],
//         cacheTime: 60_000,
//         enabled: Boolean(collectionAddress && nft),
//     });

//     const data = useContractRead({
//       address: collectionAddress,
//       abi: type === 'OG' ? OGAbi : DriftAbi,
//       functionName: '_nodeList',
//       args: [Number(nft)],
//       cacheTime: 60_000,
//       enabled: Boolean(collectionAddress && nft),
//     });

//     const getDaysSinceActive = () => {

//     }

//   };

export function useGetNodesByWallet(address: string) {
  const chain = useChain();
  // const { address: connectedAddress } = useAccount();
  // const address = (inputAddress || connectedAddress) as string;
  const fetchNodesByWallet = async (
    chainId: number
  ): Promise<NFTItemType[]> => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/nodesByWallet/${chainId}/${address}`
      );
      return res.data.code === 200 ? res.data.data : [];
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  return useQuery({
    queryKey: ['nodesByWallet', address],
    queryFn: () => fetchNodesByWallet(chain?.id as number),
    refetchInterval: 30_000,
    enabled: Boolean(address && chain?.id),
  });
}

export const useGetVrrLog = (
  collectionAddress: any,
  nft: any,
  type: string | undefined
) => {
  console.log(collectionAddress);
  console.log(nft);
  console.log(type);

  return useContractRead({
    address: collectionAddress,
    abi: type === 'Origin' ? OGAbi : DriftAbi,
    functionName: 'vrrLog',
    args: [Number(1)],
    cacheTime: 60_000,
    enabled: Boolean(collectionAddress && nft),
  });
};
