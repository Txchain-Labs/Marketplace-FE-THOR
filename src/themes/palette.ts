import { PaletteMode, createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
  }

  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
  }
}

export const presetColors = {
  // ================= Primary Colors =================
  storm: {
    100: '#000000',
    90: '#1A1A1A',
    70: '#4C4C4C',
    50: '#808080',
    30: '#B3B3B3',
    15: '#D9D9D9',
  },
  ash: '#F8F8F8',
  fire: '#F3523F',
  white: '#FFFFFF',

  // ================= Secondary colors (Storm Tints) =================
  // ================= Dark Secondary colors (Storm Tints) =================
  new: {
    100: '#0C0C0C',
    80: '#333333',
    60: '#666666',
  },

  // ================= Accent Colors =================
  cloud: '#E4E1DC',
  sky: '#DEDFEB',
  strike: '#E2E729',

  // ================= Dark Accent Colors =================
  darkStrike: '#E8EC54',

  // ================= Semantic Colors =================
  magenta: '#D90368',
  blue: '#296EB4',
  bolt: '#F99D2A',
  green: '#32B267',

  // ================= Dark Semantic Colors =================
  darkMagenta: '#DD1C77',
  darkBlue: '#3E7DBC',
  darkBolt: '#FAA73F',
  darkGreen: '#47BA76',
};

const lightPalette = {
  primary: {
    main: presetColors.fire,
    contrastText: presetColors.ash,
  },
  secondary: {
    main: presetColors.storm[100],
    contrastText: presetColors.ash,
  },
  accent: {
    main: presetColors.ash,
    contrastText: presetColors.storm[70],
  },
  background: {
    paper: presetColors.white,
    default: presetColors.white,
  },
  text: {
    primary: presetColors.storm[100],
    secondary: presetColors.storm[70],
  },
  error: {
    main: presetColors.fire,
    contrastText: presetColors.white,
  },
  warning: {
    main: presetColors.bolt,
  },
  info: {
    main: presetColors.storm[100],
    contrastText: presetColors.white,
  },
  success: {
    main: presetColors.green,
    contrastText: presetColors.white,
  },
  action: {
    hover: presetColors.sky,
    selected: 'rgba(0, 0, 0, 0.88)',
    selectedOpacity: 0.88,
    disabled: presetColors.storm[50],
    disabledBackground: presetColors.storm[30],
  },
};

const darkPalette = {
  primary: {
    main: presetColors.fire,
    contrastText: presetColors.ash,
  },
  secondary: {
    main: presetColors.ash,
    contrastText: presetColors.new[100],
  },
  accent: {
    main: presetColors.new[80],
    contrastText: presetColors.storm[50],
  },
  background: {
    paper: presetColors.storm[90],
    default: presetColors.new[100],
  },
  text: {
    primary: presetColors.ash,
    secondary: presetColors.storm[30],
  },
  error: {
    main: presetColors.fire,
    contrastText: presetColors.white,
  },
  warning: {
    main: presetColors.darkBolt,
  },
  info: {
    main: presetColors.new[100],
    contrastText: presetColors.white,
  },
  success: {
    main: presetColors.darkGreen,
    contrastText: presetColors.white,
  },
  action: {
    hover: presetColors.new[80],
    selected: 'rgba(0, 0, 0, 0.88)',
    selectedOpacity: 0.88,
    disabled: presetColors.storm[70],
    disabledBackground: presetColors.new[80],
  },
};

const Palette = (mode: PaletteMode) => {
  const paletteTheme = createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
  });

  return paletteTheme.palette;
};

export default Palette;
