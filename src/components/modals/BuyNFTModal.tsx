import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useAccount, useWaitForTransaction } from 'wagmi';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import {
  Grid,
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  IconButton,
} from '@mui/material';

import { MODAL_TYPES, useGlobalModalContext } from './GlobleModal';

import { dottedAddress, formatDecimals } from '../../shared/utils/utils';
import {
  formatNumber,
  getValidCurrency,
  isNode as isNodeNFT,
} from '../../utils/common';

import {
  useSetApprovalThor,
  useBalance,
  useGetApprovalThor,
  useGetApprovalUSDCE,
  useSetApprovalUSDCE,
} from '../../hooks/useToken';
import {
  useGetOrderByNft,
  useMarketplaceAddress,
  useExecuteOrder,
  useGetTransaction,
} from '../../hooks/Marketplace';
import { useChain } from '../../utils/web3Utils';
import {
  useGetAvaxFromThor,
  useGetThorFromAvax,
  useGetUsdFromAvax,
  useGetUsdFromThor,
} from '../../hooks/useOracle';
import { ToastSeverity } from '../../redux/slices/toastSlice';

import CloseIcon from '@mui/icons-material/Close';
import CurrencySelect from '@/components/common/CurrencySelect';
import { Listing } from '@/models/Listing';
import { toAvax, toThor, toUsd } from '@/utils/helper';

type Props = {
  open: boolean;
  handleClose?: any;
  collectionAddress?: string | undefined;
  refresh?: any;
  acceptPayments?: any[];
  tokenId?: number | undefined;
  nft?: { image: string | undefined; title: string | undefined } | undefined;
  listing: Listing;
};

