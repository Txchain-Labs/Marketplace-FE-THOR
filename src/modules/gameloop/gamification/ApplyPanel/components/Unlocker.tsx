import React, { FC, useEffect, useMemo } from 'react';
import {
  Box,
  CircularProgress,
  keyframes,
  Slider,
  SxProps,
  Theme,
} from '@mui/material';

interface UnlockerProps {
  itemToUnlock: any;
  onUnlock: () => Promise<void>;
  label?: string;
  count?: number;
  sx?: SxProps;
  isUnlocking?: boolean;
}

const Unlocker: FC<UnlockerProps> = ({
  itemToUnlock,
  onUnlock,
  label = 'Slide to Open',
  count,
  sx = {},
  isUnlocking = false,
}) => {
  const sliderRange = useMemo(() => {
    return [10, 90];
  }, []);

  const [sliderPosition, setSliderPosition] = React.useState<number>(
    sliderRange[0]
  );

  function onSlide(_event: Event, newValue: number | number[]) {
    if (isUnlocking) return;

    if (newValue > sliderRange[0] && newValue < sliderRange[1]) {
      setSliderPosition(+newValue);
    }
  }

  function onSlideCommitted(
    _event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) {
    if (isUnlocking) return;
    if (newValue > 50) {
      setSliderPosition(sliderRange[1]);
      onUnlock().then(() => {
        setSliderPosition(sliderRange[0]);
      });
    } else {
      setSliderPosition(sliderRange[0]);
    }
  }

  function getSliderBackgroundState(theme: Theme) {
    if (sliderPosition === sliderRange[1]) {
      return theme.palette.primary.main;
    } else {
      return `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${
        theme.palette.background.paper
      } ${
        sliderPosition === sliderRange[0] ? sliderPosition - 10 : sliderPosition
      }%)`;
    }
  }

  useEffect(() => {
    setSliderPosition(sliderRange[0]);
  }, [itemToUnlock, sliderRange]);

  const shine = keyframes`
    0% {
      background-position: 0;
    }
    60% {
      background-position: 180px;
    }
    100% {
      background-position: 180px;
    }
  `;

  const labelStyle = {
    default: {
      position: 'absolute',
      zIndex: 1,
      top: '47%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '12px 48px',
      fontSize: '20px',
      lineHeight: '24px',
      fontWeight: 600,
    },
    get locked() {
      return {
        ...this.default,
        'background':
          'linear-gradient(to right, transparent 0, #f35543 10%, transparent 20%)',
        'backgroundPosition': 0,
        'animation': `${shine} 3s infinite linear`,
        'animationFillMode': 'forwards',
        'webkitTextSizeAdjust': 'none',
        'textDecoration': 'none',
        'whiteSpace': 'nowrap',
        'color': '#c6c6c6',
        '-webkitTextFillColor': '#7c66667a',
        '-webkitBackgroundClip': 'text',
      };
    },
    get unlocked() {
      return {
        ...this.default,
        color: '#a5382b',
      };
    },
  };

  const sliderBtnStyle = {
    default: {
      'zIndex': 2,
      'marginLeft': '2px',
      'height': '56px',
      'width': '56px',
      'borderRadius': '0',
      'borderBottom': '2px solid #b4594e',
      'background': 'linear-gradient(90deg, #F3523F 0%, #eeb1aa 86.84%)',
      'clipPath':
        'polygon(0 22px, 22px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)',

      '&::before': {
        content: '""',
        position: 'absolute',
        display: 'block',
        bottom: '2px',
        left: '10px',
        width: '100%',
        height: '2px',
        background: '#b4594e',
        transform: 'rotate(-45deg)',
      },
    },
    get locked() {
      return {
        ...this.default,

        '&::after': {
          content: '">"',
          color: '#fff',
          fontSize: '40px',
          lineHeight: '48px',
          display: 'flex',
          justifyContent: 'center',
        },
      };
    },

    get unlocked() {
      return {
        ...this.default,
        'background': '#F3523F',
        'boxShadow': '-5px -5px 1px 5px #9f9f9f',

        '&.unlocking ::after': {
          content: '""',
          background: 'url("/images/logo22.png") no-repeat center center',
          backgroundSize: '27px',
          opacity: 0.6,
        },

        '& .MuiSlider-valueLabelOpen': {
          'top': '0',

          '&::before': {
            content: '""',
            position: 'absolute',
            display: 'block',
            top: '25px',
            left: '10px',
            width: '100%',
            height: '3px',
            background: '#e1766a',
            transform: 'rotate(0deg)',
          },

          '&::after': {
            content: '""',
            position: 'absolute',
            display: 'block',
            top: '35px',
            left: '-17px',
            width: '100%',
            height: '3px',
            background: '#e1766a',
            transform: 'rotate(-41deg)',
          },
        },
      };
    },
  };
  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={
            sliderPosition === sliderRange[1]
              ? labelStyle.unlocked
              : labelStyle.locked
          }
          className={isUnlocking ? 'unlocking' : ''}
        >
          {isUnlocking ? (
            <Box>
              <CircularProgress sx={{ color: '#fff', padding: '10px' }} />
            </Box>
          ) : (
            <>{sliderPosition === sliderRange[1] ? 'Open!' : label}</>
          )}
        </Box>
        {!isUnlocking && (
          <Box
            sx={{
              position: 'absolute',
              zIndex: 1,
              right: '20px',
              top: '47%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#F3523F',
              color: '#F8F8F8',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: '700',
              lineHeight: '32px',
            }}
          >
            {count}
          </Box>
        )}
        <Slider
          sx={(theme) => ({
            'height': '69px',
            'width': '342px',
            'borderRadius': '0',
            'transition': 'width .5s ease-in-out',

            '&.unlocking': {
              'width': '70px',
              'clipPath':
                'polygon(0 28px, 28px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)',

              '& .MuiSlider-thumb': {
                marginLeft: '-28px',
              },
            },

            '& .MuiSlider-rail': {
              'position': 'relative',
              'clipPath':
                'polygon(0 28px, 28px 0, 100% 0, 100% calc(100% - 26px), calc(100% - 26px) 100%, 0 100%)',
              'background': getSliderBackgroundState(theme),
              'border':
                theme.palette.mode === 'light'
                  ? `1px solid #9F9F9F`
                  : undefined,
              'opacity': '1',
              'boxShadow': '0px 4px 4px 0px rgba(0, 0, 0, 0.32) inset',

              '&::before': {
                content: '""',
                position: 'absolute',
                display: 'block',
                top: '11px',
                left: '-5px',
                width: '11%',
                height: '1px',
                bgcolor: theme.palette.mode === 'light' ? '#9F9F9F' : undefined,
                transform: 'rotate(-45deg)',
              },

              '&::after': {
                content: '""',
                position: 'absolute',
                display: 'block',
                bottom: '12px',
                right: '-7px',
                width: '12%',
                height: '1px',
                bgcolor: theme.palette.mode === 'light' ? '#9F9F9F' : undefined,
                transform: 'rotate(-45deg)',
              },
            },

            '& .MuiSlider-thumb':
              sliderPosition === sliderRange[1]
                ? sliderBtnStyle.unlocked
                : sliderBtnStyle.locked,

            '& .MuiSlider-track': {
              display: 'none',
            },
          })}
          className={isUnlocking ? 'unlocking' : ''}
          value={sliderPosition}
          onChange={onSlide}
          onChangeCommitted={onSlideCommitted}
          valueLabelDisplay="on"
        />
      </Box>
    </Box>
  );
};

export default Unlocker;
