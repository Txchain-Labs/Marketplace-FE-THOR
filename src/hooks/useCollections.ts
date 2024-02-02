import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useChain } from '@/utils/web3Utils';

import { collectionsService } from '@/services/collection.service';

import { Collection } from '@/models/Collection';

export const useCollections = (
  enable: boolean,
  searchText: string,
  sort: any = null
) => {
  const pageSize = 50;

  const chain = useChain(),
    chainId = chain?.id;

  return useInfiniteQuery({
    queryKey: ['collections', chainId, searchText, sort],
    queryFn: ({ pageParam }) =>
      new Promise((resolve, reject) => {
        const page = pageParam?.page ?? 1;

        const params = {
          chainId: chainId,
          pageSize,
          page,
          keyword: searchText,
          ...(sort && {
            order: sort.orderBy,
            order_dir: sort.dir,
          }),
        };

        collectionsService
          .getSortedCollections(params)
          .then((response) => {
            const data = response.data.data;

            resolve({
              page,
              totalPages: data.metaData.totalPages,
              records: data.records,
            });
          })
          .catch((error) => {
            reject(error);
          });
      }),
    getNextPageParam: (lastPage: any) => {
      if (lastPage.page && lastPage.page < lastPage.totalPages) {
        return { page: lastPage.page + 1 };
      } else {
        return undefined;
      }
    },
    enabled: enable && !!chainId && !!sort,
  });
};

export const usePromotedCollections = () => {
  const chain = useChain(),
    chainId = chain?.id;

  const params = {
    chainId,
  };

  return useQuery({
    queryKey: ['promoted-collections', chainId],
    queryFn: () =>
      new Promise((resolve, reject) => {
        collectionsService
          .getPromotedCollections(params)
          .then((response) => {
            const data = response.data.data;

            resolve(data.records);
          })
          .catch((error) => {
            reject(error);
          });
      }),
    enabled: !!chainId,
  });
};

export const useThorfiCollections = () => {
  const chain = useChain(),
    chainId = chain?.id;

  const params = { chainId, is_thor_collection: 'y' };

  return useQuery({
    queryKey: ['thorfi-collections', chainId],
    queryFn: () =>
      new Promise((resolve, reject) => {
        collectionsService
          .getSortedCollections(params)
          .then((response) => {
            const data = response.data.data;

            resolve(data.records);
          })
          .catch((error) => {
            reject(error);
          });
      }),
    enabled: !!chainId,
  });
};

export const useRecentlyAddedCollections = () => {
  const chain = useChain(),
    chainId = chain?.id;

  const params = { chainId };

  return useQuery({
    queryKey: ['recent-collections', chainId],
    queryFn: () =>
      new Promise((resolve, reject) => {
        collectionsService
          .getRecentlyAddedCollections(params)
          .then((response) => {
            const data = response.data.data;

            resolve(data.records);
          })
          .catch((error) => {
            reject(error);
          });
      }),
    enabled: !!chainId,
  });
};

export const useCollection = (address: string) => {
  const chain = useChain(),
    chainId = chain?.id;

  return useQuery({
    queryKey: ['collection', address, chainId],
    queryFn: (): Promise<Collection> =>
      new Promise((resolve, reject) => {
        collectionsService
          .getCollectionByAddress(address, chainId)
          .then((response) => {
            resolve(response.data.data);
          })
          .catch((error) => {
            reject(error);
          });
      }),
    enabled: !!address && !!chainId,
  });
};

export const useGetCollectionByAddr = (collectionAddress: string) => {
  const chain = useChain();

  return useQuery<Collection>({
    queryKey: ['collection-with-analytics', collectionAddress, chain.id],
    queryFn: () =>
      new Promise((resolve, reject) => {
        collectionsService
          .getCollectionByAddress(collectionAddress, chain.id)
          .then((response) => {
            const data = response.data.data;

            resolve(data as Collection);
          })
          .catch((error) => {
            reject(error);
          });
      }),
    enabled: !!collectionAddress && !!chain.id,
  });
};
