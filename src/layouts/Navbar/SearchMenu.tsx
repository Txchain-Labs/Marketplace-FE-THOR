import React, { FC, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
  Stack,
  Box,
  IconButton,
  Paper,
  Popover,
  useMediaQuery,
  ThemeProvider,
  useTheme,
} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import SearchSharp from '@mui/icons-material/SearchSharp';

import { DRAWER_WIDTH, NAVBAR_HEIGHT } from '@/utils/constants';
import { useChain } from '@/utils/web3Utils';

import SearchField from '@/components/common/SearchField';
import SearchContent from 'src/layouts/SearchContent';
import { fetchRecentSearches } from '@/hooks/useRecentSearches';
import { useAccentTheme } from '@/themes';

const SearchMenu: FC = () => {
  const theme = useTheme();
  const matchMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const chain = useChain();

  const searchFieldTheme = useAccentTheme(theme);

  const queryClient = useQueryClient();

  const user = useSelector((state: any) => state?.auth.user);

  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const open = Boolean(anchorEl);

  const handleSearchTextChange = (e: React.ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setSearchText(value ?? '');
  };

  const handleSearchTextClear = () => {
    setSearchText('');
  };

  const handleSearchClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

    setTimeout(() => {
      searchInputRef.current && searchInputRef.current.focus();
    });
  };

  const handleSearchClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    (async () => {
      await queryClient.prefetchInfiniteQuery({
        queryKey: ['recentSearches', chain?.id, user?.id],
        queryFn: fetchRecentSearches(chain?.id, user?.id),
      });
    })();
  }, [queryClient, chain, user]);

  return (
    <Stack
      flexGrow={1}
      direction={'row'}
      justifyContent={{ miniMobile: 'flex-end', md: 'space-around' }}
    >
      <IconButton
        color={'inherit'}
        sx={{
          display: { miniMobile: 'flex', md: 'none' },
          p: '6px',
          mr: '16px',
        }}
        onClick={handleSearchClick}
      >
        <SearchSharp />
      </IconButton>

      <Box sx={{ display: { miniMobile: 'none', md: 'block' } }}>
        <ThemeProvider theme={searchFieldTheme}>
          <SearchField
            value={searchText}
            onClick={handleSearchClick}
            onChange={handleSearchTextChange}
            onClear={handleSearchTextClear}
            width={{ md: '360px', lg: '415px' }}
            readOnly
            disableFocus
          />
        </ThemeProvider>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleSearchClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        anchorReference={matchMdDown ? 'none' : 'anchorEl'}
        PaperProps={{
          sx: {
            mt: {
              miniMobile: NAVBAR_HEIGHT.miniMobile,
              sm: NAVBAR_HEIGHT.sm,
              md: 0,
            },
            ml: {
              sm: `${DRAWER_WIDTH.collapsed}px`,
              md: 0,
            },
            maxWidth: 'none',
            maxHeight: 'unset',
            background: { md: 'transparent' },
          },
          square: true,
        }}
        elevation={0}
        marginThreshold={0}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
        TransitionComponent={Collapse}
      >
        <Box
          sx={{
            width: {
              miniMobile: '100vw',
              sm: `calc(100vw - ${DRAWER_WIDTH.collapsed}px)`,
              md: '360px',
              lg: '415px',
            },
          }}
        >
          <Box
            sx={{
              p: { miniMobile: '16px 16px 0', md: 0 },
              mb: '6px',
            }}
          >
            <ThemeProvider theme={searchFieldTheme}>
              <SearchField
                ref={searchInputRef}
                value={searchText}
                onChange={handleSearchTextChange}
                onClear={handleSearchTextClear}
                onBack={handleSearchClose}
                showBackButton={matchMdDown}
                fullWidth
              />
            </ThemeProvider>
          </Box>
          <Paper
            elevation={matchMdDown ? 0 : 1}
            square
            sx={{
              m: { miniMobile: 0, md: '2px' },
              maxHeight: {
                miniMobile: `unset`,
                md: `calc(100vh - ${NAVBAR_HEIGHT.sm} - 16px)`,
              },
              height: {
                miniMobile: `calc(100vh - ${NAVBAR_HEIGHT.miniMobile} - 66px)`,
                sm: `calc(100vh - ${NAVBAR_HEIGHT.sm} - 66px)`,
                md: 'unset',
              },
              overflow: 'auto',
            }}
          >
            <SearchContent
              searchText={searchText}
              onClose={handleSearchClose}
            />
          </Paper>
        </Box>
      </Popover>
    </Stack>
  );
};

export default SearchMenu;
