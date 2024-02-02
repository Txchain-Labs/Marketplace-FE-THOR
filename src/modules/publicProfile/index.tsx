import React, { FC, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from '@/redux/store';
import { Tab, Stack, Typography, Button, Box, Avatar } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import {
  ArrowBackIos,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { palette } from '@/theme/palette';
import { selectTabState, setTabState } from '@/redux/slices/bagListSlice';

import { NextLinkComposed } from '@/components/common/Link';

import { Nft } from '@/models/Nft';

import { dottedAddress } from '@/shared/utils/utils';
import { useListingsByUser } from '@/hooks/useListings';
import { useNftsByWallet } from '@/hooks/useNfts';
import {
  useGetNFTMetadata,
  useGetNFTsFavrt,
  useGetUserByAddress,
} from '@/hooks/useNFTDetail';
import { getMetaData, getMetaDataName } from '@/utils/common';

import EmptyStateArtwork from '@/components/common/emptyStates/EmptyStateArtwork';
import { CommonLoader } from '@/components/common';
import NFTsList from './NFTsList';

const MAX_LENGTH_BIO = 130;

interface PublicProfileProps {
  profileAddress: string;
  activeTab: string;
}

const PublicProfile: FC<PublicProfileProps> = ({
  activeTab,
  profileAddress,
}) => {
  const router = useRouter();

  const tabs = [
    {
      key: 'owned',
      label: 'Owned',
      link: `/profile/${profileAddress}/owned`,
    },
    {
      key: 'onSale',
      label: 'On Sale',
      link: `/profile/${profileAddress}/on-sale`,
    },
    {
      key: 'favorited',
      label: 'Favorited',
      link: `/profile/${profileAddress}/favorited`,
    },
  ];

  // const { address } = useAccount();
  const { data: publicUser, isLoading: publicUserDataLoading } =
    useGetUserByAddress(profileAddress?.toString());

  const dispatch = useDispatch();
  // const user = useSelector((state: any) => state.auth.user);

  const { tabState, ownedBagListed, onsaleBagListed } =
    useSelector(selectTabState);

  const { data: nfts, isLoading: isLoadingNfts } =
    useNftsByWallet(profileAddress);

  const { data: listingsData } = useListingsByUser(profileAddress);

  const { data: favoritedNftsData, isLoading: isLoadingFavorited } =
    useGetNFTsFavrt(publicUser?.id);

  const {
    data: favoritedNftsWithMetadata,
    isLoading: isLoadingFavoritedNftsMetadata,
  } = useGetNFTMetadata(
    favoritedNftsData?.map((item) => ({
      tokenId: item.token_id,
      nftAddress: item.collection_address,
    })),
    0
  );

  const [isInSeeMore, setIsInSeeMore] = useState<boolean>(false);
  const [ownedNfts, setOwnedNfts] = useState<Nft[]>([]);
  const [onSaleNfts, setOnSaleNfts] = useState<Nft[]>([]);
  const [favoritedNfts, setFavoritedNfts] = useState<Nft[]>([]);

  const bio = useMemo<string>(() => {
    if (!publicUser || !publicUser.bio) return '';

    if (!isInSeeMore && publicUser.bio.length > MAX_LENGTH_BIO) {
      return publicUser.bio.slice(0, MAX_LENGTH_BIO).concat('...');
    } else {
      return publicUser.bio;
    }
  }, [publicUser, isInSeeMore]);

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
      default:
        return false;
    }
  }, [
    activeTab,
    isLoadingNfts,
    isLoadingFavorited,
    isLoadingFavoritedNftsMetadata,
  ]);

  const counts = useMemo<{ [key: string]: number }>(() => {
    return {
      owned: ownedNfts?.length,
      onSale: onSaleNfts?.length,
      favorited: favoritedNfts?.length,
    };
  }, [ownedNfts, onSaleNfts, favoritedNfts]);

  const searchedNfts = useMemo<Nft[]>(() => {
    switch (activeTab) {
      case 'owned':
        return ownedNfts;
      case 'on-sale':
        return onSaleNfts;
      case 'favorited':
        return favoritedNfts?.map((nft) => ({
          ...nft,
          collection_address: nft.token_address,
        }));
      default:
        return [];
    }
  }, [activeTab, ownedNfts, onSaleNfts, favoritedNfts]);

  useEffect(() => {
    if (!nfts || !listingsData || !listingsData?.data?.data?.listings) {
      return;
    }

    const listings = listingsData.data.data.listings;

    const newOnSaleNfts: Nft[] = [];
    const newOwnedNfts: Nft[] = [];

    nfts.forEach((nft) => {
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
  }, [nfts, listingsData]);

  useEffect(() => {
    setFavoritedNfts(
      favoritedNftsWithMetadata?.map((nft) => {
        const name = getMetaDataName(nft);
        const img = getMetaData(nft);

        return {
          ...nft,
          name,
          img,
        };
      })
    );
  }, [favoritedNftsWithMetadata]);

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

  const handleSeeMoreClick = () => {
    setIsInSeeMore(!isInSeeMore);
  };

  return (
    <>
      <Box mb={'16px'}>
        <Button onClick={() => router.back()}>
          {' '}
          <ArrowBackIos
            sx={{ height: '1.2em', color: palette.secondary.storm[70] }}
          />
          <Typography
            sx={{ mt: '5px', color: palette.secondary.storm[70] }}
            variant="lbl-md"
          >
            {' '}
            Back
          </Typography>
        </Button>
      </Box>
      {publicUserDataLoading ? (
        <CommonLoader
          size={undefined}
          text={'Loading ...'}
          width={'100%'}
          height={'500px'}
        />
      ) : (
        <>
          <Stack direction={{ miniMobile: 'column', sm: 'row' }} gap={'16px'}>
            <Avatar
              src={publicUser?.profile_picture || '/images/profile-pic.svg'}
              sx={{ height: 80, width: 80, mt: '32px' }}
            />
            <Box>
              <Typography
                fontWeight={400}
                sx={{
                  typography: { sm: 'p-md-bk', miniMobile: 'body1' },
                }}
                mt={1}
              >
                Joined {dayjs(publicUser?.joined_date).format('MMMM YYYY')}
              </Typography>
              <Typography
                variant={'h4'}
                sx={{
                  fontSize: { xs: '24px', md: '34px' },
                  lineHeight: { xs: '33px', md: '55px' },
                }}
                mb={'8px'}
              >
                {publicUser?.username}
              </Typography>
              <Typography
                sx={{ typography: { sm: 'p-lg-bk', miniMobile: 'body1' } }}
              >
                {dottedAddress(publicUser?.address)}
              </Typography>
              <Typography
                variant={'p-lg'}
                lineHeight={'normal'}
                sx={{ color: palette.secondary.storm[70] }}
              >
                {bio}
              </Typography>

              {publicUser?.bio?.length > MAX_LENGTH_BIO && (
                <Button
                  size={'small'}
                  sx={{ color: palette.secondary.storm[70] }}
                  endIcon={
                    isInSeeMore ? <KeyboardArrowUp /> : <KeyboardArrowDown />
                  }
                  onClick={handleSeeMoreClick}
                >
                  {isInSeeMore ? 'See less' : 'See more'}
                </Button>
              )}

              <Box display="flex" mt={1}>
                {!!publicUser?.twitter && (
                  <a
                    href={`https://twitter.com/${publicUser?.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#F3523F' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'end', mr: 2 }}>
                      <svg
                        width="19"
                        height="16"
                        viewBox="0 0 19 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.0791 4.47659C17.0901 4.63528 17.0901 4.79396 17.0901 4.95411C17.0901 9.83381 13.3753 15.4616 6.58257 15.4616V15.4587C4.57599 15.4616 2.61109 14.8868 0.921875 13.8031C1.21365 13.8382 1.50688 13.8558 1.80085 13.8565C3.46374 13.8579 5.0791 13.3 6.38732 12.2726C4.80707 12.2426 3.42133 11.2122 2.93723 9.70804C3.4908 9.8148 4.06118 9.79286 4.60451 9.64442C2.88166 9.29634 1.64217 7.78262 1.64217 6.02467C1.64217 6.00858 1.64217 5.99323 1.64217 5.97787C2.15551 6.26379 2.73028 6.42248 3.31822 6.44003C1.69555 5.35557 1.19537 3.19688 2.17526 1.50913C4.05021 3.81626 6.81657 5.21882 9.78623 5.36727C9.4886 4.08464 9.89518 2.74058 10.8546 1.83893C12.342 0.44076 14.6813 0.512424 16.0795 1.99908C16.9065 1.83601 17.6992 1.53253 18.4246 1.10255C18.1489 1.9574 17.572 2.68354 16.8012 3.14496C17.5332 3.05868 18.2484 2.8627 18.9219 2.56361C18.4261 3.30657 17.8016 3.95374 17.0791 4.47659Z"
                          fill="#F3523F"
                        />
                      </svg>

                      <Typography
                        variant="lbl-md"
                        sx={{
                          ml: 0.5,
                          display: { sm: 'block', miniMobile: 'none' },
                          lineHeight: 0.85,
                        }}
                      >
                        {' '}
                        @{publicUser?.twitter}
                      </Typography>
                    </Box>
                  </a>
                )}

                {!!publicUser?.discord && (
                  <a
                    href={`https://discord.gg/${publicUser?.discord}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#F3523F' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'end' }}>
                      <svg
                        width="19"
                        height="15"
                        viewBox="0 0 19 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.1596 1.42588C15.0124 0.899473 13.7821 0.511636 12.4958 0.289506C12.4724 0.285219 12.449 0.295933 12.4369 0.31736C12.2787 0.598771 12.1034 0.965895 11.9807 1.25445C10.5972 1.04733 9.22076 1.04733 7.86562 1.25445C7.74286 0.959481 7.56124 0.598771 7.40231 0.31736C7.39024 0.296647 7.36684 0.285934 7.34341 0.289506C6.05781 0.510926 4.82755 0.898763 3.67958 1.42588C3.66964 1.43017 3.66112 1.43732 3.65547 1.4466C1.32192 4.93287 0.682662 8.33345 0.99626 11.6919C0.997679 11.7083 1.0069 11.724 1.01967 11.734C2.55928 12.8647 4.05066 13.5511 5.51433 14.006C5.53776 14.0132 5.56258 14.0046 5.57749 13.9853C5.92372 13.5125 6.23236 13.014 6.49698 12.4897C6.5126 12.459 6.49769 12.4225 6.46577 12.4104C5.97622 12.2247 5.51008 11.9983 5.06167 11.7412C5.0262 11.7204 5.02337 11.6697 5.05599 11.6454C5.15035 11.5747 5.24474 11.5011 5.33484 11.4269C5.35114 11.4133 5.37386 11.4104 5.39302 11.419C8.33884 12.764 11.528 12.764 14.4391 11.419C14.4583 11.4097 14.481 11.4126 14.498 11.4262C14.5881 11.5004 14.6825 11.5747 14.7775 11.6454C14.8102 11.6697 14.808 11.7204 14.7726 11.7412C14.3242 12.0033 13.858 12.2247 13.3678 12.4097C13.3358 12.4218 13.3216 12.459 13.3373 12.4897C13.6076 13.0132 13.9162 13.5118 14.256 13.9846C14.2702 14.0046 14.2958 14.0132 14.3192 14.006C15.79 13.5511 17.2813 12.8647 18.8209 11.734C18.8344 11.724 18.843 11.709 18.8444 11.6926C19.2197 7.80988 18.2157 4.43718 16.183 1.44731C16.1781 1.43732 16.1696 1.43017 16.1596 1.42588ZM6.93689 9.64694C6.05 9.64694 5.31922 8.83271 5.31922 7.83274C5.31922 6.83278 6.03583 6.01855 6.93689 6.01855C7.84503 6.01855 8.56873 6.83993 8.55453 7.83274C8.55453 8.83271 7.83793 9.64694 6.93689 9.64694ZM12.9179 9.64694C12.0311 9.64694 11.3003 8.83271 11.3003 7.83274C11.3003 6.83278 12.0169 6.01855 12.9179 6.01855C13.8261 6.01855 14.5498 6.83993 14.5356 7.83274C14.5356 8.83271 13.8261 9.64694 12.9179 9.64694Z"
                          fill="#F3523F"
                        />
                      </svg>

                      <Typography
                        variant="lbl-md"
                        sx={{
                          ml: 0.5,
                          display: { sm: 'block', miniMobile: 'none' },
                          lineHeight: 0.85,
                        }}
                      >
                        @{publicUser?.discord}
                      </Typography>
                    </Box>
                  </a>
                )}
              </Box>
            </Box>
          </Stack>

          <TabContext value={`/profile/${profileAddress}/${activeTab}`}>
            <TabList
              aria-label={'My NFTs tabs'}
              sx={{ mt: '16px', mb: '24px' }}
            >
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
                    pathname: tab.link,
                  }}
                  component={NextLinkComposed}
                />
              ))}
            </TabList>

            {!searchedNfts || searchedNfts.length === 0 ? (
              <EmptyStateArtwork type={activeTab} />
            ) : (
              <NFTsList
                isLoading={isLoading}
                nfts={searchedNfts}
                favoritedAddressIds={favoritedAddressIds}
                showingCartIcon={false}
              />
            )}
          </TabContext>
        </>
      )}
    </>
  );
};

export default PublicProfile;
