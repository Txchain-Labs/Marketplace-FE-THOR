import React, { FC, useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useDispatch, useSelector } from '@/redux/store';
import debounce from 'lodash.debounce';
import { queryTypes, useQueryState, useQueryStates } from 'next-usequerystate';
import { Tab, Stack, Typography, Button } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
  openBagListModal,
  selectTabState,
  setTabState,
} from '@/redux/slices/bagListSlice';

import { NextLinkComposed } from '@/components/common/Link';
import { SortDirection, SortOption } from '@/components/common/SortMenu';

import { Nft } from '@/models/Nft';
import { ActiveBid } from '@/models/Listing';

import {
  useListingsByUser,
  useGetActiveBids,
  useGetReceivedBids,
} from '@/hooks/useListings';
import { useCheckGameloopCollection } from '@/hooks/listings';
import { useNftsByWallet } from '@/hooks/useNfts';
import { useGetNFTMetadata, useGetNFTsFavrt } from '@/hooks/useNFTDetail';
import { getMetaData, getMetaDataName } from '@/utils/common';

import EmptyStateArtwork from '@/components/common/emptyStates/EmptyStateArtwork';
import ActionBar from './ActionBar';
import FilterModal from './FilterModal';
import NFTsList from './NFTsList';
import BidsList from '@/modules/myNFTs/BidsList';

let prevActiveTab: string;

const tabs = [
  {
    key: 'owned',
    label: 'Owned',
    link: 'owned',
  },
  {
    key: 'onSale',
    label: 'On Sale',
    link: 'on-sale',
  },
  {
    key: 'favorited',
    label: 'Favorited',
    link: 'favorited',
  },
  {
    key: 'activeBids',
    label: 'Active Bids',
    link: 'active-bids',
  },
  {
    key: 'receivedBids',
    label: 'Received Bids',
    link: 'received-bids',
  },
];

const sortOptions: SortOption[] = [
  {
    label: 'Price',
    directionLabels: { desc: 'High to low', asc: 'Low to high' },
    directions: ['desc', 'asc'],
    field: 'price',
  },
  {
    label: 'Sold',
    directionLabels: {
      desc: 'Most Recent to Oldest',
      asc: 'Oldest to Most Recent',
    },
    directions: ['desc', 'asc'],
    field: 'sold',
  },
  {
    label: 'Last sale',
    directionLabels: {
      desc: 'High to Low',
      asc: 'Low to High',
    },
    directions: ['desc', 'asc'],
    field: 'last_sale',
  },
  {
    label: 'Listed',
    directionLabels: {
      desc: 'Most Recent to Oldest',
      asc: 'Oldest to Most Recent',
    },
    directions: ['desc', 'asc'],
    field: 'listed_at',
  },
];

const MAX_LENGTH_BIO = 130;

interface MyNFTsProps {
  activeTab?: string;
}

