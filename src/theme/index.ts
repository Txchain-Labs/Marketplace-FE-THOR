import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { overrides } from './overrides';

const theme = createTheme({
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
  palette,
  typography: {
    ...typography,
  },
  components: {
    ...overrides,
    MuiInputLabel: {
      defaultProps: {
        sx: {
          fontSize: { sm: '40px', miniMobile: 'lbl-md' },
        },
      },
    },
    MuiInput: {
      defaultProps: {
        sx: {
          fontSize: { sm: '40px', miniMobile: 'p-lg-bk' },

          paddingTop: { sm: '10px', miniMobile: '0px' },
        },
      },
    },
    MuiPopover: {
      defaultProps: {
        sx: {
          zIndex: 13000,
        },
      },
    },
  },
});

export default theme;
