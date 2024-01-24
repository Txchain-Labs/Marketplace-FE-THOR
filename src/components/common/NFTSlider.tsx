import React, { FC, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, Typography } from '@mui/material';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

import {
  Controller,
  Mousewheel,
  EffectCreative,
  EffectCoverflow,
} from 'swiper';

export type NFTSlide = {
  key: string;
  image: string;
  title?: string;
};

interface NFTSliderProps {
  slides: NFTSlide[];
  direction?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium';
  hideTitle?: boolean;
  autoHeight?: boolean;
  fullHeightOffset?: number;
}

const NFTSlider: FC<NFTSliderProps> = ({
  slides,
  size,
  direction = 'horizontal',
}) => {
  const slidesPerView = size === 'small' ? 2.2 : 2.5;

  const [swiperController, setSwiperController] = useState<any>(null);

  const handleClick = (s: any) => {
    if (s.activeIndex !== s.clickedIndex) {
      swiperController.slideTo(s.clickedIndex);
    }
  };

  return (
    <Box>
      <Swiper
        controller={{ control: swiperController }}
        onSwiper={setSwiperController}
        direction={direction}
        grabCursor={true}
        spaceBetween={8}
        centeredSlides={true}
        slidesPerView={slidesPerView}
        // rewind={true}
        modules={[
          Mousewheel,
          Controller,
          size === 'small' ? EffectCreative : EffectCoverflow,
        ]}
        mousewheel={true}
        effect={size === 'small' ? 'creative' : 'coverflow'}
        creativeEffect={
          size === 'small'
            ? {
                prev: {
                  translate: ['-95%', '25%', -100],
                  rotate: [0, 0, 0],
                  scale: 0.5,
                },
                next: {
                  translate: ['95%', '25%', -100],
                  rotate: [0, 0, 0],
                  scale: 0.5,
                },
              }
            : {
                prev: {
                  translate: ['20%', '-80%', -100],
                  rotate: [0, 0, 0],
                  scale: 0.5,
                },
                next: {
                  translate: ['20%', '80%', -100],
                  rotate: [0, 0, 0],
                  scale: 0.5,
                },
              }
        }
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          scale: 0.65,
          modifier: 1,
          slideShadows: false,
        }}
        onClick={handleClick}
        style={{
          height: size === 'small' ? '164px' : '460px',
          width: size === 'small' ? 'calc(100vw - 32px)' : '197px',
        }}
      >
        {slides.map((slide: NFTSlide) => (
          <SwiperSlide key={slide.key}>
            <Box sx={{ position: 'relative' }}>
              <img
                src={slide.image ? slide.image : '/images/nftImage.png'}
                alt="NFTS"
                width={size === 'small' ? '164px' : '197px'}
                height="auto"
              />
              <Typography
                variant="lbl-md"
                sx={{
                  width: '80%',
                  display: 'block',
                  position: 'absolute',
                  color: 'white',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  bottom: '15px',
                  left: '15px',
                  right: 0,
                  marginTop: 1,
                }}
              >
                {slide.title ?? ''}
              </Typography>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default React.memo(NFTSlider);
