import React, { FC, useMemo } from 'react';
import { CssBaseline, ThemeProvider, PaletteMode } from '@mui/material';

import { lightTheme, darkTheme } from '@/themes';
import ColorModeContext from '@/themes/ColorModeContext';

interface ThemeCustomizationProps {
  children: React.ReactNode;
}

const ThemeCustomization: FC<ThemeCustomizationProps> = ({ children }) => {
  const [mode, setMode] = React.useState<PaletteMode>(
    (localStorage.getItem('color-mode') as PaletteMode) ?? 'light'
  );

  const colorMode = useMemo(
    () => ({
      colorMode: mode,
      toggleColorMode: (value?: PaletteMode) => {
        setMode((prevMode) =>
          value ? value : prevMode === 'light' ? 'dark' : 'light'
        );
        localStorage.setItem(
          'color-mode',
          value ? value : mode === 'light' ? 'dark' : 'light'
        );
      },
    }),
    [mode]
  );

  const theme = useMemo(() => {
    return mode === 'light' ? lightTheme : darkTheme;
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeCustomization;
