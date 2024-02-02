import React, { useState, useMemo, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  Box,
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { MODAL_TYPES, useGlobalModalContext } from './GlobleModal';
import {
  useGetApproval,
  useUpdateListNFT,
  useSetApproval,
} from '../../hooks/useNFTDetail';
import { ethers, BigNumberish } from 'ethers';
import { useAccount } from 'wagmi';
import Loader from '../common/Loader';
import {
  useMarketplaceAddress,
  useGetOrderByNft,
  useGetTransaction,
} from '../../hooks/Marketplace';
import {
  dottedAddress,
  formatDecimalsV2,
  formatDecimals,
} from '../../shared/utils/utils';
import { useGetUsdFromAvax, useGetUsdFromThor } from '../../hooks/useOracle';
import { useChain } from '../../utils/web3Utils';
import {
  getValidCurrency,
  isNode as isNodeNFT,
  formatNumber,
} from '../../utils/common';
import { useBalance } from '../../hooks/useToken';
import { ToastSeverity } from '@/redux/slices/toastSlice';
import { useTheme } from '@mui/material/styles';
import CurrencySelect from '@/components/common/CurrencySelect';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  open: boolean;
  handleClose: any;
  openToast?: any;
  refetches?: any[];
  listNFT?: {
    status: any;
    nftName: string;
    by: string;
    nftImage: string;
    nftAddress: string;
    tokenId: string;
  };
};

