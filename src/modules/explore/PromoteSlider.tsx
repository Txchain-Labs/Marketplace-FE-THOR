import React, { FC } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination, EffectFade, Autoplay } from 'swiper';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { NextLinkComposed } from '@/components/common/Link';
import { palette } from '@/theme/palette';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { formatNumber, convertPriceFromUSD } from '@/utils/common';
import { useChain } from '@/utils/web3Utils';
import { useSelector } from 'react-redux';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import { usePromotedCollections } from '@/hooks/useCollections';

import { Loader } from '@/components/common';

import { Collection } from '@/models/Collection';

import { CurrencyIcon } from '@/components/common/CurrencyIcon';
import { ethers } from 'ethers';

const PromoteSlider: FC = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const chain = useChain();
  const user = useSelector((state: any) => state?.auth.user);

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const { data: promotedCollections, isLoading } = usePromotedCollections();

  return (
    <Box
      sx={(theme) => ({
        '& .swiper-pagination > .swiper-pagination-bullet': {
          'width': '50px',
          'height': '6px',
          'borderRadius': 0,
          'margin': 0,
          'opacity': 0.6,
          'backgroundColor': palette.primary.ash,
          '&.swiper-pagination-bullet-active': {
            backgroundColor: theme.palette.primary.main,
            opacity: 1,
          },
        },
        '& .swiper-slide:after': {
          content: '""',
          zIndex: 1,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0) -17.11%, rgba(0, 0, 0, 0.4) 66.77%)',
        },
      })}
    >
      {isLoading || !avaxPrice || !thorPrice ? (
        <Loader colSpan={2} height={350} size={undefined} />
      ) : (
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination, Mousewheel, EffectFade, Autoplay]}
          mousewheel={true}
          grabCursor={true}
          autoplay={{
            delay: 4000,
          }}
          effect={'fade'}
          style={{
            height: smDown ? '248px' : '350px',
          }}
        >
          {(promotedCollections as Collection[])?.map((collection) => (
            <SwiperSlide
              key={collection.address}
              style={{
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${collection.cover_image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <Box
                sx={(theme) => ({
                  color: palette.primary.ash,
                  zIndex: 2,
                  position: 'absolute',
                  left: '40px',
                  right: '40px',
                  bottom: '40px',
                  display: 'flex',
                  flexDirection: 'row',
                  [theme.breakpoints.down('sm')]: {
                    left: '20px',
                    right: '20px',
                    bottom: '20px',
                    justifyContent: 'space-between',
                  },
                })}
              >
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Box>
                      <Avatar
                        sx={(theme) => ({
                          width: 52,
                          height: 52,
                          [theme.breakpoints.down('sm')]: {
                            width: 33,
                            height: 33,
                          },
                          marginRight: '16px',
                        })}
                        alt={collection.name}
                        src={collection.profile_image}
                      />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          lineHeight: '27px',
                          marginRight: '8px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '140px',
                        }}
                        variant={'lbl-lg'}
                      >
                        {collection.name}
                      </Typography>
                      <Typography
                        variant={'p-sm'}
                        sx={{
                          fontWeight: 300,
                          lineHeight: '18px',
                        }}
                      >
                        {collection.collection_size
                          ? formatNumber(
                              +collection.collection_size,
                              +collection.collection_size > 999 ? 1 : 0
                            )
                          : '---'}{' '}
                        Items
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={(theme) => ({
                      'marginTop': '12px',
                      'display': 'flex',
                      [theme.breakpoints.down('sm')]: {
                        display: 'none',
                      },
                      'alignItems': 'center',
                      '& > *': {
                        marginRight: '36px',
                      },
                    })}
                  >
                    <Box>
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
                          {collection.floor_price
                            ? formatNumber(
                                convertPriceFromUSD(
                                  Number(
                                    ethers.utils.formatEther(
                                      collection.floor_price ?? 0
                                    )
                                  ) *
                                    Number(ethers.utils.formatEther(avaxPrice)),
                                  avaxPrice,
                                  thorPrice,
                                  user?.default_currency
                                )
                              )
                            : '---'}
                        </Typography>
                        <Box m={'1px'} height={'16px'}>
                          <CurrencyIcon
                            defaultCurrency={user?.default_currency}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Box>
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
                        <Box display={'flex'}>
                          <Typography
                            sx={{
                              lineHeight: '18px',
                              marginRight: '3px',
                            }}
                            variant={'lbl-md'}
                          >
                            {collection.total_volume_usd
                              ? formatNumber(
                                  convertPriceFromUSD(
                                    Number(
                                      ethers.utils.formatEther(
                                        collection.total_volume_usd
                                      )
                                    ),
                                    avaxPrice,
                                    thorPrice,
                                    user?.default_currency
                                  )
                                )
                              : '---'}
                          </Typography>
                          <Box m={'1px'} height={'16px'}>
                            <CurrencyIcon
                              defaultCurrency={user?.default_currency}
                            />
                          </Box>
                        </Box>
                        {collection.volume_changed !== undefined &&
                          +collection.volume_changed !== 0 && (
                            <Typography
                              sx={{
                                lineHeight: '18px',
                                fontWeight: 300,
                                marginLeft: '5px',
                                marginRight: '3px',
                                color:
                                  collection.volume_changed < 0
                                    ? '#F3523F'
                                    : '#32B267',
                              }}
                              variant={'p-sm'}
                            >
                              {collection.volume_changed < 0 ? '' : '+'}
                              {collection.volume_changed}%
                            </Typography>
                          )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display={'flex'} alignItems={'flex-end'}>
                  <Button
                    variant={'outlined_light'}
                    to={{
                      pathname: `/collection/${collection.address}`,
                    }}
                    component={NextLinkComposed}
                  >
                    Explore collection
                  </Button>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </Box>
  );
};

export default PromoteSlider;
