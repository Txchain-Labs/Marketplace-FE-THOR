import { useChain } from '@/utils/web3Utils';
import { useInfiniteQuery } from '@tanstack/react-query';

import { AuthService } from '@/services/auth.service';

export const useUsers = (enable: boolean, searchText: string) => {
  const limit = 50;

  const chain = useChain(),
    chainId = chain?.id;

  return useInfiniteQuery({
    queryKey: ['users', chainId, searchText],
    queryFn: ({ pageParam }) =>
      new Promise((resolve, reject) => {
        const page = pageParam?.page ?? 0;

        const params = {
          chainId,
          limit,
          page,
          keyword: searchText,
        };

        AuthService.getUsers(params)
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
      }),
    getNextPageParam: (lastPage: any) => {
      if (lastPage.page && lastPage.page < lastPage.totalPages) {
        return { page: lastPage.page + 1 };
      } else {
        return undefined;
      }
    },
    enabled: enable && !!chainId,
  });
};
