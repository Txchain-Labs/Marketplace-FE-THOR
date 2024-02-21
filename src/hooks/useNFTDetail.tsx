import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
} from 'wagmi';
import axios from 'axios';
import marketplaceAbi from '../../public/abi/Marketplace.json';
import { STATUS } from '../redux/slices/transactionSlice';

import {
  fetchBidsQuery,
  fetchAllBidsQuery,
  fetchVolumeQuery,
  fetchListingQuery,
  fetchNFTsQuery,
  fetchFloorPriceQuery,
  fetchBestOfferQuery,
  fetchBestOfferOTCQuery,
  fetchOtcBidsQuery,
  bidderActiveBids,
  fetchReceivedBids,
} from '../utils/graphqlQueries';
import { getSubgraphUrl } from '../utils/constants';
import nftAbi from '../../public/abi/IERC721Enumerable.json';
import { useChain } from '../utils/web3Utils';
import { useDispatch, useSelector } from 'react-redux';
import { useMarketplaceAddress } from './Marketplace';
import {
  showToast,
  toastOptions,
  ToastSeverity,
} from '../redux/slices/toastSlice';
import { UserAllFavorites } from '../utils/types';
import { setDataRefetching } from '@/redux/slices/managerBagSlice';

import { Nft } from '@/models/Nft';

export type NFTItemType = {
  id: string;
  img: string;
  liked: boolean;
  collection_address?: string;
  token_address?: string;
  token_id?: string;
  metadata?: string;
  token_uri?: string;
};

export const useGetAvaxBalance = () => {
  const { address } = useAccount();
  return useBalance({
    address,
    cacheTime: 2_000,
  });
};

export function useFavorites(userId: string | undefined) {
  const chain = useChain();
  const fetchFavorites = async (): Promise<string[]> => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/liked-by/${userId}`
      );
      return res.data.code === 200 ? res.data.data : [];
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  return useQuery({
    queryKey: ['favorites', chain?.id, userId],
    queryFn: () => fetchFavorites(),
    refetchInterval: 30_000,
    enabled: Boolean(chain?.id && userId),
    placeholderData: [],
  });
}

export function useExploreNFTsByCollection(address: string) {
  const chain = useChain();
  //console.log("#### chain ", chain);
  const fetchAllNFTs = async (
    chainId: number,
    address: string
  ): Promise<NFTItemType[]> => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/favoriteByCollection/${chainId}/${address}`
      );
      return res.data.code === 200 ? res.data.data.nfts : [];
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  return (
    useQuery({
      queryKey: ['explore-nfts-collection', chain?.id, address],
      queryFn: () => fetchAllNFTs(chain?.id as number, address as string),
      refetchInterval: 120_000,
      enabled: Boolean(chain?.id),
      placeholderData: [],
    }).data || []
  );
}

export function useExploreNFTs() {
  const chain = useChain();
  //console.log("#### chain ", chain);
  const fetchAllNFTs = async (chainId: number): Promise<NFTItemType[]> => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/synced/${chainId}`
      );
      return res.data.code === 200 ? res.data.data.nfts : [];
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  return (
    useQuery({
      queryKey: ['explore-nfts', chain?.id],
      queryFn: () => fetchAllNFTs(chain?.id as number),
      refetchInterval: 300_000,
      enabled: Boolean(chain?.id),
      placeholderData: [],
    }).data || []
  );
}

export function useAddLike() {
  const queryClient = useQueryClient();
  const chain = useChain();

  return useMutation({
    mutationFn: (args: {
      user_id: string;
      nft_id?: string;
      collection_address: string;
      chainid: number;
      token_id: string | number;
    }) =>
      axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/like-unsynced`,
        args
      ),
    onMutate: async (args: {
      user_id: string;
      nft_id?: string;
      collection_address: string;
      chainid: number;
      token_id: string | number;
    }) => {
      // Snapshot the previous value
      const queryKey = ['favorites', chain?.id, args.user_id];
      const prevFavorites = queryClient.getQueryData<string[]>(queryKey);

      if (prevFavorites) {
        queryClient.setQueryData<string[]>(
          queryKey,
          prevFavorites.includes(args.nft_id)
            ? prevFavorites.filter((f) => f !== args.nft_id)
            : [...prevFavorites, args.nft_id]
        );
      }

      return { prevFavorites };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_err, { user_id }, context) => {
      if (context?.prevFavorites) {
        queryClient.setQueryData<string[]>(
          ['favorites', chain?.id, user_id],
          context.prevFavorites
        );
      }
    },
    // Always refetch after error or success:
    onSettled: (_data, _err, { user_id }) => {
      void queryClient.invalidateQueries({
        queryKey: ['favorites', chain?.id, user_id],
      });
      void queryClient.invalidateQueries({
        queryKey: ['nftsfvrt', user_id],
      });
    },
  });
}

