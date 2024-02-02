import { palette } from '@/theme/palette';
export const MuiTextField = {
  styleOverrides: {
    root: {
      '& label.Mui-focused': {
        // color: 'rgba(243, 82, 63, 1)'
      },

      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          // borderColor: 'rgba(243, 82, 63, 1)'
        },
        '&:hover fieldset': {
          // borderColor: 'rgba(243, 82, 63, 1)'
        },
        '&.Mui-focused fieldset': {
          // borderColor: 'rgba(243, 82, 63, 1)',
          outline: 'none',
        },
        'color': palette.text.darkBlack,
        'fontSize': '14px',
        'fontFamily': 'Inter',
        'fontWeight': 700,
      },
    },
  },
};
