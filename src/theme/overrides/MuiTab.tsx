import { palette } from '../palette';

export const MuiTab = {
  styleOverrides: {
    root: {
      'color': palette.primary.lightBlack,
      '&.MuiTab-root': {
        color: 'black !important',
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: 18,
        letterSpacing: '0.02em',
        textTransform: 'capitalize',
        minHeight: '26px',
        padding: '0px',
        margin: '0px 20px 45px 0px',
      },
      '& .MuiTabs-indicator': {
        left: '0 !important',
      },
    },
  },
};