// export const useGetNFTOwner = (collectionAddress, tokenId) => {

// };

export const useGetBidsByOrderId = (orderId: string | undefined) => {
  const status = useSelector((state: any) => state.txn.status);
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const bidsQuery = fetchBidsQuery(orderId);
  async function getBids() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: {
        query: bidsQuery,
      },
    });
  }

  return {
    ...useQuery(['getBids', orderId, status, chain], getBids, {
      refetchInterval: () => {
        return status === STATUS.SUCCESS ? 10000 : 1 * 60 * 1000;
      },
      enabled: Boolean(orderId),
    }),
  };
};

export const useGetOtcTokenBids = (
  contractAddress: string,
  tokenId: number
) => {
  const status = useSelector((state: any) => state.txn.status);
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const otcBidsQuery = fetchOtcBidsQuery(
    contractAddress?.toLowerCase(),
    tokenId
  );

  async function getOtcBids() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: {
        query: otcBidsQuery,
      },
    });
  }

  return useQuery(['getOtcBids', tokenId, contractAddress, chain], getOtcBids, {
    refetchInterval: () => {
      return status === STATUS.SUCCESS ? 10000 : 1 * 60 * 1000;
    },
    enabled: Boolean(contractAddress && tokenId),
  });
};

export const useGetNFTOwner = (collectionAddress: any, nft: any) => {
  return useContractRead({
    address: collectionAddress,
    abi: nftAbi,
    functionName: 'ownerOf',
    args: [nft],
    watch: true,
    cacheTime: 60_000,
    enabled: Boolean(collectionAddress && nft),
  });
};

export const useGetApproval = (ownerAddress: string, nftAddress: string) => {
  const marketplaceAddress = useMarketplaceAddress();
  return useContractRead({
    address: nftAddress,
    abi: nftAbi,
    functionName: 'isApprovedForAll',
    args: [ownerAddress, marketplaceAddress],
    watch: true,
    enabled: Boolean(marketplaceAddress && ownerAddress),
  });
};

export const useSetApproval = (nftAddress: any) => {
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

export const useListNFT = (toastData?: toastOptions) => {
  const dispatch = useDispatch();
  const marketplaceAddress = useMarketplaceAddress();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'listNFT',
    onSuccess: (e) => {
      console.log(e, 'listNFT success');
      if (toastData) {
        dispatch(
          showToast({
            message: toastData?.message,
            severity: toastData?.severity,
            image: toastData?.image,
            itemCount: toastData?.itemCount,
          })
        );
      }
      dispatch(setDataRefetching());
    },
    onError: (e) => {
      console.log(e, 'listNFT error -');
      if (toastData) {
        dispatch(
          showToast({
            message: 'Error in Listing NFT',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
            itemCount: toastData?.itemCount,
          })
        );
      }
    },
  });
};

export const useUpdateListNFT = (toastData?: toastOptions) => {
  const dispatch = useDispatch();
  const marketplaceAddress = useMarketplaceAddress();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'updateOrder',
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
      dispatch(setDataRefetching());
    },
    onError: () => {
      if (toastData) {
        dispatch(
          showToast({
            message: 'Error in Updating List Price',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
          })
        );
      }
    },
    // onSuccess: (data) => {
    //   dispatch(setRefetch(data));
    // },
  });
};

