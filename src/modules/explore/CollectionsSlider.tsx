import React, { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { Box, IconButton } from '@mui/material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { palette } from '@/theme/palette';
import 'swiper/css';

import { Collection } from '@/models/Collection';

import CollectionCard from '@/components/common/CollectionCard';

interface CollectionsSliderProps {
  collections: Collection[];
}

const CollectionsSlider: FC<CollectionsSliderProps> = ({ collections }) => {
  return (
    <Box
      sx={{
        'mt': '-8px',
        '& .swiper-slide': {
          'pt': '8px',
          '&:hover': {
            pt: 0,
          },
        },
        '& .navigation': {
          'background': palette.primary.ash,
          'opacity': 0.6,
          '&:hover': {
            background: palette.primary.ash,
            opacity: 0.8,
          },
          'position': 'absolute',
          'top': 'calc(50% - 20px)',
          'zIndex': 10,
          'visibility': 'hidden',
          '&:not(.swiper-button-disabled):hover': {
            visibility: 'visible',
          },
        },
        '& .swiper:hover .navigation:not(.swiper-button-disabled)': {
          visibility: 'visible',
        },
        '& .swiper-button-disabled': {
          visibility: 'hidden',
        },
      }}
    >
      <Swiper
        slidesPerView={'auto'}
        spaceBetween={16}
        modules={[Navigation]}
        navigation={{
          prevEl: '.navigation.navigation-prev',
          nextEl: '.navigation.navigation-next',
        }}
      >
        {collections?.map((collection) => (
          <SwiperSlide key={collection.address} style={{ width: '258px' }}>
            <CollectionCard collection={collection} width={'258px'} />
          </SwiperSlide>
        ))}
        <IconButton
          sx={{ left: '12px' }}
          className={'navigation navigation-prev'}
        >
          <ArrowLeftIcon />
        </IconButton>
        <IconButton
          sx={{ right: '12px' }}
          className={'navigation navigation-next'}
        >
          <ArrowRightIcon />
        </IconButton>
      </Swiper>
    </Box>
  );
};

export default CollectionsSlider;
