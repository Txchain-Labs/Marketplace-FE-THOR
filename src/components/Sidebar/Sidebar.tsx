import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Link from 'next/link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { Button, ListItemIcon, Stack, Typography } from '@mui/material';
import { list } from './style';
import { CustomMenu } from '../menu';
import MainMenu from '../menu/MainMenu';
import styles from './style.module.css';
import { setactiveCat } from '../../redux/slices/uiGolobalSlice';
import { useDispatch, useSelector } from 'react-redux';
import Lotties from 'react-lottie';
import animationData from '../../lotties/CircleAnimation.json';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import AlertModal from '../modals/AlertModal';
// import { useAccount } from 'wagmi';
// const user = useSelector((state: any) => state?.auth?.user);
import markerSDK from '@marker.io/browser';
import { useRouter } from 'next/router';
import { useSetAttribute } from '../../hooks/uiHooks';

export const drawerWidth = 96;
export const MARKER_IO_PROJECT_ID = '63b6fab3c4b2b2d7bbc6521e';

const Sidebar = () => {
  const { activeCat } = useSelector((state: any) => state.uiGolobal);
  const [, setActiveColor] = useState<boolean>(false);
  const [activeColormenue, setActiveColormenu] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const open1 = Boolean(anchorEl1);

  // const { address } = useAccount();
  const [openAlert, setOpenAlert] = useState(false);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setActiveColor(true);
    if (openArt) {
      dispatch(setactiveCat('art'));
    } else if (openNode) {
      dispatch(setactiveCat('node'));
    }
  };

  // event: React.MouseEvent<HTMLElement>
  const handleOpenMainMenu = () => {
    // setAnchorEl1(event.currentTarget);
    setActiveColormenu(true);
  };

  const handleCloseMainMenu = () => {
    setAnchorEl1(null);
    setActiveColormenu(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveColor(false);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const btn = {
    'width': '40%',
    'height': '30px',
    'boxShadow': 'inset rgba(0, 0, 0, 0.25) 0px -3px 0px',
    '&:hover': {
      'clipPath':
        'polygon(0 0, 92.5% 0, 100% 30%, 100% 100%, 7.5% 100%, 0% 70%, 0 0)',
      'transition': ' clip-path 1s',
      'zIndex': 10001,
      '&$btnWrapper': {
        opacity: 1,
      },
    },
    '&:active': {
      boxShadow: 'inset rgba(0, 0, 0, 0.25) 0px 5px 0px',
    },
  };
  const [lottieOpen, setLottieopen] = useState(false);

  const [anchorElArt, setAnchorElArt] = React.useState<HTMLElement | null>(
    null
  );
  const [anchorElNode, setAnchorElNode] = React.useState<HTMLElement | null>(
    null
  );
  const [anchorElAnalytics, setAnchorElAnalytics] =
    React.useState<HTMLElement | null>(null);
  const [anchorElTOS, setAnchorElTOS] = React.useState<HTMLElement | null>(
    null
  );

  const handlePopoverOpenNode = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNode(event.currentTarget);
  };
  const handlePopoverOpenArt = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElArt(event.currentTarget);
  };

  const handlePopoverOpenAnalytics = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAnalytics(event.currentTarget);
  };

  const handlePopoverOpenTOS = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTOS(event.currentTarget);
  };

  const handlePopoverCloseNode = () => {
    setAnchorElNode(null);
  };

  const handlePopoverCloseArt = () => {
    setAnchorElArt(null);
  };

  const handlePopoverCloseAnalytics = () => {
    setAnchorElAnalytics(null);
  };

  const handlePopoverCloseTOS = () => {
    setAnchorElTOS(null);
  };

  const openArt = Boolean(anchorElArt);

  const openNode = Boolean(anchorElNode);

  const openAnalytics = Boolean(anchorElAnalytics);

  const openTOS = Boolean(anchorElTOS);

  const [newUser, setNewUser] = useState(false);
  const router = useRouter();
  const [analyticsActive, setAnalyticsActive] = useState(
    router?.pathname === '/dashboard' ? true : false
  );
  useEffect(() => {
    // if (
    //   localStorage.getItem('isVisited') &&
    //   localStorage.getItem('isVisited') === 'yes'
    // ) {
    //   setNewUser(false);
    // }

    // const widget = await
    markerSDK.loadWidget({
      project: MARKER_IO_PROJECT_ID, //project: process.env.MARKER_IO_PROJECT_ID,
    });
  }, []);

  useEffect(() => {
    if (router?.pathname === '/dashboard') {
      setAnalyticsActive(true);
    } else {
      setAnalyticsActive(false);
    }
  }, [router, setAnalyticsActive]);
  const nodesMenuItemRef = useSetAttribute([
    { key: 'id', value: 'nodes-menu-item' },
    { key: 'dusk', value: 'nodes-menu-item' },
  ]);

  return (
    <>
      <Box className={styles.sidebar}>
        <CssBaseline />
        <Drawer
          sx={{
            'width': drawerWidth,
            'flexShrink': 0,
            'borderRight': '1px solid rgba(0, 0, 0, 0.2)',
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              overflowX: 'hidden',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Stack
            direction="column"
            spacing={2}
            height="97%"
            justifyContent="space-between"
            alignItems="center"
          >
            <List sx={{ height: '100%' }}>
              <ListItem disablePadding sx={list}>
                <Link href="/" prefetch={false}>
                  <ListItemButton
                    onMouseEnter={handleOpenMainMenu}
                    onMouseLeave={handleCloseMainMenu}
                    sx={{
                      'height': 60,
                      '&:hover': { background: 'transparent' },
                      'padding': '0px',
                    }}
                  >
                    <ListItemIcon
                      className={
                        activeColormenue ? styles.active : styles.inactive
                      }
                    >
                      <img src={'/images/mainMenue.svg'} alt="Logo" />
                    </ListItemIcon>
                  </ListItemButton>
                </Link>

                {/* <ListItemButton
                  onClick={handleOpenMenu}
                  sx={{
                    'height': 60,
                    '&:hover': { background: 'transparent' },
                  }}
                >
                  <ListItemIcon>
                    <img
                      width="80%"
                      style={{ objectFit: 'contain' }}
                      src={
                        activeColor
                          ? '/images/plusRed.svg'
                          : '/images/plus-icon.svg'
                      }
                      alt=""
                    />
                  </ListItemIcon>
                </ListItemButton> */}

                <Box sx={{ position: 'relative', marginTop: 2 }}>
                  <PopupState variant="popover" popupId="demo-popup-popover">
                    {(popupState) => (
                      <div>
                        {newUser && (
                          <Button
                            sx={{
                              position: 'fixed',
                              marginLeft: 5.4,
                              marginTop: 3,
                            }}
                            {...bindTrigger(popupState)}
                          >
                            <Lotties
                              options={defaultOptions}
                              height={52}
                              width={52}
                            />
                          </Button>
                        )}

                        {lottieOpen && (
                          <Popover
                            sx={{
                              '& .MuiPaper-root': {
                                minWidth: '0px !important',
                              },
                              'zIndex': 101020,
                              'background': 'rgba(52, 52, 52, 0.4)',
                            }}
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                          >
                            <Box
                              sx={{
                                marginTop: -7.7,
                                left: 0,
                                opacity: 1,

                                position: 'fixed',
                              }}
                            >
                              <Box sx={{ display: 'flex' }}>
                                <Box sx={{ mt: 5 }}>
                                  <img
                                    style={{
                                      width: '90px',
                                      height: '103px',
                                    }}
                                    src="/images/nodeAndArt.svg"
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    background: 'white',
                                    height: 3,
                                    width: 48,
                                    mt: 11,
                                    ml: -2,
                                    mr: 2,
                                    alignItems: 'center',
                                  }}
                                ></Box>
                                <Box sx={{ ml: 1 }}>
                                  <Typography
                                    variant="h2"
                                    sx={{ color: 'white', my: 2 }}
                                  >
                                    Switch{' '}
                                  </Typography>
                                  <Typography
                                    variant="h2"
                                    sx={{ color: 'white' }}
                                  >
                                    {' '}
                                    NFT Art &
                                  </Typography>
                                  <Typography
                                    variant="h2"
                                    sx={{ color: 'white', mt: 2 }}
                                  >
                                    Nodes
                                  </Typography>
                                  <Button
                                    onClick={() => {
                                      setLottieopen(!lottieOpen);
                                      localStorage.setItem('isVisited', 'yes');
                                      setNewUser(false);
                                    }}
                                    variant="nft_common"
                                    sx={btn}
                                  >
                                    Got it
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          </Popover>
                        )}
                      </div>
                    )}
                  </PopupState>

                  <ListItemButton
                    aria-owns={openArt ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpenArt}
                    onMouseLeave={handlePopoverCloseArt}
                    onClick={handleOpenMenu}
                    sx={{}}
                  >
                    <ListItemIcon>
                      <img
                        width="80%"
                        style={{ objectFit: 'contain' }}
                        src={
                          activeCat === 'art'
                            ? '/images/node-iconRed.svg'
                            : '/images/node-icon.svg'
                        }
                      />

                      <Popover
                        id="mouse-over-popover"
                        sx={{
                          '& .css-vmxrq5-MuiPaper-root-MuiPopover-paper': {
                            background:
                              activeCat === 'art' ? '#F3523F' : 'black',
                          },

                          'marginLeft': -1,
                          'marginTop': -5,
                          'pointerEvents': 'none',
                          'zIndex': 100012,
                        }}
                        open={openArt}
                        anchorEl={anchorElArt}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        onClose={handlePopoverCloseArt}
                        disableRestoreFocus
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            background:
                              activeCat === 'art' ? '#F3523F' : 'black',
                            paddingX: 3,
                            paddingY: 1,
                            alignItems: 'center',
                          }}
                        >
                          <img
                            width="25%"
                            style={{ objectFit: 'contain' }}
                            src="/images/node-iconWhite.svg"
                          />
                          <Typography
                            variant="p-lg"
                            sx={{
                              paddingX: 1,
                              paddingTop: 0.8,
                              color: 'white',
                            }}
                          >
                            Artwork
                          </Typography>
                        </Box>
                      </Popover>
                    </ListItemIcon>
                  </ListItemButton>

                  <ListItemButton
                    aria-owns={openNode ? 'mouse-over-popover' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpenNode}
                    onMouseLeave={handlePopoverCloseNode}
                    onClick={handleOpenMenu}
                    sx={{ marginTop: 2, background: 'transparent' }}
                    ref={nodesMenuItemRef}
                  >
                    <ListItemIcon>
                      <img
                        width="80%"
                        style={{ objectFit: 'contain' }}
                        src={
                          activeCat === 'node'
                            ? '/images/artwork-iconRed.svg'
                            : '/images/artwork-icon.svg'
                        }
                      />
                    </ListItemIcon>
                    <Popover
                      id="mouse-over-popover"
                      sx={{
                        '& .css-vmxrq5-MuiPaper-root-MuiPopover-paper': {
                          background:
                            activeCat === 'node' ? '#F3523F' : 'black',
                        },
                        'marginLeft': -1,
                        'marginTop': -5,
                        'pointerEvents': 'none',

                        'zIndex': 100012,
                      }}
                      open={openNode}
                      anchorEl={anchorElNode}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      onClose={handlePopoverCloseNode}
                      disableRestoreFocus
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          background:
                            activeCat === 'node' ? '#F3523F' : 'black',
                          paddingX: 3,
                          paddingY: 1,
                          alignItems: 'center',
                        }}
                      >
                        <img
                          width="25%"
                          style={{ objectFit: 'contain', padding: 1 }}
                          src={'/images/artwork-iconWhite.svg'}
                        />
                        <Typography
                          variant="p-lg"
                          sx={{ paddingX: 1, paddingTop: 0.8, color: 'white' }}
                        >
                          Nodes
                        </Typography>
                      </Box>
                    </Popover>
                  </ListItemButton>
                </Box>
              </ListItem>
            </List>
            <Link href="/dashboard" passHref>
              <a href="test">
                <ListItemButton
                  aria-owns={openAnalytics ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpenAnalytics}
                  onMouseLeave={handlePopoverCloseAnalytics}
                  sx={{ marginTop: 2, background: 'transparent' }}
                >
                  <ListItemIcon>
                    <img
                      width="80%"
                      style={{ objectFit: 'contain' }}
                      src={
                        analyticsActive
                          ? '/images/dashboard-iconActive.svg'
                          : '/images/dashboard-iconBlack.svg'
                      }
                    />
                  </ListItemIcon>
                  <Popover
                    id="mouse-over-popover"
                    sx={{
                      '& .css-vmxrq5-MuiPaper-root-MuiPopover-paper': {
                        background: analyticsActive ? '#F3523F' : 'black',
                      },
                      'marginLeft': -1,
                      'marginTop': -4,
                      'pointerEvents': 'none',

                      'zIndex': 100012,
                    }}
                    open={openAnalytics}
                    anchorEl={anchorElAnalytics}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    onClose={handlePopoverCloseAnalytics}
                    disableRestoreFocus
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        background: analyticsActive ? '#F3523F' : 'black',
                        paddingX: 3,
                        paddingY: 1,
                        alignItems: 'center',
                      }}
                    >
                      <img
                        width="25%"
                        style={{ objectFit: 'contain', padding: 1 }}
                        src={'/images/dashboard-iconWhite.svg'}
                      />
                      <Typography
                        variant="p-lg"
                        sx={{ paddingX: 1, paddingTop: 0.2, color: 'white' }}
                      >
                        Analytics
                      </Typography>
                    </Box>
                  </Popover>
                </ListItemButton>
              </a>
            </Link>
            <Link
              href="https://docs.capsule.gg/resources/terms-of-service"
              passHref
            >
              <a href="test" target="_blank">
                <ListItemButton
                  aria-owns={openTOS ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpenTOS}
                  onMouseLeave={handlePopoverCloseTOS}
                  sx={{ marginTop: 2, background: 'transparent' }}
                >
                  <ListItemIcon>
                    <img
                      width="80%"
                      style={{ objectFit: 'contain' }}
                      src="/images/chart.png"
                    />
                  </ListItemIcon>
                  <Popover
                    id="mouse-over-popover"
                    sx={{
                      '& .css-vmxrq5-MuiPaper-root-MuiPopover-paper': {
                        background: 'black',
                      },
                      'marginLeft': -1,
                      'marginTop': -1,
                      'pointerEvents': 'none',

                      'zIndex': 100012,
                    }}
                    open={openTOS}
                    anchorEl={anchorElTOS}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    onClose={handlePopoverCloseTOS}
                    disableRestoreFocus
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        background: 'black',
                        paddingX: 3,
                        paddingY: 1,
                        alignItems: 'center',
                      }}
                    >
                      <img
                        width="12%"
                        style={{ objectFit: 'contain', padding: 1 }}
                        src={'/images/chart-white.png'}
                      />
                      <Typography
                        variant="p-lg"
                        sx={{
                          paddingX: 1,
                          paddingTop: 0.3,
                          color: 'white',
                          fontFamily: 'Nexa-Bold',
                        }}
                      >
                        Terms of Service
                      </Typography>
                    </Box>
                  </Popover>
                </ListItemButton>
              </a>
            </Link>
          </Stack>
        </Drawer>
        <CustomMenu
          anchorEl={anchorEl}
          open={open}
          handleClose={handleClose}
          setAnchorEl={setAnchorEl}
          setActiveColor={setActiveColor}
        />
        <MainMenu
          anchorEl={anchorEl1}
          open={open1}
          handleClose={handleCloseMainMenu}
          setAnchorEl1={setAnchorEl1}
          setActiveColor={setActiveColormenu}
        />
      </Box>

      <AlertModal
        onClose={() => {
          setOpenAlert(false);
        }}
        open={openAlert}
      />
    </>
  );
};

export default Sidebar;