const UpdateListNft = (props: Props) => {
  const marketplaceAddress = useMarketplaceAddress();
  const { open, handleClose, openToast, listNFT, refetches } = props;
  const user = useSelector((state: any) => state.auth.user);
  const { showModal } = useGlobalModalContext();
  const [listPrice, setListPrice] = useState('0');
  const [listPriceUSD, setListPriceUSD] = useState(0);
  const feePercentage = 2;
  const [listFee, setListFee] = useState(0);
  const [listFeeUSD, setListFeeUSD] = useState(0);
  const [isNode, setIsNode] = useState(true);
  const currencies = getValidCurrency(isNode);
  const [currency, setCurrency] = useState(currencies[0].value);
  const { address: accountAddress } = useAccount();
  const editListNFTToast = {
    message: 'Updating List Price...',
    severity: ToastSeverity.INFO,
    image: listNFT?.nftImage || 'images/nft-placeholder.png',
  };
  const txnToast = {
    message: 'List Price Updated',
    severity: ToastSeverity.SUCCESS,
    image: listNFT?.nftImage || 'images/nft-placeholder.png',
    autoHideDuration: 5000,
  };
  const {
    write: listNFTWrite,
    isLoading: listNFTLoading,
    isSuccess: listNFTSuccess,
    isError: listNFTError,
    data: listTransactionData,
  } = useUpdateListNFT(editListNFTToast);
  const {
    data: writeTransactionResult,
    isError: writeTransactionError,
    isLoading: writeTransactionLoading,
  } = useGetTransaction(listTransactionData?.hash, txnToast);

  const { data: order } = useGetOrderByNft(
    listNFT?.nftAddress,
    Number(listNFT?.tokenId)
  );

  useEffect(() => {
    if (
      refetches &&
      !writeTransactionLoading &&
      !writeTransactionError &&
      writeTransactionResult
    ) {
      refetches.map((refetch: any) => {
        refetch();
      });
    }
  }, [
    writeTransactionResult,
    writeTransactionError,
    writeTransactionLoading,
    refetches,
  ]);
  const {
    write: setApprovalWrite,
    isLoading: setApprovalLoading,
    isSuccess: setApprovalSuccess,
  } = useSetApproval(listNFT?.nftAddress);
  const {
    data: userApproval,
    refetch: refetchGetApproval,
    isLoading: getApprovalLoading,
  } = useGetApproval(accountAddress, listNFT?.nftAddress);

  const chain = useChain();

  const { data: usdFrom1Thor } = useGetUsdFromThor('1', chain);
  const { data: usdFrom1Avax } = useGetUsdFromAvax('1', chain);

  const pricebyCurrency = useMemo(() => {
    if (!(usdFrom1Thor && usdFrom1Avax)) return [0, 0, 0];
    return [formatDecimals(usdFrom1Avax), formatDecimals(usdFrom1Thor), '1'];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usdFrom1Thor, usdFrom1Avax, listPrice]);

  const balance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');
  const usdcBalance = useBalance('USDCE');
  useEffect(() => {
    if (order && listNFT) {
      const price = formatDecimalsV2(
        (order as any)?.price,
        (order as any)?.paymentType === 2 ? 6 : 18
      );
      if (listNFT?.status) setListPrice(price);
      else setListPrice('0');
      setCurrency((order as any)?.paymentType);
    }
  }, [order, listNFT]);

  useEffect(() => {
    const price = Number(listPrice) * Number(pricebyCurrency[currency]);
    setListPriceUSD(price);
    setListFeeUSD((feePercentage / 100) * price);
  }, [currency, listPrice, pricebyCurrency]);

  const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target.value.length < 20) {
      setListPrice(event?.target.value);
      setListFee((feePercentage / 100) * Number(event?.target.value));
    }
  };

  const handleSelectCurrency = (value: number) => {
    setCurrency(value);
  };

  const listPriceError = useMemo(() => {
    if (Number.isNaN(Number(listPrice))) {
      return {
        isError: true,
        message: 'Enter a valid number',
      };
    } else if (Number(listPrice) <= 0) {
      return {
        isError: true,
        message: `List price must be greater than 0`,
      };
    } else {
      return {
        isError: false,
        message: '',
      };
    }
  }, [listPrice]);

  useEffect(() => {
    refetchGetApproval();
  }, [setApprovalSuccess, refetchGetApproval]);

  useEffect(() => {
    if (listNFTSuccess && openToast) {
      openToast({
        isSuccess: true,
        message: 'NFT Listed.',
        timeout: 3000,
        link: `/nft/${listNFT?.nftAddress}/${listNFT?.tokenId}`,
      });
    } else if (listNFTError && openToast) {
      openToast({ isError: true, message: 'Error Occurred.', timeout: 3000 });
    }
  }, [listNFTSuccess, listNFTError, openToast, listNFT]);

  const handleClick = () => {
    if (!user?.address) {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
      handleClose();
      return;
    }

    if (userApproval) {
      const acceptPayment = ['0', '0', '0'];
      acceptPayment[0] = ethers.utils
        .parseEther(
          currency === 0
            ? Number(listPrice).toString()
            : (
                (Number(listPrice) * Number(pricebyCurrency[currency])) /
                Number(pricebyCurrency[0])
              ).toFixed(3)
        )
        .toString();
      acceptPayment[1] = ethers.utils
        .parseEther(
          currency === 1
            ? Number(listPrice).toString()
            : (
                (Number(listPrice) * Number(pricebyCurrency[currency])) /
                Number(pricebyCurrency[1])
              ).toFixed(3)
        )
        .toString();
      acceptPayment[2] = ethers.utils
        .parseUnits(
          currency === 2
            ? Number(listPrice).toString()
            : (
                (Number(listPrice) * Number(pricebyCurrency[currency])) /
                Number(pricebyCurrency[2])
              ).toFixed(3),
          6
        )
        .toString();

      listNFTWrite({
        recklesslySetUnpreparedArgs: [
          1,
          currency,
          listNFT?.nftAddress.toLowerCase(),
          listNFT?.tokenId,
          acceptPayment[currency],
          acceptPayment,
        ],
      });
      handleClose();
    } else {
      setApprovalWrite({
        recklesslySetUnpreparedArgs: [marketplaceAddress, true],
      });
      refetchGetApproval();
    }
  };

  const usdBalancePrice = useMemo(() => {
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
          ? usdFrom1Avax
            ? Number(ethers.utils.formatEther(usdFrom1Avax as BigNumberish))
            : 0
          : currency === 1
          ? usdFrom1Thor
            ? Number(ethers.utils.formatEther(usdFrom1Thor as BigNumberish))
            : 0
          : 1)
      );
    } else {
      return 0;
    }
  }, [balance, thorBalance, currency, usdFrom1Avax, usdFrom1Thor, usdcBalance]);

  useEffect(() => {
    if (listNFT && listNFT.nftAddress) {
      const isNodeNFTAddress = isNodeNFT(listNFT.nftAddress, chain);
      setIsNode(isNodeNFTAddress);
    }
  }, [listNFT, chain]);
  const theme = useTheme();
  const matchSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
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
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: matchSmDown ? '100%' : '190px',
                      height: '26px',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      justifyContent: 'center',
                      aligItems: 'center',
                      mb: matchSmDown ? 1 : 2,
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
                      NFT being listed
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: matchSmDown ? '165px' : '197px',
                      position: 'relative',
                      textAlign: matchSmDown ? 'center' : 'unset',
                    }}
                  >
                    <img
                      src={listNFT?.nftImage || '/images/nftImage.png'}
                      alt="NFTS"
                      width={matchSmDown ? '164px' : '197px'}
                      height="auto"
                    />
                    <Typography
                      variant="lbl-md"
                      sx={{
                        width: '80%',
                        display: 'block',
                        position: 'absolute',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        bottom: '15px',
                        left: '15px',
                        right: 0,
                        marginTop: 1,
                      }}
                    >
                      {listNFT?.nftName ?? ''}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item md={7.5} miniMobile={12} sm={10} xs={12}>
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

                      letterSpacing: '0.04em',
                    }}
                  >
                    List NFT {listNFT?.status ? newFunction() : ''}
                  </Typography>
                  {/* === */}
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
                          {currency === 0
                            ? (balance &&
                                Number(formatDecimals(balance)).toFixed(3)) +
                              ' AVAX'
                            : currency === 1
                            ? (thorBalance &&
                                Number(formatDecimals(thorBalance)).toFixed(
                                  3
                                )) + ' THOR'
                            : (usdcBalance &&
                                Number(formatDecimals(usdcBalance, 6)).toFixed(
                                  3
                                )) + ' USDC.e'}
                        </Typography>
                        <Typography
                          sx={{ fontSize: '12px', textAlign: 'right' }}
                        >
                          {usdBalancePrice &&
                            usdBalancePrice.toFixed(3) + ' 1 USD'}
                        </Typography>
                      </Box>
                    </Box>{' '}
                  </Box>

                  {/* ======================== */}
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ width: '75%', position: 'relative' }}>
                      <TextField
                        inputProps={{
                          sx: {
                            fontSize: '18px',
                            with: '100%',
                          },
                        }}
                        sx={{ width: '95%' }}
                        fullWidth
                        name="price"
                        value={listPrice}
                        type="number"
                        // onChange={handleChangePrice}
                        onChange={handleChangePrice}
                        // onBlur={handleBlur}
                        // error={bidPriceError.isError}
                        // helperText={bidPriceError.message}
                        id="price"
                        label={
                          <Typography
                            sx={{ fontSize: '22px', fontFamily: 'Nexa-Bold' }}
                            variant="p-md"
                          >
                            List price
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
                  {/* ======================== */}

                  <Box sx={{ mt: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: '18px',
                        color: 'text.secondary',
                      }}
                    >
                      {isNode
                        ? listPriceError.isError
                          ? ' '
                          : `${formatNumber(listPriceUSD)} USD`
                        : ''}
                    </Typography>
                  </Box>
                  {/* ======================== */}

                  <Box>
                    <Typography
                      sx={{
                        color: 'success.main',
                        // fontFamily: 'Nexa',
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '14.52px',
                        letterSpacing: '0.03333em',
                        // text-align: left,
                        mb: 3,
                        marginTop: '3px',
                      }}
                    >
                      {isNode
                        ? listPriceError.isError
                          ? ' '
                          : 'You will receive AVAX or THOR depending of buyer choice'
                        : ''}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3,
                    }}
                  >
                    <Typography variant="p-md-bk">Listing fee (2%)</Typography>
                    {isNode ? (
                      <Typography variant="p-md-bk">
                        {formatNumber(listFeeUSD)} USD
                      </Typography>
                    ) : (
                      <Typography variant="p-md-bk">{listFee} AVAX</Typography>
                    )}
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
                      Your Potential Earning
                    </Typography>
                    {isNode ? (
                      <Typography variant="p-md-bk">
                        {formatNumber(listPriceUSD - listFeeUSD)} USD
                      </Typography>
                    ) : (
                      <Typography variant="p-md-bk">
                        {Number(listPrice) - listFee} AVAX
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', mt: 5, width: '100%' }}>
                    <Button
                      type="submit"
                      disabled={
                        listPriceError.isError ||
                        listNFTLoading ||
                        (setApprovalLoading && !setApprovalSuccess) ||
                        getApprovalLoading ||
                        (!setApprovalLoading &&
                          setApprovalSuccess &&
                          !userApproval)
                      }
                      variant="contained"
                      fullWidth
                      onClick={handleClick}
                    >
                      {listNFTLoading ||
                      setApprovalLoading ||
                      getApprovalLoading ||
                      (!setApprovalLoading &&
                        setApprovalSuccess &&
                        !userApproval) ? (
                        <Loader size="2.5rem" sx={{ color: 'white' }} />
                      ) : (
                        <Typography variant="p-md">
                          {userApproval ? 'Edit Price' : 'Approval Request'}
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

  function newFunction(): React.ReactNode {
    return '(EDIT)';
  }
};

export default UpdateListNft;
