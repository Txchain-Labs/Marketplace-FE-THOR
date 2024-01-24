import { red, blueGrey, grey } from '@mui/material/colors';

const white = '#ffff';
const black = '#181F3F';
const darkBlack = '#090909';
const lightBlack = '#rgba(0, 0, 0, 0.9)';
const darkWhite = '#5b5b5b';
const blue = '#23224e';
const gray = '#AEAEAE';
const lightGray = ' #505050';
const yellow = 'rgba(243, 82, 63, 1)';
const lightBlue = '#2890AD';
const themePrimaryColor = '#F3523F';
const seaGreen = '#7EF7FF';

// new colors //
const storm = '#000000';
const ash = '#F8F8F8';
const fire = '#F3523F';
const cloud = '#E4E1DC';
const sky = '#DEDFEB';
const strike = '#E2E729';
const bolt = '#F99D2A';
const mediumCarmine = '#B63D2F';

// eslint-disable-next-line import/prefer-default-export
export const palette = {
  black,
  white,
  blue,
  gray,
  yellow,
  darkBlack,
  // seaGreen,

  primary: {
    lightBlack,
    darkWhite,
    contrastText: white,
    dark: themePrimaryColor,
    main: themePrimaryColor,
    light: white,
    blue,
    lightBlue,
    seaGreen,
    gray,
    storm,
    ash,
    fire,
    mediumCarmine,
  },
  secondary: {
    contrastText: white,
    dark: themePrimaryColor,
    main: themePrimaryColor,
    light: themePrimaryColor,
    yellow: yellow,
    storm: {
      90: '#1A1A1A',
      70: '#4C4C4C',
      50: '#808080',
      30: '#B3B3B3',
      15: '#D9D9D9',
    },
  },
  accent: {
    cloud: cloud,
    sky: sky,
    strike: strike,
    bolt: bolt,
  },
  error: {
    contrastText: white,
    dark: red[900],
    main: red[600],
    light: red[400],
  },
  text: {
    primary: black,
    secondary: black,
    link: blue[600],
    darkWhite,
    darkBlack,
    lightGray,
    lightBlack,
  },
  link: blue[800],
  icon: blueGrey[600],
  background: {
    default: '#F4F6F8',
    paper: white,
  },
  divider: grey[200],
};
