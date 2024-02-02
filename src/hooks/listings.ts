import { useMemo } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
import { ethers, BigNumber } from 'ethers';

import { useChain } from '../utils/web3Utils';
import {
  ThorfiNFTType_ext,
  assetsType,
  getSubgraphUrl,
  nodeType,
  tier,
} from '../utils/constants';
import { useGetAvaxFromThor, useGetAvaxFromUsd } from './useOracle';
import { numberExponentToLarge } from '@/utils/common';
import { useGetEstimatedClaimTime } from './useNodes';
import { listedCountsType_ext, thorNodesType, ThorTier } from '@/utils/types';
import { Listing } from '@/models/Listing';

import contractReferences from '../utils/contractsReferences.json';

const DEFAULT_PAGE_SIZE = 20;

type ContractsReferencesType = {
  [key: number]: {
    contracts: {
      [key: string]: string;
    };
  };
};

const ContractsReferences: ContractsReferencesType =
  contractReferences as unknown as ContractsReferencesType;

export const useListingsCount = () => {
  const chain = useChain(),
    chainId = chain?.id;

  const endpoint = getSubgraphUrl(chainId);

  const nftAddresses = [
    ContractsReferences[chainId]?.contracts.OGNodeOdin.toLocaleLowerCase(),
    ContractsReferences[chainId]?.contracts.OGNodeThor.toLocaleLowerCase(),
    ContractsReferences[chainId]?.contracts.DriftNodeThor.toLocaleLowerCase(),
    ContractsReferences[chainId]?.contracts.DriftNodeOdin.toLocaleLowerCase(),
    ContractsReferences[chainId]?.contracts.ThorKeyNFT.toLocaleLowerCase(),
    ContractsReferences[chainId]?.contracts.ThorCapsuleNFT.toLocaleLowerCase(),
    ContractsReferences[chainId]?.contracts.ThorPerkNFT.toLocaleLowerCase(),
  ];

  const getListedCollectionsCountQuery = gql`
    query GetListedCollectionsCounts($ids: [String]) {
      listedCollections(where: { id_in: $ids }) {
        id
        listedCount
      }
    }
  `;

  const defaultVariables = {
    ids: nftAddresses,
    // date: Math.floor(Date.now() / 1000).toString(),
  };

  return useQuery({
    queryKey: ['listingsCount', nftAddresses, chainId],
    queryFn: async () => {
      const queryResult: any = await request(
        endpoint,
        getListedCollectionsCountQuery,
        {
          ...defaultVariables,
        }
      );

      return queryResult.listedCollections.reduce(
        (acu: listedCountsType_ext, cur: any) => {
          let assetType: ThorfiNFTType_ext;
          switch (cur.id) {
            case ContractsReferences[
              chainId
            ]?.contracts.ThorKeyNFT.toLocaleLowerCase():
              assetType = 'keycards';
              break;
            case ContractsReferences[
              chainId
            ]?.contracts.ThorCapsuleNFT.toLocaleLowerCase():
              assetType = 'capsules';
              break;
            case ContractsReferences[
              chainId
            ]?.contracts.ThorPerkNFT.toLocaleLowerCase():
              assetType = 'perks';
              break;
            case ContractsReferences[
              chainId
            ]?.contracts.OGNodeOdin.toLocaleLowerCase():
            case ContractsReferences[
              chainId
            ]?.contracts.OGNodeThor.toLocaleLowerCase():
              assetType = 'origin';
              break;
            default:
              assetType = 'drift';
          }
          acu[assetType] += +cur.listedCount;
          return acu;
        },
        {
          origin: 0,
          drift: 0,
          keycards: 0,
          capsules: 0,
          perks: 0,
        }
      );
    },
    enabled: !!nftAddresses && !!chainId,
  });
};

