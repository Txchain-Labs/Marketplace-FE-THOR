import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box, Typography, Button, MenuItem, Container } from '@mui/material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import 'react-alice-carousel/lib/alice-carousel.css';
import Link from 'next/link';
import {
  sidebar_menu_0001,
  sidebar_menu_00013,
  sidebar_menu_00014,
  sidebar_menu_0002,
  sidebar_menu_0003,
  sidebar_menu_0004,
  sidebar_menu_0006,
  sidebar_menu_0007,
} from '../../styles/home';
import { palette } from '../../theme/palette';
import { useSelector } from '../../redux/store';
import { useRouter } from 'next/router';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

const menuItem = {
  pl: 4,
  width: '100%',
  fontSize: '22px',
  opacity: 0.5,
  color: palette.primary.storm,
  fontWeight: '400',
  lineHeight: '33px',
};

export default function FullScreenDialog({ open, onClose }: SimpleDialogProps) {
  const [view, setView] = React.useState<number>(0);
  const handleProfile = (value: number) => {
    if (value === 1) {
      setView(1);
      onClose();
    } else if (value === 2) {
      setView(2);
      onClose();
    } else if (value === 3) {
      setView(3);
      onClose();
    } else if (value === 4) {
      setView(4);
      onClose();
    } else if (value === 5) {
      setView(5);
      onClose();
    } else {
      setView(0);
    }
  };
  const router = useRouter();
  React.useEffect(() => {
    if (router?.pathname === '/dashboard') {
      setView(5);
    }
  }, [router]);

  const uiState = useSelector((state: any) => state.uiGolobal);
  const active = uiState.activeCat;

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        BackdropProps={{
          style: {
            opacity: 0,
          },
        }}
        PaperProps={{
          style: {
            background: 'rgba(255, 255, 255, 0.87)',
          },
        }}
        sx={{
          zIndex: 10006,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{ marginTop: '20px', paddingRight: '54px !important' }}
        >
          <Box
            display="flex"
            sx={{
              flexDirection: 'wrap',
              justifyContent: 'space-between',
              marginBottom: '30px',
            }}
          >
            <Button onClick={onClose} sx={{ marginRight: '-30px' }}>
              <img src={'/images/mainMenueActive.png'} width="45px" alt="" />
            </Button>
            <Button onClick={onClose}>
              <img src="/images/Union.svg" width="25px" />
            </Button>
          </Box>
          <Box>
            <Link href="/" prefetch={false}>
              <Box display={'flex'} onClick={() => handleProfile(1)}>
                <Box sx={sidebar_menu_0004({ view })} />
                <MenuItem sx={sidebar_menu_0001({ view })}>Home</MenuItem>
              </Box>
            </Link>
            {active === 'node' && (
              <>
                <Link href="/thorfi/nodes" prefetch={false}>
                  <Box display={'flex'} onClick={() => handleProfile(2)}>
                    <Box sx={sidebar_menu_0002({ view })} />
                    <MenuItem sx={sidebar_menu_0003({ view })}>Nodes</MenuItem>
                  </Box>
                </Link>
              </>
            )}
            {active === 'art' && (
              <>
                <Link href="/explore" prefetch={false}>
                  <Box display={'flex'} onClick={() => handleProfile(2)}>
                    <Box sx={sidebar_menu_0002({ view })} />
                    <MenuItem sx={sidebar_menu_0003({ view })}>
                      Explore
                    </MenuItem>
                  </Box>
                </Link>
                <Link href="/collections" prefetch={false}>
                  <Box display={'flex'} onClick={() => handleProfile(4)}>
                    <Box sx={sidebar_menu_0007({ view })} />
                    <MenuItem sx={sidebar_menu_0006({ view })}>
                      Collections
                    </MenuItem>
                  </Box>
                </Link>
              </>
            )}
          </Box>
          <Box sx={{ marginLeft: '50px' }}>
            {active === 'node' && (
              <>
                <Box
                  display={'flex'}
                  onClick={() => handleProfile(1)}
                  marginTop={3}
                >
                  <img src={'/images/plusRed.svg'} width="24px" alt="" />
                  <MenuItem disabled={false} sx={menuItem}>
                    <Link href="/profile#node"> List Origin Node</Link>
                  </MenuItem>
                </Box>
                <Box display={'flex'} marginTop={3}>
                  <img src={'/images/plusRed.svg'} width="24px" alt="" />
                  <MenuItem sx={menuItem}>Transform/Burn Nodes</MenuItem>
                </Box>
                <Box display={'flex'} marginTop={3}>
                  <img src={'/images/plusRed.svg'} width="24px" alt="" />
                  <MenuItem sx={menuItem}>Gameloop</MenuItem>
                </Box>
              </>
            )}
            {active === 'art' && (
              <>
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography
                    variant="p-lg"
                    sx={{ color: '#000000', letterSpacing: '2px' }}
                  >
                    Create Collections and NFT{' '}
                  </Typography>
                  <Typography
                    variant="p-lg"
                    sx={{
                      color: palette.primary.fire,
                      letterSpacing: '2px',
                      marginTop: '5px',
                      fontStyle: 'italic',
                    }}
                  >
                    Coming Soon
                  </Typography>
                </Box>
              </>
            )}
          </Box>
          <Box sx={{ marginTop: '20px' }}>
            <Link href="/dashboard" prefetch={false}>
              <Box display={'flex'} onClick={() => handleProfile(5)}>
                <Box sx={sidebar_menu_00013({ view })} />
                <MenuItem sx={sidebar_menu_00014({ view })}>Dashboard</MenuItem>
              </Box>
            </Link>
          </Box>
        </Container>
      </Dialog>
    </div>
  );
}
