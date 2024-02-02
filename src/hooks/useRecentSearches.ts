import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { useChain } from '@/utils/web3Utils';

import { RecentSearchService } from '@/services/recentSearch.service';

export const fetchRecentSearches =
  (chainId: number, userId: string) =>
  ({ pageParam }: any) =>
    new Promise((resolve, reject) => {
      const limit = 50;
      const page = pageParam?.page ?? 0;

      const params = {
        limit,
        page,
      };

      RecentSearchService.getRecentSearchesByUser(chainId, userId, params)
        .then((response) => {
          const { data } = response;

          resolve({
            page,
            totalPages: data?.data?.metaData?.totalPages,
            records: data?.data?.records,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });

export const useRecentSearches = (enable: boolean, userId: string) => {
  const chain = useChain(),
    chainId = chain?.id;

  return useInfiniteQuery({
    queryKey: ['recentSearches', chainId, userId],
    queryFn: fetchRecentSearches(chainId, userId),
    getNextPageParam: (lastPage: any) => {
      if (lastPage.page && lastPage.page < lastPage.totalPages) {
        return { page: lastPage.page + 1 };
      } else {
        return undefined;
      }
    },
    enabled: enable && !!chainId && !!userId,
  });
};

export const useAddRecentSearch = () => {
  const queryClient = useQueryClient();

  const chain = useChain(),
    chainId = chain?.id;

  return useMutation({
    mutationFn: (args: {
      user_id: string;
      item_type: string;
      item: {
        collection_address?: string;
        token_id?: string;
        user_address?: string;
      };
    }) => {
      return RecentSearchService.addRecentSearchByUser(
        chainId,
        args.user_id,
        args.item_type,
        args.item
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['recentSearches'],
      });
    },
  });
};
