import * as React from 'react';
import { useAccount } from 'wagmi';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  NativeSelect,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close, TimerSharp } from '@mui/icons-material';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { MODAL_TYPES, useGlobalModalContext } from './GlobleModal';
import {
  useGetBidByNft,
  useGetOrderByNft,
  useGetOtcBid,
  useMarketplaceAddress,
  useOtcPlaceBid,
  usePlaceBid,
} from '../../hooks/Marketplace';
import {
  dottedAddress,
  formatDecimals,
  formatDecimalsV2,
} from '../../shared/utils/utils';
import {
  useBalance,
  useGetApprovalThor,
  useGetApprovalUSDCE,
  useSetApprovalThor,
  useSetApprovalUSDCE,
} from '../../hooks/useToken';
import { BigNumberish, ethers } from 'ethers';
import { bidType } from '../../utils/constants';
import {
  getValidCurrency,
  isNode as isNodeNFT,
  numberExponentToLarge,
} from '../../utils/common';
import { useChain } from '../../utils/web3Utils';
import {
  useGetAvaxFromThor,
  useGetThorFromAvax,
  useGetUsdFromAvax,
  useGetUsdFromThor,
} from '../../hooks/useOracle';
import { ToastSeverity } from '../../redux/slices/toastSlice';
import { useSetAttribute } from '../../hooks/uiHooks';
import CurrencySelect from '@/components/common/CurrencySelect';

type Props = {
  open: boolean;
  handleClose?: any;
  placingBid?: (val: boolean) => void | undefined;
  collectionAddress?: string | undefined;
  tokenId?: number | undefined;
  acceptPayments?: any[];
  nft?: { image: string | undefined; title: string | undefined } | undefined;
  activeBidType?: string;
};

