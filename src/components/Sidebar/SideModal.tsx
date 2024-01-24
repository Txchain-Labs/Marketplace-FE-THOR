import * as React from 'react';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useRouter } from 'next/router';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Divider } from '@mui/material';
import {
  sidebar_menueHover,
  sidebar_menueStyle,
  sidebar_menu_0001,
  sidebar_menu_0002,
  sidebar_menu_0003,
  sidebar_menu_0004,
  sidebar_menu_0006,
  sidebar_menu_0007,
  sidebar_menu_0009,
  sidebar_menu_0011,
  sidebar_menu_0012,
} from '../../styles/home';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  list: {
    paddingTop: '48px !important',
    paddingBottom: '30px !important',
  },
});

const SwitchButton = ({ on, setOn }: any) => {
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      width={40}
      marginRight={'55px'}
      flexDirection={on ? 'row' : 'row-reverse'}
      onClick={(): void => setOn(!on)}
    >
      <Box
        component="span"
        width={28}
        height={'1px'}
        style={{ background: 'black' }}
      />
      <Box
        component="span"
        width={16}
        height={16}
        borderRadius={'50%'}
        style={
          on
            ? { background: '#F3523F' }
            : { background: '#fff', border: `2px solid #F3523F` }
        }
      />
    </Box>
  );
};

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

export default function FullScreenDialog(
  { open, onClose }: SimpleDialogProps,
  props: any
) {
  const { openPage, anchorEl, handleClose, setAnchorEl1, setActiveColor } =
    props;
  const router = useRouter();
  const classes = useStyles();
  const [detailOn, setDetailOn] = React.useState(false);
  const [lightOn, setLightOn] = React.useState(true);

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
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <Menu
          elevation={0}
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={openPage}
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
          <Link href="/explore" prefetch={false}>
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
          </Link>
          <Divider sx={sidebar_menu_0009({ pathname: router.pathname })} />
          <Box sx={sidebar_menueHover} onClick={() => handleProfile}>
            <MenuItem sx={sidebar_menu_0011()}>Details</MenuItem>
            <SwitchButton on={detailOn} setOn={setDetailOn} />
          </Box>
          <Box sx={sidebar_menueHover} onClick={() => handleProfile}>
            <MenuItem sx={sidebar_menu_0012()}>Light mode</MenuItem>
            <SwitchButton on={lightOn} setOn={setLightOn} />
          </Box>
        </Menu>
      </Dialog>
    </div>
  );
}
