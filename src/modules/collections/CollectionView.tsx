import React, { FC, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { BigNumber, ethers } from 'ethers';

import { formatNumber } from '../../utils/common';
import { dottedAddress } from '../../shared/utils/utils';

import { Loader, NoData } from '../../components/common';
import NFTsList from './NFTsList';

import { useCollection } from '../../hooks/collections';
import {
  useGetBestOfferAvax,
  useGetBestOfferOTCAvax,
  useGetFloorPriceAvax,
  useGetVolume,
} from '../../hooks/useNFTDetail';
import { useGetUsdFromAvax, useGetUsdFromThor } from '../../hooks/useOracle';
import { useChain } from '../../utils/web3Utils';

const MAX_DESCRIPTION_LENGTH = 100;

interface CollectionViewProps {
  collectionAddress?: string;
}

const CollectionView: FC<CollectionViewProps> = ({ collectionAddress }) => {
  const theme = useTheme();
  const matchLgDown = useMediaQuery(theme.breakpoints.down('lg'));
  const matchSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const router = useRouter();

  const chain = useChain();

  const {
    data: collection,
    isLoading: isCollectionLoading,
  }: { data: any; isLoading: boolean } = useCollection(collectionAddress);

  const { data: totalVolumeData } = useGetVolume(
    collection?.address?.toLowerCase() || ''
  );
  const { data: bestOfferData } = useGetBestOfferAvax(
    collection?.address?.toLowerCase() || ''
  );
  const { data: bestOfferOTCData } = useGetBestOfferOTCAvax(
    collection?.address?.toLowerCase()
  );
  const { data: floorPriceData } = useGetFloorPriceAvax(
    collection?.address?.toLowerCase() || ''
  );

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const [isInSeeMore, setIsInSeeMore] = useState(false);

  const totalVolume = useMemo(() => {
    if (!avaxPrice || !thorPrice) {
      return '0';
    }

    const totalVolumeThor =
      totalVolumeData?.data?.data?.collectionSums[0]?.totalVolumeThor ??
      BigNumber.from('0');
    const totalVolumeThorBN = BigNumber.from(totalVolumeThor);

    const totalVolumeAvax =
      totalVolumeData?.data?.data?.collectionSums[0]?.totalVolumeAvax ??
      BigNumber.from('0');

    const totalVolumeAvaxBN = BigNumber.from(totalVolumeAvax);

    const totalVolumeBN = totalVolumeAvaxBN
      .mul(avaxPrice)
      .add(totalVolumeThorBN.mul(thorPrice));

    const usdtotalVolumeBN = totalVolumeBN;

    const totalVal = Number(ethers.utils.formatUnits(usdtotalVolumeBN, 36));
    const fixedTotalVal = Math.round(totalVal * 100) / 100;

    return totalVolumeData?.data?.data?.collectionSums?.length > 0
      ? fixedTotalVal
      : '---';
  }, [totalVolumeData, thorPrice, avaxPrice]);

  const bestOffer = useMemo(() => {
    if (!avaxPrice || !thorPrice) {
      return '0';
    }

    const priceInWei = bestOfferData?.data.data.bids[0]?.priceInWei ?? '0';
    const paymentType = bestOfferData?.data.data.bids[0]?.paymentType; // 0 / 1

    const tokenpriceBN = paymentType === '0' ? avaxPrice : thorPrice;

    const priceBN = BigNumber.from(priceInWei);

    const usdPriceBN = priceBN.mul(tokenpriceBN);
    const usdPrice = Number(ethers.utils.formatUnits(usdPriceBN, 36));

    const priceOctInWei =
      bestOfferOTCData?.data.data.otcbids[0]?.priceInWei ?? '0';
    const paymentOctType =
      bestOfferOTCData?.data.data.otcbids[0]?.paymentType ?? '0';

    const tokenOctpriceBN = paymentOctType === '0' ? avaxPrice : thorPrice;

    const priceOctBN = BigNumber.from(priceOctInWei);

    const usdPriceOctBN = priceOctBN.mul(tokenOctpriceBN);
    const usdPriceOct = Number(ethers.utils.formatUnits(usdPriceOctBN, 36));

    const maxPrice = Math.max(usdPrice, usdPriceOct);
    const fixedMaxPrice = Math.round(maxPrice * 100) / 100;

    return fixedMaxPrice.toString();
  }, [bestOfferData, bestOfferOTCData, avaxPrice, thorPrice]);

  const floorPrice = useMemo(() => {
    return floorPriceData?.data?.data?.listings?.length > 0
      ? ethers.utils.formatEther(
          floorPriceData.data.data.listings[0].priceInWei
        )
      : '---';
  }, [floorPriceData]);

  const description = useMemo(() => {
    if (!collection || !collection.description) return '';

    if (
      !isInSeeMore &&
      collection.description.length > MAX_DESCRIPTION_LENGTH
    ) {
      return collection.description
        .slice(0, MAX_DESCRIPTION_LENGTH)
        .concat('...');
    } else {
      return collection.description;
    }
  }, [collection, isInSeeMore]);

  const handleSeeMore = () => {
    setIsInSeeMore(!isInSeeMore);
  };

  const handleClickBack = () => {
    router.back();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {isCollectionLoading ? (
        <Loader colSpan={2} height={750} size={undefined} />
      ) : collection ? (
        <React.Fragment>
          <Box
            sx={{
              paddingLeft: '24px',
              paddingRight: matchLgDown ? '24px' : '90px',
              paddingTop: '35px',
            }}
          >
            {matchSmDown && (
              <Box sx={{ marginBottom: '12px' }}>
                <Button
                  startIcon={<ArrowLeftIcon />}
                  sx={{
                    'textTransform': 'none',
                    '& .MuiButton-startIcon': {
                      marginRight: 0,
                    },
                  }}
                  onClick={handleClickBack}
                >
                  <Typography variant={'lbl-md'} color={'#F3523F'}>
                    Collection
                  </Typography>
                </Button>
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: matchSmDown ? 'column' : 'row',
              }}
            >
              <Avatar
                alt={collection?.name}
                src={collection?.profile_image || '/images/random.png'}
                sx={{
                  width: '72px',
                  height: '72px',
                  marginRight: '16px',
                }}
              />
              <Typography variant={'h1'} sx={{ lineHeight: '72px' }}>
                {collection?.name
                  ?.replace('OG Odin', 'Origin Odin')
                  ?.replace('OG Thor', 'Origin Thor')}
              </Typography>
            </Box>
            <Box
              sx={{
                marginTop: '20px',
                marginLeft: matchLgDown ? undefined : '88px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                variant={'lbl-lg'}
                sx={{ lineHeight: '24px', marginRight: '3px' }}
              >
                By
              </Typography>
              <Link href={`/profile/${collection?.owner}`}>
                <a href={`/profile/${collection?.owner}`}>
                  <Typography
                    variant={'lbl-lg'}
                    sx={{ lineHeight: '24px', marginRight: '8px' }}
                  >
                    {matchLgDown
                      ? dottedAddress(collection?.owner)
                      : collection?.owner}
                  </Typography>
                </a>
              </Link>
              {/*<Button variant={'outlined'}>*/}
              {/*  Follow*/}
              {/*</Button>*/}
            </Box>
            {!matchLgDown && (
              <Divider
                sx={{
                  marginTop: '8px',
                  marginLeft: matchLgDown ? undefined : '88px',
                }}
              />
            )}
            <Box
              sx={{
                marginTop: '19px',
                marginLeft: matchLgDown ? undefined : '88px',
              }}
            >
              <Typography
                variant={'p-lg-bk'}
                sx={{
                  lineHeight: '24px',
                }}
              >
                {description.replace('OG ', 'Origin ')}
              </Typography>{' '}
              {collection?.description?.length > MAX_DESCRIPTION_LENGTH && (
                <Button
                  sx={{
                    'padding': 0,
                    'textTransform': 'none',
                    '& .MuiButton-endIcon': {
                      marginLeft: 0,
                    },
                  }}
                  endIcon={
                    isInSeeMore ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )
                  }
                  onClick={handleSeeMore}
                >
                  <Typography
                    variant={'p-md'}
                    sx={{
                      fontWeight: 400,
                      lineHeight: '20px',
                      fontFamily: 'Work Sans',
                    }}
                  >
                    See more
                  </Typography>
                </Button>
              )}
            </Box>
            <Box
              sx={{
                'marginTop': '15px',
                'marginLeft': matchLgDown ? undefined : '88px',
                'display': 'flex',
                'justifyContent': 'space-between',
                'flexWrap': 'wrap',
                '& > .MuiBox-root': {
                  marginRight: '62px',
                  marginBottom: '8px',
                  minWidth: '80px',
                  maxWidth: '120px',
                },
              }}
            >
              <Box>
                <Typography variant={'h5'} sx={{ lineHeight: '32px' }}>
                  {formatNumber(
                    collection?.collection_size,
                    collection?.collection_size > 999 ? 1 : 0
                  )}
                </Typography>
                <Typography
                  variant={'p-lg'}
                  sx={{
                    fontWeight: 400,
                    lineHeight: '24px',
                    marginTop: '3px',
                  }}
                >
                  items
                </Typography>
              </Box>
              {/*<Box>*/}
              {/*  <Typography variant={'h5'} sx={{ lineHeight: '32px' }}>*/}
              {/*    ---*/}
              {/*  </Typography>*/}
              {/*  <Typography*/}
              {/*    variant={'p-lg'}*/}
              {/*    sx={{*/}
              {/*      fontWeight: 400,*/}
              {/*      lineHeight: '24px',*/}
              {/*      marginTop: '3px',*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    owners*/}
              {/*  </Typography>*/}
              {/*</Box>*/}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant={'h5'} sx={{ lineHeight: '32px' }}>
                    {totalVolume}
                  </Typography>
                  <Typography
                    variant={'p-lg'}
                    sx={{
                      fontWeight: 400,
                    }}
                  >
                    &nbsp;USD
                  </Typography>
                </Box>
                <Typography
                  variant={'p-lg'}
                  sx={{
                    fontWeight: 400,
                    lineHeight: '24px',
                    marginTop: '3px',
                  }}
                >
                  total volume
                </Typography>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant={'h5'} sx={{ lineHeight: '32px' }}>
                    {floorPrice}
                  </Typography>
                  <Typography
                    variant={'p-lg'}
                    sx={{
                      fontWeight: 400,
                    }}
                  >
                    &nbsp;USD
                  </Typography>
                </Box>
                <Typography
                  variant={'p-lg'}
                  sx={{
                    fontWeight: 400,
                    lineHeight: '24px',
                    marginTop: '3px',
                  }}
                >
                  floor price
                </Typography>
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant={'h5'} sx={{ lineHeight: '32px' }}>
                    {bestOffer}
                  </Typography>
                  <Typography
                    variant={'p-lg'}
                    sx={{
                      fontWeight: 400,
                    }}
                  >
                    &nbsp;USD
                  </Typography>
                </Box>
                <Typography
                  variant={'p-lg'}
                  sx={{
                    fontWeight: 400,
                    lineHeight: '24px',
                    marginTop: '3px',
                  }}
                >
                  best offer
                </Typography>
              </Box>
            </Box>
          </Box>
          <NFTsList collection={collection} />
        </React.Fragment>
      ) : (
        <NoData text="No data found" size={undefined} height={750} />
      )}
    </Box>
  );
};

export default CollectionView;