export const useUnListNFT = (toastData?: toastOptions) => {
  const dispatch = useDispatch();
  const marketplaceAddress = useMarketplaceAddress();
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: marketplaceAddress,
    abi: marketplaceAbi,
    functionName: 'delistNFT',
    onSuccess: (e) => {
      console.log(e, 'delistNFT success');
      if (toastData) {
        dispatch(
          showToast({
            message: toastData?.message,
            severity: toastData?.severity,
            image: toastData?.image,
            itemCount: toastData?.itemCount,
          })
        );
      }
      dispatch(setDataRefetching());
    },
    onError: (e) => {
      console.log(e, 'delistNFT error');
      if (toastData) {
        dispatch(
          showToast({
            message: 'Error in Unlisting NFT',
            severity: ToastSeverity.ERROR,
            image: toastData?.image,
            itemCount: toastData?.itemCount,
          })
        );
      }
    },
  });
};

export function useGetNFTsByWallet(address: string) {
  const chain = useChain();
  // const { address: connectedAddress } = useAccount();
  // const address = (inputAddress || connectedAddress) as string;
  const fetchNFTsByWallet = async (chainId: number): Promise<NFTItemType[]> => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/nftsByWallet/${chainId}/${address}`
      );
      return res.data.code === 200 ? res.data.data.result : [];
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  return useQuery({
    queryKey: ['nftsByWallet', chain?.id],
    queryFn: () => fetchNFTsByWallet(chain?.id as number),
    refetchInterval: 60_000,
    enabled: Boolean(address && chain?.id),
  });
}

export function useGetNFTsFavrt(userId: number) {
  const chain = useChain();
  const fetchNFTsFavrt = async (userId: number): Promise<NFTItemType[]> => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/liked-by-user/${userId}/${chain.id}`
      );
      // console.log(res.data);
      return res.data.code === 200 ? res.data.data : [];
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  return useQuery({
    queryKey: ['nftsfvrt', userId],
    queryFn: () => fetchNFTsFavrt(userId as number),
    // refetchInterval: 30_000,
    enabled: Boolean(userId),
  });
}

export const useGetNFTList = (address: string) => {
  // const { address: connectedAddress } = useAccount();
  // const address = (inputAddress || connectedAddress) as string;
  const refetch = useSelector((state: any) => state.txn.refetch);
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const nftListQuery = fetchNFTsQuery(address?.toLowerCase());

  async function listNFT() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json', 'Authorization': null },
      data: {
        query: nftListQuery,
      },
    });
  }

  return useQuery(['listNFT', address, chain, refetch], listNFT, {
    refetchInterval: 60_000,
    enabled: Boolean(address),
  });
};

