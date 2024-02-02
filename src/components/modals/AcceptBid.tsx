import Dialog from '@mui/material/Dialog';
import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { palette } from '../../theme/palette';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { dottedAddress } from '../../shared/utils/utils';
import {
  useAcceptBid,
  useAcceptOtcBid,
  useGetTransaction,
  useMarketplaceAddress,
} from '../../hooks/Marketplace';
import { bidType } from '../../utils/constants';
import { useGetNFTApproval, useSetNFTApproval } from '../../hooks/useNFTDetail';
// import dayjs from 'dayjs';
import { ethers } from 'ethers';
import Loader from '../common/Loader';
import { ToastSeverity } from '../../redux/slices/toastSlice';

type Props = {
  open: boolean;
  handleClose: any;
  bidData: {
    bidPrice: number | string;
    bidExpiresAt: string;
    paymentType: number | string;
  };
  acceptBidType: string;
  acceptBidResponse?: any;
  nftData: {
    nftName: string;
    by: string;
    nftImage: string;
    nftAddress: string;
    tokenId: number | string;
  };
};
const AcceptBid = (props: Props) => {
  const {
    open,
    handleClose,
    nftData,
    bidData,
    acceptBidResponse,
    acceptBidType,
  } = props;
  const user = useSelector((state: any) => state.auth.user);
  const fee = (2 / 100) * Number(bidData?.bidPrice);
  const Earning = Number(bidData?.bidPrice) - fee;
  const acceptBidToast = {
    message: 'Bid Accepting...',
    severity: ToastSeverity.INFO,
    image: nftData?.nftImage,
    autoHideDuration: 5000,
  };
  const txnToast = {
    message: 'Bid Accepted',
    severity: ToastSeverity.SUCCESS,
    image: nftData?.nftImage,
    autoHideDuration: 5000,
  };
  const {
    data: acceptBidData,
    write: writeBid,
    isLoading: acceptBidLoading,
  } = useAcceptBid(acceptBidToast);
  const {
    data: acceptOtcBidData,
    write: writeOtcBid,
    isLoading: acceptOTCBidLoading,
  } = useAcceptOtcBid(acceptBidToast);
  useGetTransaction(acceptBidData?.hash || acceptOtcBidData?.hash, txnToast);

  const marketplaceAddress = useMarketplaceAddress();
  const {
    data: nftApproval,
    refetch: refetchGetApproval,
    isLoading: getApprovalLoading,
  } = useGetNFTApproval(nftData?.nftAddress, Number(nftData?.tokenId));
  const {
    write: approveNFT,
    isLoading: approveNFTLoading,
    isSuccess: setApprovalSuccess,
  } = useSetNFTApproval(nftData?.nftAddress);

  useEffect(() => {
    refetchGetApproval();
  }, [setApprovalSuccess, refetchGetApproval]);
  // const feePercentage = 2;
  // const daysToExpire = dayjs.unix(Number(bidData?.bidExpiresAt));
  const handlePlaceBid = async () => {
    if (nftApproval === ethers.constants.AddressZero) {
      approveNFT({
        recklesslySetUnpreparedArgs: [
          marketplaceAddress,
          Number(nftData?.tokenId),
        ],
      });
      return;
    }
    if (acceptBidType === bidType.DEFAULT) {
      await writeBid({
        recklesslySetUnpreparedArgs: [nftData?.nftAddress, nftData?.tokenId],
        recklesslySetUnpreparedOverrides: {
          from: user?.address,
          value: 0,
        },
      });
      if (acceptBidResponse) {
        acceptBidResponse({ isSuccess: true, message: 'Bid is Accepted' });
      }
    } else if (acceptBidType === bidType.OTC) {
      await writeOtcBid({
        recklesslySetUnpreparedArgs: [nftData?.nftAddress, nftData?.tokenId],
        recklesslySetUnpreparedOverrides: {
          from: user?.address,
          value: 0,
        },
      });
      if (acceptBidResponse) {
        acceptBidResponse({ isSuccess: true, message: 'Bid is Accepted' });
      }
    }
    handleClose();
  };
  useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = open ? 'hidden' : 'auto';
    }
  }, [open]);
  return (
    <Box>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{
          'zIndex': 10006,
          '& .MuiDialog-paper': {
            maxWidth: '770px !important',
            background: 'transparent !important',
            boxShadow: 'none',
            boxRadius: 'none',
            margin: 1,
            width: '100%',
          },
          '& .MuiDialog-container': {
            background: 'rgba(255, 255, 255, 0.5) !important',
            backdropFilter: 'blur(13px) !important',
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
              miniMobile={12}
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

                  alignItems: 'center',
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
                    <Typography
                      variant="p-md"
                      sx={{ color: '#fff', fontSize: { miniMobile: '12px' } }}
                    >
                      NFT Bid
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
                      src={nftData?.nftImage || '/images/nftImage.png'}
                      alt="NFTS"
                      width="100%"
                      height="100%"
                    />
                  </Box>
                </Box>
                <Box sx={{ ml: { miniMobile: 2, xs: 2, sm: 4, md: 0, lg: 0 } }}>
                  <Typography
                    sx={{
                      width: '100%',
                      display: 'flex',
                      aligItems: 'center',

                      marginTop: 1,
                    }}
                  >
                    By {nftData?.by}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item md={7.5} miniMobile={12} sm={10} xs={12}>
              <Box
                sx={{
                  background: '#FAFAFA',
                  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.24)',
                  p: 3,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    right: 20,
                    cursor: `url("/images/cursor-pointer.svg"), auto`,
                  }}
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
                    NFT BID
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
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
                        <Typography variant="p-md-bk">
                          {' '}
                          {dottedAddress(user?.address)}{' '}
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

                  {/* ======================== */}

                  {/* <Box
                    sx={{
                      width: '100%',
                      position: 'relative',
                      marginBottom: 2,
                      p: 1,
                      border: '1px solid rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <Typography variant="p-md-bk">
                      Bid expires in {daysToExpire.diff(dayjs(), 'day')} day
                    </Typography>
                  </Box> */}

                  {/* ======================== */}

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="p-md-bk">Bid Price</Typography>
                    <Typography variant="p-md-bk">
                      {bidData?.bidPrice}
                      {acceptBidType === bidType.DEFAULT
                        ? Number(bidData?.paymentType) === 0
                          ? 'AVAX'
                          : Number(bidData?.paymentType) === 1
                          ? 'THOR'
                          : 'USD'
                        : 'USD'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="p-md-bk">Listing fee (2%)</Typography>
                    <Typography variant="p-md-bk">
                      {fee}
                      {acceptBidType === bidType.DEFAULT
                        ? Number(bidData?.paymentType) === 0
                          ? 'AVAX'
                          : Number(bidData?.paymentType) === 1
                          ? 'THOR'
                          : 'USD'
                        : 'USD'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="p-md-bk">Your Earning</Typography>
                    <Typography variant="p-md-bk">
                      {Earning}
                      {acceptBidType === bidType.DEFAULT
                        ? Number(bidData?.paymentType) === 0
                          ? 'AVAX'
                          : Number(bidData?.paymentType) === 1
                          ? 'THOR'
                          : 'USD'
                        : 'USD'}
                    </Typography>
                  </Box>
                  <Divider
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', mb: 1.5 }}
                  />

                  <Box sx={{ display: 'flex', mt: 5, width: '100%' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={
                        getApprovalLoading ||
                        acceptBidLoading ||
                        acceptOTCBidLoading ||
                        approveNFTLoading
                      }
                      sx={{
                        'borderRadius': '0%',
                        ':disabled': {
                          backgroundColor: '#F3523F',
                          color: 'white',
                          opacity: 0.5,
                        },
                      }}
                      onClick={handlePlaceBid}
                    >
                      {getApprovalLoading ||
                      acceptBidLoading ||
                      acceptOTCBidLoading ||
                      approveNFTLoading ? (
                        <Loader size="2.5rem" sx={{ color: 'white' }} />
                      ) : (
                        <Typography variant="p-md">
                          {nftApproval === ethers.constants.AddressZero
                            ? 'Approval Request'
                            : 'Accept Bid'}
                        </Typography>
                      )}
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

export default AcceptBid;
