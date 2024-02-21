import { useContractRead, useAccount, useContractReads } from 'wagmi';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';

import OGAbi from '../../public/abi/OG.json';
import DriftAbi from '../../public/abi/Drift.json';

import { useChain } from '../utils/web3Utils';
import {
  thorfiNfts,
  SupportedChains,
  nodeType,
  ThorfiNFTType,
} from '../utils/constants';
import ThorNodeDappQueryV2Abi from '@/../public/abi/ThorNodeDappQueryV2.json';
import marketplaceAbi from '@/../public/abi/Marketplace.json';

import { GameloopAssetsType, NodeType, thorNodesType } from '@/utils/types';
import { NFTItemType } from './useNFTDetail';
import { BigNumber, BigNumberish } from 'ethers';
import { useSelector } from 'react-redux';
import { useMarketplaceAddress } from './Marketplace';

// Efficient contract to fetch all nodes of user in one call
export function useDappQueryContract() {
  const chain = useChain();
  switch (chain?.id) {
    case SupportedChains.Fuji:
      return '0xd3A5079282b86C4aE587A49f55F1fa7B13FE1aE5';
    // Subject to change when fork restarted
    case SupportedChains.Avalanche:
      // return '0xb741aF0E005844bb956C135A397056A8b16c6b33';
      return '0xF4fF4A10C385527769eFdFABaa685af0ebbC4Fb6';
    default:
      throw new Error('Chain not supported');
  }
}

export const useGetNodesV2 = () => {
  // const { address } = useAccount();
  const user = useSelector((state: any) => state?.auth?.user);

  const DAPP_QUERY_V2 = useDappQueryContract();
  return useContractRead({
    address: DAPP_QUERY_V2,
    abi: ThorNodeDappQueryV2Abi,
    functionName: 'getNodes',
    args: [user?.address],
    enabled: !!user?.address,
    watch: true,
    // cacheTime: 60_000,
  }) as unknown as UseQueryResult<NodeType[], Error>;
};

export const useGetNodeRewards = (
  collectionAddress: any,
  nft: any,
  type: thorNodesType,
  assetType?: ThorfiNFTType
) => {
  return useContractRead({
    address: collectionAddress,
    abi: type === 'ORIGIN' ? OGAbi : DriftAbi,
    functionName: 'getRewardAmountOf',
    args: [Number(nft)],
    cacheTime: 60_000,
    enabled:
      Boolean(collectionAddress && nft) &&
      Boolean(assetType === undefined || assetType === 'nodes'),
  });
};

export const useGetVrrLogLength = (collectionAddress: any, nft: any) => {
  return useContractRead({
    address: collectionAddress,
    abi: OGAbi,
    functionName: 'getVRRlogLength',
    args: [],
    cacheTime: 60_000,
    enabled: Boolean(collectionAddress && nft),
  });
};

export const useGetVrrLog = (collectionAddress: any, nft: any) => {
  const { data: vrrLoglength } = useGetVrrLogLength(collectionAddress, nft);
  return useContractRead({
    address: collectionAddress,
    abi: OGAbi,
    functionName: 'vrrLog',
    args: [
      vrrLoglength ? Number((vrrLoglength as BigNumberish).toString()) - 1 : 1,
    ],
    cacheTime: 60_000,
    enabled: Boolean(collectionAddress && nft && vrrLoglength),
  });
};

export const useGetTokenURI = (
  collectionAddress: any,
  nft: any,
  type?: thorNodesType
) => {
  return useContractRead({
    address: collectionAddress,
    abi: type === 'ORIGIN' ? OGAbi : DriftAbi,
    functionName: 'tokenURI',
    args: [Number(nft)],
    cacheTime: 60_000,
    enabled: Boolean(collectionAddress && nft),
  });
};
export const useGetNFTsListed = (collectionAddress: any, tokenIds: any[]) => {
  const marketplaceAddress = useMarketplaceAddress();
  return useContractRead({
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'areNFTListed',
    args: [collectionAddress, tokenIds],
    watch: true,
    enabled: Boolean(collectionAddress && tokenIds),
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
    refetchInterval: 120_000,
    enabled: Boolean(address && chain?.id),
  });
}

export const useGetGameloopAssets = (userAddress: string) => {
  // const { address } = useAccount();
  const DAPP_QUERY_V2 = useDappQueryContract();
  // console.log('assets hook called');
  return useContractRead({
    address: DAPP_QUERY_V2,
    abi: ThorNodeDappQueryV2Abi,
    functionName: 'getGameloopAssets',
    args: [userAddress],
    enabled: !!userAddress,
    // watch: true,
    cacheTime: 60_000,
  }) as unknown as UseQueryResult<GameloopAssetsType, Error>;
};

export const useGetVRR4Origin = () => {
  const { chain } = useAccount();
  const originNodes = thorfiNfts('nodes', chain).filter(
    (value) => value.nodeType === 'ORIGIN'
  );

  return useContractReads({
    contracts: originNodes.map((each: any) => {
      return {
        address: each.contract,
        abi: OGAbi,
        functionName: 'vrrLog',
        args: [Number(1)],
        cacheTime: 60_000,
        enabled: Boolean(originNodes),
      };
    }),
  });
};

export const useGetEstimatedClaimTime = (
  _nodeType: thorNodesType,
  _reward: BigNumber
) => {
  const DAPP_QUERY_V2 = useDappQueryContract();

  return useContractRead({
    address: DAPP_QUERY_V2,
    abi: ThorNodeDappQueryV2Abi,
    functionName: 'getEstimatedClaimTime',
    args: [nodeType.indexOf(_nodeType), _reward],
    enabled: Boolean(_nodeType && _reward),
  });
};

export const useGetStakedDriftNodesByTokenIds = (
  args: [BigNumberish[], BigNumberish[]]
) => {
  const DAPP_QUERY_V2 = useDappQueryContract();
  return useContractRead({
    address: DAPP_QUERY_V2,
    abi: ThorNodeDappQueryV2Abi,
    functionName: 'getDriftsByIds',
    args,
  }) as unknown as UseQueryResult<NodeType[], Error>;
};

export const useGetActivePerks = (
  collectionAddress: any,
  nft: any,
  enabled = true
) => {
  return useContractRead({
    address: collectionAddress,
    abi: OGAbi,
    functionName: 'getActivePerks',
    args: [Number(nft)],
    cacheTime: 60_000,
    enabled: Boolean(collectionAddress && nft && enabled),
  });
};

export const useGetAcceptPaymentsByNFT = (nftAddress: any, tokenId: any) => {
  const marketplaceAddress = useMarketplaceAddress();
  return useContractReads({
    contracts: [
      {
        address: marketplaceAddress,
        abi: marketplaceAbi,
        functionName: 'acceptPayment',
        args: [nftAddress, tokenId, 0],
      },
      {
        address: marketplaceAddress,
        abi: marketplaceAbi,
        functionName: 'acceptPayment',
        args: [nftAddress, tokenId, 1],
      },
      {
        address: marketplaceAddress,
        abi: marketplaceAbi,
        functionName: 'acceptPayment',
        args: [nftAddress, tokenId, 2],
      },
    ],
    watch: true,
    enabled: Boolean(marketplaceAddress && tokenId && nftAddress),
  });
};
