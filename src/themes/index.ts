import { deepmerge } from '@mui/utils';
import { Theme, createTheme } from '@mui/material';
import Palette from './palette';
import { typography } from './typography';
import { overrides } from './overrides';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    miniMobile: true;
  }
}

const common = {
  breakpoints: {
    values: {
      miniMobile: 0,
      xs: 390,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography,
  components: overrides,
};

export const lightTheme = createTheme({
  ...common,
  palette: Palette('light'),
});

export const darkTheme = createTheme({
  ...common,
  palette: Palette('dark'),
});

export const useAccentTheme = (theme: Theme) => {
  return createTheme(
    deepmerge(theme, {
      palette: {
        background: {
          paper: theme.palette.accent.main,
        },
      },
    })
  );
};

export const useSearchFieldTheme = (theme: Theme) => {
  return createTheme(
    deepmerge(theme, {
      palette: {
        background: {
          paper:
            theme.palette.mode === 'light'
              ? theme.palette.accent.main
              : theme.palette.background.paper,
        },
      },
    })
  );
};
