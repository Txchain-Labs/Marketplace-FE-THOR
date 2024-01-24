import { palette } from '../palette';

export const MuiButton = {
  styleOverrides: {
    root: {
      color: '#fff',
      background: 'black',
    },
    text: {
      // padding: 0,
      'background': 'transparent',
      'boxShadow': 'none',
      'color': 'black',
      '&:hover': {
        background: 'transparent',
        boxShadow: 'none',
        color: 'black',
      },
    },
    contained: {
      'maxWidth': '220px',
      'height': '50px',
      'background': palette.primary.fire,
      'boxShadow': 'inset 0px -2px 0px rgba(0, 0, 0, 0.25)',

      '&:hover': {
        background: palette.primary.fire,
      },
    },
    nft_common: {
      ///// figma-styled button
      'alignItems': 'center',
      'maxWidth': '220px',
      'height': '50px',
      'background': palette.primary.fire,
      'boxShadow': 'inset rgba(0, 0, 0, 0.25) 0px -1px 0px',
      'borderRadius': '0px',
      'textTransform': 'initial',
      '&:hover': {
        background: palette.primary.fire,
      },
    },
    nft_primary: {
      'justifyContent': 'center',
      'alignItems': 'center',
      // 'maxWidth': '220px',
      'width': '100%',
      'minHeight': '45px',
      'background': palette.primary.fire,
      'borderRadius': '0px',
      'textTransform': 'initial',
      'borderBottom': `2px solid ${palette.primary.mediumCarmine}`,
      'boxShadow':
        '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      'color': palette.primary.ash,
      '&:hover': {
        background: palette.primary.fire,
        clipPath:
          'polygon(0 0, 92.5% 0, 100% 30%, 100% 100%, 7.5% 100%, 0% 70%, 0 0)',
        transition: ' clip-path 1s',
        zIndex: 10001,
      },
      '&:focus': {
        boxShadow: 'inset 0px -2px 0px rgba(0, 0, 0, 0.25)',
      },
      '&:disabled': {
        background: palette.secondary.storm[30],
        borderBottom: '0px',
        color: palette.secondary.storm[50],
      },
    },
    nft_secondary: {
      'justifyContent': 'center',
      'alignItems': 'center',
      // 'maxWidth': '220px',
      'width': '100%',
      'minHeight': '45px',
      'background': palette.primary.storm,
      'borderRadius': '0px',
      'textTransform': 'initial',
      'borderBottom': `1px solid ${palette.secondary.storm[90]}`,
      'boxShadow':
        '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      'color': palette.primary.ash,
      '&:hover': {
        background: palette.primary.storm,
        clipPath:
          'polygon(0 0, 92.5% 0, 100% 30%, 100% 100%, 7.5% 100%, 0% 70%, 0 0)',
        transition: ' clip-path 1s',
        zIndex: 10001,
      },
      '&:focus': {
        boxShadow: 'inset 0px -2px 0px rgba(0, 0, 0, 0.25)',
      },
      '&:disabled': {
        background: palette.secondary.storm[30],
        borderBottom: '0px',
        color: palette.secondary.storm[50],
      },
    },
    nft_outlined: {
      'justifyContent': 'center',
      'alignItems': 'center',
      // 'maxWidth': '220px',
      'width': '100%',
      'minHeight': '45px',
      'background': 'none',
      'borderRadius': '0px',
      'textTransform': 'initial',
      'border': `2px solid ${palette.primary.storm}`,
      'color': palette.primary.storm,
      'position': 'relative',
      '&:hover': {
        'background': "url('/images/button-bg.png') no-repeat ",
        'backgroundSize': '100%',
        '-webkitBackgroundSize': '100%',
        'height': 'auto',
        'border': 'none',
        // clipPath:
        //   'polygon(0 0, 92.5% 0, 100% 30%, 100% 100%, 7.5% 100%, 0% 70%, 0 0)',
        // transition: ' clip-path 1s',
        // zIndex: 10001,
      },
      '&:focus': {
        boxShadow: 'inset 0px -2px 0px rgba(0, 0, 0, 0.25)',
      },
      '&:disabled': {
        background: 'none',
        color: palette.secondary.storm[50],
        border: `2px solid ${palette.secondary.storm[50]}`,
      },
    },
    nft_text: {
      'justifyContent': 'center',
      'alignItems': 'center',
      // 'maxWidth': '220px',
      'width': '100%',
      'minHeight': '45px',
      'background': 'none',
      'borderRadius': '0px',
      'textTransform': 'initial',
      'color': palette.primary.storm,
      '&:focus': {
        color: palette.primary.fire,
      },
      '&:disabled': {
        color: palette.secondary.storm[50],
      },
    },
    activity_view: {
      'alignItems': 'center',
      'width': '120px',
      'height': '35px',
      'background': 'transparent',
      'color': 'black',
      'border': '1px solid black',
      'boxShadow': 'inset rgba(0, 0, 0, 0.25) 0px -1px 0px',
      'borderRadius': '0px',
      'textTransform': 'none',
      '&:hover': {
        background: palette.primary.fire,
      },
    },
    activity_outside: {
      alignItems: 'center',
      width: '100%',
      height: '100%',
      fontSize: '12px',
      background: 'white',
      color: 'black',
      border: '1px solid black',
      boxShadow: 'inset rgba(0, 0, 0, 0.25) 0px -1px 0px',
      borderRadius: '0px',
      textTransform: 'initial',
      padding: '0px',
      zIndex: 101,
    },
    activity_inside: {
      width: '100px',
      maxWidth: '200px',
      height: '50px',
      background: 'black',
      alignItems: 'center',
      padding: '2px',
      zIndex: 100,
    },
  },
};
