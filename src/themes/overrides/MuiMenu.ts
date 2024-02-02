export const MuiMenu = {
  styleOverrides: {
    root: {
      '& .MuiMenu-list': {
        padding: 0,
      },
      '& .MuiMenuItem-root': {
        padding: '10px 12px',
        // '& .MuiListItemIcon-root': {
        //   minWidth: 0,
        // },
      },
      '& .MuiMenuItem-root.Mui-selected': {
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
