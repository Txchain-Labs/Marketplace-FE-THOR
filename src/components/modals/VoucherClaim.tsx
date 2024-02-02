import { Box, Button, Dialog, Grid, Typography } from '@mui/material';
import { Loader } from '../common';
import Image from 'next/image';
import { palette } from '@/theme/palette';
import { dottedAddress, formatDecimals } from '@/shared/utils/utils';
import { useAccount } from 'wagmi';
import { useBalance } from '@/hooks/useToken';
import { useEffect, useMemo, useState } from 'react';
import { getValidCurrency } from '@/utils/common';
import { ToastSeverity } from '@/redux/slices/toastSlice';
import { BigNumberish, ethers } from 'ethers';
import { useChain } from '@/utils/web3Utils';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import { MODAL_TYPES, useGlobalModalContext } from './GlobleModal';
import {
  useGetGameloopApproval,
  useNodePerk,
  useSetGameloopApproval,
  useThorGamificationContract,
} from '@/hooks/useGameloop';
import { useGetTransaction } from '@/hooks/Marketplace';

interface Modal {
  open: boolean;
  handleClose: any;
  voucher?: {
    name: string;
    by: string;
    image: string;
    tokenId: string;
    tokenAddress: string;
  };
}

const ClaimVoucher = ({ open, handleClose, voucher }: Modal) => {
  const claimToast = {
    message: 'Claiming Voucher...',
    severity: ToastSeverity.INFO,
    image: voucher?.image || 'images/nft-placeholder.png',
  };
  const txnToast = {
    message: 'Voucher Claimed',
    severity: ToastSeverity.SUCCESS,
    image: voucher?.image || 'images/nft-placeholder.png',
    autoHideDuration: 5000,
  };
  const {
    write: claimVoucherWrite,
    data: voucherClaimResponse,
    isLoading: claimLoading,
  } = useNodePerk(claimToast);
  useGetTransaction(voucherClaimResponse?.hash, txnToast);
  const { showModal } = useGlobalModalContext();
  const gameloopAddress = useThorGamificationContract();
  const chain = useChain();
  const { data: usdFromAvax } = useGetUsdFromAvax('1', chain);
  const { data: usdFromThor } = useGetUsdFromThor('1', chain);
  const { address: accountAddress } = useAccount();
  const balance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');
  const [isNode] = useState(true);
  const currencies = getValidCurrency(isNode);
  const [currency] = useState(currencies[0].value);
  const usdBalancePrice = useMemo(() => {
    if (balance || thorBalance) {
      const tempTotalPrice =
        currency === 0 ? formatDecimals(balance) : formatDecimals(thorBalance);
      return (
        Number(tempTotalPrice) *
        (currency === 0
          ? usdFromAvax
            ? Number(ethers.utils.formatEther(usdFromAvax as BigNumberish))
            : 0
          : usdFromThor
          ? Number(ethers.utils.formatEther(usdFromThor as BigNumberish))
          : 0)
      );
    } else {
      return 0;
    }
  }, [balance, thorBalance, currency, usdFromAvax, usdFromThor]);

  const {
    write: setApprovalWrite,
    isLoading: setApprovalLoading,
    isSuccess: setApprovalSuccess,
  } = useSetGameloopApproval(voucher?.tokenAddress);
  const {
    data: userApproval,
    refetch: refetchGetApproval,
    isLoading: getApprovalLoading,
  } = useGetGameloopApproval(accountAddress, voucher?.tokenAddress);

  useEffect(() => {
    refetchGetApproval();
  }, [setApprovalSuccess, refetchGetApproval]);

  const handleClick = () => {
    if (!accountAddress) {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
      handleClose();
      return;
    }

    if (userApproval) {
      claimVoucherWrite({
        recklesslySetUnpreparedArgs: [Number(voucher?.tokenId), 0, 0],
      });
      handleClose();
    } else {
      setApprovalWrite({
        recklesslySetUnpreparedArgs: [gameloopAddress, true],
      });
      refetchGetApproval();
    }
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{
        // 'zIndex': 10006,
        '& .MuiDialog-paper': {
          maxWidth: '770px !important',
          background: 'transparent !important',
          boxShadow: 'none',
          boxRadius: 'none',
          margin: 1,
          width: '100%',
          overflow: 'auto',
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
                mt: { miniMobile: '49px', sm: '1px' },
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
                    Voucher being claimed
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
                    src={voucher?.image || '/images/nftImage.png'}
                    alt="voucher"
                    width="100%"
                    height="100%"
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  ml: { miniMobile: 2, xs: 2, sm: 4, md: 0, lg: 0 },
                  position: 'absolute',
                  top: { miniMobile: '215px', sm: '170px' },
                  left: '16px',
                }}
              >
                <Typography
                  variant="p-lg"
                  sx={{
                    width: '100%',
                    display: 'flex',
                    aligItems: 'center',

                    marginTop: 1,
                  }}
                >
                  {voucher?.name}
                </Typography>
                <Typography
                  sx={{
                    width: '100%',
                    display: 'flex',
                    aligItems: 'center',

                    marginTop: 1,
                  }}
                >
                  by {voucher?.by}
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
                  Claim Voucher
                </Typography>
                {/* === */}
                <Box
                  sx={{
                    display: { miniMobile: 'content', sm: 'block' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3.8,
                    mt: 3,
                    p: 2,
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '40px', height: '30px' }}>
                        <Image
                          src="/images/redAvaxIcon.svg"
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
                        <Typography
                          variant="p-md-bk"
                          sx={{
                            fontSize: { miniMobile: '12px', sm: '16px' },
                          }}
                        >
                          {dottedAddress(accountAddress)}{' '}
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
                          fontSize: '14px',
                          fontWeight: 700,
                        }}
                      >
                        CONNECTED
                      </Typography>
                      <Box sx={{ height: '21px' }}>
                        <img src="/images/shaEllipse.png" alt="circle" />
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 0.8,
                    }}
                  >
                    <Typography variant="p-md-bk">
                      Your wallet balance
                    </Typography>
                    <Box>
                      <Typography variant="p-md-bk">
                        {isNode
                          ? currency === 0
                            ? (balance &&
                                Number(formatDecimals(balance)).toFixed(3)) +
                              ' AVAX'
                            : (thorBalance &&
                                Number(formatDecimals(thorBalance)).toFixed(
                                  3
                                )) + ' THOR'
                          : (balance &&
                              Number(formatDecimals(balance)).toFixed(3)) +
                            ' AVAX'}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', textAlign: 'right' }}>
                        {usdBalancePrice && usdBalancePrice.toFixed(3) + ' USD'}
                      </Typography>
                    </Box>
                  </Box>{' '}
                </Box>

                <Box sx={{ display: 'flex', mt: 5, width: '100%' }}>
                  <Button
                    type="submit"
                    disabled={
                      claimLoading ||
                      (setApprovalLoading && !setApprovalSuccess) ||
                      getApprovalLoading ||
                      (!setApprovalLoading &&
                        setApprovalSuccess &&
                        !userApproval)
                    }
                    variant="contained"
                    fullWidth
                    onClick={handleClick}
                    sx={{
                      'borderRadius': '0%',
                      ':disabled': {
                        backgroundColor: '#F3523F',
                        color: 'white',
                        opacity: 0.5,
                      },
                    }}
                  >
                    {claimLoading ||
                    setApprovalLoading ||
                    getApprovalLoading ||
                    (!setApprovalLoading &&
                      setApprovalSuccess &&
                      !userApproval) ? (
                      <Loader size="2.5rem" sx={{ color: 'white' }} />
                    ) : (
                      <Typography variant="p-md">
                        {userApproval ? 'Claim Voucher' : 'Approval Request'}
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
  );
};

export default ClaimVoucher;