const MyNFTs: FC<MyNFTsProps> = ({ activeTab = 'owned' }) => {
  const { address } = useAccount();

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const { tabState, ownedBagListed, onsaleBagListed } =
    useSelector(selectTabState);

  const { gameAssets } = useCheckGameloopCollection();

  const { data: nfts, isLoading: isLoadingNfts } = useNftsByWallet(address);

  const { data: listingsData } = useListingsByUser(address);

  const { data: favoritedNftsData, isLoading: isLoadingFavorited } =
    useGetNFTsFavrt(user?.id);

  const {
    data: favoritedNftsWithMetadata,
    isLoading: isLoadingFavoritedNftsMetadata,
  } = useGetNFTMetadata(
    favoritedNftsData
      ?.filter(
        (item) =>
          // item.token_id.toString() !== '0' &&
          item.collection_address !== '' &&
          !gameAssets.includes(item.collection_address.toLowerCase())
      )
      ?.map((item) => ({
        tokenId: item.token_id,
        nftAddress: item.collection_address,
      })),
    0
  );

  const {
    data: activeBids,
    isLoading: isLoadingActiveBids,
    refetch: refetchActiveBids,
  } = useGetActiveBids(user?.address);

  const { data: activeBidsMetadata, isLoading: isLoadingActiveBidsMetadata } =
    useGetNFTMetadata(activeBids, 0);

  const {
    data: receivedBids,
    isLoading: isLoadingReceivedBids,
    refetch: refetchReceivedBids,
  } = useGetReceivedBids(user?.address);

  const {
    data: receivedBidsMetadata,
    isLoading: isLoadingReceivedBidsMetadata,
  } = useGetNFTMetadata(receivedBids, 0);

  const [isInSeeMore, setIsInSeeMore] = useState<boolean>(false);
  const [isShowCartIcon, setIsShowCartIcon] = useState<boolean>(false);
  const [ownedNfts, setOwnedNfts] = useState<Nft[]>([]);
  const [onSaleNfts, setOnSaleNfts] = useState<Nft[]>([]);
  const [favoritedNfts, setFavoritedNfts] = useState<Nft[]>([]);
  const [activeBidNfts, setActiveBidNfts] = useState<(Nft & ActiveBid)[]>([]);
  const [receivedBidNfts, setReceivedBidNfts] = useState<(Nft & ActiveBid)[]>(
    []
  );

  const [querySearchText, setQuerySearchText] = useQueryState(
    'q',
    queryTypes.string.withDefault('')
  );
  const [querySort, setQuerySort] = useQueryStates({
    orderBy: queryTypes.string.withDefault('price'),
    dir: queryTypes.string.withDefault('desc'),
  });

  const [searchText, setSearchText] = useState<string>(querySearchText);
  const [sort, setSort] = useState<any>(querySort);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  const bio = useMemo<string>(() => {
    if (!user || !user.bio) return '';

    if (!isInSeeMore && user.bio.length > MAX_LENGTH_BIO) {
      return user.bio.slice(0, MAX_LENGTH_BIO).concat('...');
    } else {
      return user.bio;
    }
  }, [user, isInSeeMore]);

  const debouncedSetQuerySearchText = useMemo(
    () => debounce(setQuerySearchText, 500),
    [setQuerySearchText]
  );
  const debouncedSetQuerySort = useMemo(
    () => debounce(setQuerySort, 500),
    [setQuerySort]
  );

  const favoritedAddressIds = useMemo<string[]>(() => {
    return favoritedNfts?.map((nft) => `${nft.token_address}-${nft.token_id}`);
  }, [favoritedNfts]);

  const isLoading = useMemo<boolean>(() => {
    switch (activeTab) {
      case 'ownwd':
      case 'on-sale':
        return isLoadingNfts;
      case 'favorited':
        return isLoadingFavorited || isLoadingFavoritedNftsMetadata;
      case 'active-bids':
        return isLoadingActiveBids || isLoadingActiveBidsMetadata;
      case 'received-bids':
        return isLoadingReceivedBids || isLoadingReceivedBidsMetadata;
      default:
        return false;
    }
  }, [
    activeTab,
    isLoadingNfts,
    isLoadingFavorited,
    isLoadingFavoritedNftsMetadata,
    isLoadingActiveBids,
    isLoadingActiveBidsMetadata,
    isLoadingReceivedBids,
    isLoadingReceivedBidsMetadata,
  ]);

  const counts = useMemo<{ [key: string]: number }>(() => {
    return {
      owned: ownedNfts?.length,
      onSale: onSaleNfts?.length,
      favorited: favoritedNfts?.length,
      activeBids: activeBidNfts?.length,
      receivedBids: receivedBidNfts?.length,
    };
  }, [ownedNfts, onSaleNfts, favoritedNfts, activeBidNfts, receivedBidNfts]);

  const searchedNfts = useMemo<Nft[]>(() => {
    switch (activeTab) {
      case 'owned':
        return ownedNfts?.filter((nft) => {
          return querySearchText
            ? RegExp(querySearchText, 'i').test(nft.name)
            : true;
        });
      case 'on-sale':
        return onSaleNfts?.filter((nft) => {
          return querySearchText
            ? RegExp(querySearchText, 'i').test(nft.name)
            : true;
        });
      case 'favorited':
        return favoritedNfts
          ?.filter((nft) => {
            return querySearchText
              ? RegExp(querySearchText, 'i').test(nft.name)
              : true;
          })
          .map((nft) => ({
            ...nft,
            collection_address: nft.token_address,
          }));
      case 'active-bids':
        return activeBidNfts
          ?.filter((nft) => {
            return querySearchText
              ? RegExp(querySearchText, 'i').test(nft.name)
              : true;
          })
          .map((nft) => ({
            ...nft,
            collection_address: nft.token_address,
          }));
      case 'received-bids':
        return receivedBidNfts
          ?.filter((nft) => {
            return querySearchText
              ? RegExp(querySearchText, 'i').test(nft.name)
              : true;
          })
          .map((nft) => ({
            ...nft,
            collection_address: nft.token_address,
          }));
      default:
        return [];
    }
  }, [
    activeTab,
    ownedNfts,
    onSaleNfts,
    favoritedNfts,
    activeBidNfts,
    receivedBidNfts,
    querySearchText,
  ]);

  useEffect(() => {
    if (
      !gameAssets ||
      !nfts ||
      !listingsData ||
      !listingsData?.data?.data?.listings
    ) {
      return;
    }

    const listings = listingsData.data.data.listings;

    const newOnSaleNfts: Nft[] = [];
    const newOwnedNfts: Nft[] = [];

    nfts.forEach((nft) => {
      if (gameAssets.includes(nft.token_address.toLowerCase())) {
        return;
      }

      if (
        listings.find(
          (listing: any) =>
            listing.nftAddress.toLowerCase() ===
              nft.token_address.toLowerCase() &&
            listing.tokenId === nft.token_id
        )
      ) {
        const name = getMetaDataName(nft);
        const img = getMetaData(nft);

        newOnSaleNfts.push({ ...nft, name, img });
      } else {
        const img = getMetaData(nft);

        newOwnedNfts.push({ ...nft, img });
      }
    });

    setOwnedNfts(newOwnedNfts);
    setOnSaleNfts(newOnSaleNfts);
  }, [nfts, listingsData, gameAssets]);

  useEffect(() => {
    setFavoritedNfts(
      favoritedNftsWithMetadata
        // ?.filter((nft) => !gameAssets.includes(nft.token_address.toLowerCase()))
        ?.map((nft) => {
          const name = getMetaDataName(nft);
          const img = getMetaData(nft);

          return {
            ...nft,
            name,
            img,
          };
        })
    );
  }, [favoritedNftsWithMetadata, gameAssets]);

  useEffect(() => {
    setActiveBidNfts(
      activeBidsMetadata?.map((nft, index) => ({
        ...nft,
        ...activeBids[index],
        name: getMetaDataName(nft),
        img: getMetaData(nft),
      }))
    );
  }, [activeBids, activeBidsMetadata]);

  useEffect(() => {
    setReceivedBidNfts(
      receivedBidsMetadata?.map((nft, index) => ({
        ...nft,
        ...receivedBids[index],
        name: getMetaDataName(nft),
        img: getMetaData(nft),
      }))
    );
  }, [receivedBids, receivedBidsMetadata]);

  useEffect(() => {
    const tabValues: { [key: string]: number } = {
      'owned': 0,
      'on-sale': 1,
      'favorited': 2,
      'active-bids': 3,
      'received-bids': 4,
    };

    const bagPayload: any = {
      value: tabValues[activeTab],
      owned: ownedBagListed,
      onsale: onsaleBagListed,
    };
    dispatch(setTabState(bagPayload));
  }, [dispatch, activeTab, tabState, ownedBagListed, onsaleBagListed]);

  useEffect(() => {
    if (activeTab === prevActiveTab) {
      return;
    }

    setSearchText(querySearchText);
    setIsShowCartIcon(activeTab === 'owned' || activeTab === 'on-sale');

    prevActiveTab = activeTab;
  }, [activeTab, querySearchText]);

  const handleSeeMoreClick = () => {
    setIsInSeeMore(!isInSeeMore);
  };

  const handleSortChange = (orderBy: string, dir: SortDirection) => {
    setSort({ orderBy, dir });
    debouncedSetQuerySort(
      { orderBy, dir },
      {
        scroll: false,
        shallow: true,
      }
    );
  };

  const handleSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSearchText(value);
    debouncedSetQuerySearchText(value === '' ? null : value, {
      scroll: false,
      shallow: true,
    });
  };

  const handleSearchClear = () => {
    setSearchText('');
    debouncedSetQuerySearchText(null, {
      scroll: false,
      shallow: true,
    });
  };

  const handleFilterModalOpen = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterModalClose = () => {
    setIsFilterModalOpen(false);
  };

  const handleShowCart = () => {
    dispatch(openBagListModal());
  };

  return (
    <>
      <Typography variant={'h1'} fontWeight={700} lineHeight={'normal'}>
        My NFTs
      </Typography>
      <Typography variant={'lbl-lg'} fontWeight={700} mb={'8px'}>
        {user.username}
      </Typography>
      <Typography
        variant={'p-lg'}
        lineHeight={'normal'}
        sx={{ color: 'text.secondary' }}
      >
        {bio}
      </Typography>

      {user?.bio?.length > MAX_LENGTH_BIO && (
        <Button
          size={'small'}
          sx={{ color: 'text.secondary' }}
          endIcon={isInSeeMore ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          onClick={handleSeeMoreClick}
        >
          {isInSeeMore ? 'See less' : 'See more'}
        </Button>
      )}

      <TabContext value={activeTab}>
        <TabList aria-label={'My NFTs tabs'} sx={{ mt: '16px', mb: '24px' }}>
          {tabs.map((tab) => (
            <Tab
              key={tab.link}
              sx={{ fontFamily: 'Nexa-Bold' }}
              label={
                <Stack>
                  <Typography
                    variant={'h3'}
                    sx={{
                      textAlign: 'left',
                    }}
                  >
                    {counts[tab.key] ?? 0}
                  </Typography>
                  <Typography variant={'h5'}>{tab.label}</Typography>
                </Stack>
              }
              value={tab.link}
              to={{
                pathname: `/my-nfts/${tab.link}`,
              }}
              component={NextLinkComposed}
            />
          ))}
        </TabList>

        <ActionBar
          sortOptions={sortOptions}
          selectedSortField={sort.orderBy}
          sortDirection={sort.dir}
          onSortChange={handleSortChange}
          searchValue={searchText}
          onSearchValueChange={handleSearchValueChange}
          onSearchClear={handleSearchClear}
          onFilterModalOpen={handleFilterModalOpen}
          isFiltered={false}
          onShowCart={handleShowCart}
          cartedCount={
            activeTab === 'owned'
              ? ownedBagListed.length
              : onsaleBagListed.length
          }
          showingCartIcon={isShowCartIcon}
        />

        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={handleFilterModalClose}
        />

        {!searchedNfts || searchedNfts.length === 0 ? (
          <EmptyStateArtwork type={activeTab} />
        ) : (
          <>
            {activeTab === 'active-bids' || activeTab === 'received-bids' ? (
              <BidsList
                type={activeTab === 'active-bids' ? 'activeBid' : 'receivedBid'}
                isLoading={isLoading}
                nfts={searchedNfts as (Nft & ActiveBid)[]}
                refresh={
                  activeTab === 'active-bids'
                    ? refetchActiveBids
                    : refetchReceivedBids
                }
              />
            ) : (
              <NFTsList
                isLoading={isLoading}
                nfts={searchedNfts}
                favoritedAddressIds={favoritedAddressIds}
                showingCartIcon={isShowCartIcon}
              />
            )}
          </>
        )}
      </TabContext>
    </>
  );
};

export default MyNFTs;
