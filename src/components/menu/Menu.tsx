import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import CollectionModal from '../modals/CreationCollection';
import NFTModal from '../modals/CreationNFT';
import { palette } from '../../theme/palette';
import { makeStyles } from '@mui/styles';
import { useSelector } from '../../redux/store';
import Link from 'next/link';
import { useGlobalModalContext } from '../modals/GlobleModal';

const menueStyle = {
  paddingBottom: '5px',
  paddingRight: '30px',
  height: 'auto',
  clipPath: 'polygon(0 0, 85% 0, 100% 25%, 100% 100%, 18% 100%, 0 85%)',
  marginLeft: 85,
  background: ' rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.24)',
  transform: 'matrix(1, 0, 0, 1, 0, 0)',
  border: '3px solid rgba(245, 245, 245)',
};
const useStyles = makeStyles({
  root: {
    zIndex: '10003 !important',
  },
});
const menueHover = {
  'display': 'flex',
  'alignItems': 'center',
  'mt': 2,
  '&:hover': {
    '& div': {
      background: palette.primary.fire,
    },
    '& li': {
      color: '#00000',
      opacity: 1,
      background: 'transparent',
    },
  },
};
const menuItem = {
  pl: 4,

  fontSize: '22px',
  opacity: 0.5,
  color: palette.primary.storm,
  fontWeight: '400',
  lineHeight: '33px',
};
const Menue = (props: any) => {
  const { open, anchorEl, handleClose, setAnchorEl, setActiveColor } = props;
  const classes = useStyles();
  const [openCollection, setOpenCollection] = React.useState(false);
  const [openNFT, setOpenNFT] = React.useState(false);
  const [view, setView] = React.useState<number>(0);
  const menuBox = {
    width: '8px',
    height: '24px',
    background: view === 1 ? palette.primary.fire : 'transparent',
  };
  // const menuBox2 = {
  //   width: '8px',
  //   height: '24px',
  //   background: view === 2 ? palette.primary.fire : 'transparent',
  // };

  const { hideModal } = useGlobalModalContext(); // Loading button state

  const handleProfile = (value: number) => {
    if (value === 1) {
      //   setView(1);
      setAnchorEl(null);
      setActiveColor(false);
    } else if (value === 2) {
      //   setView(2);
      setAnchorEl(null);
      setActiveColor(false);
    } else if (value === 3) {
      //   setView(3);
      setAnchorEl(null);
      setActiveColor(false);
    } else {
      setView(0);
    }

    ///// if connect-wallet modal is already open, should be closed since user is moving to different page
    //console.log('here'); ///// don't reach out to here

    if (hideModal) hideModal();
  };
  const uiState = useSelector((state: any) => state.uiGolobal);
  const active = uiState.activeCat;

  return (
    <>
      {active === 'node' && (
        <Menu
          elevation={0}
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          classes={{
            root: classes.root,
          }}
          PaperProps={{
            style: menueStyle,
          }}
        >
          <Box sx={menueHover} onClick={() => handleProfile(1)}>
            <Box sx={menuBox} />
            <MenuItem disabled={false} sx={menuItem}>
              <Link href="/thorfi/nodes" legacyBehavior>
                <a href={'/thorfi/nodes'} id="nodes-a-href-link">
                  Nodes
                </a>
              </Link>
            </MenuItem>
          </Box>

          <Box sx={menueHover} onClick={() => handleProfile(1)}>
            <Box sx={menuBox} />
            <MenuItem disabled={false} sx={menuItem}>
              <Link href="/profile#node"> List Origin Node</Link>
            </MenuItem>
          </Box>

          {/* <Box sx={menueHover}>
            <Box sx={menuBox} />
            <MenuItem disabled={true} sx={menuItem}>
              Transform Nodes{' '}
            </MenuItem>
            <span
              style={{
                background: '#F3523F',
                color: 'white',
                fontSize: '10px',

                paddingTop: '6px',
                paddingBottom: '3px',
                paddingLeft: '8px',
                paddingRight: '8px',
                fontWeight: 'bolder',
              }}
            >
              COMING SOON
            </span>
          </Box> */}

          {/* <Box sx={menueHover}>
            <Box sx={menuBox} />
            <MenuItem disabled={true} sx={menuItem}>
              Gameloop{' '}
            </MenuItem>
            <span
              style={{
                background: '#F3523F',
                color: 'white',
                fontSize: '10px',

                paddingTop: '6px',
                paddingBottom: '3px',
                paddingLeft: '8px',
                paddingRight: '8px',
                fontWeight: 'bolder',
              }}
            >
              COMING SOON
            </span>
          </Box> */}
        </Menu>
      )}
      {active === 'art' && (
        <Menu
          elevation={0}
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          classes={{
            root: classes.root,
          }}
          PaperProps={{
            style: menueStyle,
          }}
        >
          <Box sx={menueHover} onClick={() => handleProfile(1)}>
            <Box sx={menuBox} />
            <MenuItem disabled={false} sx={menuItem}>
              <Link href="/explore">Explore</Link>
            </MenuItem>
          </Box>

          <Box sx={menueHover} onClick={() => handleProfile(2)}>
            <Box sx={menuBox} />
            <MenuItem disabled={false} sx={menuItem}>
              <Link href="/collections">Collections</Link>
            </MenuItem>
          </Box>

          {/* <Box sx={menueHover} onClick={() => handleProfile(1)}>
            <Box sx={menuBox} />
            <MenuItem sx={menuItem}>Collection</MenuItem>
          </Box>
          <Box sx={menueHover} onClick={() => handleProfile(2)}>
            <Box sx={menuBox} />
            <MenuItem sx={menuItem}>Explore</MenuItem>
          </Box> */}

          {/* <Box sx={menueHover}>
            <Box sx={menuBox2} />
            <MenuItem sx={menuItem}>Banner</MenuItem>
          </Box>
          <Box sx={menueHover} onClick={() => handleProfile(3)}>
            <Box sx={menuBox2} />
            <MenuItem sx={menuItem}>Transform Node</MenuItem>
          </Box> */}

          {/* <Box sx={{ p: 3, textAlign: 'center' }}>
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
          </Box> */}
        </Menu>
      )}
      <CollectionModal
        onClose={() => {
          setOpenCollection(false);
        }}
        open={openCollection}
      />
      <NFTModal
        onClose={() => {
          setOpenNFT(false);
        }}
        open={openNFT}
      />
    </>
  );
};
export default Menue;
