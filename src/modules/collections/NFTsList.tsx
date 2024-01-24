import React, { FC, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import { useWindowWidth } from '@react-hook/window-size';
import { useSelector } from 'react-redux';
import { Box, ImageList, ImageListItem } from '@mui/material';

import { selectId2cartedIndex } from '../../redux/slices/cartSlice';

import { CommonLoader } from '../../components/common';
import ArtworkCard from '../../components/common/thumbnails/ArtworkCard';

import { useNFTs } from '../../hooks/collections';
import { useGetNFTsFavrt } from '../../hooks/useNFTDetail';
import { useChain } from '../../utils/web3Utils';
import { useGetUsdFromAvax, useGetUsdFromThor } from '../../hooks/useOracle';

import { Nft } from '../../models/Nft';

interface NFTsListProps {
  collection?: any;
}

const NFTsList: FC<NFTsListProps> = ({ collection }) => {
  const windowWidth = useWindowWidth();
  const chain = useChain();

  const user = useSelector((state: any) => state.auth.user);
  const id2cartedIndex = useSelector(selectId2cartedIndex);

  const { data: favorites, refetch: refetchFavorates } = useGetNFTsFavrt(
    user?.id
  );

  const {
    status,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    // refetch,
  } = useNFTs(collection?.address);

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const { ref, inView } = useInView({ rootMargin: '500px' });
  const nftImageListCols = useMemo(() => {
    return Math.floor((windowWidth - 455) / 248);
  }, [windowWidth]);
  const nftImageListRowHeight = useMemo(() => {
    if (windowWidth < 600) {
      return windowWidth;
    } else {
      return Math.floor((windowWidth - 455) / nftImageListCols);
    }
  }, [windowWidth, nftImageListCols]);

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

  return status === 'loading' || id2cartedIndex === undefined ? (
    <CommonLoader
      size={undefined}
      text={'Loading NFTs...'}
      width={'100%'}
      height={'50vh'}
    />
  ) : (
    <React.Fragment>
      <ImageList
        sx={{
          overflow: 'hidden',
          width: '100%',
          padding: '50px 0 12px 0',
          margin: 0,
        }}
        cols={nftImageListCols}
        rowHeight={nftImageListRowHeight}
        gap={0}
      >
        {data?.pages?.map((page: any) => (
          <React.Fragment key={page.curPage}>
            {page?.records?.map((item: Nft) => (
              <ImageListItem key={item.collection_address + item.token_id}>
                <ArtworkCard
                  collection={collection}
                  nft={item}
                  isLiked={
                    favoritesByAddressId?.has(
                      item?.collection_address + item?.token_id
                    ) ?? false
                  }
                  onLike={() =>
                    handleLike(item?.collection_address, item?.token_id)
                  }
                  avaxPrice={avaxPrice}
                  thorPrice={thorPrice}
                  isCarted={id2cartedIndex.includes(
                    item.collection_address + item.token_id
                  )}
                  // refresh={refetch}
                />
              </ImageListItem>
            ))}
          </React.Fragment>
        ))}
      </ImageList>
      <Box ref={ref} height={'248px'} hidden={!hasNextPage}>
        {isFetchingNextPage && (
          <CommonLoader
            size={undefined}
            text={'Loading more ...'}
            width={'100%'}
            height={'248px'}
          />
        )}
      </Box>
    </React.Fragment>
  );
};

export default NFTsList;
