import React, { FC, useMemo, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import TwitterIcon from '@/components/icons/Twitter';
import DiscordIcon from '@/components/icons/Discord';
import { NextLinkComposed } from '@/components/common/Link';

import { dottedAddress } from '@/shared/utils/utils';
import { formatNumber, convertPriceFromUSD } from '@/utils/common';

import { useChain } from '@/utils/web3Utils';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import {
  useGetBestOfferAvax,
  useGetBestOfferOTCAvax,
  useGetUserByAddress,
} from '@/hooks/useNFTDetail';
import { useSelector } from 'react-redux';
import { Collection } from '@/models/Collection';

const MAX_DESCRIPTION_LENGTH = 240;

interface SubHeaderProps {
  collection: Collection;
}

const SubHeader: FC<SubHeaderProps> = ({ collection }) => {
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));

  const chain = useChain();
  const user = useSelector((state: any) => state?.auth.user);

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const { data: publicUser } = useGetUserByAddress(collection?.owner);

  const { data: bestOfferData } = useGetBestOfferAvax(
    collection?.address?.toLowerCase() || ''
  );
  const { data: bestOfferOTCData } = useGetBestOfferOTCAvax(
    collection?.address?.toLowerCase()
  );

  const [isInSeeMore, setIsInSeeMore] = useState<boolean>(false);

  const totalVolume = useMemo<string>(() => {
    if (!collection || !avaxPrice || !thorPrice) {
      return '---';
    }

    return collection.total_volume_usd
      ? formatNumber(
          convertPriceFromUSD(
            Number(ethers.utils.formatEther(collection.total_volume_usd)),
            avaxPrice,
            thorPrice,
            user?.default_currency
          )
        )
      : '---';
  }, [collection, avaxPrice, thorPrice, user?.default_currency]);

  const floorPrice = useMemo<string>(() => {
    if (!collection || !avaxPrice || !thorPrice) {
      return '---';
    }

    return collection.floor_price
      ? formatNumber(
          convertPriceFromUSD(
            Number(ethers.utils.formatEther(collection.floor_price ?? 0)) *
              Number(ethers.utils.formatEther(avaxPrice)),
            avaxPrice,
            thorPrice,
            user?.default_currency
          )
        )
      : '---';
  }, [collection, avaxPrice, thorPrice, user?.default_currency]);

  const volumeChanged = useMemo<number | undefined>(() => {
    if (!collection) {
      return undefined;
    }

    return collection.volume_changed;
  }, [collection]);

  const itemsCount = useMemo<string>(() => {
    if (!collection) {
      return '---';
    }

    return collection.collection_size
      ? formatNumber(
          collection.collection_size,
          Number(collection.collection_size) > 999 ? 1 : 0
        )
      : '---';
  }, [collection]);

  const bestOffer = useMemo(() => {
    if (!avaxPrice || !thorPrice) {
      return '---';
    }

    const priceInWei = bestOfferData?.data?.data?.bids[0]?.priceInWei ?? '0';
    const paymentType = bestOfferData?.data.data?.bids[0]?.paymentType; // 0 / 1

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
    const fixedMaxPrice = formatNumber(
      convertPriceFromUSD(
        maxPrice,
        avaxPrice,
        thorPrice,
        user?.default_currency
      ),
      4
    );

    return fixedMaxPrice.toString();
  }, [
    bestOfferData,
    bestOfferOTCData,
    avaxPrice,
    thorPrice,
    user?.default_currency,
  ]);

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

  return (
    <Box>
      <Typography
        variant={'h2'}
        lineHeight={'73px'}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {collection?.name
          ?.replace('OG Odin', 'Origin Odin')
          ?.replace('OG Thor', 'Origin Thor')}
      </Typography>
      <Box mb={'8px'}>
        <Typography variant={'lbl-md'} display={'inline-block'} mr={'4px'}>
          By
        </Typography>
        {publicUser?.address ? (
          <Typography
            variant={'lbl-md'}
            display={'inline-block'}
            color={'primary'}
            to={{
              pathname: `/profile/${collection.owner}`,
            }}
            component={NextLinkComposed}
          >
            {mdDown ? dottedAddress(collection.owner) : collection.owner}
          </Typography>
        ) : (
          <Typography variant={'lbl-md'} display={'inline-block'}>
            {mdDown ? dottedAddress(collection.owner) : collection.owner}
          </Typography>
        )}
      </Box>
      <Typography
        variant={'p-lg'}
        fontWeight={400}
        lineHeight={'27px'}
        sx={{ color: 'text.secondary' }}
      >
        {description}
      </Typography>
      {collection?.description?.length > MAX_DESCRIPTION_LENGTH && (
        <Button
          size={'small'}
          sx={{ color: 'text.secondary' }}
          endIcon={isInSeeMore ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          onClick={handleSeeMore}
        >
          {isInSeeMore ? 'See less' : 'See more'}
        </Button>
      )}
      <Box mt={'10px'} mb={'24px'} display={'flex'}>
        {collection.twitter && (
          <Link
            href={collection.twitter}
            target={'_blank'}
            sx={{
              'mr': '8px',
              'display': 'flex',
              'alignItems': 'center',
              'color': 'primary.main',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <Box
              sx={{
                width: '24px',
                height: '24px',
                fontSize: '24px',
                lineHeight: '24px',
              }}
            >
              <TwitterIcon />
            </Box>
            <Typography variant="lbl-md">@Twitter</Typography>
          </Link>
        )}
        {collection.discord && (
          <Link
            href={collection.discord}
            target={'_blank'}
            sx={{
              'display': 'flex',
              'alignItems': 'center',
              'color': 'primary.main',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <Box
              sx={{
                width: '24px',
                height: '24px',
                fontSize: '24px',
                lineHeight: '24px',
              }}
            >
              <DiscordIcon />
            </Box>
            <Typography variant="lbl-md">@Discord</Typography>
          </Link>
        )}
      </Box>
      <Grid container spacing={'16px'}>
        <Grid item lg={2} md={3} xs={4}>
          <Box>
            <Typography
              variant={'sub-h'}
              lineHeight={'36px'}
              sx={(theme) => ({
                [theme.breakpoints.down('sm')]: {
                  fontSize: '18px',
                  lineHeight: '21px',
                },
              })}
            >
              {totalVolume}{' '}
              {user?.default_currency
                ? user?.default_currency.replace('USDC', 'USD')
                : 'USD'}
            </Typography>
            <Typography
              variant={'lbl-lg'}
              lineHeight={'27px'}
              sx={(theme) => ({
                color: 'text.secondary',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '14px',
                  lineHeight: '21px',
                },
              })}
            >
              Total volume
            </Typography>
          </Box>
        </Grid>
        <Grid item lg={2} md={3} xs={4}>
          <Box>
            <Typography
              variant={'sub-h'}
              lineHeight={'36px'}
              sx={(theme) => ({
                [theme.breakpoints.down('sm')]: {
                  fontSize: '18px',
                  lineHeight: '21px',
                },
              })}
            >
              {floorPrice}{' '}
              {user?.default_currency
                ? user?.default_currency.replace('USDC', 'USD')
                : 'USD'}
            </Typography>
            <Typography
              variant={'lbl-lg'}
              lineHeight={'27px'}
              sx={(theme) => ({
                color: 'text.secondary',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '14px',
                  lineHeight: '21px',
                },
              })}
            >
              Floor price
            </Typography>
          </Box>
        </Grid>
        <Grid item lg={2} md={3} xs={4}>
          <Box>
            <Typography
              variant={'sub-h'}
              lineHeight={'36px'}
              sx={(theme) => ({
                [theme.breakpoints.down('sm')]: {
                  fontSize: '18px',
                  lineHeight: '21px',
                },
              })}
            >
              {bestOffer}{' '}
              {user?.default_currency
                ? user?.default_currency.replace('USDC', 'USD')
                : 'USD'}
            </Typography>
            <Typography
              variant={'lbl-lg'}
              lineHeight={'27px'}
              sx={(theme) => ({
                color: 'text.secondary',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '14px',
                  lineHeight: '21px',
                },
              })}
            >
              Best offer
            </Typography>
          </Box>
        </Grid>
        <Grid item lg={2} md={3} xs={4}>
          <Box>
            {volumeChanged !== undefined && volumeChanged ? (
              <Typography
                variant={'sub-h'}
                lineHeight={'36px'}
                sx={(theme) => ({
                  color: volumeChanged < 0 ? '#F3523F' : '#32B267',
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '18px',
                    lineHeight: '21px',
                  },
                })}
              >
                {volumeChanged}%
              </Typography>
            ) : (
              <Typography
                variant={'sub-h'}
                lineHeight={'36px'}
                sx={(theme) => ({
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '18px',
                    lineHeight: '21px',
                  },
                })}
              >
                ---
              </Typography>
            )}
            <Typography
              variant={'lbl-lg'}
              lineHeight={'27px'}
              sx={(theme) => ({
                color: 'text.secondary',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '14px',
                  lineHeight: '21px',
                },
              })}
            >
              7 Days change
            </Typography>
          </Box>
        </Grid>
        <Grid item lg={2} md={3} xs={4}>
          <Box>
            <Typography
              variant={'sub-h'}
              lineHeight={'36px'}
              sx={(theme) => ({
                [theme.breakpoints.down('sm')]: {
                  fontSize: '18px',
                  lineHeight: '21px',
                },
              })}
            >
              {itemsCount}
            </Typography>
            <Typography
              variant={'lbl-lg'}
              lineHeight={'27px'}
              sx={(theme) => ({
                color: 'text.secondary',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '14px',
                  lineHeight: '21px',
                },
              })}
            >
              items
            </Typography>
          </Box>
        </Grid>
        <Grid item lg={2} md={3} xs={4}>
          <Box>
            <Typography
              variant={'sub-h'}
              lineHeight={'36px'}
              sx={(theme) => ({
                [theme.breakpoints.down('sm')]: {
                  fontSize: '18px',
                  lineHeight: '21px',
                },
              })}
            >
              ---
            </Typography>
            <Typography
              variant={'lbl-lg'}
              lineHeight={'27px'}
              sx={(theme) => ({
                color: 'text.secondary',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '14px',
                  lineHeight: '21px',
                },
              })}
            >
              Owners
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubHeader;
