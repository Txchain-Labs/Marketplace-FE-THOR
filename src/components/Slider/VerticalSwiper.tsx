// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Mousewheel, Navigation } from 'swiper';
import { Box, MenuItem } from '@mui/material';
import styles from './styles.module.css';

type Props = {
  slides: {
    image: string;
  }[];
  direction: 'horizontal' | 'vertical';
  setCurrentSlide: (arg: number) => void;
};

export const VerticalSwiper = ({
  slides,
  direction,
  setCurrentSlide,
}: Props) => {
  return (
    <Box
      className={styles.swiperBox}
      sx={{
        width: direction === 'vertical' ? '100%' : 'calc(100% - 96px)',
      }}
    >
      {/* {
        direction && (
          <Button onClick={() => swiper?.slidePrev()} sx={{width: '100%'}}>
          <img
            src={
              slides[currentSlide - 1 > 0 ? currentSlide - 1 : currentSlide]
                .image
            }
            height={'150px'}
            width={'80%'}
            style={{ objectFit: 'cover' }}
          />
          </Button>
        )
        // <Box variant="button" sx={{width: '80%', height: '120px', background: 'black'}}></Box>
      } */}
      <Swiper
        direction={direction}
        spaceBetween={50}
        slidesPerView={1}
        mousewheel={true}
        pagination={{
          clickable: true,
        }}
        onSlideChange={(s) => setCurrentSlide(s?.activeIndex)}
        modules={[Mousewheel, Navigation]}
        navigation={{
          nextEl: '.next',
          prevEl: '.prev',
        }}
        // style={{marginTop: '20px'}}
        style={{
          display: 'block',
          // height: '100%',
          maxHeight: direction === 'vertical' ? '85vh' : 'auto',
          width: direction === 'vertical' ? '80%' : '80%',
          marginTop: direction === 'vertical' ? '4em' : 'none',
          textAlign: 'center',
        }}
      >
        {slides.map(
          (slide, index) => (
            // console.log(slides, 'sliddd'),
            (<></>),
            (
              <SwiperSlide key={slide.image}>
                {direction === 'vertical' ? (
                  <MenuItem
                    sx={{
                      'placeContent': 'center',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                    disabled={index === 0 ? true : false}
                  >
                    <KeyboardArrowUpIcon
                      className=" prev "
                      sx={{
                        width: '100px',
                        height: '100px',
                        color: 'black',
                      }}
                    />
                  </MenuItem>
                ) : (
                  <KeyboardArrowLeftIcon
                    className=" prev "
                    sx={{
                      position: 'absolute',
                      left: '5px',
                      top: '35vw',
                      width: '100px',
                      height: '100px',
                      color: index === 0 ? 'gray' : 'black',
                      transform: 'translateY(-50%)',
                    }}
                  />
                )}

                <img src={slide.image} width={'100%'} />

                {direction === 'vertical' ? (
                  <MenuItem
                    sx={{
                      'placeContent': 'center',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                    disabled={index + 1 === slides.length ? true : false}
                  >
                    <KeyboardArrowDownIcon
                      className=" next "
                      sx={{ width: '100px', height: '100px', color: 'black' }}
                    />
                  </MenuItem>
                ) : (
                  <KeyboardArrowRightIcon
                    className=" next "
                    sx={{
                      position: 'absolute',
                      right: '5px',
                      top: '35vw',
                      width: '100px',
                      height: '100px',
                      color: index + 1 === slides.length ? 'gray' : 'black',
                      transform: 'translateY(-50%)',
                    }}
                  />
                )}
              </SwiperSlide>
            )
          )
        )}
      </Swiper>
      {/* {
        direction && (
          <Button onClick={() => swiper?.slideNext()} sx={{width: '100%'}}>
          <img
            src={
              slides[
                currentSlide < slides.length - 1
                  ? currentSlide + 1
                  : currentSlide
              ].image
            }
            width={'80%'}
            height={'150px'}
            style={{ objectFit: 'cover' }}
          />
          </Button>
        )
        // <Box variant="button" sx={{width: '80%', height: '120px', background: 'black'}}></Box>
      } */}
    </Box>
  );
};