const BuyNFTModal = (props: Props) => {
  const { showModal } = useGlobalModalContext();

  const {
    open,
    handleClose,
    collectionAddress,
    tokenId,
    nft,
    listing,
    refresh,
    acceptPayments,
  } = props;

  const user = useSelector((state: any) => state.auth.user);

  const [approved, setApproved] = useState(true);

  const chain = useChain();
  const { address: accountAddress } = useAccount();
  const marketplaceAddress = useMarketplaceAddress();

  const { data: order }: any = useGetOrderByNft(collectionAddress, tokenId);
  const isNode = isNodeNFT(collectionAddress ? collectionAddress : '', chain);

  const balance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');
  const usdcBalance = useBalance('USDCE');

  const { data: usdFromThor } = useGetUsdFromThor('1', chain);
  const { data: usdFromAvax } = useGetUsdFromAvax('1', chain);
  const { data: avaxFromThor } = useGetAvaxFromThor('1', chain);
  const { data: thorFromAvax } = useGetThorFromAvax('1', chain);

  const currencies = getValidCurrency(isNode, acceptPayments);
  const [currency, setCurrency] = useState(currencies[0].value);
  const [priceByCurrency, setPriceByCurrency] = useState(['0', '0', '0']);

  const nftImage = nft?.image;

  const {
    data: tokenApproval,
    refetch: refetchGetApproval,
    isLoading: getApprovalLoading,
  } = useGetApprovalThor(accountAddress);
  const {
    write: approveThor,
    isLoading: approveThorLoading,
    isSuccess: setApprovalSuccess,
  } = useSetApprovalThor();

  const {
    data: usdcTokenApproval,
    refetch: refetchGetUsdcTokenApproval,
    isLoading: getUsdcTokenApprovalLoading,
  } = useGetApprovalUSDCE(accountAddress);
  const {
    write: approveUsdc,
    isLoading: approveUsdcLoading,
    isSuccess: setUsdcApprovalSuccess,
  } = useSetApprovalUSDCE();

  const buyNFTToast = {
    message: 'Processing transaction',
    severity: ToastSeverity.INFO,
    image: nftImage,
    autoHideDuration: 5000,
  };

  const txnToast = {
    message: 'Transaction Successful',
    severity: ToastSeverity.SUCCESS,
    image: nftImage,
    autoHideDuration: 5000,
  };

  const {
    write,
    data: executeData,
    isLoading: isExecuteLoading,
  } = useExecuteOrder(buyNFTToast);

  const { isLoading: transactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({ hash: executeData?.hash });

  useGetTransaction(executeData?.hash, txnToast);

  const isInsufficientBalance = useMemo(() => {
    return (
      (currency === 0 &&
        balance &&
        Number(formatDecimals(balance)) <
          Number(
            ethers.utils.formatEther(
              (priceByCurrency && priceByCurrency[currency]) || 0
            )
          )) ||
      (currency === 1 &&
        thorBalance &&
        Number(formatDecimals(thorBalance)) <
          Number(
            ethers.utils.formatEther(
              (priceByCurrency && priceByCurrency[currency]) || 0
            )
          )) ||
      (currency === 2 &&
        usdcBalance &&
        Number(formatDecimals(usdcBalance, 6)) <
          Number(
            ethers.utils.formatEther(
              (priceByCurrency && priceByCurrency[currency]) || 0
            )
          ))
    );
  }, [balance, thorBalance, usdcBalance, currency, priceByCurrency]);

  const usdBalancePrice = React.useMemo(() => {
    if (balance || thorBalance || usdcBalance) {
      const tempTotalPrice =
        currency === 0
          ? formatDecimals(balance)
          : currency === 1
          ? formatDecimals(thorBalance)
          : formatDecimals(usdcBalance, 6);
      return (
        Number(tempTotalPrice) *
        (currency === 0
          ? usdFromAvax
            ? Number(ethers.utils.formatEther(usdFromAvax as BigNumberish))
            : 0
          : currency === 1
          ? usdFromThor
            ? Number(ethers.utils.formatEther(usdFromThor as BigNumberish))
            : 0
          : currency === 2
          ? 1
          : 0)
      );
    } else {
      return 0;
    }
  }, [balance, thorBalance, currency, usdFromAvax, usdcBalance, usdFromThor]);

  const usdBuyPrice = React.useMemo(() => {
    if (priceByCurrency) {
      return priceByCurrency[2];
    } else {
      return '0';
    }
  }, [priceByCurrency]);
  // Refetch approval amount when approval success
  useEffect(() => {
    refetchGetApproval();
  }, [setApprovalSuccess, refetchGetApproval]);

  useEffect(() => {
    refetchGetUsdcTokenApproval();
  }, [setUsdcApprovalSuccess, refetchGetUsdcTokenApproval]);

  // Set approved state
  useEffect(() => {
    if (currency === 0) {
      setApproved(true);
      return;
    }
    if (tokenApproval && currency === 1 && priceByCurrency) {
      setApproved(
        BigNumber.from(priceByCurrency[currency]).lte(
          tokenApproval as BigNumberish
        )
      );
    } else if (usdcTokenApproval && currency === 2 && priceByCurrency) {
      setApproved(
        BigNumber.from(priceByCurrency[currency]).lte(
          usdcTokenApproval as BigNumberish
        )
      );
    } else {
      setApproved(false);
    }
  }, [
    currency,
    tokenApproval,
    usdcTokenApproval,
    setApprovalSuccess,
    setUsdcApprovalSuccess,
    approveThorLoading,
    approveUsdcLoading,
    priceByCurrency,
  ]);

  useEffect(() => {
    if (isTransactionSuccess === true) {
      handleClose();
      refresh && refresh();
    }
  }, [isTransactionSuccess, refresh, handleClose]);

  useEffect(() => {
    if (!order || !order.paymentType) return;

    setCurrency(Number((order as any).paymentType));
  }, [order]);

  useEffect(() => {
    if (
      !acceptPayments ||
      !listing ||
      !thorFromAvax ||
      !usdFromAvax ||
      !usdFromThor ||
      !avaxFromThor
    ) {
      return;
    }

    const nftAvaxPrice = toAvax(
        listing.priceInWei,
        listing.paymentType,
        avaxFromThor,
        usdFromAvax
      ),
      nftThorPrice = toThor(
        listing.priceInWei,
        listing.paymentType,
        thorFromAvax,
        usdFromThor
      ),
      nftUsdPrice = toUsd(
        listing.priceInWei,
        listing.paymentType,
        usdFromAvax,
        usdFromThor
      );

    setPriceByCurrency([
      nftAvaxPrice.toString(),
      nftThorPrice.toString(),
      nftUsdPrice.toString(),
    ]);
  }, [
    thorFromAvax,
    usdFromAvax,
    usdFromThor,
    avaxFromThor,
    acceptPayments,
    listing,
  ]);

  const handleSelectCurrency = (value: number) => {
    setCurrency(value);
  };

  const handleBuyOrApproval = async () => {
    if (!user?.address && !priceByCurrency) {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
      handleClose();
      return;
    }

    // Approve when purchase by THOR or USDC.e
    if (!approved && currency === 1 && priceByCurrency) {
      approveThor({
        recklesslySetUnpreparedArgs: [
          marketplaceAddress,
          priceByCurrency[currency],
        ],
      });
    } else if (!approved && currency === 2 && priceByCurrency) {
      approveUsdc({
        recklesslySetUnpreparedArgs: [
          marketplaceAddress,
          BigNumber.from(priceByCurrency[currency]),
        ],
      });
    }
    // Purchase
    else {
      write({
        recklesslySetUnpreparedArgs: [
          [collectionAddress],
          [tokenId],
          [BigNumber.from(priceByCurrency[currency])],
          currency,
        ],
        recklesslySetUnpreparedOverrides: {
          from: user?.address,
          value:
            currency === 0
              ? BigNumber.from(priceByCurrency[currency])
              : BigNumber.from(0),
        },
      });
    }
  };

  return (
    <Box>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        hideBackdrop={true}
        disableScrollLock
        fullWidth
        maxWidth="sm"
        sx={{
          // 'zIndex': 10006,
          'overflow': { miniMobile: 'scroll', md: 'hidden' },
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
                    miniMobile: 'block',
                    xs: 'flex',
                    sm: 'flex',
                    md: 'block',
                    lg: 'block',
                  },
                  position: 'relative',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Box
                    sx={{
                      width: 190,
                      height: '26px',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      justifyContent: 'center',
                      aligItems: 'center',
                      mb: 1,
                      paddingTop: 1,
                      mt: { miniMobile: '49px', sm: '0px' },
                    }}
                  >
                    <Typography
                      variant="p-md"
                      sx={{ color: '#fff', fontSize: { miniMobile: '12px' } }}
                    >
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
                      src={nft?.image ? nft?.image : '/images/nftImage.png'}
                      alt="NFTS"
                      width="100%"
                      height="100%"
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    ml: {
                      miniMobile: 2,
                      xs: 2,
                      sm: 4,
                      md: 0,
                      lg: 0,
                      position: 'absolute',
                      bottom: '20px',
                      left: '16px',
                    },
                  }}
                >
                  <Typography
                    variant="p-lg"
                    sx={{
                      width: {
                        miniMobile: '100%',
                        xs: '169px',
                        sm: '169px',
                        md: '169px',
                      },
                      display: 'block',
                      aligItems: 'center',
                      marginTop: 1,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',

                      fontFamily: 'Nexa-Bold',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      lineHeight: '15px',
                    }}
                  >
                    {nft?.title ?? ''}
                  </Typography>
                  {/* <Typography
                    sx={{
                      width: '100%',
                      display: 'flex',
                      aligItems: 'center',

                      marginTop: 1,
                    }}
                  >
                    by Algo (B)
                  </Typography> */}
                </Box>
              </Box>
            </Grid>
            <Grid item md={7.5} miniMobile={12} sm={10} xs={12}>
              <Box
                sx={(theme) => ({
                  // height: '590px',
                  bgcolor: 'background.paper',
                  boxShadow: theme.shadows[1],
                  p: 3,
                  position: 'relative',
                })}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                  }}
                >
                  <IconButton aria-label="close" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box>
                  <Typography
                    variant="sub-h"
                    sx={{
                      display: 'flex',
                      width: '100%',
                      fontWeight: '700',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Buy Asset
                  </Typography>
                  {/* ============= */}
                  <Box
                    sx={(theme) => ({
                      display: { miniMobile: 'content', sm: 'block' },
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3.8,
                      mt: 3,
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    })}
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
                            color: 'success.main',
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
                          {currency === 0 ? (
                            (balance &&
                              Number(formatDecimals(balance)).toFixed(3)) +
                            ' AVAX'
                          ) : currency === 1 ? (
                            (thorBalance &&
                              Number(formatDecimals(thorBalance)).toFixed(3)) +
                            ' THOR'
                          ) : currency === 2 ? (
                            (usdcBalance &&
                              Number(formatDecimals(usdcBalance, 6)).toFixed(
                                3
                              )) + ' USDC.e'
                          ) : (
                            <></>
                          )}
                        </Typography>
                        <Typography
                          sx={{ fontSize: '12px', textAlign: 'right' }}
                        >
                          {usdBalancePrice &&
                            usdBalancePrice.toFixed(3) + ' USD'}
                        </Typography>
                      </Box>
                    </Box>{' '}
                  </Box>
                  {/* =========================== */}
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ width: '75%', position: 'relative' }}>
                      <TextField
                        inputProps={{
                          sx: {
                            fontSize: '18px',
                            color: 'text.secondary',
                            with: '100%',
                          },
                        }}
                        sx={{ width: '95%' }}
                        fullWidth
                        name="price"
                        value={Number(
                          currency === 2
                            ? ethers.utils.formatUnits(
                                priceByCurrency[currency] || 0,
                                6
                              )
                            : ethers.utils.formatEther(
                                priceByCurrency[currency] || 0
                              )
                        )?.toFixed(3)}
                        type="number"
                        // onChange={handleChangePrice}
                        // onBlur={handleBlur}
                        // error={bidPriceError.isError}
                        // helperText={bidPriceError.message}
                        id="price"
                        label={
                          <Typography
                            sx={{
                              fontSize: '22px',
                              fontFamily: 'Nexa-Bold',
                              color: 'text.primary',
                            }}
                            variant="p-md"
                          >
                            Your bid
                          </Typography>
                        }
                        variant="standard"
                      />
                    </Box>

                    <Box mt={'13px'}>
                      <CurrencySelect
                        currencies={currencies}
                        value={currency}
                        onChange={handleSelectCurrency}
                      />
                    </Box>
                  </Box>

                  {/* ============================ */}
                  <Box sx={{ mt: 1, mb: 3 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'text.secondary',
                      }}
                    >
                      {`${formatNumber(
                        ethers.utils.formatUnits(usdBuyPrice, 6)
                      )} USD`}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="p-md-bk">Service fee</Typography>
                    <Typography variant="p-md-bk">
                      {(
                        Number(
                          currency === 2
                            ? ethers.utils.formatUnits(
                                priceByCurrency[currency] || 0,
                                6
                              )
                            : ethers.utils.formatEther(
                                priceByCurrency[currency] || 0
                              )
                        ) * 0.0025
                      )?.toFixed(3)}
                      {currency === 0
                        ? ' AVAX '
                        : currency === 1
                        ? ' THOR '
                        : ' USDC.e '}
                      (0.25%)
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3.5,
                    }}
                  >
                    <Typography variant="p-md-bk" sx={{ fontSize: '18px' }}>
                      You will pay
                    </Typography>
                    <Typography
                      variant="p-md"
                      sx={{
                        fontWeight: 700,
                        fontSize: '18px',
                      }}
                    >
                      {Number(
                        currency === 2
                          ? ethers.utils.formatUnits(
                              priceByCurrency[currency] || 0,
                              6
                            )
                          : ethers.utils.formatEther(
                              priceByCurrency[currency] || 0
                            )
                      )?.toFixed(3)}{' '}
                      {
                        currencies.filter(
                          (_currency) => _currency.value === currency
                        )[0].text
                      }
                    </Typography>
                  </Box>
                  {isInsufficientBalance && (
                    <Box
                      sx={{ mt: 5, textAlign: 'center', color: 'error.main' }}
                    >
                      <Typography variant="p-md">
                        Insufficient balance
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', mt: 1, width: '100%' }}>
                    <Button
                      disabled={
                        isInsufficientBalance ||
                        getApprovalLoading ||
                        getUsdcTokenApprovalLoading ||
                        approveThorLoading ||
                        approveUsdcLoading ||
                        isExecuteLoading ||
                        transactionLoading
                      }
                      variant="contained"
                      fullWidth
                      onClick={handleBuyOrApproval}
                      sx={{
                        borderRadius: '0%',
                      }}
                    >
                      <Typography variant="p-md">
                        {approved ? 'Buy NFT' : 'Approval Request'}
                      </Typography>
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

export default BuyNFTModal;
