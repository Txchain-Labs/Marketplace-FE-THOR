import { useEffect, useState, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { RootState } from '../redux/store';
import { AuthService } from '../services/auth.service';
import { authAction } from '../redux/slices/authSlice';
import {
  Button,
  Dialog,
  DialogTitle,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import NetworkAlert from './modals/NetworkAlert';
import { useChain } from '../utils/web3Utils';

import { isMobile, isTablet, isDesktop } from 'react-device-detect';

type JWTDataType = {
  address: string;
  iat: number;
  exp: number;
};

const Signin = () => {
  const dispatch = useDispatch();
  const address = useAccount().address || '';
  const { signMessageAsync } = useSignMessage();
  const { token } = useSelector((state: RootState) => state.auth);
  const [showModal, setShowModal] = useState(false);

  const _btn = {
    'width': '220px',
    'height': '54px',
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
    'zIndex': '100',
    'fontSize': '18px',
    'fontWeight': '700',
    'lineHeight': '1.5',
    'mt': { miniMobile: '50px', sx: '50px' },
    '@media (max-width: 601px) and (min-width: 390px)': {
      marginTop: '28px',
      marginLeft: '0px',
    },
  };

  // async function authenticate() {
  const authenticate = useCallback(async () => {
    if (!address) {
      return;
    }
    let {
      data: { data: user },
    } = await AuthService.getUser(address);
    console.log('user found', user);
    // Create user if one doesn't exist
    if (!('address' in user)) {
      const createResponse = await AuthService.handleSignup(address);
      user = createResponse.data;
      console.log('user not found calling signup', user);
    }
    // Something went wrong, abort.
    if (!('address' in user)) {
      throw Error('ERROR SETTING UP USER');
    }
    // Prompt for creation of signature.
    const signature = await signMessageAsync({
      message: `I am signing my one-time nonce: ${user.nonce}`,
    });
    // Fetch JWT token
    const res = await AuthService.handleAuthenticate(address, signature);
    if (!('data' in res)) {
      throw Error(res.message);
    }
    // Tell the world we're logged in
    dispatch(authAction.setLoading(true));
    AuthService.setToken(res.data.token);
    dispatch(authAction.setToken(res.data.token));
    dispatch(authAction.setUser(user));
    setShowModal(false);
    setTimeout(() => {
      dispatch(authAction.setLoading(false));
    }, 1000);
  }, [address]); // eslint-disable-line
  const chain = useChain();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (!address) {
      return;
    }

    if (token) {
      setOpen(![43114, 43113].includes(chain?.id));
      const info: JWTDataType = jwt_decode(token as string);
      if (
        info &&
        'address' in info &&
        info.address.toLowerCase() === address.toLowerCase()
      ) {
        console.log('already logged in');
        console.log(token, info);
        setShowModal(false);
        return;
      }
    }
    if (address) {
      console.log('desktop', isMobile, isDesktop, isTablet);
      if (!isMobile) {
        authenticate();
      } else {
        setShowModal(true);
      }
      return;
    }
  }, [address, token, chain, authenticate]);

  return (
    <>
      <Box>
        <Dialog
          open={showModal && !!address}
          maxWidth="xs"
          fullWidth={true}
          BackdropProps={{
            style: {
              background: 'rgba(255, 255, 255, 0.87)',
            },
          }}
          sx={{
            '& .MuiDialog-paper': {
              padding: '25px',
              marginLeft: {
                md: '80px',
              },
              clipPath:
                'polygon( 30% 0%, 92% 0, 100% 15%, 100% 100%, 70% 100%, 8% 100%, 0 85%, 0 0) !important',
              background: '#000',
              position: 'relative',
              overflow: 'hidden',
              maxWidth: {
                'lg': '45%',
                'md': '50%',
                'sm': '70%',
                'xs': '100%',
                '@media (max-width: 390px)': {
                  maxWidth: '100%',
                },
              },
              height: {
                'lg': '30%',
                'md': '30%',
                'sm': '30%',
                'xs': '30%',
                '@media (max-width: 420px)': {
                  height: '30%',
                },
              },
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              background: '#fff',
              width: '99.5%',
              height: '99.5%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              clipPath:
                'polygon( 30% 0%, 92% 0, 100% 15%, 100% 100%, 70% 100%, 8% 100%, 0 85%, 0 0) !important',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}
          >
            <>
              <DialogTitle
                textAlign="center"
                sx={{
                  fontWeight: 400,
                  width: '99.5%',
                  fontSize: { md: '30px', sm: '24px', xs: '20px' },
                }}
              >
                Signature required
              </DialogTitle>
              <Grid container>
                <Grid
                  item
                  md
                  textAlign="center"
                  sx={{
                    width: '99.5%',
                    height: '99.5%',
                    padding: '10px',
                  }}
                >
                  <Typography
                    textAlign="center"
                    variant="h1"
                    fontSize={22}
                    color="rgba(0, 0, 0, 1)"
                    lineHeight="164%"
                    fontFamily="Nexa"
                    sx={{
                      fontWeight: 200,
                      fontSize: {
                        miniMobile: '12px',
                        md: '18px',
                        sm: '14px',
                        xs: '14px',
                      },
                    }}
                  >
                    Please complete this signature to connect to Capsule.
                  </Typography>
                  <Button
                    variant="nft_common"
                    onClick={authenticate}
                    sx={_btn}
                    id="sign-message-modal"
                  >
                    Sign message
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
        <NetworkAlert open={open} handleClose={handleClose} />
      </Box>
    </>
  );
};

export default Signin;
