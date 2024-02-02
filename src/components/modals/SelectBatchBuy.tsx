import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Dialog,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useTheme } from '@mui/material/styles';
import NFTSlider, { NFTSlide } from '../common/NFTSlider';
import BatchListNFTModal from './BatchListNFTModal';

type Props = {
  buy_open: boolean;
  buy_handleClose: any;
  totalUsdPrice?: number;
  buy_nfts: any[];
  buy_approvalAddress?: string;
};

const SelectBatchBuy = (props: Props) => {
  const { buy_open, buy_handleClose, buy_nfts, buy_approvalAddress } = props;

  const [openListModal, setOpenListModal] = useState(false);
  const [nodesToList, setNodesToList] = useState([]);
  const [nftApprovalAddress, setNFTApprovalAddress] = useState('');
  const [provide_method, setProvide_method] = useState('single');

  useEffect(() => {
    setNodesToList(buy_nfts);
    setNFTApprovalAddress(buy_approvalAddress);
  }, [buy_nfts, buy_approvalAddress]);

  const handleModalClose = () => {
    setOpenListModal(false);
  };

  const theme = useTheme();

  const matchLgUp = useMediaQuery(theme.breakpoints.up('sm'));
  const matchSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const handleQBuyClick = () => {
    // buy_handleClose();
    setOpenListModal(true);
    setProvide_method('detail');
  };
  const handleABuyClick = () => {
    // buy_handleClose();
    setOpenListModal(true);
    setProvide_method('advanced');
  };

  useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = buy_open ? 'hidden' : 'auto';
    }
    if (buy_open && nodesToList.length === 1) {
      setOpenListModal(true);
    } else {
      setOpenListModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buy_open]);

  return (
    <Box>
      <BatchListNFTModal
        open={openListModal}
        handleClose={buy_handleClose}
        handleModalBack={handleModalClose}
        nfts={nodesToList}
        approvalAddress={nftApprovalAddress}
        modal_method={provide_method}
      />
      <Dialog
        open={buy_open && nodesToList.length > 1}
        keepMounted
        onClose={buy_handleClose}
        hideBackdrop={true}
        disableScrollLock
        fullWidth
        maxWidth="sm"
        sx={{
          'zIndex': 10000,
          '& .MuiDialog-paper': {
            maxWidth: '1000px !important',
            background: 'transparent !important',
            boxShadow: 'none',
            boxRadius: 'none',
            margin: 1,
            width: '100%',
            height: matchSmDown ? '100vh' : 'auto',
          },
          '& .MuiDialog-container': {
            background: 'rgba(255, 255, 255, 0.5) !important',
            backdropFilter: 'blur(13px) !important',
            justifyContent: 'center',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            background: 'transparent',
            p: 1,
            overflowX: 'hidden',
            flexGrow: 1,
          }}
        >
          <Grid sx={{ flexGrow: 1 }} container>
            <Grid item xs={12}>
              <Grid
                container
                justifyContent="center"
                columnSpacing={{ sm: 2, md: 3 }}
                rowSpacing={{ xs: 2, miniMobile: 1 }}
              >
                <Grid item md={3} sm={4} xs={12}>
                  <Box
                    sx={{
                      display: {
                        miniMobile: 'flex',
                        xs: 'flex',
                        sm: 'flex',
                        md: 'block',
                        lg: 'block',
                      },

                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: matchSmDown ? '100%' : '209px',
                          height: '26px',
                          bgcolor: 'primary.main',
                          display: 'flex',
                          justifyContent: 'center',
                          aligItems: 'center',
                          mb: 1,
                          paddingTop: 1,
                        }}
                      >
                        <Typography
                          variant="p-md"
                          sx={{
                            color: 'primary.contrastText',
                            fontSize: { miniMobile: '12px' },
                          }}
                        >
                          NFT BEING LISTED
                        </Typography>
                      </Box>
                      <Box>
                        <NFTSlider
                          slides={buy_nfts.map(
                            (item: any) =>
                              ({
                                key: item.token_id,
                                image: item.image,
                                title: item.name,
                              } as NFTSlide)
                          )}
                          direction={matchLgUp ? 'vertical' : 'horizontal'}
                          size={matchSmDown ? 'small' : 'medium'}
                          hideTitle={matchSmDown}
                          fullHeightOffset={matchSmDown ? 72 : 48}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item md={6} sm={8} xs={12}>
                  <Box
                    sx={{
                      bgcolor: 'background.paper',
                      boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.24)',
                      p: 3,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 18,
                        right: 18,
                        cursor: 'pointer',
                      }}
                    >
                      <IconButton aria-label="close" onClick={buy_handleClose}>
                        <CloseIcon />
                      </IconButton>
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
                        List NFT
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: '0px',
                        mt: '24px',
                      }}
                    >
                      <Box
                        onClick={() => handleQBuyClick()}
                        sx={{
                          '&:hover': {
                            cursor: 'url(/images/cursor-pointer.svg),auto',
                          },
                          '&:hover .arrow': {
                            display: 'inline-block',
                          },
                          '&:hover .title': {
                            color: 'primary.main',
                          },
                          '& .arrow': {
                            display: matchSmDown ? 'inline-block' : '',
                          },
                          '& .title': {
                            color: matchSmDown ? 'primary.main' : '',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '16px',
                            mb: '8px',
                          }}
                        >
                          <Box className="title">Quick listing</Box>
                          <Box
                            className="arrow"
                            sx={{
                              width: '21px',
                              height: '21px',
                              padding: '2px',
                              display: 'none',
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              justifyContent: 'space-between',
                              textAlign: 'right',
                            }}
                          >
                            <ArrowOutwardIcon
                              sx={{
                                fontSize: 'medium',
                                color: 'white',
                              }}
                            />
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '14px',
                            mb: '24px',
                          }}
                        >
                          List all your NFTs at once for the same price and
                          currency
                        </Box>
                      </Box>
                      <Box
                        onClick={() => handleABuyClick()}
                        sx={{
                          '&:hover': {
                            cursor: 'url(/images/cursor-pointer.svg),auto',
                          },
                          '&:hover .arrow': {
                            display: 'inline-block',
                          },
                          '&:hover .title': {
                            color: 'primary.main',
                          },
                          '& .arrow': {
                            display: matchSmDown ? 'inline-block' : '',
                          },
                          '& .title': {
                            color: matchSmDown ? 'primary.main' : '',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '16px',
                            mb: '8px',
                          }}
                        >
                          <Box className="title"> Advanced listing</Box>
                          <Box
                            className="arrow"
                            sx={{
                              width: '21px',
                              height: '21px',
                              padding: '2px',
                              display: 'none',
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              justifyContent: 'space-between',
                              textAlign: 'right',
                            }}
                          >
                            <ArrowOutwardIcon
                              sx={{
                                fontSize: 'medium',
                                color: 'white',
                              }}
                            />
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '14px',
                            mb: '24px',
                          }}
                        >
                          List all the NFTs in your bag choosing different
                          prices and currencies for each of them.
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Box>
  );
};

export default SelectBatchBuy;
