import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { palette } from '../../theme/palette';

import { dottedAddress, formatDecimals } from '../../shared/utils/utils';
import { formatNumber } from '../../utils/common';

import {
  useSetApprovalThor,
  useBalance,
  useGetApprovalThor,
} from '../../hooks/useToken';
import {
  useMarketplaceAddress,
  useExecuteOrder,
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
import SelectBox from '../common/SelectBox';

const currencies = [
  {
    value: 0,
    label: 'AVAX',
  },
  {
    value: 1,
    label: 'THOR',
  },
];

type Props = {
  open: boolean;
  handleClose: any;
  totalUsdPrice: number;
  nfts: any[];
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
  const [currency, setCurrency] = useState(currencies[0].value);
  const [expanded, setExpanded] = useState(false);
  const [nftAddress, setNftAddress] = useState([]);
  const [tokenId, setTokenId] = useState([]);
  const [priceByCurrency, setPriceByCurrency] = useState([[], []]);

  const chain = useChain();
  const { address: accountAddress } = useAccount();
  const marketplaceAddress = useMarketplaceAddress();
  // const { data: order }: any = useGetOrderByNft(collectionAddress, tokenId);

  const dispatch = useDispatch();

  const theme = useTheme();

  const matchLgUp = useMediaQuery(theme.breakpoints.up('sm'));
  const matchSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const balance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');

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
    write,
    data: executeData,
    isLoading: isExecuteLoading,
  } = useExecuteOrder();
  const { isLoading: transactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({ hash: executeData?.hash });

  const totalPriceByCurrency = useMemo(() => {
    if (!nfts || !avaxFromThor || !thorFromAvax)
      return [BigNumber.from(0), BigNumber.from(0)];

    const _totalPriceByCurrency = [BigNumber.from(0), BigNumber.from(0)];
    const _nftAddress: any[] = [];
    const _tokenId: any[] = [];
    const _priceByCurrency: any[] = [[], []];
    const avaxPriceByNFT: any[] = [];
    const thorPriceByNFT: any[] = [];
    nfts.forEach((item: any) => {
      if (Number(item?.paymentType) === 0) {
        _totalPriceByCurrency[0] = _totalPriceByCurrency[0].add(
          BigNumber.from(item?.priceInWei)
        );
        avaxPriceByNFT.push(item?.priceInWei);
        _totalPriceByCurrency[1] = _totalPriceByCurrency[1].add(
          BigNumber.from(item?.priceInWei)
            .mul(thorFromAvax as BigNumberish)
            .div('1000000000000000000')
        );
        thorPriceByNFT.push(
          BigNumber.from(item?.priceInWei)
            .mul(thorFromAvax as BigNumberish)
            .div('1000000000000000000')
        );
      } else {
        _totalPriceByCurrency[0] = _totalPriceByCurrency[0].add(
          BigNumber.from(item?.priceInWei)
            .mul(avaxFromThor as BigNumberish)
            .div('1000000000000000000')
        );
        avaxPriceByNFT.push(
          BigNumber.from(item?.priceInWei)
            .mul(avaxFromThor as BigNumberish)
            .div('1000000000000000000')
        );
        _totalPriceByCurrency[1] = _totalPriceByCurrency[1].add(
          BigNumber.from(item?.priceInWei)
        );
        thorPriceByNFT.push(item?.priceInWei);
      }
      _nftAddress.push(item.nftAddress);
      _tokenId.push(item.tokenId);
    });
    _priceByCurrency[0] = avaxPriceByNFT;
    _priceByCurrency[1] = thorPriceByNFT;
    setNftAddress(_nftAddress);
    setTokenId(_tokenId);
    setPriceByCurrency(_priceByCurrency);
    return _totalPriceByCurrency;
  }, [nfts, thorFromAvax, avaxFromThor]);

  // const priceByTokens = useMemo(() => {
  //   if (!order || !avaxFromThor || !thorFromAvax)
  //     return [BigNumber.from(0), BigNumber.from(0), BigNumber.from(0)];

  //   const { price } = order;

  //   const changedPriceByTokens = [];

  //   // Listed by AVAX
  //   if (Number((order as any).paymentType) === 0) {
  //     changedPriceByTokens[0] = BigNumber.from(price);
  //     changedPriceByTokens[1] = BigNumber.from(price)
  //       .mul(thorFromAvax as BigNumberish)
  //       .div('1000000000000000000');
  //     changedPriceByTokens[2] = BigNumber.from(price)
  //       .mul(usdFromAvax as BigNumberish)
  //       .div('1000000000000000000');
  //   }
  //   // Listed by THOR
  //   else {
  //     changedPriceByTokens[0] = BigNumber.from(price)
  //       .mul(avaxFromThor as BigNumberish)
  //       .div('1000000000000000000');
  //     changedPriceByTokens[1] = BigNumber.from(price);
  //     changedPriceByTokens[2] = BigNumber.from(price)
  //       .mul(usdFromThor as BigNumberish)
  //       .div('1000000000000000000');
  //   }

  //   return changedPriceByTokens;
  // }, [order, avaxFromThor, thorFromAvax, usdFromThor, usdFromAvax]);

  const isInsufficientBalance = useMemo(() => {
    return (
      (currency === 0 &&
        balance &&
        Number(formatDecimals(balance)) <
          Number(
            ethers.utils.formatEther(totalPriceByCurrency[currency] || 0)
          )) ||
      (currency !== 0 &&
        thorBalance &&
        Number(formatDecimals(thorBalance)) <
          Number(ethers.utils.formatEther(totalPriceByCurrency[currency] || 0)))
    );
  }, [balance, thorBalance, currency, totalPriceByCurrency]);

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
      setApproved(
        totalPriceByCurrency[currency].lte(tokenApproval as BigNumberish)
      );
    } else {
      setApproved(false);
    }
    if (currency === 0) {
      setApproved(true);
    }

    console.log('totalPriceByCurrency----------' + totalPriceByCurrency);
  }, [
    currency,
    tokenApproval,
    setApprovalSuccess,
    approveThorLoading,
    totalPriceByCurrency,
  ]);

  useEffect(() => {
    if (isTransactionSuccess === true) {
      dispatch(resetAll());
      handleClose();
    }
  }, [isTransactionSuccess, handleClose, dispatch]);

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

    if (totalPriceByCurrency.length < 2) return;

    // Approve when purchase by THOR
    if (!approved && currency === 1) {
      approveThor({
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

  useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = open ? 'hidden' : 'auto';
    }
  }, [open]);

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
                    Buy nodes
                  </Typography>
                  {/* ============= */}
                  <Box
                    sx={{
                      display: { miniMobile: 'content', sm: 'block' },
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.2,
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
                            : (thorBalance &&
                                parseFloat(
                                  Number(formatDecimals(thorBalance)).toFixed(3)
                                )) + ' THOR'}
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
                          sx={{ color: '#4C4C4C', alignItems: 'center' }}
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
                        sx={{ pb: '5px', color: '#4C4C4C' }}
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
                            color: 'rgba(0, 0, 0, 0.24)',
                            with: '100%',
                          },
                        }}
                        sx={{ width: '95%' }}
                        fullWidth
                        name="price"
                        value={parseFloat(
                          Number(
                            ethers.utils.formatEther(
                              totalPriceByCurrency[currency] || 0
                            )
                          ).toFixed(3)
                        )}
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
                            Items total Price
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
                  {/* ============= */}
                  <Box sx={{ mt: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'rgba(0, 0, 0, 0.24)',
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
                          ethers.utils.formatEther(
                            totalPriceByCurrency[currency] || 0
                          )
                        )?.toFixed(3)
                      )}{' '}
                      {currencies[currency].label}
                    </Typography>
                  </Box>
                  {isInsufficientBalance && (
                    <Box sx={{ mt: 3, textAlign: 'center', color: 'red' }}>
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
