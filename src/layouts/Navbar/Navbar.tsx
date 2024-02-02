import React, { FC } from 'react';
import { useConnect, useSwitchNetwork } from 'wagmi';
import { watchNetwork } from '@wagmi/core';
import { Stack, Button } from '@mui/material';
// import Brightness4Icon from '@mui/icons-material/Brightness4';
// import Brightness7Icon from '@mui/icons-material/Brightness7';

import {
  DEFAULT_CHAIN_ID,
  NAVBAR_HEIGHT,
  DRAWER_WIDTH,
} from '@/utils/constants';

// import ColorModeContext from '@/themes/ColorModeContext';

import { Logo } from '@/components/icons/Logo';
import BalanceDisplay from './BalanceDisplay';
import UserMenu from './UserMenu';
import SearchMenu from './SearchMenu';

interface NavbarProps {
  expandSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  hideSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChatIconHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: FC<NavbarProps> = ({
  expandSidebar,
  hideSidebar,
  setIsChatIconHidden,
}) => {
  // const theme = useTheme();
  // const colorMode = React.useContext(ColorModeContext);

  const { switchNetwork } = useSwitchNetwork();

  watchNetwork(() => {
    switchNetwork?.(DEFAULT_CHAIN_ID);
  });

  useConnect({
    onSuccess() {
      switchNetwork?.(DEFAULT_CHAIN_ID);
    },
  });

  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      sx={(theme) => ({
        width: {
          miniMobile: '100vw',
          sm: `calc(100vw - ${DRAWER_WIDTH.collapsed}px)`,
        },
        height: NAVBAR_HEIGHT,
        px: { miniMobile: '16px', sm: '48px' },
        background: theme.palette.background.paper,
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
        position: 'fixed',
        zIndex: 3,
      })}
    >
      <Button
        disableRipple
        sx={{
          display: { miniMobile: 'flex', sm: 'none' },
          minWidth: 0,
          p: 0,
          color: 'inherit',
        }}
        onClick={() => {
          hideSidebar(false);
          setTimeout(() => {
            expandSidebar(true);
          });
        }}
      >
        <Logo viewBox={'0 0 32 24'} sx={{ width: '32px', height: '32px' }} />
      </Button>

      <BalanceDisplay />

      <SearchMenu />

      {/*<IconButton*/}
      {/*  onClick={colorMode.toggleColorMode}*/}
      {/*  color={'inherit'}*/}
      {/*  sx={{ mr: 1 }}*/}
      {/*>*/}
      {/*  {theme.palette.mode === 'dark' ? (*/}
      {/*    <Brightness7Icon />*/}
      {/*  ) : (*/}
      {/*    <Brightness4Icon />*/}
      {/*  )}*/}
      {/*</IconButton>*/}

      <UserMenu setIsChatIconHidden={setIsChatIconHidden} />
    </Stack>
  );
};

export default Navbar;
