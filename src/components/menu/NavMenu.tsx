import React from 'react';
import Menu from '@mui/material/Menu';
import { Box } from '@mui/system';
import { makeStyles } from '@mui/styles';
import { Typography, Button } from '@mui/material';
import { setactiveCat } from '../../redux/slices/uiGolobalSlice';
import { useDispatch, useSelector } from 'react-redux';

const menueStyle = {
  width: '173px',
  background: 'none',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.24)',
  transform: 'matrix(1, 0, 0, 1, 0, 0)',
  position: 'relative' as any,
  margin: 'auto',
  marginTop: 70,
  display: 'flex',
  justifyContent: 'center',
  marginLeft: 62,
};
const useStyles = makeStyles({
  root: {
    zIndex: '10003 !important',
  },
});
const NavMenu = (props: any) => {
  const { open, anchorEl, handleClose } = props;
  const classes = useStyles();
  const { activeCat } = useSelector((state: any) => state.uiGolobal);
  const dispatch = useDispatch();

  return (
    <>
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
        PaperProps={
          {
            style: menueStyle,
          } as any
        }
      >
        <Box
          sx={{
            height: '48px',
            paddingLeft: '20px',
            paddingRight: '20px',
            background: activeCat === 'art' ? '#F3523F' : 'black',
            marginBottom: '10px',
          }}
        >
          <Button
            onClick={() => {
              dispatch(setactiveCat('art'));
              handleClose(true);
            }}
          >
            <img
              width="80%"
              style={{ objectFit: 'contain' }}
              src={'/images/artwork-iconWhite.svg'}
            />
            <Typography
              sx={{
                fontSize: '21px',
                fontWeight: 700,
                color: 'white',
                textTransform: 'none',
                paddingLeft: '12px',
              }}
            >
              Artwork
            </Typography>
          </Button>
        </Box>
        <Box
          sx={{
            height: '48px',
            paddingLeft: '20px',
            paddingRight: '20px',
            background: activeCat === 'node' ? '#F3523F' : 'black',
          }}
        >
          <Button
            onClick={() => {
              dispatch(setactiveCat('node'));
              handleClose(true);
            }}
          >
            <img
              width="80%"
              style={{ objectFit: 'contain' }}
              src={'/images/node-iconWhite.svg'}
            />
            <Typography
              sx={{
                fontSize: '21px',
                fontWeight: 700,
                color: 'white',
                textTransform: 'none',
                paddingLeft: '12px',
              }}
            >
              Nodes
            </Typography>
          </Button>
        </Box>
      </Menu>
    </>
  );
};
export default NavMenu;
