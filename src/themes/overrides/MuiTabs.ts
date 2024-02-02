import { palette } from '@/theme/palette';

export const MuiTabs = {
  styleOverrides: {
    root: {
      '& .MuiTabs-indicator': {
        backgroundColor: palette.primary.fire,
        height: '8px',
      },
      '& .MuiTabs-flexContainer .MuiTab-textColorPrimary': {
        cursor: `url('/images/cursor-pointer.svg'), auto`,
      },
    },
  },
};
