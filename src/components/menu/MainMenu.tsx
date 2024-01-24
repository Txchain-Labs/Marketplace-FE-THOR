import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import Link from 'next/link';
import { useSelector } from '../../redux/store';
import {
  sidebar_menueHover,
  sidebar_menueStyle,
  sidebar_menu_0001,
  sidebar_menu_0004,
} from '../../styles/home';
import { makeStyles } from '@mui/styles';
import { useGlobalModalContext } from '../modals/GlobleModal';

const useStyles = makeStyles({
  list: {
    paddingTop: '48px !important',
    paddingBottom: '30px !important',
  },
  root: {
    zIndex: '10003 !important',
  },
});

// const SwitchButton = ({ on, setOn }: any) => {
//   return (
//     <Box
//       display={'flex'}
//       alignItems={'center'}
//       width={40}
//       marginRight={'55px'}
//       flexDirection={on ? 'row' : 'row-reverse'}
//       onClick={(): void => setOn(!on)}
//     >
//       <Box
//         component="span"
//         width={28}
//         height={'1px'}
//         style={{ background: 'black' }}
//       />
//       <Box
//         component="span"
//         width={16}
//         height={16}
//         borderRadius={'50%'}
//         style={
//           on
//             ? { background: palette.primary.fire }
//             : {
//                 background: '#fff',
//                 border: `2px solid ${palette.primary.fire}`,
//               }
//         }
//       />
//     </Box>
//   );
// };

const MainMenu = (props: any) => {
  const { open, anchorEl, handleClose, setAnchorEl1, setActiveColor } = props;
  // const router = useRouter();
  const classes = useStyles();
  // const [detailOn, setDetailOn] = React.useState(false);
  // const [lightOn, setLightOn] = React.useState(true);

  const { hideModal } = useGlobalModalContext(); // Loading button state

  const [view, setView] = React.useState<number>(0);
  const handleProfile = (value: number) => {
    if (value === 1) {
      setView(1);
      setAnchorEl1(null);
      setActiveColor(false);
    } else if (value === 2) {
      setView(2);
      setAnchorEl1(null);
      setActiveColor(false);
    } else if (value === 3) {
      setView(3);
      setAnchorEl1(null);
      setActiveColor(false);
    } else if (value === 4) {
      setView(4);
      setAnchorEl1(null);
      setActiveColor(false);
    } else {
      setView(0);
    }

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
            list: classes.list,
            root: classes.root,
          }}
          PaperProps={{
            style: sidebar_menueStyle,
          }}
        >
          <Link href="/" prefetch={false}>
            <Box sx={sidebar_menueHover} onClick={() => handleProfile(1)}>
              <Box sx={sidebar_menu_0004({ view })} />
              <MenuItem sx={sidebar_menu_0001({ view })}>Home</MenuItem>
            </Box>
          </Link>

          {/* <Link href="/thorfi/nodes" prefetch={false}>
            <Box sx={sidebar_menueHover} onClick={() => handleProfile(2)}>
              <Box sx={sidebar_menu_0002({ view })} />
              <MenuItem sx={sidebar_menu_0003({ view })}>Nodes</MenuItem>
            </Box>
          </Link> */}

          {/* <Link href="/collections" prefetch={false}>
          <Box sx={sidebar_menueHover} onClick={() => handleProfile(4)}>
            <Box sx={sidebar_menu_0007({ view })} />
            <MenuItem sx={sidebar_menu_0006({ view })}>Collections</MenuItem>
          </Box>
        </Link> */}

          {/* <Divider sx={sidebar_menu_0009({ pathname: router.pathname })} /> */}
          {/* <Box sx={sidebar_menueHover} onClick={() => handleProfile}>
          <MenuItem sx={sidebar_menu_0011()}>Details</MenuItem>
          <SwitchButton on={detailOn} setOn={setDetailOn} />
        </Box> */}
          {/* <Box sx={sidebar_menueHover} onClick={() => handleProfile}>
          <MenuItem sx={sidebar_menu_0012()}>Light mode</MenuItem>
          <SwitchButton on={lightOn} setOn={setLightOn} />
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
            list: classes.list,
            root: classes.root,
          }}
          PaperProps={{
            style: sidebar_menueStyle,
          }}
        >
          <Link href="/" prefetch={false}>
            <Box sx={sidebar_menueHover} onClick={() => handleProfile(1)}>
              <Box sx={sidebar_menu_0004({ view })} />
              <MenuItem sx={sidebar_menu_0001({ view })}>Home</MenuItem>
            </Box>
          </Link>

          {/* <Link href="/explore" prefetch={false}>
            <Box sx={sidebar_menueHover} onClick={() => handleProfile(2)}>
              <Box sx={sidebar_menu_0002({ view })} />
              <MenuItem sx={sidebar_menu_0003({ view })}>Explore</MenuItem>
            </Box>
          </Link>

          <Link href="/collections" prefetch={false}>
            <Box sx={sidebar_menueHover} onClick={() => handleProfile(4)}>
              <Box sx={sidebar_menu_0007({ view })} />
              <MenuItem sx={sidebar_menu_0006({ view })}>Collections</MenuItem>
            </Box>
          </Link> */}

          {/* <Divider sx={sidebar_menu_0009({ pathname: router.pathname })} /> */}
          {/* <Box sx={sidebar_menueHover} onClick={() => handleProfile}>
          <MenuItem sx={sidebar_menu_0011()}>Details</MenuItem>
          <SwitchButton on={detailOn} setOn={setDetailOn} />
        </Box> */}
          {/* <Box sx={sidebar_menueHover} onClick={() => handleProfile}>
          <MenuItem sx={sidebar_menu_0012()}>Light mode</MenuItem>
          <SwitchButton on={lightOn} setOn={setLightOn} />
        </Box> */}
        </Menu>
      )}
    </>
  );
};

export default MainMenu;
