import React, { FC, useState, useMemo, useEffect } from 'react';
import { queryTypes, useQueryState, useQueryStates } from 'next-usequerystate';
import axios from 'axios';
import { useSelector } from '@/redux/store';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/material';
import { CommonLoader } from '@/components/common';

import { useChain } from '@/utils/web3Utils';
import {
  useGetAvaxFromThor,
  useGetAvaxFromUsd,
  useGetUsdFromAvax,
  useGetUsdFromThor,
} from '@/hooks/useOracle';
import { useNFTs } from '@/hooks/useNfts';
import { useGetNFTsFavrt } from '@/hooks/useNFTDetail';

import ArtworkCard from '@/components/common/thumbnails/ArtworkCard';
import PlaceBid from '@/components/modals/PlaceBid';

import { Nft } from '@/models/Nft';
import { Collection } from '@/models/Collection';

export const defaultFilterValues: {
  listed: boolean;
  notListed: boolean;
  privateBids: boolean;
  bids: boolean;
  noBids: boolean;
  currency: number;
  priceMin: string;
  priceMax: string;
} = {
  listed: true,
  notListed: true,
  privateBids: true,
  bids: true,
  noBids: true,
  currency: 0,
  priceMin: '',
  priceMax: '',
};

interface NFTsListProps {
  collection: Collection;
}

const NFTsList: FC<NFTsListProps> = ({ collection }) => {
  const chain = useChain();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchText] = useQueryState('q', queryTypes.string.withDefault(''));
  const [sort] = useQueryStates({
    orderBy: queryTypes.string.withDefault('minted_at'),
    dir: queryTypes.string.withDefault('desc'),
  });
  const [filter] = useQueryStates({
    listed: queryTypes.boolean.withDefault(defaultFilterValues.listed),
    notListed: queryTypes.boolean.withDefault(defaultFilterValues.notListed),
    privateBids: queryTypes.boolean.withDefault(
      defaultFilterValues.privateBids
    ),
    bids: queryTypes.boolean.withDefault(defaultFilterValues.bids),
    noBids: queryTypes.boolean.withDefault(defaultFilterValues.noBids),
    currency: queryTypes.integer.withDefault(defaultFilterValues.currency),
    priceMin: queryTypes.string.withDefault(defaultFilterValues.priceMin),
    priceMax: queryTypes.string.withDefault(defaultFilterValues.priceMax),
  });

  const { user } = useSelector((state: any) => state.auth);

  const [isBidModalOpen, setIsBidModalOpen] = useState<boolean>(false);
  const [biddingNft, setBiddingNft] = useState<Nft | null>(null);
  const [activeBidType, setActiveBidType] = useState<string>('');

  const { ref, inView } = useInView({ rootMargin: '500px' });

  const { data: usd2avax } = useGetAvaxFromUsd('1', chain);
  const { data: thor2avax } = useGetAvaxFromThor('1', chain);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const { data, status, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useNFTs(
      true,
      searchText,
      sort,
      filter,
      usd2avax,
      thor2avax,
      collection.address
    );

  const { data: favorites, refetch: refetchFavorates } = useGetNFTsFavrt(
    user?.id
  );

  const favoritesByAddressId = useMemo(() => {
    if (!favorites) {
      return undefined;
    }

    const map = new Map();

    favorites.forEach((item) => {
      map.set(item.collection_address + item.token_id, true);
    });

    return map;
  }, [favorites]);

  const handlePlaceBid = (nft: Nft, activeBidType: string) => {
    setBiddingNft(nft);
    setActiveBidType(activeBidType);
    setIsBidModalOpen(true);
  };

  const handleCloseBidModal = () => {
    setBiddingNft(null);
    setIsBidModalOpen(false);
  };

  const handleLike = (collection_address: string, token_id: string): void => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/like-unsynced`, {
        user_id: user?.id,
        chainid: chain?.id,
        collection_address: collection_address,
        token_id: token_id,
      })
      .then(() => {
        refetchFavorates();
      });
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <Box>
      {status === 'loading' ? (
        <CommonLoader
          size={undefined}
          text={'Loading NFTs...'}
          width={'100%'}
          height={smDown ? 'calc(100vh - 211px)' : 'calc(100vh - 181px)'}
        />
      ) : (
        <Box
          sx={(theme) => ({
            ml: '-16px',
            [theme.breakpoints.down('sm')]: { ml: 0 },
          })}
        >
          {data?.pages?.map((page: any) => (
            <React.Fragment key={page.curPage}>
              {page?.records?.map((nft: Nft) => (
                <Box
                  key={nft.collection_address + nft.token_id}
                  sx={(theme) => ({
                    float: 'left',
                    width: '209px',
                    ml: '16px',
                    mb: '16px',
                    [theme.breakpoints.down('sm')]: {
                      width: 'calc(50vw - 16px)',
                      ml: 0,
                      mb: '8px',
                    },
                  })}
                >
                  <ArtworkCard
                    nft={nft}
                    collection={collection}
                    avaxPrice={avaxPrice}
                    thorPrice={thorPrice}
                    isLiked={
                      favoritesByAddressId?.has(
                        nft?.collection_address + nft?.token_id
                      ) ?? false
                    }
                    onLike={() =>
                      handleLike(nft?.collection_address, nft?.token_id)
                    }
                    handlePlaceBid={handlePlaceBid}
                    width={smDown ? 'calc(50vw - 16px)' : undefined}
                  />
                </Box>
              ))}
            </React.Fragment>
          ))}
          <Box
            ref={ref}
            width={'100%'}
            height={'248px'}
            sx={{ clear: 'both' }}
            hidden={!hasNextPage}
          >
            {isFetchingNextPage && (
              <CommonLoader
                size={undefined}
                text={'Loading more ...'}
                width={'100%'}
                height={'248px'}
              />
            )}
          </Box>
        </Box>
      )}

      {isBidModalOpen && (
        <PlaceBid
          open={isBidModalOpen}
          handleClose={handleCloseBidModal}
          collectionAddress={biddingNft.collection_address}
          tokenId={Number(biddingNft.token_id)}
          nft={{
            image: biddingNft.img,
            title: biddingNft.metadata
              ? JSON.parse(biddingNft.metadata).name
              : biddingNft.name,
          }}
          activeBidType={activeBidType}
        />
      )}
    </Box>
  );
};

export default NFTsList;
