import axios from 'axios';
import { useChain } from '@/utils/web3Utils';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';

import { Nft } from '@/models/Nft';

export const useNFTs = (
  enable: boolean,
  searchText: string,
  sort: { orderBy: string; dir: string },
  filter?: {
    listed?: boolean;
    notListed?: boolean;
    privateBids?: boolean;
    bids?: boolean;
    noBids?: boolean;
    currency?: number;
    priceMin?: string;
    priceMax?: string;
    nftType?: string;
  },
  usd2avax?: any,
  thor2avax?: any,
  collectionAddress?: string | null
) => {
  const chain = useChain(),
    chainId = chain?.id;

  const pageSize = 100;

  const filterParams: {
    listed?: ('listed' | 'not_listed')[];
    bids?: ('otc_bids' | 'simple_bids' | 'no_bids')[];
    price_gte?: null | string;
    price_lte?: null | string;
    nft_type?: string;
  } = {};

  if (filter) {
    if (!(filter.listed && filter.notListed)) {
      filterParams.listed = [];
      filter.listed && filterParams.listed.push('listed');
      filter.notListed && filterParams.listed.push('not_listed');
    }

    if (!(filter.bids && filter.noBids && filter.privateBids)) {
      filterParams.bids = [];
      filter.bids && filterParams.bids.push('simple_bids');
      filter.privateBids && filterParams.bids.push('otc_bids');
      filter.noBids && filterParams.bids.push('no_bids');
    }

    if (filter.priceMin && filter.priceMax && usd2avax && thor2avax) {
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

      switch (filter.currency) {
        case 0:
          filterParams.price_gte = avaxPriceMinInWei.toString();
          filterParams.price_lte = avaxPriceMaxInWei.toString();
          break;
        case 1:
          filterParams.price_gte = avaxPriceMinInWei
            .mul(BigNumber.from(thor2avax))
            .div(BigNumber.from('1000000000000000000'))
            .toString();
          filterParams.price_lte = avaxPriceMaxInWei
            .mul(BigNumber.from(thor2avax))
            .div(BigNumber.from('1000000000000000000'))
            .toString();
          break;
        case 2:
          filterParams.price_gte = avaxPriceMinInWei
            .mul(BigNumber.from(usd2avax))
            .div(BigNumber.from('1000000000000000000'))
            .toString();
          filterParams.price_lte = avaxPriceMaxInWei
            .mul(BigNumber.from(usd2avax))
            .div(BigNumber.from('1000000000000000000'))
            .toString();
          break;
      }
    }

    if (filter.nftType) {
      filterParams.nft_type = filter.nftType;
    }
  }

  const sortParams = {
    orderBy: sort.orderBy,
    orderDirection: sort.dir,
  };

  return useInfiniteQuery({
    queryKey: [
      'nfts',
      chainId,
      searchText,
      JSON.stringify(sort),
      JSON.stringify(filter),
      collectionAddress,
    ],
    queryFn: ({ pageParam }) =>
      new Promise((resolve, reject) => {
        const curPage = pageParam?.curPage ?? 0;

        axios
          .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts`, {
            params: {
              chainId,
              keyword: searchText,
              address: collectionAddress,
              limit: pageSize,
              page: curPage,
              ...filterParams,
              ...sortParams,
            },
          })
          .then((response) => {
            const data = response.data.data;

            data.records = data.records
              ? data.records.map((item: any) => {
                  if (!/#\d+$/.test(item.name)) {
                    item.name = `${item.name} #${item.token_id}`;
                  }

                  item.img = item.img?.replace(
                    'ipfs://',
                    'https://ipfs.io/ipfs/'
                  );

                  return item;
                })
              : [];

            resolve({
              curPage: Number(data.metaData.page),
              // pageSize: data.data.pageSize,
              // totalPages: data.data.totalPages,
              records: data.records,
            });
          })
          .catch(reject);
      }),
    getNextPageParam: (lastPage: any) => {
      if (lastPage.curPage >= 0 && lastPage.records.length >= pageSize) {
        return { curPage: lastPage.curPage + 1, cursor: lastPage.cursor || '' };
      } else if (lastPage.cursor) {
        return { curPage: lastPage.curPage + 1, cursor: lastPage.cursor };
      } else {
        return undefined;
      }
    },
    enabled: enable && !!chain && !!sort && !!usd2avax && !!thor2avax,
  });
};

export const useNftsByWallet = (address: string) => {
  const chain = useChain();

  const fetchNftsByWallet = async (chainId: number): Promise<Nft[]> => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/nfts/nftsByWallet/${chainId}/${address}`
      );
      return res.data.code === 200
        ? res.data.data.result.map((item: any) => ({
            ...item,
            collection_address: item.token_address,
          }))
        : [];
    } catch (error) {
      console.log(error);
    }
    return [];
  };

  return useQuery({
    queryKey: ['nftsByWallet', chain?.id],
    queryFn: () => fetchNftsByWallet(chain?.id as number),
    refetchInterval: 60_000,
    enabled: Boolean(address && chain?.id),
  });
};
