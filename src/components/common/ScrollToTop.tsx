import React, { FC, useState, useEffect } from 'react';
// eslint-disable-next-line import/named
import { animateScroll } from 'react-scroll';
import { Fab } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { palette } from '@/theme/palette';

interface ScrollToTopProps {
  offset?: number;
}

const ScrollToTop: FC<ScrollToTopProps> = ({ offset = 0 }) => {
  const [isShow, setIsShow] = useState(false);

  const handleBackToTopClick = () => {
    animateScroll.scrollToTop({
      duration: 1500,
      smooth: true,
    });
  };

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > offset) {
        setIsShow(true);
      } else {
        setIsShow(false);
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [offset]);

  return (
    <Fab
      size={'small'}
      sx={{
        'position': 'fixed',
        'bottom': '24px',
        'left': 'calc(50% - 20px)',
        'background': palette.primary.ash,
        'opacity': 0.6,
        '&:hover': {
          background: palette.primary.ash,
          opacity: 0.8,
        },
        'visibility': isShow ? 'visible' : 'hidden',
      }}
      onClick={handleBackToTopClick}
    >
      <ArrowDropUpIcon />
    </Fab>
  );
};

export default ScrollToTop;
