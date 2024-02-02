import { palette } from '@/theme/palette';

export const MuiSlider = {
  styleOverrides: {
    root: {
      '& .MuiSlider-rail': {
        borderRadius: 0,
        backgroundColor: '#808080',
        opacity: 1,
      },
      '& .MuiSlider-thumb': {
        borderRadius: 0,
        width: '6px',
        height: '16px',
      },
      'cursor': `url('/images/cursor-pointer.svg'), auto`,
    },
    valueLabel: {
      backgroundColor: palette.primary.main,
      borderRadius: 0,
    },
  },
};
