import React, { FC, useState, useRef, useEffect } from 'react';
import { useWindowHeight } from '@react-hook/window-size';
import useSize from '@react-hook/size';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, Typography } from '@mui/material';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

import { Controller, Mousewheel, EffectCoverflow } from 'swiper';

const CONST_TITLE_BOX_HEIGHT = 86;

export type Slide = {
  key: string;
  image: string;
  video?: string;
  title?: string;
  subtitle?: string;
};

interface ThorfiSliderProps {
  slides: Slide[];
  mediaType?: 'video' | 'img';
  activeSlide?: string;
  onActiveSlideChange?: (key: string) => void;
  direction?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium';
  hideTitle?: boolean;
  autoHeight?: boolean;
  fullHeightOffset?: number;
  action?: React.ReactNode;
}

const ThorfiSlider: FC<ThorfiSliderProps> = ({
  slides,
  mediaType = 'img',
  onActiveSlideChange,
  activeSlide,
  direction = 'horizontal',
  size = 'medium',
  hideTitle = false,
  // autoHeight = true,
  fullHeightOffset = 0,
  action,
}) => {
  const ref = useRef();
  const [width] = useSize(ref);

  const windowHeight = useWindowHeight();
  const height = windowHeight - fullHeightOffset;

  const slidesPerView = size === 'small' ? 1 : 1.5;

  const horizontalSlideWidth =
    slidesPerView === 1 ? width : width / slidesPerView + 10;
  const verticalSlideHeight =
    slidesPerView === 1 ? height : height / slidesPerView + 10;

  const verticalTitlePx =
    (width - verticalSlideHeight + CONST_TITLE_BOX_HEIGHT) / 2;
  const horizontalTitlePx =
    (horizontalSlideWidth - height + CONST_TITLE_BOX_HEIGHT) / 2;

  const sliderHeight =
    direction === 'horizontal' &&
    horizontalSlideWidth < height - CONST_TITLE_BOX_HEIGHT * (hideTitle ? 0 : 1)
      ? horizontalSlideWidth + CONST_TITLE_BOX_HEIGHT * (hideTitle ? 0 : 1)
      : height;

  const [swiperController, setSwiperController] = useState<any>(null);

  const handleClick = (s: any) => {
    if (s.activeIndex !== s.clickedIndex && swiperController) {
      swiperController.slideTo(s.clickedIndex);
    }
  };

  const handleSlideChange = (s: any) => {
    onActiveSlideChange && onActiveSlideChange(slides[s.activeIndex].key);
  };

  useEffect(() => {
    if (!swiperController) return;

    const index = slides.findIndex((slide) => slide.key === activeSlide);
    if (index > -1) {
      // swiperController?.slideTo(index);
    }
  }, [swiperController, activeSlide, slides]);

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Swiper
        // controller={{ control: swiperController }}
        onSwiper={setSwiperController}
        direction={direction}
        grabCursor={true}
        spaceBetween={-42}
        centeredSlides={true}
        slidesPerView={slidesPerView}
        // rewind={true}
        modules={[Controller, Mousewheel, EffectCoverflow]}
        mousewheel={true}
        effect={'coverflow'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          scale: 0.65,
          modifier: 1,
          slideShadows: false,
        }}
        onClick={handleClick}
        onActiveIndexChange={handleSlideChange}
        style={{
          width,
          height: sliderHeight,
        }}
      >
        {slides.map((slide: Slide) => (
          <SwiperSlide
            key={slide.key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {({ isActive }) => (
              <React.Fragment>
                {mediaType === 'img' ? (
                  <img
                    src={slide.image}
                    alt={slide.title}
                    style={{
                      width:
                        direction === 'horizontal' &&
                        horizontalSlideWidth < height - CONST_TITLE_BOX_HEIGHT
                          ? '100%'
                          : 'auto',
                      height:
                        direction === 'horizontal' &&
                        horizontalSlideWidth < height - CONST_TITLE_BOX_HEIGHT
                          ? 'auto'
                          : hideTitle
                          ? '100%'
                          : `calc(100% - ${CONST_TITLE_BOX_HEIGHT}px)`,
                      transition: '.7s',
                    }}
                  />
                ) : (
                  <video
                    poster={slide.image}
                    loop
                    autoPlay={true}
                    muted
                    style={{
                      width:
                        direction === 'horizontal' &&
                        horizontalSlideWidth < height - CONST_TITLE_BOX_HEIGHT
                          ? '100%'
                          : 'auto',
                      height:
                        direction === 'horizontal' &&
                        horizontalSlideWidth < height - CONST_TITLE_BOX_HEIGHT
                          ? 'auto'
                          : hideTitle
                          ? '100%'
                          : `calc(100% - ${CONST_TITLE_BOX_HEIGHT}px)`,
                      transition: '.7s',
                    }}
                  >
                    <source src={slide.video} type="video/mp4" />
                  </video>
                )}
                <Box
                  sx={{
                    boxSizing: 'border-box',
                    width: '100%',
                    height: `${CONST_TITLE_BOX_HEIGHT}px`,
                    pt: '20px',
                    px:
                      direction === 'vertical'
                        ? `${verticalTitlePx > 0 ? verticalTitlePx : 8}px`
                        : `${horizontalTitlePx > 0 ? horizontalTitlePx : 8}px`,
                    display: hideTitle ? 'none' : undefined,
                  }}
                >
                  <Typography
                    variant={'h4'}
                    sx={{
                      lineHeight: '39px',
                      display: isActive ? undefined : 'none',
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography
                    variant={'p-sm'}
                    sx={{
                      marginTop: size === 'medium' ? '8px' : '4px',
                      lineHeight: '18px',
                      display: isActive ? undefined : 'none',
                    }}
                  >
                    {slide.subtitle}
                  </Typography>
                </Box>
              </React.Fragment>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {action && (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: `calc(50% + ${sliderHeight / 2}px)`,
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
          }}
        >
          {action}
        </Box>
      )}
    </Box>
  );
};

export default React.memo(ThorfiSlider);
