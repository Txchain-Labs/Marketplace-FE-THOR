import {
  fetchListingsQuery,
  fetchListingByTokenId,
  fetchOtcBidsQuery,
  fetchBidsForNftQuery,
} from '../utils/graphqlQueries';
import { getSubgraphUrl } from '../utils/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useChain } from '../utils/web3Utils';
import { useSelector } from 'react-redux';
import { Listing } from '../models/Listing';

export const useGetListings = (
  contractAddress: any,
  start = 0,
  limit = 100
) => {
  const status = useSelector((state: any) => state.txn.status);
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const listingsQuery = fetchListingsQuery(contractAddress, start, limit);

  async function getListings() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: {
        query: listingsQuery,
      },
    });
  }

  return useQuery(
    ['getListings', contractAddress, start, limit, chain, status],
    getListings,
    {
      refetchInterval: 2 * 60 * 1000,
      enabled: Boolean(contractAddress),
    }
  );
};

export const useGetLikedListings = (
  collectionAddress: any,
  user: any,
  slideChanged: any,
  optionalParams = ''
) => {
  const status = useSelector((state: any) => state.txn.status);
  const chain = useChain();

  async function getLikedListings(): Promise<Listing[]> {
    return new Promise((res) =>
      axios({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/is-liked-listings/${
          chain.id
        }/${
          user?.id ?? '00000000-0000-0000-0000-000000000000'
        }/${collectionAddress}/?${optionalParams}`,
        method: 'get',
        headers: { 'content-type': 'application/json' },
      })
        .then((resp) => res(resp?.data?.data ?? []))
        .catch(() => res([]))
    );
  }

  return useQuery(
    [
      'getLikedListings',
      collectionAddress,
      chain,
      status,
      user,
      slideChanged ? slideChanged : status,
    ],
    getLikedListings,
    {
      refetchInterval: 2 * 60 * 1000,
      enabled: Boolean(collectionAddress && user),
    }
  );
};

export const funcGetGraphQuery = async function (
  listingsQuery: string,
  subgraphUrl: string
) {
  return axios({
    url: subgraphUrl,
    method: 'post',
    headers: { 'content-type': 'application/json' },
    data: {
      query: listingsQuery,
    },
  });
};

export const funcGetListingPriceByTokenId = (
  contractAddress: string | undefined,
  tokenId: number | undefined,
  chain: any
) => {
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const listingsQuery = fetchListingByTokenId(contractAddress, tokenId);

  return funcGetGraphQuery(listingsQuery, subgraphUrl);
};

export const useGetListingByNft = (
  contractAddress: string | undefined,
  tokenId: number | undefined
) => {
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const listingsQuery = fetchListingByTokenId(contractAddress, tokenId);

  async function getListingByTokenId() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: {
        query: listingsQuery,
      },
    });
  }

  return useQuery(
    ['getListingByTokenId', contractAddress, tokenId, chain],
    getListingByTokenId,
    {
      refetchInterval: 2 * 60 * 1000,
      enabled: Boolean(contractAddress && tokenId),
    }
  );
};

export const funcGetBidPriceByTokenId = (
  contractAddress: string | undefined,
  tokenId: number | undefined,
  chain: any
) => {
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const bidQuery = fetchOtcBidsQuery(contractAddress, tokenId);

  return funcGetGraphQuery(bidQuery, subgraphUrl);
};

export const funcGetBidsByTokenId = (
  contractAddress: string | undefined,
  tokenId: number | undefined,
  chain: any
) => {
  const subgraphUrl = getSubgraphUrl(chain?.id);
  const bidQuery = fetchBidsForNftQuery(contractAddress, tokenId);

  return funcGetGraphQuery(bidQuery, subgraphUrl);
};