export const useGetNFTMetadata = (listings: any, start: number) => {
  const chain = useChain();
  const fetchNFTsMetadata = async (chainId: string): Promise<Nft[]> => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/getNFTsByListing`,
        { listings: listings, chainId: chainId, start: start }
      );
      return res.data.code === 200 ? res.data.data : [];
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  return useQuery({
    queryKey: ['nftsMetadata', listings],
    queryFn: () => fetchNFTsMetadata(chain?.id.toString()),
    refetchInterval: 120_000,
    enabled: Boolean(listings?.length && chain?.id),
  });
};

export const useGetBidsList = (nftAddress: string) => {
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const bidsQuery = fetchAllBidsQuery(nftAddress);

  async function getBids() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: {
        query: bidsQuery,
      },
    });
  }

  return useQuery(['getBids', chain], getBids, {
    refetchInterval: 2 * 60 * 1000,
    enabled: !!nftAddress,
  });
};

export const useGetVolume = (nftAddress: string) => {
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const volumeQuery = fetchVolumeQuery(nftAddress);

  async function getVolume() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: {
        query: volumeQuery,
      },
    });
  }

  return useQuery(['getVolume', nftAddress], getVolume, {
    refetchInterval: 2 * 60 * 1000,
    enabled: !!nftAddress,
  });
};

export const funcGetFloorPrice = async function (
  subgraphUrl: string,
  floorPriceQuery: string
) {
  return axios({
    url: subgraphUrl,
    method: 'post',
    headers: { 'content-type': 'application/json' },
    data: {
      query: floorPriceQuery,
    },
  });
};

export const funcGetFloorPriceAvax = (nftAddress: string, chain: any) => {
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const floorPriceQuery = fetchFloorPriceQuery(nftAddress, 0);

  return funcGetFloorPrice(subgraphUrl, floorPriceQuery);
};

export const useGetFloorPriceAvax = (nftAddress: string) => {
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const floorPriceQuery = fetchFloorPriceQuery(nftAddress, 0);

  async function getFloorPrice() {
    return funcGetFloorPrice(subgraphUrl, floorPriceQuery);
  }

  return useQuery(['getFloorPrice', nftAddress], getFloorPrice, {
    refetchInterval: 2 * 60 * 1000,
    enabled: !!nftAddress,
  });
};

export const useGetFloorPriceThor = (nftAddress: string) => {
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const floorPriceQuery = fetchFloorPriceQuery(nftAddress, 1);

  async function getFloorPrice() {
    return funcGetFloorPrice(subgraphUrl, floorPriceQuery);
  }

  return useQuery(['getFloorPrice', nftAddress], getFloorPrice, {
    refetchInterval: 2 * 60 * 1000,
    enabled: !!nftAddress,
  });
};

export const useGetBestOfferAvax = (nftAddress: string) => {
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const bestOfferQuery = fetchBestOfferQuery(nftAddress, 0);

  async function getBestOffer() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: {
        query: bestOfferQuery,
      },
    });
  }

  return useQuery(['getBestOffer', nftAddress], getBestOffer, {
    refetchInterval: 2 * 60 * 1000,
    enabled: !!nftAddress,
  });
};

export const useGetBestOfferOTCAvax = (nftAddress: string) => {
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const bestOfferOTCQuery = fetchBestOfferOTCQuery(nftAddress, 0);

  async function getBestOfferOtc() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: {
        query: bestOfferOTCQuery,
      },
    });
  }

  return useQuery(['getBestOfferOtc', nftAddress], getBestOfferOtc, {
    refetchInterval: 2 * 60 * 1000,
    enabled: !!nftAddress,
  });
};

export const useGetListings = (nftAddress: string) => {
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const listingQuery = fetchListingQuery(nftAddress);

  async function getListing() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: {
        query: listingQuery,
      },
    });
  }

  return useQuery(['getListing', chain], getListing, {
    refetchInterval: 2 * 60 * 1000,
    enabled: !!nftAddress,
  });
};

export const fetchUserByAddress = async (userAddress: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userAddress}`
    );
    return res?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export function useGetUserByAddress(userAddress: string) {
  return useQuery({
    queryKey: ['userByAddress', userAddress],
    queryFn: () => fetchUserByAddress(userAddress as string),
    // refetchInterval: 30_000,
    enabled: Boolean(userAddress),
  });
}

export const useGetNFTApproval = (nftAddress: string, tokenId: number) => {
  return useContractRead({
    address: nftAddress,
    abi: nftAbi,
    functionName: 'getApproved',
    args: [tokenId],
    watch: true,
    cacheTime: 60_000,
    enabled: Boolean(nftAddress && tokenId),
  });
};

export const useSetNFTApproval = (nftAddress: string) => {
  return useContractWrite({
    mode: 'recklesslyUnprepared',
    address: nftAddress,
    abi: nftAbi,
    functionName: 'approve',
  });
};

