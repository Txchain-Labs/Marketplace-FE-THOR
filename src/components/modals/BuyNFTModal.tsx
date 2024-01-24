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
} from '@mui/material';

import { MODAL_TYPES, useGlobalModalContext } from './GlobleModal';
import { palette } from '../../theme/palette';

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

import SelectBox from '../common/SelectBox';

type Props = {
  open: boolean;
  handleClose?: any;
  openToast?: any;
  collectionAddress?: string | undefined;
  refresh?: any;
  tokenId?: number | undefined;
  nft?: { image: string | undefined; title: string | undefined } | undefined;
};

const BuyNFTModal = (props: Props) => {
  const { showModal } = useGlobalModalContext();

  const { open, handleClose, collectionAddress, tokenId, nft, refresh } = props;

  const user = useSelector((state: any) => state.auth.user);

  const [approved, setApproved] = useState(true);

  const chain = useChain();
  const { address: accountAddress } = useAccount();
  const marketplaceAddress = useMarketplaceAddress();

  const { data: order }: any = useGetOrderByNft(collectionAddress, tokenId);
  const isNode = isNodeNFT(collectionAddress ? collectionAddress : '', chain);
  const currencies = getValidCurrency(isNode);
  const [currency, setCurrency] = useState(currencies[0].value);

  console.log([currencies]);

  const balance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');

  const { data: usdFromThor } = useGetUsdFromThor('1', chain);
  const { data: usdFromAvax } = useGetUsdFromAvax('1', chain);
  const { data: avaxFromThor } = useGetAvaxFromThor('1', chain);
  const { data: thorFromAvax } = useGetThorFromAvax('1', chain);
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

  // [AVAX, THOR, USDCE]
  const priceByTokens = useMemo(() => {
    if (!order || !avaxFromThor || !thorFromAvax)
      return [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)];

    const { price } = order;

    const changedPriceByTokens = [];

    // Listed by AVAX
    if (Number((order as any).paymentType) === 0) {
      changedPriceByTokens[0] = BigNumber.from(price);
      changedPriceByTokens[1] = BigNumber.from(price)
        .mul(thorFromAvax as BigNumberish)
        .div('1000000000000000000');
      changedPriceByTokens[2] = BigNumber.from(price)
        .mul(usdFromAvax as BigNumberish)
        .div('1000000000000000000');
    }
    // Listed by THOR
    else {
      changedPriceByTokens[0] = BigNumber.from(price)
        .mul(avaxFromThor as BigNumberish)
        .div('1000000000000000000');
      changedPriceByTokens[1] = BigNumber.from(price);
      changedPriceByTokens[2] = BigNumber.from(price)
        .mul(usdFromThor as BigNumberish)
        .div('1000000000000000000');
    }

    return changedPriceByTokens;
  }, [order, avaxFromThor, thorFromAvax, usdFromThor, usdFromAvax]);

  const isInsufficientBalance = useMemo(() => {
    return (
      (isNode &&
        currency === 0 &&
        balance &&
        Number(formatDecimals(balance)) <
          Number(ethers.utils.formatEther(priceByTokens[currency] || 0))) ||
      (isNode &&
        currency !== 0 &&
        thorBalance &&
        Number(formatDecimals(thorBalance)) <
          Number(ethers.utils.formatEther(priceByTokens[currency] || 0))) ||
      (!isNode &&
        balance &&
        Number(formatDecimals(balance)) <
          Number(ethers.utils.formatEther(priceByTokens[currency] || 0)))
    );
  }, [balance, thorBalance, currency, isNode, priceByTokens]);

  const usdBalancePrice = React.useMemo(() => {
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
  // Refetch approval amount when approval success
  useEffect(() => {
    refetchGetApproval();
  }, [setApprovalSuccess, refetchGetApproval]);

  // Set approved state
  useEffect(() => {
    if (tokenApproval && currency === 1) {
      setApproved(priceByTokens[currency].lte(tokenApproval as BigNumberish));
    } else {
      setApproved(false);
    }
    if (currency === 0) {
      setApproved(true);
    }
  }, [
    currency,
    tokenApproval,
    setApprovalSuccess,
    approveThorLoading,
    priceByTokens,
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

  const handleSelectCurrency: React.ChangeEventHandler<HTMLSelectElement> = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrency(Number(event.target.value));
  };

  const handleBuyOrApproval = async () => {
    if (!user?.address) {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
      handleClose();
      return;
    }

    if (priceByTokens.length < 2) return;

    // Approve when purchase by THOR
    if (isNode && !approved && currency === 1) {
      approveThor({
        recklesslySetUnpreparedArgs: [
          marketplaceAddress,
          priceByTokens[currency],
        ],
      });
    }
    // Purchase by AVAX
    else {
      write({
        recklesslySetUnpreparedArgs: [
          [collectionAddress],
          [tokenId],
          [priceByTokens[currency]],
          currency,
        ],
        recklesslySetUnpreparedOverrides: {
          from: user?.address,
          value: currency === 0 ? priceByTokens[currency] : BigNumber.from(0),
        },
      });
    }
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
        hideBackdrop={true}
        disableScrollLock
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
                      background: palette.primary.fire,
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

                      fontWeight: '700',
                      fontFamily: 'Nexa',
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
                sx={{
                  // height: '590px',
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
                      fontWeight: '700',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Buy a node
                  </Typography>
                  {/* ============= */}
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
                            color: 'rgba(0, 0, 0, 0.24)',
                            with: '100%',
                          },
                        }}
                        sx={{ width: '95%' }}
                        fullWidth
                        name="price"
                        value={Number(
                          ethers.utils.formatEther(priceByTokens[currency] || 0)
                        )?.toFixed(3)}
                        type="number"
                        // onChange={handleChangePrice}
                        // onBlur={handleBlur}
                        // error={bidPriceError.isError}
                        // helperText={bidPriceError.message}
                        id="price"
                        label={
                          <Typography
                            sx={{ fontSize: '22px', fontFamily: 'Nexa-Bold' }}
                            variant="p-md"
                          >
                            Your bid
                          </Typography>
                        }
                        variant="standard"
                      />
                    </Box>

                    <Box
                      sx={{
                        'display': 'flex',
                        // position: 'absolute',
                        'alignItems': 'center',
                        'top': '15px',
                        'left': '70%',
                        'borderBottom': '1px solid rgba(0, 0, 0)',
                        'borderRight': '1px solid rgba(0, 0, 0)',
                        '&:hover': {
                          borderBottom: '2px solid rgba(0, 0, 0)',
                          borderRight: '2px solid rgba(0, 0, 0)',
                        },
                      }}
                    >
                      <Box sx={{ m: '0px 12px 0px 8px' }}>
                        <Image
                          src={`/images/${
                            currency === 0 ? 'avax' : 'thor'
                          }Icon.svg`}
                          height={14}
                          width={14}
                          objectFit="contain"
                        />
                      </Box>
                      <SelectBox
                        onChange={handleSelectCurrency}
                        defaultValue={currency}
                        options={currencies}
                        value={currency}
                      />
                    </Box>
                  </Box>

                  {/* ============================ */}
                  <Box sx={{ mt: 1, mb: 3 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'rgba(0, 0, 0, 0.24)',
                      }}
                    >
                      {isNode
                        ? `${formatNumber(
                            ethers.utils.formatEther(priceByTokens[2])
                          )} USD`
                        : ''}
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
                          ethers.utils.formatEther(priceByTokens[currency] || 0)
                        ) * 0.0025
                      )?.toFixed(3)}
                      {!currency ? ' AVAX' : ' THOR'}
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
                        ethers.utils.formatEther(priceByTokens[currency] || 0)
                      )?.toFixed(3)}{' '}
                      {isNode ? currencies[currency].label : 'AVAX'}
                    </Typography>
                  </Box>
                  {isInsufficientBalance && (
                    <Box sx={{ mt: 5, textAlign: 'center', color: 'red' }}>
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
                        approveThorLoading ||
                        isExecuteLoading ||
                        transactionLoading
                      }
                      variant="contained"
                      onClick={handleBuyOrApproval}
                      sx={{
                        borderRadius: '0%',
                        width: '100%',
                        maxWidth: '100%',
                      }}
                    >
                      <Typography variant="p-md">
                        {isNode
                          ? approved
                            ? 'Buy NFT'
                            : 'Approval Request'
                          : 'Buy NFT'}
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
