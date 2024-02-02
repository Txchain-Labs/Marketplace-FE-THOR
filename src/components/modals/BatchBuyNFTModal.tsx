import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import {
  Grid,
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  Collapse,
  Card,
  CardContent,
  CardActions,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButtonProps } from '@mui/material/IconButton';
import { MODAL_TYPES, useGlobalModalContext } from './GlobleModal';

import { dottedAddress, formatDecimals } from '../../shared/utils/utils';
import { formatNumber } from '../../utils/common';

import {
  useSetApprovalThor,
  useBalance,
  useGetApprovalThor,
  useGetApprovalUSDCE,
  useSetApprovalUSDCE,
} from '../../hooks/useToken';
import {
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
import NFTSlider, { NFTSlide } from '../common/NFTSlider';
import { resetAll } from '../../redux/slices/cartSlice';
import { Listing } from '@/models/Listing';
import { ToastSeverity } from '@/redux/slices/toastSlice';
import CurrencySelect from '@/components/common/CurrencySelect';
import { Currency } from '@/components/common/CurrencySelect/CurrencySelect';
import { Currencies } from '@/utils/constants';
import AvaxIcon from '@/components/icons/currencies/Avax';
import ThorIcon from '@/components/icons/currencies/Thor';
import UsdceIcon from '@/components/icons/currencies/Usdce';
import CloseIcon from '@mui/icons-material/Close';
import { toAvax, toThor, toUsd } from '@/utils/helper';

const currencyLabel = ['AVAX', 'THOR', 'USDC.e'];

type Props = {
  open: boolean;
  handleClose: any;
  totalUsdPrice: number;
  nfts: Listing[];
};

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const BatchBuyNFTModal = (props: Props) => {
  const { showModal } = useGlobalModalContext();

  const { open, handleClose, totalUsdPrice, nfts } = props;

  const user = useSelector((state: any) => state.auth.user);

  const [approved, setApproved] = useState(true);
  const [currencies, setCurrencies] = useState<Currency[]>(Currencies);

  const [currency, setCurrency] = useState(currencies[0].value);
  const [expanded, setExpanded] = useState(false);
  const [nftAddress, setNftAddress] = useState([]);
  const [tokenId, setTokenId] = useState([]);
  const [priceByCurrency, setPriceByCurrency] = useState([[], [], []]);

  const chain = useChain();
  const { address: accountAddress } = useAccount();
  const marketplaceAddress = useMarketplaceAddress();

  const dispatch = useDispatch();

  const theme = useTheme();

  const matchLgUp = useMediaQuery(theme.breakpoints.up('sm'));
  const matchSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const balance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');
  const usdcBalance = useBalance('USDCE');

  const { data: usdFromThor } = useGetUsdFromThor('1', chain);
  const { data: usdFromAvax } = useGetUsdFromAvax('1', chain);
  const { data: avaxFromThor } = useGetAvaxFromThor('1', chain);
  const { data: thorFromAvax } = useGetThorFromAvax('1', chain);

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
    message: 'NFTs Buying...',
    severity: ToastSeverity.INFO,
    image: nfts[0]?.image || 'images/nft-placeholder.png',
    itemCount: nfts ? nfts?.length : 0,
  };
  const txnToast = {
    message: 'NFTs Bought',
    severity: ToastSeverity.SUCCESS,
    image: nfts[0]?.image || 'images/nft-placeholder.png',
    autoHideDuration: 5000,
    itemCount: nfts ? nfts?.length : 0,
  };
  const {
    write,
    data: executeData,
    isLoading: isExecuteLoading,
  } = useExecuteOrder(buyNFTToast);
  const { isLoading: transactionLoading, isSuccess: isTransactionSuccess } =
    useGetTransaction(executeData?.hash, txnToast);

  const totalPriceByCurrency = useMemo(() => {
    if (!nfts || !avaxFromThor || !thorFromAvax || !usdFromAvax || !usdFromThor)
      return [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)];

    const _totalPriceByCurrency = [
      BigNumber.from(0),
      BigNumber.from(0),
      BigNumber.from(0),
    ];
    const _token_address: any[] = [];
    const _token_id: any[] = [];
    const _priceByCurrency: any[] = [[], [], []];
    const avaxPriceByNFT: any[] = [];
    const thorPriceByNFT: any[] = [];
    const usdcPriceByNFT: any[] = [];
    nfts.forEach((item: Listing) => {
      const nftAvaxPrice = toAvax(
          item.priceInWei,
          item.paymentType,
          avaxFromThor,
          usdFromAvax
        ),
        nftThorPrice = toThor(
          item.priceInWei,
          item.paymentType,
          thorFromAvax,
          usdFromThor
        ),
        nftUsdPrice = toUsd(
          item.priceInWei,
          item.paymentType,
          usdFromAvax,
          usdFromThor
        );

      _totalPriceByCurrency[0] = _totalPriceByCurrency[0].add(nftAvaxPrice);
      avaxPriceByNFT.push(nftAvaxPrice);
      thorPriceByNFT.push(nftThorPrice);
      usdcPriceByNFT.push(nftUsdPrice);
      _totalPriceByCurrency[1] = _totalPriceByCurrency[1].add(nftThorPrice);
      _totalPriceByCurrency[2] = _totalPriceByCurrency[2].add(nftUsdPrice);

      _token_address.push(item.nftAddress);
      _token_id.push(item.tokenId);
    });
    _priceByCurrency[0] = avaxPriceByNFT;
    _priceByCurrency[1] = thorPriceByNFT;
    _priceByCurrency[2] = usdcPriceByNFT;
    setNftAddress(_token_address);
    setTokenId(_token_id);
    setPriceByCurrency(_priceByCurrency);
    return _totalPriceByCurrency;
  }, [nfts, thorFromAvax, avaxFromThor, usdFromAvax, usdFromThor]);

  const isInsufficientBalance = useMemo(() => {
    return (
      (currency === 0 &&
        balance &&
        Number(formatDecimals(balance)) <
          Number(
            ethers.utils.formatEther(totalPriceByCurrency[currency] || 0)
          )) ||
      (currency === 1 &&
        thorBalance &&
        Number(formatDecimals(thorBalance)) <
          Number(
            ethers.utils.formatEther(totalPriceByCurrency[currency] || 0)
          )) ||
      (currency === 2 &&
        usdcBalance &&
        Number(formatDecimals(usdcBalance, 6)) <
          Number(
            ethers.utils.formatUnits(totalPriceByCurrency[currency] || 0, 6)
          ))
    );
  }, [currency, balance, totalPriceByCurrency, thorBalance, usdcBalance]);

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
          : 1)
      );
    } else {
      return 0;
    }
  }, [balance, thorBalance, usdcBalance, currency, usdFromAvax, usdFromThor]);

  useEffect(() => {
    const availablePaymentType = [true, true, true];
    const currencyArr: Currency[] = [];
    for (const item of nfts) {
      availablePaymentType[0] &&= item.acceptPayments[0] !== '0';
      availablePaymentType[1] &&= item.acceptPayments[1] !== '0';
      availablePaymentType[2] &&= item.acceptPayments[2] !== '0';
      if (
        +availablePaymentType[0] +
          +availablePaymentType[1] +
          +availablePaymentType[2] ===
        0
      ) {
        break;
      }
    }
    availablePaymentType.forEach((type, index) => {
      if (type) {
        currencyArr.push({
          value: index,
          text: currencyLabel[index],
          icon:
            index === 0 ? (
              <AvaxIcon viewBox={'0 0 18 15'} />
            ) : index === 1 ? (
              <ThorIcon viewBox={'0 0 25 20'} />
            ) : (
              <UsdceIcon viewBox={'0 0 15 14'} />
            ),
        });
      }
    });
    setCurrencies(currencyArr);
    setCurrency(currencyArr[0].value);
  }, [nfts]);

  // Refetch approval amount when approval success
  useEffect(() => {
    refetchGetApproval();
  }, [setApprovalSuccess, refetchGetApproval]);

  useEffect(() => {
    refetchGetUsdcTokenApproval();
  }, [setUsdcApprovalSuccess, refetchGetUsdcTokenApproval]);

  // Set approved state
  useEffect(() => {
    if (tokenApproval && currency === 1) {
      setApproved(
        totalPriceByCurrency[currency].lte(tokenApproval as BigNumberish)
      );
    } else if (usdcTokenApproval && currency === 2) {
      setApproved(
        totalPriceByCurrency[currency].lte(usdcTokenApproval as BigNumberish)
      );
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
    totalPriceByCurrency,
    usdcTokenApproval,
  ]);

  useEffect(() => {
    if (isTransactionSuccess === true) {
      dispatch(resetAll());
      handleClose();
    }
  }, [isTransactionSuccess, handleClose, dispatch]);

  const handleSelectCurrency = (value: number) => {
    setCurrency(value);
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

    if (totalPriceByCurrency.length < 2) return;

    // Approve when purchase by THOR
    if (!approved && currency === 1) {
      approveThor({
        recklesslySetUnpreparedArgs: [
          marketplaceAddress,
          totalPriceByCurrency[currency],
        ],
      });
    } else if (!approved && currency === 2) {
      approveUsdc({
        recklesslySetUnpreparedArgs: [
          marketplaceAddress,
          totalPriceByCurrency[currency],
        ],
      });
    }
    // Purchase by AVAX
    else {
      write({
        recklesslySetUnpreparedArgs: [
          nftAddress,
          tokenId,
          priceByCurrency[currency],
          currency,
        ],
        recklesslySetUnpreparedOverrides: {
          from: user?.address,
          value:
            currency === 0 ? totalPriceByCurrency[currency] : BigNumber.from(0),
        },
      });
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
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
          'zIndex': 10002,
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
        <Box
          sx={{
            width: '100%',
            background: 'transparent',
            p: 1,
            overflowX: 'hidden',
          }}
        >
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
                      Buying NFTs
                    </Typography>
                  </Box>
                  <Box>
                    <NFTSlider
                      slides={nfts.map(
                        (item: any) =>
                          ({
                            key: item.matadata?.tokenId,
                            image: item.image,
                            title: item.metadata?.name,
                          } as NFTSlide)
                      )}
                      key={'NFTSlider'}
                      direction={matchLgUp ? 'vertical' : 'horizontal'}
                      size={matchSmDown ? 'small' : 'medium'}
                      hideTitle={matchSmDown}
                      fullHeightOffset={matchSmDown ? 72 : 48}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item md={7.5} miniMobile={12} sm={10} xs={12}>
              <Box
                sx={{
                  // height: '590px',
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
                    Buy Assets
                  </Typography>
                  {/* ============= */}
                  <Box
                    sx={(theme) => ({
                      display: { miniMobile: 'content', sm: 'block' },
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.2,
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
                      }}
                    >
                      <Typography variant="p-md-bk" sx={{ fontSize: '16px' }}>
                        Your wallet balance
                      </Typography>
                      <Box>
                        <Typography variant="p-md-bk">
                          {currency === 0
                            ? (balance &&
                                parseFloat(
                                  Number(formatDecimals(balance)).toFixed(3)
                                )) + ' AVAX'
                            : currency === 1
                            ? (thorBalance &&
                                parseFloat(
                                  Number(formatDecimals(thorBalance)).toFixed(3)
                                )) + ' THOR'
                            : (usdcBalance &&
                                parseFloat(
                                  Number(
                                    formatDecimals(usdcBalance, 6)
                                  ).toFixed(3)
                                )) + ' USDC.e'}
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
                  {/* ============= */}
                  <Box>
                    <Card
                      sx={{
                        background: 'transparent',
                        border: 0,
                        borderRadiu: 0,
                        boxShadow: 'none',
                      }}
                    >
                      <CardActions
                        disableSpacing
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          p: '8px 0 0',
                        }}
                      >
                        <Typography variant="p-md">
                          {nfts.length} Items
                        </Typography>
                        <Box
                          display={'flex'}
                          sx={{ color: 'text.secondary', alignItems: 'center' }}
                        >
                          <Typography variant="p-md">Details</Typography>
                          <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                          >
                            <ExpandMoreIcon />
                          </ExpandMore>
                        </Box>
                      </CardActions>
                      <Collapse
                        in={expanded}
                        timeout="auto"
                        sx={{ pb: '5px', color: 'text.secondary' }}
                        unmountOnExit
                      >
                        <CardContent
                          sx={{
                            p: 0,
                            maxHeight: '135px',
                            overflowY: 'auto',
                          }}
                        >
                          {nfts?.map((nft, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 1,
                              }}
                            >
                              <Typography
                                variant="p-md"
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  lineHeight: '24px',
                                  pr: '20px',
                                }}
                              >
                                {nft.metadata?.name}
                              </Typography>
                              <Typography
                                variant="p-md"
                                sx={{
                                  minWidth: '140px',
                                  textAlign: 'right',
                                  lineHeight: '24px',
                                }}
                              >
                                {formatNumber(nft.usdPrice)} USD
                              </Typography>
                            </Box>
                          ))}
                        </CardContent>
                      </Collapse>
                    </Card>
                  </Box>
                  {/* ============= */}
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ width: '75%', position: 'relative' }}>
                      <TextField
                        inputProps={{
                          sx: {
                            fontSize: '18px',
                            // color: 'rgba(0, 0, 0, 0.9)',
                            with: '100%',
                          },
                        }}
                        sx={{ width: '95%' }}
                        fullWidth
                        name="price"
                        value={parseFloat(
                          Number(
                            currency === 2
                              ? ethers.utils.formatUnits(
                                  totalPriceByCurrency[currency] || 0,
                                  6
                                )
                              : ethers.utils.formatEther(
                                  totalPriceByCurrency[currency] || 0
                                )
                          ).toFixed(3)
                        )}
                        type="number"
                        id="price"
                        label={
                          <Typography
                            sx={{ fontSize: '22px', fontFamily: 'Nexa-Bold' }}
                            variant="p-md"
                          >
                            Items total Price
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
                  {/* ============= */}
                  <Box sx={{ mt: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'text.secondary',
                      }}
                    >
                      {`${formatNumber(totalUsdPrice)} USD`}
                    </Typography>
                  </Box>
                  {/* ============= */}

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 4,
                      mt: 4,
                    }}
                  >
                    <Typography variant="lbl-lg">You will pay</Typography>
                    <Typography variant="lbl-lg">
                      {parseFloat(
                        Number(
                          currency === 2
                            ? ethers.utils.formatUnits(
                                totalPriceByCurrency[currency] || 0,
                                6
                              )
                            : ethers.utils.formatEther(
                                totalPriceByCurrency[currency] || 0
                              )
                        )?.toFixed(3)
                      )}{' '}
                      {currencyLabel[currency]}
                    </Typography>
                  </Box>
                  {isInsufficientBalance && (
                    <Box
                      sx={{ mt: 3, textAlign: 'center', color: 'primary.main' }}
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
                        approveUsdcLoading ||
                        approveThorLoading ||
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
                        {approved ? 'Buy nodes' : 'Approval Request'}
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

export default BatchBuyNFTModal;
