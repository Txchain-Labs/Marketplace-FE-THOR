import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

import { getNodesContractByChain } from '../utils/constants';
import { useChain } from '../utils/web3Utils';

import { collectionsService } from '../services/collection.service';

export const useCollections = (searchText: string) => {
  const chain = useChain();

  const params = { keyword: searchText, chainId: chain?.id };

  const nodeAddresses = getNodesContractByChain(chain);

  return useQuery({
    queryKey: ['collections', searchText],
    queryFn: () =>
      new Promise((resolve, reject) => {
        collectionsService
          .getCollections(params)
          .then((response) => {
            const data = response.data.data;

            if (data.metaData?.totalCount > 0 && data.records) {
              const nodeCollections: any[] = [];

              const records = data.records.filter((item: any) => {
                if (nodeAddresses.includes(item.address.toLowerCase())) {
                  nodeCollections.push(item);
                  return false;
                }

                return true;
              });

              data.records = nodeCollections.concat(records);
            }
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      }),
  });
};

export const useCollection = (address: string) => {
  const chain = useChain(),
    chainId = chain?.id;

  return useQuery({
    queryKey: ['collection', address, chainId],
    queryFn: () =>
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

export const useNFTs = (address: string) => {
  const chain = useChain(),
    chainId = chain?.id;

  const nodeAddresses = getNodesContractByChain(chain);

  return useInfiniteQuery({
    queryKey: ['nfts', address],
    queryFn: ({ pageParam }) =>
      new Promise((resolve, reject) => {
        const curPage = pageParam?.curPage ?? 0;
        const cursor = pageParam?.cursor ?? '';

        let url: string;

        if (nodeAddresses.includes(address.toLowerCase())) {
          const collection_name = nodeAddresses.findIndex(
            (item) => item.toLowerCase() === address.toLowerCase()
          )
            ? 'OG_THOR'
            : 'OG_ODIN';

          url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/nodesSynced?chainId=${chainId}&${collection_name}=${address}&page=${curPage}&cursor=${cursor}&pageSize=20`;
          axios
            .get(url)
            .then((response) => {
              const { data } = response;
              resolve({
                cursor: data.data.cursor,
                curPage: data.data.curPage,
                pageSize: data.data.pageSize,
                totalPages: data.data.totalPages,
                records: data.data.nfts,
              });
            })
            .catch(reject);
        } else {
          url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/favoriteByCollection/${chainId}/${address}?page=${curPage}&pageSize=20`;
          axios
            .get(url)
            .then((response) => {
              const { data } = response;

              data.data.nfts = data.data.nfts
                ? data.data.nfts.map(
                    (item: { name: string; token_id: string }) => {
                      if (!/#\d+$/.test(item.name)) {
                        item.name = `${item.name} #${item.token_id}`;
                      }

                      return item;
                    }
                  )
                : [];

              resolve({
                curPage: data.data.curPage,
                pageSize: data.data.pageSize,
                totalPages: data.data.totalPages,
                records: data.data.nfts,
              });
            })
            .catch(reject);
        }
      }),
    getNextPageParam: (lastPage: any) => {
      if (lastPage.totalPages && lastPage.totalPages > lastPage.curPage) {
        return { curPage: lastPage.curPage + 1, cursor: lastPage.cursor || '' };
      } else if (lastPage.cursor) {
        return { curPage: lastPage.curPage + 1, cursor: lastPage.cursor };
      } else {
        return undefined;
      }
    },
    enabled: !!address && !!chainId,
  });
};
