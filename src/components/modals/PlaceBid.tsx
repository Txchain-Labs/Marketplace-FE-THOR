import * as React from 'react';
import { useAccount } from 'wagmi';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  Box,
  Grid,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  NativeSelect,
} from '@mui/material';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { MODAL_TYPES, useGlobalModalContext } from './GlobleModal';
import { palette } from '../../theme/palette';
import {
  useGetOrderByNft,
  useGetBidByNft,
  usePlaceBid,
  useOtcPlaceBid,
  useGetOtcBid,
  useMarketplaceAddress,
  useGetTransaction,
} from '../../hooks/Marketplace';
import {
  dottedAddress,
  formatDecimals,
  formatDecimalsV2,
} from '../../shared/utils/utils';
import {
  useSetApprovalThor,
  useBalance,
  useGetApprovalThor,
} from '../../hooks/useToken';
// import dayjs from 'dayjs';
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
import SelectBox from '../common/SelectBox';

type Props = {
  open: boolean;
  handleClose?: any;
  openToast?: any;
  placingBid?: (val: boolean) => void | undefined;
  collectionAddress?: string | undefined;
  tokenId?: number | undefined;
  nft?: { image: string | undefined; title: string | undefined } | undefined;
  activeBidType?: string;
};

const PlaceBid = (props: Props) => {
  const {
    open,
    handleClose,
    collectionAddress,
    tokenId,
    nft,
    placingBid,
    activeBidType = bidType.DEFAULT,
  } = props;
  console.log('nft', nft);
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
  const currencies = getValidCurrency(isNode);
  const [bidPrice, setBidPrice] = React.useState('0');
  const [lastPrice, setLastPrice] = React.useState([]); // [avax, thor]
  // const [usdPrice, setUsdPrice] = React.useState(0);
  const [isLastPrice, setIsLastPrice] = React.useState(false);
  const [daysToExpire, setDaysToExpire] = React.useState(7);
  const [tempPrice, setTempPrice] = React.useState('0');
  const [currency, setCurrency] = React.useState(currencies[0].value);

  console.log('currency', currency, balance, thorBalance);
  const [isFirstBid, setIsFirstBid] = React.useState(true);

  const expiryTimestamp = React.useMemo(() => {
    // const newDate = dayjs().add(daysToExpire, 'day');
    // const timestamp = Math.ceil(Number(newDate as any as number) / 1000);
    // return timestamp;
    return Number(daysToExpire) * 86400; //  days * total seconds in a day
  }, [daysToExpire]);
  const marketplaceAddress = useMarketplaceAddress();

  const {
    write: approveThor,
    isLoading: approveThorLoading,
    isSuccess: setApprovalSuccess,
  } = useSetApprovalThor();
  const {
    data: tokenApproval,
    refetch: refetchGetApproval,
    isLoading: getApprovalLoading,
  } = useGetApprovalThor(accountAddress);
  const nftImage = nft?.image;
  const placeBidToast = {
    message: 'Bid Placing...',
    severity: ToastSeverity.INFO,
    image: nftImage,
    autoHideDuration: 5000,
  };
  const txnToast = {
    message: 'Bid Placed',
    severity: ToastSeverity.SUCCESS,
    image: nftImage,
    autoHideDuration: 5000,
  };
  const {
    data: placeBidData,
    write: writePlaceBid,
    isLoading: placeBidLoading,
  } = usePlaceBid(placeBidToast);
  const {
    data: otcPlaceBidData,
    write: writeOtcPlaceBid,
    isLoading: otcPlaceBidLoading,
  } = useOtcPlaceBid(placeBidToast);
  useGetTransaction(otcPlaceBidData?.hash || placeBidData?.hash, txnToast);

  React.useEffect(() => {
    refetchGetApproval();
  }, [setApprovalSuccess, refetchGetApproval]);

  React.useEffect(() => {
    if (tokenApproval && currency === 1) {
      setApproved(
        Number(tempPrice) <
          Number(ethers.utils.formatEther(tokenApproval as BigNumberish))
      );
    } else {
      setApproved(false);
    }
    if (currency === 0) {
      setApproved(true);
    }
  }, [currency, tempPrice, tokenApproval]);

  const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target.value.length < 20) {
      setBidPrice(event?.target.value);
    }
  };

  const handleChangeDays = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDaysToExpire(Number(event.target.value));
  };

  React.useEffect(() => {
    if (placeBidLoading || otcPlaceBidLoading) {
      // placingBid(true);
    }
  }, [placeBidLoading, otcPlaceBidLoading, placingBid]);

  React.useEffect(() => {
    let price = '0';
    if ((lastBid || lastOtcBid) && order) {
      if (
        (lastBid as any)?.bidder ===
          '0x0000000000000000000000000000000000000000' &&
        (lastOtcBid as any)?.bidder ===
          '0x0000000000000000000000000000000000000000'
      ) {
        setIsFirstBid(true);
        price = formatDecimalsV2((order as any)?.price);
      } else {
        setIsFirstBid(false);
        const simpleBidPrice = formatDecimalsV2((lastBid as any)?.price);
        const otcBidPrice = formatDecimalsV2((lastOtcBid as any)?.price);
        if ((lastBid as any)?.price && (lastOtcBid as any)?.price) {
          if ((lastBid as any)?.price?.lt?.((lastOtcBid as any)?.price)) {
            price = otcBidPrice;
            // (lastOtcBid as any)?.price;
          } else {
            price = simpleBidPrice;
            // (lastBid as any)?.price;
          }
        }
      }
    } else {
      setIsFirstBid(true);
    }
    // price = formatDecimals(price, 18, true);

    if (price) {
      if (!isNode) {
        setBidPrice(price);
        setLastPrice([price, '0']);
      } else {
        setTempPrice(price);
        setBidPrice(price);
        // setLastPrice([price]);
      }
    }
  }, [order, lastBid, lastOtcBid, isNode]);

  React.useEffect(() => {
    setTempPrice(bidPrice);
  }, [bidPrice]);

  const { data: avaxFromThor } = useGetAvaxFromThor(
    tempPrice ? tempPrice : '0',
    chain
  );

  const { data: thorFromAvax } = useGetThorFromAvax(
    tempPrice ? tempPrice : '0',
    chain
  );

  React.useEffect(() => {
    if (order) {
      const paymentType: number = (order as any).paymentType;
      setCurrency(paymentType);
    }
  }, [order]);

  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);

  const usdPrice = React.useMemo(() => {
    if (tempPrice) {
      return (
        Number(tempPrice) *
        (currency === 0
          ? avaxPrice
            ? Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
            : 0
          : thorPrice
          ? Number(ethers.utils.formatEther(thorPrice as BigNumberish))
          : 0)
      );
    } else {
      return 0;
    }
  }, [tempPrice, currency, avaxPrice, thorPrice]);

  const usdBalancePrice = React.useMemo(() => {
    if (balance || thorBalance) {
      const tempTotalPrice =
        currency === 0 ? formatDecimals(balance) : formatDecimals(thorBalance);
      return (
        Number(tempTotalPrice) *
        (currency === 0
          ? avaxPrice
            ? Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
            : 0
          : thorPrice
          ? Number(ethers.utils.formatEther(thorPrice as BigNumberish))
          : 0)
      );
    } else {
      return 0;
    }
  }, [balance, thorBalance, currency, avaxPrice, thorPrice]);

  console.log(
    '============>',
    tempPrice,
    Number(formatDecimals(balance)),
    usdPrice,
    usdBalancePrice
  );

  React.useEffect(() => {
    if (order) {
      if (!isLastPrice) {
        const _lastPrice = ['0', '0'];
        if (currency === 0) {
          if (thorFromAvax) {
            _lastPrice[0] = tempPrice;
            _lastPrice[1] = Number(
              ethers.utils.formatEther(
                (thorFromAvax as BigNumberish).toString()
              )
            ).toFixed(3);
          }
        } else {
          if (avaxFromThor) {
            _lastPrice[1] = tempPrice;
            _lastPrice[0] = Number(
              ethers.utils.formatEther(
                (avaxFromThor as BigNumberish).toString()
              )
            ).toFixed(3);
          }
        }
        if (thorFromAvax && avaxFromThor) {
          setLastPrice(_lastPrice);
          setIsLastPrice(true);
        }
      }
    }
  }, [
    avaxFromThor,
    thorFromAvax,
    currency,
    order,
    lastPrice,
    tempPrice,
    isLastPrice,
  ]);

  const handleSelectCurrency: React.ChangeEventHandler<HTMLSelectElement> = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrency(Number(event.target.value));
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
    }
    const balanceVal = formatDecimals(balance);
    const thorBalanceVal = formatDecimals(thorBalance);
    if (balanceVal || thorBalanceVal) {
      if (!currency) {
        if (Number(balanceVal) < Number(bidPrice))
          return {
            isError: true,
            message: `Insufficient funds in your wallet`,
          };
      } else {
        if (Number(thorBalanceVal) < Number(bidPrice))
          return {
            isError: true,
            message: `Insufficient funds in your wallet`,
          };
      }
    }
    return { isError: false, message: '' };
  }, [bidPrice, isFirstBid, currency, balance, thorBalance]);

  // const expirationMessage = React.useMemo(() => {
  //   const newDate = dayjs().add(daysToExpire, 'day');
  //   return `(Expiration at ${newDate.format('MMM DD, YYYY, h:mm A')})`;
  // }, [daysToExpire]);

  const handleClick = async () => {
    if (isNode && !approved && currency === 1) {
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
    if (activeBidType === bidType.DEFAULT) {
      writePlaceBid({
        recklesslySetUnpreparedArgs: [
          collectionAddress,
          tokenId,
          ethers.utils.parseEther(bidPrice.toString()),
          expiryTimestamp,
          currency,
        ],
        recklesslySetUnpreparedOverrides: {
          from: accountAddress,
          value: isNode
            ? currency === 0
              ? ethers.utils.parseEther(bidPrice.toString())
              : 0
            : ethers.utils.parseEther(bidPrice.toString()),
        },
      });
    } else if (activeBidType === bidType.OTC) {
      writeOtcPlaceBid({
        recklesslySetUnpreparedArgs: [
          currency,
          collectionAddress,
          tokenId,
          ethers.utils.parseEther(bidPrice.toString()),
          expiryTimestamp,
        ],
        recklesslySetUnpreparedOverrides: {
          from: accountAddress,
          value: isNode
            ? currency === 0
              ? ethers.utils.parseEther(bidPrice.toString())
              : 0
            : ethers.utils.parseEther(bidPrice.toString()),
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
    // openToast(isLoading, isSuccess);
    handleClose();
  };
  const closePlaceBidModalRef = useSetAttribute([
    { key: 'id', value: 'nodes-close-modal-button' },
    { key: 'dusk', value: 'nodes-close-modal-button' },
  ]);
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
                      mt: { miniMobile: '49px', sm: '1px' },
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
                    },
                    position: 'absolute',
                    bottom: '20px',
                    left: '16px',
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
                </Box>
              </Box>
            </Grid>
            <Grid item md={7.5} miniMobile={12} sm={10} xs={12}>
              <Box
                sx={{
                  height: '562px',
                  background: '#FAFAFA',
                  boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.24)',
                  p: 3,
                  position: 'relative',
                }}
              >
                <Box
                  ref={closePlaceBidModalRef}
                  sx={{ position: 'absolute', right: 20, cursor: 'pointer' }}
                  onClick={handleClose}
                >
                  <Image src="/images/cross.svg" width={16} height={16} />
                </Box>
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
                        color: !bidPriceError?.isError ? 'black' : '#D90368',
                      }}
                    >
                      <Typography variant="p-md-bk">
                        Your wallet balance
                      </Typography>
                      <Box>
                        <Typography variant="p-md-bk">
                          {isNode
                            ? currency === 0
                              ? (balance && formatDecimals(balance)) + ' AVAX'
                              : (thorBalance && formatDecimals(thorBalance)) +
                                ' THOR'
                            : (balance && formatDecimals(balance)) + ' AVAX'}
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
                            color: 'rgba(0, 0, 0, 0.24)',
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
                  {/* ======================== */}
                  <Box sx={{ mt: 1, mb: 3 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'rgba(0, 0, 0, 0.24)',
                      }}
                    >
                      {isNode
                        ? bidPriceError.isError
                          ? ' '
                          : `${usdPrice.toFixed(3)} USD`
                        : ''}
                    </Typography>
                  </Box>
                  {/* === */}
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl
                      fullWidth
                      sx={{
                        'borderBottom': '1px solid rgba(0, 0, 0)',
                        'borderRight': '1px solid rgba(0, 0, 0)',
                        '&:hover': {
                          borderBottom: '2px solid rgba(0, 0, 0)',
                          borderRight: '2px solid rgba(0, 0, 0)',
                        },
                      }}
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
                          <Image
                            src={'/images/timeIcon.svg'}
                            height={20}
                            width={20}
                          />
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
                  {/* <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3,
                    }}
                  ></Box> */}

                  {/* ======================== */}

                  {/* <Divider
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', mb: 1.5 }}
                  /> */}
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
                          color: !bidPriceError?.isError ? 'black' : '#D90368',
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
                        {bidPrice}{' '}
                        {isNode ? currencies[currency].label : 'AVAX'}
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
                        sx={{ fontSize: '12px', mt: 0.4, color: '#D90368' }}
                      >
                        {bidPriceError?.message}
                      </Typography>
                    </Box>

                    {/* bidPriceError.isError */}
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
                        (isNode &&
                          currency === 0 &&
                          Number(formatDecimals(balance)) < Number(bidPrice)) ||
                        (isNode &&
                          currency === 1 &&
                          Number(formatDecimals(thorBalance)) <
                            Number(bidPrice)) ||
                        (!isNode &&
                          Number(formatDecimals(balance)) < Number(bidPrice))
                      }
                      variant="contained"
                      onClick={handleClick}
                      sx={{
                        'borderRadius': '0%',
                        'width': '100%',
                        'maxWidth': '100%',
                        'background': 'black',
                        '&:hover': { backgroundColor: 'black' },
                      }}
                    >
                      <Typography variant="p-md">
                        {isNode
                          ? approved
                            ? 'Place a Bid'
                            : 'Approval Request'
                          : 'Place Bid'}
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
