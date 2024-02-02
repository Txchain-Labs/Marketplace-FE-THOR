import React, { FC, useMemo } from 'react';
import {
  ThorfiNFTType_ext,
  nodeType,
  thorfiNfts_ext,
  getThorfiNftAddress,
} from '@/utils/constants';
import { useChain } from '@/utils/web3Utils';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { nodeTitle, nodesWrapper } from '@/styles/Manager';
import NodeSelectTile from './NodeSelectTile';
import { convertPriceFromUSD, formatNumber } from '@/utils/common';
import { BigNumber, ethers } from 'ethers';
import { useCollection } from '@/hooks/useCollections';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import { useSelector } from 'react-redux';
import {
  useGetBestOfferAvax,
  useGetBestOfferOTCAvax,
} from '@/hooks/useNFTDetail';
import { ThorTier } from '@/utils/types';

interface AssetsTileProps {
  assetsType: ThorfiNFTType_ext;
  activeTier?: string;
  activeNodeType?: string;
  setActive: (tier: string, nodeType: string) => void;
  hasTile?: boolean;
  titleImage?: string[];
}
const AssetsTile: FC<AssetsTileProps> = ({
  assetsType,
  activeTier,
  activeNodeType,
  setActive,
  hasTile,
  titleImage = [''],
}) => {
  const chain = useChain();
  const nodesType = nodeType;
  const thorfiNFTs = thorfiNfts_ext(assetsType, chain);
  const collectionAddress = getThorfiNftAddress(
    chain?.id,
    assetsType,
    activeTier as ThorTier
  );

  const isWide = assetsType === 'keycards' || assetsType === 'perks';

  const user = useSelector((state: any) => state?.auth.user);

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const { data: collection } = useCollection(collectionAddress);

  const { data: bestOfferData } = useGetBestOfferAvax(
    collection?.address?.toLowerCase() || ''
  );
  const { data: bestOfferOTCData } = useGetBestOfferOTCAvax(
    collection?.address?.toLowerCase()
  );

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

  const handleTileClick = (tier: string, nodeType: string) => {
    setActive(tier, nodeType);
  };

  return (
    <Stack
      direction={{
        miniMobile: 'column',
        md: isWide ? 'column' : 'row',
        lg: 'row',
      }}
      alignItems={{
        miniMobile: 'unset',
        md: isWide ? 'unset' : 'center',
        lg: 'center',
      }}
      spacing={'20px'}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'no-wrap',
          gap: { sm: '20px', miniMobile: '10px' },
          overflowX: { sm: 'auto', miniMobile: 'scroll' },
        }}
      >
        {nodesType.map((type, index) => (
          <Box key={type + index}>
            {hasTile && assetsType !== 'origin' && assetsType !== 'drift' && (
              <Typography sx={nodeTitle(activeNodeType === type)}>
                <img
                  src={titleImage[index]}
                  width="18px"
                  height="18px"
                  style={{
                    display: activeNodeType === type ? '' : 'none',
                    marginRight: '8px',
                  }}
                ></img>
                {type}
              </Typography>
            )}
            <Box key={index} sx={nodesWrapper}>
              {thorfiNFTs
                .filter(
                  (item) =>
                    item.nodeType === type ||
                    (item.nodeType === '' && type === 'ORIGIN')
                )
                .map((item) => (
                  <NodeSelectTile
                    key={item.name + item.nodeType + item.tier}
                    nodeType={item.nodeType}
                    tier={item.tier}
                    currentActive={
                      hasTile
                        ? activeNodeType === item.nodeType &&
                          activeTier === item.tier
                        : activeNodeType === item.nodeType ||
                          activeTier === item.tier
                    }
                    enable={hasTile ? activeNodeType === item.nodeType : true}
                    poster={item.poster}
                    video={item.video}
                    text={
                      hasTile
                        ? item.tier
                        : item.nodeType === ''
                        ? item.tier
                        : item.nodeType
                    }
                    handleTileClick={handleTileClick}
                  />
                ))}
            </Box>
          </Box>
        ))}
      </Box>
      <Box>
        <Grid container spacing={'16px'}>
          <Grid item lg={6} md={isWide ? 3 : 6} xs={4}>
            <Box>
              <Typography
                variant={'sub-h'}
                fontSize={'18px'}
                lineHeight={'normal'}
              >
                {collection?.total_volume_usd && avaxPrice && thorPrice
                  ? formatNumber(
                      convertPriceFromUSD(
                        Number(
                          ethers.utils.formatEther(collection?.total_volume_usd)
                        ),
                        avaxPrice,
                        thorPrice,
                        user?.default_currency
                      )
                    )
                  : '---'}{' '}
                {user?.default_currency
                  ? user?.default_currency.replace('USDC', 'USD')
                  : 'USD'}
              </Typography>
              <Typography
                variant={'lbl-lg'}
                color={'text.secondary'}
                fontSize={'14px'}
                lineHeight={'normal'}
              >
                Total volume
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={6} md={isWide ? 3 : 6} xs={4}>
            <Box>
              <Typography
                variant={'sub-h'}
                fontSize={'18px'}
                lineHeight={'normal'}
              >
                {collection?.floor_price && avaxPrice && thorPrice
                  ? formatNumber(
                      convertPriceFromUSD(
                        Number(
                          ethers.utils.formatEther(collection?.floor_price ?? 0)
                        ) * Number(ethers.utils.formatEther(avaxPrice)),
                        avaxPrice,
                        thorPrice,
                        user?.default_currency
                      )
                    )
                  : '---'}{' '}
                {user?.default_currency
                  ? user?.default_currency.replace('USDC', 'USD')
                  : 'USD'}
              </Typography>
              <Typography
                variant={'lbl-lg'}
                color={'text.secondary'}
                fontSize={'14px'}
                lineHeight={'normal'}
              >
                Floor price
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={6} md={isWide ? 3 : 6} xs={4}>
            <Box>
              <Typography
                variant={'sub-h'}
                fontSize={'18px'}
                lineHeight={'normal'}
              >
                {bestOffer}{' '}
                {user?.default_currency
                  ? user?.default_currency.replace('USDC', 'USD')
                  : 'USD'}
              </Typography>
              <Typography
                variant={'lbl-lg'}
                color={'text.secondary'}
                fontSize={'14px'}
                lineHeight={'normal'}
              >
                Best offer
              </Typography>
            </Box>
          </Grid>
          <Grid item lg={6} md={isWide ? 3 : 6} xs={4}>
            <Box>
              {collection?.volume_changed !== undefined &&
              +collection?.volume_changed !== 0 ? (
                <Typography
                  variant={'sub-h'}
                  fontSize={'18px'}
                  lineHeight={'normal'}
                  color={
                    collection?.volume_changed < 0
                      ? 'error.main'
                      : 'success.main'
                  }
                >
                  {collection?.volume_changed}%
                </Typography>
              ) : (
                <Typography
                  variant={'sub-h'}
                  fontSize={'18px'}
                  lineHeight={'normal'}
                >
                  ---
                </Typography>
              )}
              <Typography
                variant={'lbl-lg'}
                color={'text.secondary'}
                fontSize={'14px'}
                lineHeight={'normal'}
              >
                7 Days change
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default AssetsTile;
