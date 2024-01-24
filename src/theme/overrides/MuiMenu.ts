import { palette } from '../palette';

export const MuiMenu = {
  styleOverrides: {
    root: {
      '& .MuiMenu-list': {
        padding: 0,
      },
      '& .MuiMenuItem-root': {
        padding: '10px 12px',
      },
      '& .MuiMenuItem-root.Mui-selected': {
        'background': palette.primary.fire,
        '&:hover': {
          background: palette.primary.fire,
        },
        'color': 'white',
        '& .MuiListItemIcon-root': {
          color: 'white',
        },
      },
    },
    paper: {
      borderRadius: '0!important',
    },
  },
};