export const useListings = (
  _assetsType: string,
  sort: { orderBy: string; orderDirection: 'asc' | 'desc' },
  filter: {
    currency: number;
    priceMin?: string;
    priceMax?: string;
    privateBids: boolean;
    bids: boolean;
    noBids: boolean;
    favourited: boolean;
    notFavourited: boolean;
    withPerks?: boolean;
    withoutPerks?: boolean;
    pendingRewardsMin?: string;
    pendingRewardsMax?: string;
    dueDate?: number[];
  },
  favorited: number[],
  _tier?: ThorTier,
  _nodeType?: thorNodesType,
  _searchText?: string
) => {
  const chain = useChain(),
    chainId = chain?.id;

  const { data: usd2avax } = useGetAvaxFromUsd('1', chain);
  const { data: thor2avax } = useGetAvaxFromThor('1', chain);

  const avaxPriceMinInWei = ethers.utils.parseEther(
    Number(filter.priceMin).toLocaleString('fullwide', {
      useGrouping: false,
      maximumFractionDigits: 18,
    })
  );
  const avaxPriceMaxInWei = ethers.utils.parseEther(
    Number(filter.priceMax).toLocaleString('fullwide', {
      useGrouping: false,
      maximumFractionDigits: 18,
    })
  );

  let avaxPriceInWei_gte: string, avaxPriceInWei_lte: string;

  if (filter.priceMin && filter.priceMax && usd2avax && thor2avax) {
    switch (filter.currency) {
      case 0:
        avaxPriceInWei_gte = avaxPriceMinInWei.toString();
        avaxPriceInWei_lte = avaxPriceMaxInWei.toString();
        break;
      case 1:
        avaxPriceInWei_gte = avaxPriceMinInWei
          .mul(BigNumber.from(thor2avax))
          .div(BigNumber.from('1000000000000000000'))
          .toString();
        avaxPriceInWei_lte = avaxPriceMaxInWei
          .mul(BigNumber.from(thor2avax))
          .div(BigNumber.from('1000000000000000000'))
          .toString();
        break;
      case 2:
        avaxPriceInWei_gte = avaxPriceMinInWei
          .mul(BigNumber.from(usd2avax))
          .div(BigNumber.from('1000000000000000000'))
          .toString();
        avaxPriceInWei_lte = avaxPriceMaxInWei
          .mul(BigNumber.from(usd2avax))
          .div(BigNumber.from('1000000000000000000'))
          .toString();
        break;
    }
  }

  let lastClaimTime_gte: string, lastClaimTime_lte: string;

  const { data: minLastClaimTime } = useGetEstimatedClaimTime(
    _nodeType,
    filter.pendingRewardsMax
      ? ethers.utils.parseEther(numberExponentToLarge(filter.pendingRewardsMin))
      : BigNumber.from('0')
  );
  const { data: maxLastClaimTime } = useGetEstimatedClaimTime(
    _nodeType,
    filter.pendingRewardsMin
      ? ethers.utils.parseEther(numberExponentToLarge(filter.pendingRewardsMax))
      : BigNumber.from('0')
  );
  if (minLastClaimTime && maxLastClaimTime) {
    lastClaimTime_gte = maxLastClaimTime.toString();

    lastClaimTime_lte = minLastClaimTime.toString();
  }

  const endpoint = getSubgraphUrl(chainId);

  const getListingsQuery = gql`
    query GetListings(
      $first: Int
      $skip: Int
      $assetsType: String
      $nodeType: String
      $tier: String
      $orderBy: String
      $orderDirection: String
      $avaxPriceInWei_gte: String
      $avaxPriceInWei_lte: String
      $lastClaimTime_gte: String
      $lastClaimTime_lte: String
      $cur_timestamp: String
      $searchText: String
      $favorited: [Int]
    ) {
      listings(
        first: $first
        skip: $skip
        orderBy: $orderBy
        orderDirection: $orderDirection
        where: {
          and : [
            {assetsType: $assetsType},
            {tier: $tier},
            {isInvalidOwner: false}
            ${_nodeType ? ',{nodeType: $nodeType}' : ''}
            ${sort.orderBy === 'dueDate' ? ',{dueDate_gte: "0"}' : ''}
            ${_searchText ? ',{nftName_contains_nocase: $searchText}' : ''}
            ${
              sort.orderBy === 'lastClaimTime'
                ? ',{dueDate_gte: $cur_timestamp}'
                : ''
            }
            ${
              filter.priceMin
                ? ',{avaxPriceInWei_gte: $avaxPriceInWei_gte}'
                : ''
            }
            ${
              filter.priceMax
                ? ',{avaxPriceInWei_lte: $avaxPriceInWei_lte}'
                : ''
            }
            ${
              filter.pendingRewardsMin
                ? ',{lastClaimTime_gte: $lastClaimTime_gte}'
                : ''
            }
            ${
              filter.pendingRewardsMax
                ? ',{lastClaimTime_lte: $lastClaimTime_lte}'
                : ''
            }
            ${
              filter.favourited || filter.notFavourited
                ? filter.favourited && !filter.notFavourited
                  ? `,{tokenId_in: $favorited}`
                  : !filter.favourited && filter.notFavourited
                  ? `,{tokenId_not_in: $favorited}`
                  : ''
                : ''
            }
            ${
              filter.withPerks || filter.withoutPerks
                ? ',{withPerk_in: ' +
                  (filter.withPerks && !filter.withoutPerks
                    ? '[1]}'
                    : !filter.withPerks && filter.withoutPerks
                    ? '[0]}'
                    : '[0 , 1]}')
                : ''
            }
            ${
              filter.noBids || filter.bids || filter.privateBids
                ? `{
                    or: [
                      ${
                        filter.bids
                          ? filter.noBids
                            ? `{simpleBid_gte: 0}`
                            : `{simpleBid_gt: 0}`
                          : ''
                      }
                      ${
                        filter.privateBids
                          ? filter.noBids
                            ? `{otcBid_gte: 0}`
                            : `{otcBid_gt: 0}`
                          : ''
                      }
                      ${
                        filter.noBids && !filter.bids && !filter.privateBids
                          ? `{simpleBid: 0} {otcBid: 0}`
                          : ''
                      }
                    ]
                  }`
                : ''
            }
          ]
        }
      ) {
        id
        sellerAddress
        nftAddress
        nftName
        tokenId
        paymentType
        priceInWei
        saleType
        nftOwnerAddress
        isInvalidOwner
        dueDate
        lastClaimTime
        assetsType
        tier
        withPerk
        nodeType
      }
    }
  `;
  const variables = {
    assetsType: assetsType
      .indexOf(
        _assetsType === 'origin' || _assetsType === 'drift'
          ? 'nodes'
          : _assetsType
      )
      .toString(),
    nodeType: _nodeType ? nodeType.indexOf(_nodeType).toString() : '',
    tier: _tier ? tier[_tier].toString() : '0',
    orderBy: sort.orderBy,
    orderDirection: sort.orderDirection,
    avaxPriceInWei_gte,
    avaxPriceInWei_lte,
    lastClaimTime_gte,
    lastClaimTime_lte,
    cur_timestamp: Math.floor(Date.now() / 1000).toString(),
    favorited,
    searchText: _searchText,
  };

  return useInfiniteQuery({
    queryKey: [
      'listings',
      chainId,
      _assetsType,
      _nodeType,
      _tier,
      JSON.stringify(sort),
      JSON.stringify(filter),
      _searchText,
    ],
    queryFn: async ({ pageParam }) => {
      const page = pageParam?.page ?? 1;
      const pageSize = pageParam?.pageSize ?? DEFAULT_PAGE_SIZE;

      const queryResult: any = await request(endpoint, getListingsQuery, {
        ...variables,
        first: pageSize,
        skip: (page - 1) * pageSize,
      });

      return {
        page,
        pageSize,
        records: queryResult.listings as Listing[],
      };
    },
    getNextPageParam: (lastPage: any) => {
      return lastPage.records && lastPage.records.length === lastPage.pageSize
        ? { page: lastPage.page + 1 }
        : undefined;
    },
    enabled: !!_assetsType && !!chainId && !!usd2avax && !!thor2avax,
  });
};

export const useCheckGameloopCollection = () => {
  const chain = useChain(),
    chainId = chain?.id;

  const gameAssets = useMemo(() => {
    return [
      ContractsReferences[chainId]?.contracts.OGNodeOdin.toLocaleLowerCase(),
      ContractsReferences[chainId]?.contracts.OGNodeThor.toLocaleLowerCase(),
      ContractsReferences[chainId]?.contracts.DriftNodeThor.toLocaleLowerCase(),
      ContractsReferences[chainId]?.contracts.DriftNodeOdin.toLocaleLowerCase(),
      ContractsReferences[chainId]?.contracts.ThorKeyNFT.toLocaleLowerCase(),
      ContractsReferences[
        chainId
      ]?.contracts.ThorCapsuleNFT.toLocaleLowerCase(),
      ContractsReferences[chainId]?.contracts.ThorPerkNFT.toLocaleLowerCase(),
    ];
  }, [chainId]);

  return { gameAssets };
};
