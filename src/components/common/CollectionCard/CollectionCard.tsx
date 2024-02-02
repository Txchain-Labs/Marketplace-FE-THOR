import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { Grid, Box, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import { NextLinkComposed } from '@/components/common/Link';

import { formatNumber, convertPriceFromUSD } from '@/utils/common';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import { useChain } from '@/utils/web3Utils';
import { useSelector } from 'react-redux';
import { Collection } from '@/models/Collection';

import { CurrencyIcon } from '@/components/common/CurrencyIcon';
import { ethers } from 'ethers';

interface CollectionCardProps {
  collection: Collection;
  width?: string;
}

const CollectionCard: FC<CollectionCardProps> = ({
  collection,
  width = '258px',
}) => {
  const {
    address,
    profile_image,
    name,
    floor_price,
    total_volume_usd,
    volume_changed,
  } = collection;

  const router = useRouter();
  const chain = useChain();
  const user = useSelector((state: any) => state?.auth.user);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const handleClick = () => {
    router.push(`/collection/${address}`);
  };

  return (
    <Box
      sx={(theme) => ({
        width,
        'height': '266px',
        'm': '2px',
        'backgroundColor': theme.palette.background.paper,
        '&:hover': {
          boxShadow: theme.shadows[1],
          clipPath:
            'polygon(-1px -1px, calc(101% - 36px) -1px, 101% 36px, 101% 101%, -1px 101%)',
        },
        'cursor': `url("/images/cursor-pointer.svg"), auto`,
      })}
      // to={{
      //   pathname: `/collection/${address}`,
      // }}
      // component={NextLinkComposed}
      onClick={handleClick}
    >
      <Box
        width={width}
        height={'142px'}
        sx={{
          backgroundImage: `url(${profile_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Box p={'16px'}>
        <Box mb={'8px'}>
          <Typography
            sx={{
              lineHeight: '28px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '200px',
            }}
            variant={'lbl-lg'}
          >
            {name}
          </Typography>
        </Box>
        <Grid container>
          <Grid item xs={6}>
            <Typography
              variant={'p-sm'}
              sx={{
                fontWeight: 300,
                lineHeight: '18px',
              }}
            >
              Floor price
            </Typography>
            <Box display={'flex'}>
              <Typography
                sx={{
                  lineHeight: '18px',
                  marginRight: '3px',
                }}
                variant={'lbl-md'}
              >
                {floor_price && avaxPrice && thorPrice
                  ? formatNumber(
                      convertPriceFromUSD(
                        Number(ethers.utils.formatEther(floor_price ?? 0)) *
                          Number(ethers.utils.formatEther(avaxPrice)),
                        avaxPrice,
                        thorPrice,
                        user?.default_currency
                      )
                    )
                  : '---'}
              </Typography>
              <Box ml={'3px'} height={'18px'}>
                <CurrencyIcon defaultCurrency={user?.default_currency} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant={'p-sm'}
              sx={{
                fontWeight: 300,
                lineHeight: '18px',
              }}
            >
              Volume
            </Typography>
            <Box display={'flex'}>
              <Typography
                sx={{
                  lineHeight: '18px',
                  marginRight: '3px',
                }}
                variant={'lbl-md'}
              >
                {total_volume_usd && avaxPrice && thorPrice
                  ? formatNumber(
                      convertPriceFromUSD(
                        Number(ethers.utils.formatEther(total_volume_usd)),
                        avaxPrice,
                        thorPrice,
                        user?.default_currency
                      )
                    )
                  : '---'}
              </Typography>
              <Box ml={'3px'} height={'18px'}>
                <CurrencyIcon defaultCurrency={user?.default_currency} />
              </Box>
            </Box>
            {volume_changed !== undefined && +volume_changed !== 0 && (
              <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                {volume_changed < 0 ? (
                  <ArrowDropDownIcon
                    sx={{
                      color: '#F3523F',
                    }}
                  />
                ) : (
                  <ArrowDropUpIcon
                    sx={{
                      color: '#32B267',
                    }}
                  />
                )}
                <Typography
                  sx={{
                    color: volume_changed < 0 ? '#F3523F' : '#32B267',
                  }}
                  variant={'lbl-md'}
                >
                  {volume_changed < 0 ? '' : '+'}
                  {volume_changed}%
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CollectionCard;
