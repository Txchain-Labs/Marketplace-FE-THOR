import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import { Theme, CSSObject } from '@mui/material/styles';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  SvgIconProps,
  Typography,
} from '@mui/material';
import { InfoOutlined, DescriptionOutlined } from '@mui/icons-material';

import { DRAWER_WIDTH } from '@/utils/constants';
import { NextLinkComposed } from '@/components/common/Link';
import { Logo } from '@/components/icons/Logo';
import Discord from '@/components/icons/Discord';
import Twitter from '@/components/icons/Twitter';
import Medium from '@/components/icons/Medium';
import {
  Explore,
  MyNFTs,
  Gameloop,
  BuyAssets,
  Manager,
  Dashboard,
} from './icons';

interface MenuItem {
  key: string;
  label?: string;
  icon?: React.FC<SvgIconProps>;
  url?: string;
  divider?: boolean;
  gap?: boolean;
  render?: ({
    isExpanded,
    toggleSidebar,
  }: {
    isExpanded: boolean;
    toggleSidebar: () => void;
  }) => React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    key: 'Explore',
    label: 'Explore',
    icon: Explore,
    url: '/explore',
  },
  {
    key: 'My NFTs',
    label: 'My NFTs',
    icon: MyNFTs,
    url: '/my-nfts',
  },
  {
    key: 'Divider 1',
    divider: true,
  },
  {
    key: 'GAMELOOP',
    label: 'GAMELOOP',
    icon: Gameloop,
    url: '/gameloop',
  },
  {
    key: 'Buy Assets',
    label: 'Buy Assets',
    icon: BuyAssets,
    url: '/buyassets',
  },
  {
    key: 'Manager',
    label: 'Manager',
    icon: Manager,
    url: '/manager',
  },
  {
    key: 'gap 1',
    gap: true,
  },
  {
    key: 'Dashboard',
    label: 'Dashboard',
    icon: Dashboard,
    url: '/dashboard',
  },
  {
    key: 'Divider 2',
    divider: true,
  },
  {
    key: 'Links',
    render: ({ isExpanded, toggleSidebar }) => (
      <Stack
        width={'100%'}
        direction={'row'}
        justifyContent={'space-between'}
        visibility={isExpanded ? 'visible' : 'hidden'}
        p={'8px'}
      >
        <Stack direction={'row'}>
          <Link href={'/about'} target={'_blank'}>
            <IconButton onClick={toggleSidebar}>
              <InfoOutlined color={'primary'} />
            </IconButton>
          </Link>
          <Link
            href={'https://docs.capsule.gg/resources/terms-of-service'}
            target={'_blank'}
          >
            <IconButton onClick={toggleSidebar}>
              <DescriptionOutlined color={'primary'} />
            </IconButton>
          </Link>
        </Stack>
        <Stack direction={'row'}>
          <Link href={'https://discord.gg/ThorFi'} target={'_blank'}>
            <IconButton onClick={toggleSidebar}>
              <Discord />
            </IconButton>
          </Link>
          <Link href={'https://twitter.com/CapsulePresents'} target={'_blank'}>
            <IconButton onClick={toggleSidebar}>
              <Twitter />
            </IconButton>
          </Link>
          <Link href={'https://medium.thorfi.io/'} target={'_blank'}>
            <IconButton onClick={toggleSidebar}>
              <Medium />
            </IconButton>
          </Link>
        </Stack>
      </Stack>
    ),
  },
];

interface SidebarProps {
  isExpanded: boolean;
  isSidebarHidden: boolean;

  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  isExpanded,
  isSidebarHidden,
  setIsExpanded,
  setIsSidebarHidden,
}) => {
  const router = useRouter();

  const currentPath = useMemo(() => router.asPath, [router]);
  const drawerWidth = isExpanded
    ? isMobile
      ? '100%'
      : DRAWER_WIDTH.expanded
    : DRAWER_WIDTH.collapsed;

  const openedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  });

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarHidden(!isSidebarHidden);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const renderMenuItem = (menuItem: MenuItem) => {
    if (menuItem.divider) {
      return (
        <Divider
          key={menuItem.key}
          sx={{
            visibility: isExpanded ? 'visible' : 'hidden',
            mx: '16px',
          }}
        />
      );
    }

    if (menuItem.gap) {
      return <Box key={menuItem.key} flexGrow={1} />;
    }

    if (menuItem.render) {
      return (
        <ListItem key={menuItem.key} disablePadding>
          {menuItem.render({ isExpanded, toggleSidebar })}
        </ListItem>
      );
    }

    const isSelected = currentPath.startsWith(menuItem.url);

    return (
      <ListItem key={menuItem.key} disablePadding>
        <ListItemButton
          sx={{
            'p': '16px 26.5px',
            'justifyContent': isExpanded ? 'initial' : 'center',
            '&.Mui-selected': {
              color: 'primary.contrastText',
              clipPath:
                'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%, 0% calc(100% - 18px), 0 0)',
            },
          }}
          selected={isSelected}
          to={{
            pathname: menuItem.url,
          }}
          component={NextLinkComposed}
          onClick={toggleSidebar}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            {<menuItem.icon />}
          </ListItemIcon>
          <ListItemText
            sx={{ ml: '12px', display: isExpanded ? undefined : 'none' }}
          >
            <Typography variant={'lbl-md'}>{menuItem.label}</Typography>
          </ListItemText>
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box
      position={'absolute'}
      zIndex={100}
      display={isSidebarHidden ? 'none' : undefined}
    >
      <Drawer
        variant={'permanent'}
        anchor={'left'}
        sx={(theme) => ({
          'flexShrink': 0,
          'boxSizing': 'border-box',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            p: '12px 5px 16px',
            borderRight: '1px solid',
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            ...(isExpanded ? openedMixin(theme) : closedMixin(theme)),
          },
        })}
        onMouseEnter={() => {
          setIsExpanded(true);
        }}
        onMouseLeave={() => {
          setIsExpanded(false);
        }}
      >
        <Stack width={'100%'} height={'100%'}>
          <List
            disablePadding
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <ListItem disablePadding>
              <ListItemButton
                disableRipple
                sx={{
                  'p': '16px 22.5px',
                  'justifyContent': isExpanded ? 'initial' : 'center',
                  '&:hover': {
                    backgroundColor: 'unset!important',
                  },
                }}
                onClick={toggleSidebar}
              >
                <ListItemIcon
                  sx={{ color: 'inherit', width: '32px', height: '24px' }}
                >
                  <Logo
                    viewBox={'0 0 32 24'}
                    sx={{ width: '32px', height: '24px' }}
                  />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <Box sx={{ height: '57px' }} />
            </ListItem>
            {menuItems.map(renderMenuItem)}
          </List>
        </Stack>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
