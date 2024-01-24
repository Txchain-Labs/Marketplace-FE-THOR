import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Divider, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { MODAL_TYPES, useGlobalModalContext } from './GlobleModal';
import { useSelector } from 'react-redux';
import { palette } from '../../theme/palette';

type Props = {
  open: boolean;
  handleClose: any;
  openToast: () => void;
};

const BuyNft = (props: Props) => {
  const user = useSelector((state: any) => state.auth.user);
  const { showModal } = useGlobalModalContext();

  const { open, handleClose, openToast } = props;

  const handleClick = () => {
    if (!user?.address) {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
      handleClose();

      return;
    }
    openToast();
    handleClose();
  };
  React.useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = open ? 'hidden' : 'auto';
      console.log('buyyy view is not working');
    }
  }, [open]);

  return (
    <Box>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
        sx={{
          'zIndex': 10006,
          'overflow': { miniMobile: 'scroll', md: 'hidden' },

          '& .MuiDialog-paper': {
            maxWidth: '770px !important',
            background: 'transparent',
            boxShadow: 'none',
            boxRadius: 'none',
            margin: 1,
            width: '100%',
          },
          '& .MuiDialog-container': {
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(13px)',
            justifyContent: 'center',
          },
        }}
      >
        <Box sx={{ width: '100%', background: 'transparent', p: 1 }}>
          <Grid container spacing={1} sx={{ justifyContent: 'center' }}>
            <Grid
              item
              md={4.5}
              sm={10}
              miniMobile={10}
              xs={12}
              sx={{ maxWidth: '100%' }}
            >
              <Box
                sx={{
                  display: {
                    miniMobile: 'flex',
                    xs: 'flex',
                    sm: 'flex',
                    md: 'block',
                    lg: 'block',
                  },
                }}
              >
                <Box>
                  <Box
                    sx={{
                      width: '190px',
                      height: '26px',
                      background: palette.primary.fire,
                      display: 'flex',
                      justifyContent: 'center',
                      aligItems: 'center',
                      mb: 1,
                      paddingTop: 1,
                    }}
                  >
                    <Typography variant="p-md" sx={{ color: '#fff' }}>
                      BUYING
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: {
                        miniMobile: 190,
                        xs: 190,
                        sm: 190,
                        md: 190,
                        lg: 190,
                      },
                      width: {
                        miniMobile: 190,
                        xs: 190,
                        sm: 190,
                        md: 190,
                        lg: 190,
                      },
                    }}
                  >
                    <img
                      src="/images/nftImage.png"
                      alt="NFTS"
                      width="100%"
                      height="100%"
                    />
                  </Box>
                </Box>
                <Box sx={{ ml: { miniMobile: 2, xs: 2, sm: 4, md: 0, lg: 0 } }}>
                  <Typography
                    variant="p-lg"
                    sx={{
                      width: '100%',
                      display: 'flex',
                      aligItems: 'center',

                      marginTop: 1,
                    }}
                  >
                    Ocean Parallax
                  </Typography>
                  <Typography
                    sx={{
                      width: '100%',
                      display: 'flex',
                      aligItems: 'center',

                      marginTop: 1,
                    }}
                  >
                    by Algo (B)
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item md={7.5} miniMobile={10} sm={10} xs={12}>
              <Box
                sx={{
                  height: '438px',
                  background: '#FAFAFA',
                  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.24)',
                  p: 3,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{ position: 'absolute', right: 20, cursor: 'pointer' }}
                  onClick={handleClose}
                >
                  <Image src="/images/cross.svg" width={16} height={16} />
                </Box>
                <Box>
                  <Typography
                    variant="sub-h"
                    sx={{
                      display: 'flex',
                      width: '100%',

                      letterSpacing: '0.04em',
                    }}
                  >
                    Checkout
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3.3,
                      mt: 3,
                      p: 2,
                      border: '1px solid rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '40px', height: '30px' }}>
                        <Image
                          src="/images/avaxIcon.svg"
                          alt="triangle"
                          width={40}
                          height={30}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          flexDirection: 'column',
                          ml: 1.5,
                        }}
                      >
                        <Typography variant="lbl-md">
                          0xf3b81...c578{' '}
                        </Typography>
                        <Typography variant="lbl-lg">AVAX</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <Typography
                        sx={{
                          color: 'rgba(29, 185, 84, 1)',
                          mr: 1,
                          fontSize: '9px',
                          fontWeight: 700,
                        }}
                      >
                        CONNECTED
                      </Typography>
                      <img src="/images/Ellipse.png" alt="circle" />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="p-md-bk">
                      Your biddiing balance
                    </Typography>
                    <Typography variant="p-md-bk">5 AVAX</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="p-md-bk">Your balance</Typography>
                    <Typography variant="p-md-bk">3.25 AVAX</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="p-md-bk">Service fee</Typography>
                    <Typography variant="p-md-bk">0.25%</Typography>
                  </Box>
                  <Divider
                    sx={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      height: '2px',
                      mb: 1.5,
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="p-md-bk">You will pay</Typography>
                    <Typography variant="p-md">3.71 AVAX</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mt: 5, width: '100%' }}>
                    <Button
                      variant="contained"
                      onClick={handleClick}
                      sx={{
                        borderRadius: '0%',
                        width: '100%',
                        maxWidth: '100%',
                      }}
                    >
                      <Typography variant="p-md">Proceed to payment</Typography>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Box>
  );
};

export default BuyNft;