const PlaceBid = (props: Props) => {
  const {
    open,
    handleClose,
    collectionAddress,
    acceptPayments,
    tokenId,
    nft,
    activeBidType = bidType.DEFAULT,
  } = props;
  const user = useSelector((state: any) => state.auth.user);
  const { showModal } = useGlobalModalContext();
  const { data: order } = useGetOrderByNft(collectionAddress, tokenId);
  const [approved, setApproved] = React.useState(true);
  const chain = useChain();
  const isNode = isNodeNFT(collectionAddress ? collectionAddress : '', chain);
  const { data: lastBid, refetch: refetchLastBid } = useGetBidByNft(
    collectionAddress,
    tokenId
  );
  const { address: accountAddress } = useAccount();
  const { data: lastOtcBid, refetch: refetchLastOtcBid } = useGetOtcBid(
    collectionAddress,
    Number(tokenId)
  );

  const balance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');
  const usdcBalance = useBalance('USDCE');

  const [bidPrice, setBidPrice] = React.useState('0');
  const [lastPrice, setLastPrice] = React.useState([]); // [avax, thor, usdc]
  const [daysToExpire, setDaysToExpire] = React.useState(7);
  const [tempPrice, setTempPrice] = React.useState('0');

  const [isFirstBid, setIsFirstBid] = React.useState(true);

  const expiryTimestamp = React.useMemo(() => {
    return Number(daysToExpire) * 86400; //  days * total seconds in a day
  }, [daysToExpire]);
  const marketplaceAddress = useMarketplaceAddress();

  const { write: approveThor, isLoading: approveThorLoading } =
    useSetApprovalThor();
  const { data: tokenApproval, isLoading: getApprovalLoading } =
    useGetApprovalThor(accountAddress);

  const { data: usdcTokenApproval, isLoading: getUsdcTokenApprovalLoading } =
    useGetApprovalUSDCE(accountAddress);
  const { write: approveUsdc, isLoading: approveUsdcLoading } =
    useSetApprovalUSDCE();

  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: avaxFromThor } = useGetAvaxFromThor('1', chain);
  const { data: thorFromAvax } = useGetThorFromAvax('1', chain);

  const currencies = getValidCurrency(isNode, acceptPayments);

  const [currency, setCurrency] = React.useState(currencies[0].value);

  const nftImage = nft?.image;

  const txnToast = {
    message: 'Bid Placed',
    severity: ToastSeverity.SUCCESS,
    image: nftImage,
    autoHideDuration: 5000,
  };
  const { write: writePlaceBid } = usePlaceBid(txnToast);
  const { write: writeOtcPlaceBid } = useOtcPlaceBid(txnToast);

  React.useEffect(() => {
    if (tokenApproval && currency === 1) {
      setApproved(
        Number(tempPrice) <=
          Number(ethers.utils.formatEther(tokenApproval as BigNumberish))
      );
    } else if (usdcTokenApproval && currency === 2) {
      setApproved(
        Number(tempPrice) <=
          Number(ethers.utils.formatUnits(usdcTokenApproval as BigNumberish, 6))
      );
    } else {
      setApproved(false);
    }
    if (currency === 0) {
      setApproved(true);
    }
  }, [currency, tempPrice, tokenApproval, usdcTokenApproval]);

  const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target.value.length < 20) {
      setBidPrice(event?.target.value);
    }
  };

  const handleChangeDays = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDaysToExpire(Number(event.target.value));
  };

  React.useEffect(() => {
    let price = '0';
    let paymentType = 0;
    if (order) {
      if (
        (lastBid as any)?.bidder ===
          '0x0000000000000000000000000000000000000000' &&
        (lastOtcBid as any)?.bidder ===
          '0x0000000000000000000000000000000000000000'
      ) {
        setIsFirstBid(true);
        paymentType = (order as any)?.paymentType;
        price =
          paymentType === 2
            ? formatDecimalsV2((order as any)?.price, 6)
            : formatDecimalsV2((order as any)?.price);
      } else {
        setIsFirstBid(false);
        if (activeBidType === bidType.DEFAULT && lastBid) {
          paymentType = (lastBid as any)?.paymentType;

          if (
            Number((lastBid as any).expiresAt.toString()) < 3250454400 &&
            Number((lastBid as any).expiresAt.toString()) >
              Math.ceil(Number((new Date() as any) / 1000))
          ) {
            price =
              paymentType === 2
                ? formatDecimalsV2((lastBid as any)?.price, 6)
                : formatDecimalsV2((lastBid as any)?.price);
          }
        } else if (activeBidType === bidType.OTC && lastOtcBid) {
          paymentType = (lastOtcBid as any)?.paymentType;

          if (
            Number((lastOtcBid as any).expiresAt.toString()) < 3250454400 &&
            Number((lastOtcBid as any).expiresAt.toString()) >
              Math.ceil(Number((new Date() as any) / 1000))
          ) {
            price =
              paymentType === 2
                ? formatDecimalsV2((lastOtcBid as any)?.price, 6)
                : formatDecimalsV2((lastOtcBid as any)?.price);
          }
        }
      }
    } else {
      setIsFirstBid(true);
    }

    setCurrency(paymentType);

    if (price && thorFromAvax && avaxFromThor) {
      setTempPrice(price);
      setBidPrice(price);
      if (paymentType === 0) {
        const _thor = (
          Number(price) *
          Number(
            ethers.utils.formatEther(thorFromAvax as BigNumberish).toString()
          )
        ).toFixed(3);
        const _usdc = (
          Number(price) *
          Number(ethers.utils.formatEther(avaxPrice as BigNumberish).toString())
        ).toFixed(3);
        setLastPrice([price, _thor, _usdc]);
      } else if (paymentType === 1) {
        const _avax = (
          Number(price) *
          Number(
            ethers.utils.formatEther(avaxFromThor as BigNumberish).toString()
          )
        ).toFixed(3);
        const _usdc = (
          Number(price) *
          Number(ethers.utils.formatEther(thorPrice as BigNumberish).toString())
        ).toFixed(3);
        setLastPrice([_avax, price, _usdc]);
      } else {
        const _avax = (
          Number(price) *
          Number(ethers.utils.formatEther(avaxPrice as BigNumberish).toString())
        ).toFixed(3);
        const _thor = (
          Number(price) *
          Number(ethers.utils.formatEther(thorPrice as BigNumberish).toString())
        ).toFixed(3);
        setLastPrice([_avax, _thor, price]);
      }
    }
  }, [
    order,
    lastBid,
    lastOtcBid,
    avaxFromThor,
    thorFromAvax,
    activeBidType,
    avaxPrice,
    thorPrice,
  ]);

  React.useEffect(() => {
    setTempPrice(bidPrice);
  }, [bidPrice]);

  const usdPrice = React.useMemo(() => {
    if (tempPrice) {
      return (
        Number(tempPrice) *
        (currency === 0
          ? avaxPrice
            ? Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
            : 0
          : currency === 1
          ? thorPrice
            ? Number(ethers.utils.formatEther(thorPrice as BigNumberish))
            : 0
          : 1)
      );
    } else {
      return 0;
    }
  }, [tempPrice, currency, avaxPrice, thorPrice]);

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
          ? avaxPrice
            ? Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
            : 0
          : currency === 1
          ? thorPrice
            ? Number(ethers.utils.formatEther(thorPrice as BigNumberish))
            : 0
          : 1)
      );
    } else {
      return 0;
    }
  }, [balance, thorBalance, usdcBalance, currency, avaxPrice, thorPrice]);

  const handleSelectCurrency = (value: number) => {
    setCurrency(value);
  };
  const bidPriceError = React.useMemo(() => {
    if (Number.isNaN(Number(bidPrice))) {
      return {
        isError: true,
        message: 'Enter a valid number',
      };
    }

    if (isFirstBid) {
      if (Number(bidPrice) <= 0) {
        return {
          isError: true,
          message: `Bid price must be non zero`,
        };
      }
    } else {
      if (lastPrice) {
        if (Number(bidPrice) <= Number(lastPrice[currency])) {
          return {
            isError: true,
            message: `Bid price must be greater than ${Number(
              lastPrice[currency]
            )} ${
              currencies.filter((_currency) => _currency.value === currency)[0]
                .text
            }`,
          };
        }
      }
    }
    const balanceVal = formatDecimals(balance);
    const thorBalanceVal = formatDecimals(thorBalance);
    const usdcBalanceVal = formatDecimals(usdcBalance, 6);
    if (balanceVal || thorBalanceVal || usdcBalanceVal) {
      if (currency === 0) {
        if (Number(balanceVal) < Number(bidPrice))
          return {
            isError: true,
            message: `Insufficient funds in your wallet`,
          };
      } else if (currency === 1) {
        if (Number(thorBalanceVal) < Number(bidPrice))
          return {
            isError: true,
            message: `Insufficient funds in your wallet`,
          };
      } else if (currency === 2) {
        if (Number(usdcBalanceVal) < Number(bidPrice))
          return {
            isError: true,
            message: `Insufficient funds in your wallet`,
          };
      }
    }
    return { isError: false, message: '' };
  }, [
    bidPrice,
    isFirstBid,
    currency,
    currencies,
    balance,
    thorBalance,
    usdcBalance,
    lastPrice,
  ]);

  const handleClick = async () => {
    if (!approved && currency === 1) {
      approveThor({
        recklesslySetUnpreparedArgs: [
          marketplaceAddress,
          ethers.utils.parseEther(
            numberExponentToLarge(Number(bidPrice).toString())
          ),
        ],
      });
      return;
    }

    if (!approved && currency === 2) {
      approveUsdc({
        recklesslySetUnpreparedArgs: [
          marketplaceAddress,
          ethers.utils.parseUnits(bidPrice, 6),
        ],
      });
      return;
    }

    if (activeBidType === bidType.DEFAULT) {
      writePlaceBid({
        recklesslySetUnpreparedArgs: [
          collectionAddress,
          tokenId,
          currency === 2
            ? ethers.utils.parseUnits(bidPrice.toString(), 6)
            : ethers.utils.parseEther(bidPrice.toString()),
          expiryTimestamp,
          currency,
        ],
        recklesslySetUnpreparedOverrides: {
          from: accountAddress,
          value:
            currency === 0 ? ethers.utils.parseEther(bidPrice.toString()) : 0,
        },
      });
    } else if (activeBidType === bidType.OTC) {
      writeOtcPlaceBid({
        recklesslySetUnpreparedArgs: [
          currency,
          collectionAddress,
          tokenId,
          currency === 2
            ? ethers.utils.parseUnits(bidPrice.toString(), 6)
            : ethers.utils.parseEther(bidPrice.toString()),
          expiryTimestamp,
        ],
        recklesslySetUnpreparedOverrides: {
          from: accountAddress,
          value:
            currency === 0 ? ethers.utils.parseEther(bidPrice.toString()) : 0,
        },
      });
    }
    refetchLastBid();
    refetchLastOtcBid();
    if (!user?.address) {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
      handleClose();
      return;
    }
    handleClose();
  };
  const closePlaceBidModalRef = useSetAttribute([
    { key: 'id', value: 'nodes-close-modal-button' },
    { key: 'dusk', value: 'nodes-close-modal-button' },
  ]);
  const theme = useTheme();
  const matchSmDown = useMediaQuery(theme.breakpoints.down('sm'));

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
                  alignItems: 'center',
                  position: 'relative',
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
                      width: matchSmDown ? '100%' : '190px',
                      height: '26px',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      justifyContent: 'center',
                      aligItems: 'center',
                      mb: matchSmDown ? 1 : 2,
                      paddingTop: 1,
                      // mt: { miniMobile: '49px', sm: '1px' },
                    }}
                  >
                    <Typography
                      variant="p-md"
                      sx={{ color: '#fff', fontSize: { miniMobile: '12px' } }}
                    >
                      PLACING A BID ON
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      // height: matchSmDown ? '164px' : '460px',
                      width: matchSmDown ? 'calc(100vw - 32px)' : '197px',
                      position: 'relative',
                      textAlign: matchSmDown ? 'center' : 'unset',
                    }}
                  >
                    <img
                      src={nft?.image ? nft?.image : '/images/nftImage.png'}
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
                        color: 'white',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        bottom: '15px',
                        left: '15px',
                        right: 0,
                        marginTop: 1,
                      }}
                    >
                      {nft?.title ?? ''}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              md={7.5}
              miniMobile={12}
              sm={10}
              xs={12}
              sx={{ marginTop: matchSmDown ? '-8px' : 'auto' }}
            >
              <Box
                sx={{
                  height: '562px',
                  bgcolor: 'background.paper',
                  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.24)',
                  p: 3,
                  position: 'relative',
                }}
              >
                <IconButton
                  ref={closePlaceBidModalRef}
                  onClick={handleClose}
                  size={'small'}
                  sx={{
                    position: 'absolute',
                    right: 20,
                  }}
                >
                  <Close />
                </IconButton>
                <Box>
                  <Typography
                    variant="sub-h"
                    sx={{
                      display: { miniMobile: 'content', sm: 'flex' },
                      width: '100%',
                      fontWeight: '700',
                      letterSpacing: '0.04em',
                      fontFamily: 'Nexa-Bold',
                    }}
                  >
                    Place a bid
                  </Typography>
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
                        color: !bidPriceError?.isError
                          ? 'text.secondary'
                          : 'error.main',
                      }}
                    >
                      <Typography variant="p-md-bk">
                        Your wallet balance
                      </Typography>
                      <Box>
                        <Typography variant="p-md-bk">
                          {currency === 0
                            ? (balance && formatDecimals(balance)) + ' AVAX'
                            : currency === 1
                            ? (thorBalance && formatDecimals(thorBalance)) +
                              ' THOR'
                            : (usdcBalance && formatDecimals(usdcBalance, 6)) +
                              ' USDC.e'}
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
                        value={bidPrice}
                        type="number"
                        onChange={handleChangePrice}
                        // onBlur={handleBlur}
                        error={bidPriceError.isError}
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

                    <Box mt={'13px'}>
                      <CurrencySelect
                        currencies={currencies}
                        value={currency}
                        onChange={handleSelectCurrency}
                      />
                    </Box>
                  </Box>
                  {/* ======================== */}
                  <Box sx={{ mt: 1, mb: 3 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'text.secondary',
                      }}
                    >
                      {bidPriceError.isError
                        ? ' '
                        : `${usdPrice.toFixed(3)} USD`}
                    </Typography>
                  </Box>
                  {/* === */}
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl
                      fullWidth
                      sx={(theme) => ({
                        'borderBottom': `1px solid ${theme.palette.divider}`,
                        'borderRight': `1px solid ${theme.palette.divider}`,
                        '&:hover': {
                          borderBottom: `2px solid ${theme.palette.divider}`,
                          borderRight: `2px solid ${theme.palette.divider}`,
                        },
                      })}
                    >
                      <InputLabel
                        variant="standard"
                        htmlFor="uncontrolled-native"
                      >
                        <Typography
                          variant="lbl-md"
                          sx={{
                            fontSize: '22px',
                            fontFamily: 'Nexa-Bold',
                          }}
                        >
                          {' '}
                          Bid expires in
                        </Typography>
                      </InputLabel>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box
                          sx={{
                            width: '31px',
                            height: '31px',
                            marginTop: '31px',
                          }}
                        >
                          <TimerSharp sx={{ color: 'text.secondary' }} />
                        </Box>
                        <Box sx={{ width: '90%' }}>
                          <NativeSelect
                            onChange={handleChangeDays}
                            defaultValue={7}
                            fullWidth
                            inputProps={{
                              name: 'age',
                              id: 'uncontrolled-native',
                              sx: {
                                fontSize: '18px',
                                fontWeight: 400,
                                height: '40px',
                                width: '100%',
                              },
                            }}
                            sx={{
                              'mt': 2,
                              '&:before': {
                                border: 'none',
                              },
                              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                                border: 'none',
                              },
                            }}
                          >
                            <option value={7}>7 DAYS</option>
                            <option value={14}>14 DAYS</option>
                            <option value={21}>21 DAYS</option>
                          </NativeSelect>
                        </Box>
                      </Box>
                    </FormControl>
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 4,
                      }}
                    >
                      <Typography
                        variant="p-md-bk"
                        sx={{
                          color: !bidPriceError?.isError
                            ? 'text.primary'
                            : 'error.main',
                        }}
                      >
                        You will pay
                      </Typography>
                      <Typography
                        variant="p-md"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {`${bidPrice} ${
                          currency === 0
                            ? 'AVAX'
                            : currency === 1
                            ? 'THOR'
                            : 'USDC.e'
                        }`}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: !bidPriceError?.isError ? 'none' : 'flex',
                        mt: 0.6,
                      }}
                    >
                      <Box sx={{ m: '0px 2px 0px 0px' }}>
                        <Image
                          src={'/images/warningPlaceBid.svg'}
                          height={14}
                          width={14}
                          objectFit="contain"
                        />
                      </Box>
                      <Typography
                        variant="p-md-bk"
                        sx={{ fontSize: '12px', mt: 0.4, color: 'error.main' }}
                      >
                        {bidPriceError?.message}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', mt: 5, width: '100%' }}>
                    <Button
                      disabled={
                        bidPriceError?.isError ||
                        !writePlaceBid ||
                        !writeOtcPlaceBid ||
                        bidPriceError.isError ||
                        getApprovalLoading ||
                        approveThorLoading ||
                        getUsdcTokenApprovalLoading ||
                        approveUsdcLoading ||
                        (currency === 0 &&
                          Number(formatDecimals(balance)) < Number(bidPrice)) ||
                        (currency === 1 &&
                          Number(formatDecimals(thorBalance)) <
                            Number(bidPrice)) ||
                        (currency === 2 &&
                          Number(formatDecimals(usdcBalance, 6)) <
                            Number(bidPrice))
                      }
                      variant="contained"
                      fullWidth
                      onClick={handleClick}
                    >
                      <Typography variant="p-md">
                        {approved ? 'Place a Bid' : 'Approval Request'}
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

export default PlaceBid;
