import { deepmerge } from '@mui/utils';
import { Theme, createTheme } from '@mui/material';

const useSearchFieldTheme = (theme: Theme) => {
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

export default useSearchFieldTheme;
