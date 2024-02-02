import { makeStyles } from '@mui/styles';
import { palette } from '../theme/palette';

export const mobileTable = makeStyles({
  table: {
    //   maxWidth: 850,
    // maxWidth: '400px',
  },
  tableHead: {
    borderBottom: '3px solid  #D9D9D9',
  },
  tableBody: {
    // height: '200px',
    overflowY: 'scroll',
  },
  tableRow: {
    'borderBottom': `3px solid ${palette.secondary.storm[15]}`,
    'backgroundColor': '#F4F4F',
    '&:hover': {
      backgroundColor: '#D9D9D9',
    },
    'overflow': 'scroll',
  },
  tableStickyCell: {
    position: 'sticky',
    left: 0,
    zIndex: 1,
    backgroundColor: 'white',
    // borderRight: '3px solid  #D9D9D9',

    // boxShadow:
    //   '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15) !important',
    // minWidth: '200px !important',
    //   height: '80px',
    // backgroundColor: '#f0f0f0',
  },
  tableCell: {
    'minWidth': '150px !important',
    'color': 'black',
    //   'height': '80px',
    // backgroundColor: '#f0f0f0',
    '&:disabled': {
      color: '#D9D9D9',
    },
  },
});

export const desktopTable = makeStyles({
  table: {
    // maxWidth: '80%',
    //   display:{ sm:'visible',minMobile:'none'}
  },
  tableHead: {
    '&:hover': {
      backgroundColor: 'red !important',
    },
  },
  tableBody: {
    // height: '200px',
    overflowY: 'scroll',
  },
  tableRow: {
    'height': 20,

    '&:hover': {
      backgroundColor: '#D9D9D9',
    },

    // '&:hover > tr:first-child': {
    //   backgroundColor: 'blue',
    // },

    'borderBottom': '3px solid  #D9D9D9',
  },
  tableCell: {
    '&:disabled': {
      color: '#D9D9D9',
    },
  },
});
