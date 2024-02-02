import React from 'react';
import { PaletteMode } from '@mui/material';

const ColorModeContext = React.createContext<{
  colorMode: PaletteMode;
  toggleColorMode: (value?: PaletteMode) => void;
}>(null);

export default ColorModeContext;
