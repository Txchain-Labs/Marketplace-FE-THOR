import React, { FC, useEffect, useMemo, useState } from 'react';
// eslint-disable-next-line import/named
import { animateScroll } from 'react-scroll';
import { useDebounce } from 'usehooks-ts';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { Box, Typography } from '@mui/material';
import { useChain } from '../../utils/web3Utils';
import { thorfiNfts } from '../../utils/constants';

import { useGetNFTsFavrt } from '../../hooks/useNFTDetail';
import { useListings, useListingsCount } from '../../hooks/listings';

import { selectSort, selectTier, setSort } from '../../redux/slices/nodesSlice';

import { SortMenu, CommonLoader } from '../../components/common';
import NodeTile from './NodeTile';
import PlaceBid from '../../components/modals/PlaceBid';
import BuyNFTModal from '../../components/modals/BuyNFTModal';

import { selectId2cartedIndex } from '../../redux/slices/cartSlice';

type ThorfiNFTCategory = {
  name: string;
  tier: string;
  image: string;
  contract: string;
};

interface ThorfiNftsListProps {
  thorfiNFTType?: any;
}

const ThorfiNftsList: FC<ThorfiNftsListProps> = ({ thorfiNFTType }) => {
  const chain = useChain();

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const tier = useSelector(selectTier);
  const sort = useSelector(selectSort);
  const id2cartedIndex = useSelector(selectId2cartedIndex);
  const debouncedTier = useDebounce<string>(tier, 500);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBuyModal, setIsOpenBuyModal] = useState(false);
  const [selectedTile, setSelectedTile] = useState(null);
  console.log(123123, selectedTile);
  const thorfiNFTs = thorfiNfts(thorfiNFTType, chain);
  const thorfiNFTCategory = useMemo<ThorfiNFTCategory | undefined>(() => {
    if (!thorfiNFTs) return undefined;

    return thorfiNFTs.find((item) => item.tier === debouncedTier);
  }, [thorfiNFTs, debouncedTier]);
  console.log('123123123', thorfiNFTCategory);
  const { data: favorites, refetch: refetchFavorates } = useGetNFTsFavrt(
    user?.id
  );

  const { data: listedNodeCount } = useListingsCount(
    thorfiNFTCategory?.contract
  );

  const {
    status,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useListings(thorfiNFTCategory?.contract, sort);

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

  const onSortChange = (orderBy: string, orderDirection: 'asc' | 'desc') => {
    dispatch(setSort({ orderBy, orderDirection }));
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCloseBuyModal = () => {
    setIsOpenBuyModal(false);
  };

  const { ref, inView } = useInView({ rootMargin: '500px' });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  useEffect(() => {
    animateScroll.scrollToTop({
      containerId: 'thorfi_nfts_list_container',
      duration: 1000,
      smooth: true,
    });
  }, [debouncedTier]);

  useEffect(() => {
    if (sort && !sort.orderBy) {
      dispatch(
        setSort({
          orderBy: 'avaxPriceInWei',
          orderDirection: 'desc',
        })
      );
    }
  }, [dispatch, sort]);

  return thorfiNFTCategory && id2cartedIndex !== undefined ? (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Typography
        variant={'h4'}
        sx={(theme) => ({
          fontSize: '52px',
          lineHeight: '78px',
          [theme.breakpoints.down('md')]: {
            fontSize: '32px',
            lineHeight: '48px',
          },
        })}
      >
        {thorfiNFTCategory.tier}
      </Typography>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Typography
          variant={'subtitle1'}
          sx={{ fontSize: '15px', letterSpacing: '4%', lineHeight: '23px' }}
        >
          THORFI{' '}
          <span style={{ fontWeight: '600', fontFamily: 'Nexa-Bold' }}>
            {thorfiNFTCategory?.name}
          </span>{' '}
          NODES
        </Typography>
      </Box>
      <Typography
        variant={'p-lg'}
        sx={{
          fontWeight: 400,
          fontSize: '19px',
          lineHeight: '28px',
          marginTop: '4px',
        }}
      >
        {listedNodeCount ?? 0}
      </Typography>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box flexGrow={1} />
        <Box display={'flex'}>
          <SortMenu
            sortOptions={[
              {
                label: 'Price',
                directionLabels: { desc: 'High to low', asc: 'Low to high' },
                directions: ['desc', 'asc'],
                field: 'avaxPriceInWei',
              },
              {
                label: 'Active Days Remaining',
                directionLabels: {
                  desc: 'Most to least',
                  asc: 'Least to most',
                },
                directions: ['desc', 'asc'],
                field: 'dueDate',
                disabled: true,
              },
              {
                label: 'Pending rewards',
                directionLabels: { desc: 'High to low', asc: 'Low to high' },
                directions: ['desc', 'asc'],
                field: 'lastClaimDate',
                disabled: true,
              },
            ]}
            selectedField={sort.orderBy}
            direction={sort.orderDirection}
            onChange={onSortChange}
          />
        </Box>
      </Box>

      {status === 'loading' ? (
        <CommonLoader
          size={undefined}
          text={'Loading NFTs...'}
          width={'100%'}
          height={'50vh'}
        />
      ) : (
        <Box
          sx={{
            mt: 3,
            flexGrow: 1,
            overflow: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
          id={'thorfi_nfts_list_container'}
        >
          {data?.pages?.map((page: any, index) => (
            <React.Fragment key={index}>
              {page?.records?.map((item: any) => (
                <Box
                  key={item.id}
                  sx={{
                    'mt': '6px',
                    'mb': 1,
                    '@media (max-width: 500px)': {
                      width: 'calc(50% - 5px)',
                    },
                  }}
                >
                  <NodeTile
                    listing={Object.assign(
                      {
                        isLiked:
                          favoritesByAddressId?.has(
                            item?.nftAddress + item?.tokenId
                          ) ?? false,
                      },
                      item
                    )}
                    isCarted={id2cartedIndex.includes(
                      item?.nftAddress + item?.tokenId
                    )}
                    type={thorfiNFTCategory?.name}
                    contract={thorfiNFTCategory?.contract}
                    setSelectedTile={setSelectedTile}
                    chain={chain}
                    user={user}
                    viewPlaceBidModal={() => setIsOpen(true)}
                    refresh={refetchFavorates}
                  />
                </Box>
              ))}
            </React.Fragment>
          ))}
          <Box
            ref={ref}
            display={hasNextPage ? 'block' : 'none'}
            textAlign={'center'}
            width={'100%'}
            height={'248px'}
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

      {isOpen && (
        <PlaceBid
          open={isOpen}
          handleClose={handleClose}
          openToast={undefined}
          collectionAddress={thorfiNFTCategory?.contract}
          tokenId={selectedTile}
          // placingBid={(v) => console.log(v)}
          nft={{
            image: thorfiNFTCategory?.image,
            title:
              thorfiNFTCategory?.tier.charAt(0).toUpperCase() +
              thorfiNFTCategory?.tier.slice(1).toLowerCase() +
              ' ' +
              thorfiNFTCategory?.name,
          }}
        />
      )}
      {isOpenBuyModal && (
        <BuyNFTModal
          collectionAddress={thorfiNFTCategory?.contract}
          tokenId={selectedTile}
          open={isOpenBuyModal}
          handleClose={handleCloseBuyModal}
          openToast={undefined}
          refresh={refetch}
          nft={{
            image: thorfiNFTCategory?.image,
            title:
              thorfiNFTCategory?.tier.charAt(0).toUpperCase() +
              thorfiNFTCategory?.tier.slice(1).toLowerCase() +
              ' ' +
              thorfiNFTCategory?.name,
          }}
        />
      )}
    </Box>
  ) : (
    <Box
      sx={{
        border: '2px dashed rgba(0, 0, 0, 0.4)',
        boxSizing: 'border-box',
        padding: '8px',
        textAlign: 'center',
        color: '#808080',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Nexa',
          fontSize: '14px',
          fontWeight: '700',
          lineHeight: '21px',
          letterSpacing: '0em',
          textAlign: 'center',
          color: '#808080',
        }}
      >
        Invalid Thor NFT type
      </Typography>
    </Box>
  );
};

export default ThorfiNftsList;
