import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
// import { Listing } from '../models/Listing';

import { useChain } from '../utils/web3Utils';
import { getSubgraphUrl } from '../utils/constants';

const DEFAULT_LIMIT = 1000;
const DEFAULT_PAGE_SIZE = 20;

export const useListingsCount = (collectionAddress: string) => {
  const chain = useChain(),
    chainId = chain?.id;

  const endpoint = getSubgraphUrl(chainId);

  const getListingsQuery = gql`
    query GetListings($first: Int, $skip: Int, $nftAddress: String) {
      listings(
        first: $first
        skip: $skip
        where: { nftAddress: $nftAddress, isInvalidOwner: false }
      ) {
        id
      }
    }
  `;

  const defaultVariables = {
    first: DEFAULT_LIMIT,
    skip: 0,
    nftAddress: collectionAddress,
    // date: Math.floor(Date.now() / 1000).toString(),
  };

  return useQuery({
    queryKey: ['listingsCount', collectionAddress, chainId],
    queryFn: async () => {
      let count = 0;

      for (let skip = 0; ; skip += DEFAULT_LIMIT) {
        const queryResult: any = await request(endpoint, getListingsQuery, {
          ...defaultVariables,
          skip: skip,
        });

        if (!queryResult.listings) break;

        if (queryResult.listings.length < DEFAULT_LIMIT) {
          count += queryResult.listings.length;
          break;
        }

        count += DEFAULT_LIMIT;
      }

      return count;
    },
    enabled: !!collectionAddress && !!chainId,
  });
};

export const useListings = (
  collectionAddress: string,
  sort: { orderBy: string; orderDirection: 'asc' | 'desc' }
) => {
  const chain = useChain(),
    chainId = chain?.id;

  const endpoint = getSubgraphUrl(chainId);

  const getListingsQuery = gql`
    query GetListings(
      $first: Int
      $skip: Int
      $nftAddress: String
      $orderBy: String
      $orderDirection: String
    ) {
      listings(
        first: $first
        skip: $skip
        orderBy: $orderBy
        orderDirection: $orderDirection
        where: { nftAddress: $nftAddress, isInvalidOwner: false }
      ) {
        id
        sellerAddress
        nftAddress
        tokenId
        paymentType
        priceInWei
        saleType
        expiresAt
        expiredAt
        nftOwnerAddress
        isInvalidOwner
      }
    }
  `;

  const defaultVariables = {
    nftAddress: collectionAddress,
    orderBy: sort.orderBy,
    orderDirection: sort.orderDirection,
  };

  return useInfiniteQuery({
    queryKey: [
      'listings',
      collectionAddress,
      sort.orderBy,
      sort.orderDirection,
      chainId,
    ],
    queryFn: async ({ pageParam }) => {
      const page = pageParam?.page ?? 1;
      const pageSize = pageParam?.pageSize ?? DEFAULT_PAGE_SIZE;

      const queryResult: any = await request(endpoint, getListingsQuery, {
        ...defaultVariables,
        first: pageSize,
        skip: (page - 1) * pageSize,
      });

      return {
        page,
        pageSize,
        records: queryResult.listings,
      };
    },
    getNextPageParam: (lastPage: any) => {
      return lastPage.records && lastPage.records.length === lastPage.pageSize
        ? { page: lastPage.page + 1 }
        : undefined;
    },
    enabled: !!collectionAddress && !!chainId,
  });
};
