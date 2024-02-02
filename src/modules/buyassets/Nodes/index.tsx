import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQueryState, useQueryStates, queryTypes } from 'next-usequerystate';
import { useInView } from 'react-intersection-observer';
import debounce from 'lodash.debounce';

import { ThorfiNFTType_ext, thorfiNfts_ext } from '@/utils/constants';

import { thorNodesType, ThorTier } from '@/utils/types';

import {
  Badge,
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  useMediaQuery,
  useTheme,
  ThemeProvider,
} from '@mui/material';
import { useSearchFieldTheme } from '@/themes';
import FilterListIcon from '@mui/icons-material/FilterList';
import { CommonLoader, SearchField, SortMenu } from '@/components/common';
import { SortDirection, SortOption } from '@/components/common/SortMenu';
import AssetsTile from '../AssetsTile';
import OGFilterModal from './OGFilterModal';
import DriftFilterModal from './DriftFilterModal';
import { useChain } from '@/utils/web3Utils';
import NftEmptyState from '../NftEmptyState';
import PlaceBid from '@/components/modals/PlaceBid';
import ListedGameAssetsCard from '@/components/common/thumbnails/ListedGameAssets';

import { useListings } from '@/hooks/listings';
import { useGetNFTsFavrt } from '@/hooks/useNFTDetail';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';

import { selectId2cartedIndex } from '@/redux/slices/cartSlice';
import { Listing } from '@/models/Listing';
import Sticky from 'react-stickynode';
import useSize from '@react-hook/size';
import _ from 'lodash';
import EmptyState from '@/components/common/EmptyState';

interface ThorfiNFTsProps {
  assetsType?: ThorfiNFTType_ext;
}

type ThorfiNFTCategory = {
  name: string;
  nodeType: string;
  tier: string;
  poster: string;
  video: string;
  contract: string;
};

const sortOptions: SortOption[] = [
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
    // disabled: true,
  },
  {
    label: 'Pending rewards',
    directionLabels: { asc: 'High to low', desc: 'Low to high' },
    directions: ['asc', 'desc'],
    field: 'lastClaimTime',
    // disabled: true,
  },
];

const defaultFilterValues: {
  favourited: boolean;
  notFavourited: boolean;
  privateBids: boolean;
  bids: boolean;
  noBids: boolean;
  withPerks: boolean;
  withoutPerks: boolean;
  currency: number;
  priceMin: string;
  priceMax: string;
  pendingRewardsMin: string;
  pendingRewardsMax: string;
  dueDate: number[];
} = {
  favourited: true,
  notFavourited: true,
  privateBids: true,
  bids: true,
  noBids: true,
  withPerks: true,
  withoutPerks: true,
  currency: 0,
  priceMin: '',
  priceMax: '',
  pendingRewardsMin: '',
  pendingRewardsMax: '',
  dueDate: [0, 30],
};

