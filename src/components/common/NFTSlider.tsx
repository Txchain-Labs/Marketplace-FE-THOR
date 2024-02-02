import React, { FC, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Avatar, AvatarGroup, Box, Typography } from '@mui/material';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

import { Controller, Mousewheel, EffectCreative } from 'swiper';

export type NFTSlide = {
  key: string;
  image: string;
  title?: string;
  isChecked?: boolean;
  isChecked1?: boolean;
  isChecked2?: boolean;
  currency?: number;
  listPrice?: string;
  nftAvax?: string;
};

interface NFTSliderProps {
  slides: NFTSlide[];
  direction?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium';
  hideTitle?: boolean;
  autoHeight?: boolean;
  fullHeightOffset?: number;
  activeIndex?: number;
  onChangeActiveIndex?: any;
}

const NFTSlider: FC<NFTSliderProps> = ({
  slides,
  size,
  direction,
  activeIndex,
  onChangeActiveIndex,
}) => {
  const slidesPerView = size === 'small' ? 2 : 2;

  const [swiperController, setSwiperController] = useState<any>(null);

  const handleClick = (s: any) => {
    if (s.activeIndex !== s.clickedIndex) {
      swiperController.slideTo(s.clickedIndex);
    }
  };

  useEffect(() => {
    if (
      swiperController &&
      typeof swiperController.activeIndex !== 'undefined' &&
      typeof activeIndex !== 'undefined' &&
      swiperController.activeIndex !== activeIndex
    ) {
      swiperController.slideTo(activeIndex);
    }
  }, [activeIndex, swiperController]);

  return (
    <Box>
      <Swiper
        onActiveIndexChange={(s) => {
          if (
            onChangeActiveIndex &&
            typeof onChangeActiveIndex === 'function'
          ) {
            onChangeActiveIndex(s.activeIndex);
          }
        }}
        onSwiper={setSwiperController}
        direction={direction}
        grabCursor={true}
        spaceBetween={8}
        centeredSlides={true}
        slidesPerView={slidesPerView}
        modules={[Mousewheel, Controller, EffectCreative]}
        mousewheel={true}
        effect={'creative'}
        creativeEffect={
          size === 'small'
            ? {
                prev: {
                  translate: ['-87%', '30%', -150],
                  rotate: [0, 0, 0],
                  scale: 0.5,
                },
                next: {
                  translate: ['87%', '30%', -150],
                  rotate: [0, 0, 0],
                  scale: 0.5,
                },
              }
            : {
                prev: {
                  shadow: true,
                  translate: [0, '-150%', -500],
                },
                next: {
                  shadow: true,
                  translate: ['50%', '110%', -1200],
                },
              }
        }
        onClick={handleClick}
        style={{
          height: size === 'small' ? '45vw' : '418px',
          width: size === 'small' ? 'calc(100vw - 32px)' : '209px',
          top: 'auto',
        }}
      >
        {slides.map((slide: NFTSlide) => (
          <SwiperSlide key={slide.key}>
            <Box
              className="swiper-content"
              sx={{
                '&::before': {
                  content: '""',
                  backgroundImage: `url(${
                    slide.image ? slide.image : '/images/nftImage.png'
                  })`,
                  backgroundSize: 'cover',
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  left: '0px',
                  bottom: '0px',
                },
                'display': 'flex',
                'p': 1,
                'height': '100%',
                'flexDirection': 'column',
                'justifyContent': 'center',
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  justifyContent: 'space-between',
                }}
              >
                {slide.listPrice && (
                  <Typography sx={{ fontSize: '14px' }}>PRICE</Typography>
                )}

                <Box>
                  <AvatarGroup sx={{ color: 'white' }} spacing={6}>
                    {(slide.currency === 0 || slide.isChecked) && (
                      <Avatar
                        alt="avax"
                        src="/images/avaxIcon1.svg"
                        sx={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: 'black',
                          borderWidth: '1px',
                          color: 'white',
                        }}
                      />
                    )}
                    {(slide.currency === 1 || slide.isChecked1) && (
                      <Avatar
                        alt="thor"
                        src="/images/thorIcon1.svg"
                        sx={{
                          width: '20px',
                          height: '20px',
                          borderWidth: '1px',
                          backgroundColor: 'black',
                          color: 'white',
                        }}
                      />
                    )}
                    {(slide.currency === 2 || slide.isChecked2) && (
                      <Avatar
                        alt="usdc"
                        src="/images/usdcIcon1.svg"
                        sx={{
                          width: '20px',
                          height: '20px',
                          borderWidth: '1px',
                          backgroundColor: 'black',
                          color: 'white',
                        }}
                      />
                    )}
                  </AvatarGroup>
                </Box>
              </Box>
              <Box sx={{ display: 'inline-flex', height: '45px' }}>
                <Typography sx={{ fontSize: '32px' }}>
                  {slide.listPrice}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    mt: '14px',
                    ml: '10px',
                  }}
                >
                  {slide.nftAvax}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '14px' }}>
                  0.204 THOR PENDING
                </Typography>
                <Typography sx={{ fontSize: '14px' }}>REWARDS</Typography>
                <Typography sx={{ fontSize: '14px' }}>
                  {slide.title ?? ''}
                </Typography>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default React.memo(NFTSlider);
