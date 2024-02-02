import { Theme } from '@mui/material';

export const MuiTab = {
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      'textTransform': 'none' as const,
      'fontFamily': 'Nexa',
      'fontStyle': 'normal',
      'fontWeight': 400,
      'fontSize': '24px',
      'lineHeight': '36px',
      'letterSpacing': '0.02em',
      '&.Mui-selected': {
        color:
          theme.palette.mode === 'dark'
            ? theme.palette.primary.contrastText
            : theme.palette.common.black,
      },
      'cursor': `url('/images/cursor-pointer.svg'), auto`,
    }),
  },
};