const NodesTab: FC<ThorfiNFTsProps> = ({ assetsType }) => {
  const theme = useTheme();
  const searchFieldTheme = useSearchFieldTheme(theme);

  const chain = useChain();

  const user = useSelector((state: any) => state.auth.user);
  const id2cartedIndex = useSelector(selectId2cartedIndex);

  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [selectedAcceptPayments, setSelectedAcceptPayments] = useState<
    string[]
  >(['1', '1', '1']);
  const [isOpenBidModal, setIsOpenBidModal] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<boolean>(true);

  const { ref, inView } = useInView({ rootMargin: '500px' });

  const matches = useMediaQuery('(max-width:600px)');

  const [activeNode, setActiveNode] = useQueryStates({
    nodeType:
      assetsType === 'drift'
        ? queryTypes.string.withDefault('DRIFT')
        : queryTypes.string.withDefault('ORIGIN'),
    tier: queryTypes.string.withDefault('ODIN'),
  });

  const [searchText, setSearchText] = useQueryState(
    'q',
    queryTypes.string.withDefault('')
  );
  const [_searchText, set_searchText] = useState<string>(searchText);

  const debouncedSetSearchText = useMemo(
    () =>
      debounce((value: string) => {
        if (value === '') value = null;
        setSearchText(value);
      }, 500),
    [setSearchText]
  );

  const [sort, setSort] = useQueryStates({
    orderBy: queryTypes.string.withDefault('avaxPriceInWei'),
    orderDirection: queryTypes.string.withDefault('desc'),
  });

  const [filter, setFilter] = useQueryStates({
    favourited: queryTypes.boolean.withDefault(true),
    notFavourited: queryTypes.boolean.withDefault(true),
    privateBids: queryTypes.boolean.withDefault(true),
    bids: queryTypes.boolean.withDefault(true),
    noBids: queryTypes.boolean.withDefault(true),
    withPerks: queryTypes.boolean.withDefault(true),
    withoutPerks: queryTypes.boolean.withDefault(true),
    currency: queryTypes.integer.withDefault(0),
    priceMin: queryTypes.string.withDefault(''),
    priceMax: queryTypes.string.withDefault(''),
    pendingRewardsMin: queryTypes.string.withDefault(''),
    pendingRewardsMax: queryTypes.string.withDefault(''),
    dueDate: queryTypes.array(queryTypes.integer).withDefault([0, 30]),
  });

  useEffect(() => {
    setFilter({
      favourited: null,
      notFavourited: null,
      privateBids: null,
      bids: null,
      noBids: null,
      withPerks: null,
      withoutPerks: null,
      currency: null,
      priceMin: null,
      priceMax: null,
      pendingRewardsMin: null,
      pendingRewardsMax: null,
      dueDate: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNode.nodeType]);

  useEffect(() => {
    setFilterStatus(_.isEqual(filter, defaultFilterValues));
  }, [filter]);

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const nftsListContainerRef = useRef(null);
  const [width] = useSize(nftsListContainerRef);
  const nftImageListCols = useMemo(() => {
    return matches ? 2 : Math.ceil(width / 220);
  }, [width, matches]);

  const thorfiNFTs = thorfiNfts_ext(assetsType, chain);

  const thorfiNFTCategory = useMemo<ThorfiNFTCategory | undefined>(() => {
    if (!thorfiNFTs) return undefined;

    return thorfiNFTs.find(
      (item) =>
        item.tier === activeNode.tier && item.nodeType === activeNode.nodeType
    );
  }, [thorfiNFTs, activeNode]);

  const { data: favorites, refetch: refetchFavorates } = useGetNFTsFavrt(
    user?.id
  );

  const favoritesByAddressId = useMemo(() => {
    if (!favorites) {
      return undefined;
    }

    const favoritedTokenIds: number[] = [];
    const favoriteItems = [...favorites];

    favoriteItems.forEach((item) => {
      if (
        thorfiNFTCategory?.contract.toLocaleLowerCase() ===
        item.collection_address.toLocaleLowerCase()
      ) {
        favoritedTokenIds.push(Number(item.token_id));
      }
    });

    return favoritedTokenIds;
  }, [favorites, thorfiNFTCategory]);

  const { status, data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useListings(
      assetsType,
      {
        orderBy: sort.orderBy,
        orderDirection: sort.orderDirection as SortDirection,
      },
      filter,
      favoritesByAddressId,
      activeNode.tier as ThorTier,
      activeNode.nodeType as thorNodesType,
      searchText
    );

  const filteredCount = useMemo(() => {
    if (!data || !data.pages) return 0;

    let count = 0;
    data.pages.forEach((page) => {
      count += page.records?.length;
    });

    return count;
  }, [data]);

  const setActive = (tier: string, nodeType: string) => {
    setActiveNode({ nodeType, tier });
  };

  const [isOGFilterModalOpen, setIsOGFilterModalOpen] =
    useState<boolean>(false);

  const [isDriftFilterModalOpen, setIsDriftFilterModalOpen] =
    useState<boolean>(false);

  const handleSearchTextChange = (e: React.ChangeEvent) => {
    const value: string = (e.target as HTMLInputElement).value;
    set_searchText(value);
    debouncedSetSearchText(value);
  };

  const handleSearchTextClear = () => {
    set_searchText('');
    debouncedSetSearchText('');
  };

  const handleFilterModalOpen = () => {
    if (activeNode.nodeType === 'ORIGIN') {
      setIsOGFilterModalOpen(true);
    } else {
      setIsDriftFilterModalOpen(true);
    }
  };

  const handleOGFilterModalClose = () => {
    setIsOGFilterModalOpen(false);
  };

  const handleDriftFilterModalClose = () => {
    setIsDriftFilterModalOpen(false);
  };

  const onSortChange = (orderBy: string, orderDirection: SortDirection) => {
    setSort({ orderBy, orderDirection } as {
      orderBy: string;
      orderDirection: string;
    });
  };

  const handleBidModalClose = () => {
    setIsOpenBidModal(false);
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <Box>
      <AssetsTile
        setActive={setActive}
        assetsType={assetsType}
        activeNodeType={activeNode.nodeType}
        activeTier={activeNode.tier}
        hasTile={true}
        titleImage={['/images/origin-icon.png', '/images/drift-icon.png']}
      />
      <Sticky top={48} innerZ={3} innerActiveClass={'sticky-header-active'}>
        <Box
          sx={(theme) => ({
            background: theme.palette.background.default,
            margin: '0 -30px',
            padding: '16px 30px',
            [theme.breakpoints.down('sm')]: {
              pt: '16px',
              pb: 0,
            },
          })}
          className={'sticky-header'}
        >
          <Box
            sx={(theme) => ({
              display: 'flex',
              padding: '16px 0',
              justifyContent: 'space-between',
              [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
              },
            })}
          >
            <Box
              sx={(theme) => ({
                [theme.breakpoints.down('sm')]: {
                  mb: '8px',
                },
              })}
            >
              <ThemeProvider theme={searchFieldTheme}>
                <SearchField
                  placeholder={
                    assetsType === 'origin' ? 'Search Origins' : 'Search Drifts'
                  }
                  fullWidth
                  value={_searchText}
                  onChange={handleSearchTextChange}
                  onClear={handleSearchTextClear}
                />
              </ThemeProvider>
            </Box>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <SortMenu
                sortOptions={sortOptions}
                selectedField={sort.orderBy}
                direction={sort.orderDirection as SortDirection}
                onChange={onSortChange}
              />
              <IconButton onClick={handleFilterModalOpen}>
                <Badge color="primary" variant="dot" invisible={filterStatus}>
                  <FilterListIcon />
                </Badge>
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Sticky>

      <Box ref={nftsListContainerRef}>
        {status === 'loading' ? (
          <CommonLoader
            size={undefined}
            text={'Loading NFTs...'}
            width={'100%'}
            height={'248px'}
          />
        ) : (
          <React.Fragment>
            <ImageList
              sx={{
                overflow: 'hidden',
                width: '100%',
                margin: 0,
              }}
              cols={filteredCount === 0 ? 0 : nftImageListCols}
              gap={0}
              id={'thorfi_nfts_list_container'}
            >
              {data?.pages?.map((page: any, index) => (
                <React.Fragment key={index}>
                  {page?.records?.map((item: Listing) => (
                    <ImageListItem key={item.id}>
                      <ListedGameAssetsCard
                        listing={Object.assign(
                          {
                            isLiked: favoritesByAddressId?.includes(
                              Number(item?.tokenId) * 1
                            ),
                          },
                          item
                        )}
                        isCarted={id2cartedIndex.includes(
                          item?.nftAddress + item?.tokenId
                        )}
                        assetType={assetsType}
                        type={thorfiNFTCategory?.nodeType as thorNodesType}
                        tier={thorfiNFTCategory?.tier as ThorTier}
                        setSelectedTile={setSelectedTile}
                        setSelectedAcceptPayments={setSelectedAcceptPayments}
                        user={user}
                        viewPlaceBidModal={() => setIsOpenBidModal(true)}
                        refresh={refetchFavorates}
                        avaxPrice={avaxPrice}
                        thorPrice={thorPrice}
                      />
                    </ImageListItem>
                  ))}
                </React.Fragment>
              ))}
              {(!filterStatus || searchText.length) && filteredCount === 0 ? (
                <React.Fragment>
                  <EmptyState type={!filterStatus ? 'filter' : 'search'} />
                </React.Fragment>
              ) : filteredCount === 0 ? (
                <React.Fragment>
                  <NftEmptyState />
                </React.Fragment>
              ) : (
                <></>
              )}
            </ImageList>
            <Box
              ref={ref}
              textAlign={'center'}
              width={'100%'}
              height={'248px'}
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
          </React.Fragment>
        )}
      </Box>

      {isOGFilterModalOpen && (
        <OGFilterModal
          isOpen={isOGFilterModalOpen}
          onClose={handleOGFilterModalClose}
          defaultFilterValues={defaultFilterValues}
        />
      )}

      {isDriftFilterModalOpen && (
        <DriftFilterModal
          isOpen={isDriftFilterModalOpen}
          onClose={handleDriftFilterModalClose}
          defaultFilterValues={defaultFilterValues}
        />
      )}

      {isOpenBidModal && (
        <PlaceBid
          open={isOpenBidModal}
          handleClose={handleBidModalClose}
          collectionAddress={thorfiNFTCategory?.contract}
          tokenId={selectedTile}
          acceptPayments={selectedAcceptPayments}
          nft={{
            image: thorfiNFTCategory?.poster,
            title:
              thorfiNFTCategory?.tier.charAt(0).toUpperCase() +
              thorfiNFTCategory?.tier.slice(1).toLowerCase() +
              ' ' +
              thorfiNFTCategory?.nodeType,
          }}
        />
      )}
    </Box>
  );
};

export default NodesTab;