export const useGetActiveBids = (bidderAddress: string) => {
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const activeBidsQuery = bidderActiveBids(bidderAddress);

  async function getActiveBids() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json', 'Authorization': null },
      data: {
        query: activeBidsQuery,
      },
    });
  }

  return useQuery(['getActiveBids', chain, bidderAddress], getActiveBids, {
    refetchInterval: 30_000,
    enabled: !!bidderAddress,
  });
};

export function useGetNFTDetail(collectionAddress: string, tokenId: string) {
  const chain = useChain();
  const fetchNFTDetail = async (chainId: number): Promise<NFTItemType> => {
    try {
      const res = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/nfts/nftDetail/${chainId}/${collectionAddress?.toLowerCase()}/${tokenId}`
      );
      return res.data.code === 200 ? res.data.data : {} as NFTItemType;
    } catch (error) {
      console.log(error);
    }
    return {} as NFTItemType;
  };

  return useQuery({
    queryKey: ['nftDetail', collectionAddress, tokenId, chain?.id],
    queryFn: () => fetchNFTDetail(chain?.id as number),
    refetchInterval: 30_000,
    enabled: Boolean(collectionAddress && tokenId && chain?.id),
  });
}

export const useGetReceivedBids = (ownerAddress: string) => {
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const receivedBidsQuery = fetchReceivedBids(ownerAddress);

  async function getReceivedBids() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json', 'Authorization': null },
      data: {
        query: receivedBidsQuery,
      },
    });
  }

  return useQuery(['getReceivedBids', chain, ownerAddress], getReceivedBids, {
    refetchInterval: 30_000,
    enabled: !!ownerAddress,
  });
};

export function useGetCollectionAnalytics(
  collectionAddress: string,
  start: number | string,
  end: number | string = undefined
) {
  start = start?.toString();
  end = end?.toString();

  const chain = useChain(),
    chainId = chain?.id;

  const endpoint = getSubgraphUrl(chainId);

  const getCollectionAnalyticsQuery = gql`
      query GetCollectionAnalytics(
          $nftAddress: String
          $start: String
      ) {
          collectionAnalytics(
              first: 8
              orderBy: updatedAt
              orderDirection: desc
              where: {
                  nftAddress: $nftAddress
                  updatedAt_gte: $start
                  ${end ? `updatedAt_lt: ${end}` : ''}
              }
          ) {
              date
              id
              nftAddress
              sales
              updatedAt
              volumeAvax
              volumeThor
          }
      }
`;

  const variables = {
    nftAddress: collectionAddress,
    start,
  };

  return useQuery({
    queryKey: ['collection_analytics', collectionAddress, chainId, start, end],
    queryFn: async () => {
      const queryResult: any = await request(
        endpoint,
        getCollectionAnalyticsQuery,
        variables
      );

      return queryResult.collectionAnalytics;
    },
    enabled: !!collectionAddress && !!chainId,
  });
}

export function useGetAllFavorites(userId: string | undefined) {
  const chain = useChain();
  const fetchAllFavorites = async (): Promise<UserAllFavorites[]> => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/liked-by-user/${userId}/${chain?.id}`
      );
      return res.data.code === 200 ? res.data.data : [];
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  return useQuery({
    queryKey: ['Allfavorites', chain?.id, userId],
    queryFn: () => fetchAllFavorites(),
    refetchInterval: 30_000,
    enabled: Boolean(chain?.id && userId),
    placeholderData: [],
  });
}

export function useGetIsLikedUnsynced(
  userId: string,
  collection_address: string,
  token_id: string
) {
  const chain = useChain();
  const fetchNFTFavoriteStatus = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/is-liked-unsynced/${chain?.id}/${userId}/${collection_address}/${token_id}`
      );
      return res?.data?.code === 200 ? res?.data.data : false;
    } catch (error) {
      console.log(error);
    }
    return false;
  };

  return useQuery({
    queryKey: ['singleNFTFavoriteStatus', chain?.id, userId],
    queryFn: () => fetchNFTFavoriteStatus(),
    refetchInterval: false,
    enabled: Boolean(chain?.id && userId && collection_address && token_id),
    placeholderData: false,
  });
}
