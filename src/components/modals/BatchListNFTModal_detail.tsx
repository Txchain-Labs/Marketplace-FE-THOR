import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
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
  MobileStepper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
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
  useGetTransaction,
  useMarketplaceAddress,
} from '../../hooks/Marketplace';
import {
  useGetApproval,
  useListNFT,
  useSetApproval,
} from '../../hooks/useNFTDetail';
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
import { ToastSeverity } from '@/redux/slices/toastSlice';
import { KeyboardArrowLeft } from '@mui/icons-material';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const currencies = [
  {
    value: 0,
    label: <Typography sx={{ fontSize: 'larger' }}>{'AVAX'}</Typography>,
  },
  {
    value: 1,
    label: <Typography sx={{ fontSize: 'larger' }}>{'THOR'}</Typography>,
  },
  {
    value: 2,
    label: <Typography sx={{ fontSize: 'larger' }}>{'USDC.e'}</Typography>,
  },
];

type Props = {
  open: boolean;
  handleClose: any;
  totalUsdPrice?: number;
  nfts: any[];
  approvalAddress?: string;
  modal_method?: string;
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

const BatchListNFTModal = (props: Props) => {
  const { showModal } = useGlobalModalContext();

  const { open, handleClose, nfts, approvalAddress, modal_method } = props;

  const user = useSelector((state: any) => state.auth.user);

  const [approved, setApproved] = useState(true);
  const [currency, setCurrency] = useState(currencies[0].value);
  const [expanded, setExpanded] = useState(false);
  const [nftAddress, setNftAddress] = useState([]);
  const [tokenId, setTokenId] = useState([]);
  const [priceInWei, setPriceInWei] = useState([]);
  const [expiresAt, setExpiredsAt] = useState([]);
  const [currencys, setCurrencys] = useState([]);
  const [listPrice, setListPrice] = useState('0');
  const [nftAvax, setNftAvax] = useState('AVAX');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isChecked1, setIsChecked1] = useState<boolean>(false);
  const [isChecked2, setIsChecked2] = useState<boolean>(false);

  const chain = useChain();
  const { address: accountAddress } = useAccount();
  const marketplaceAddress = useMarketplaceAddress();
  // const { data: order }: any = useGetOrderByNft(collectionAddress, tokenId);

  //manage title
  const [title, setTitle] = React.useState('');
  const dispatch = useDispatch();

  const theme = useTheme();

  /////////////////////////////////////////////////////
  const [activeStep, setActiveStep] = React.useState(0);
  const [maxSteps, setMaxSteps] = useState(0);

  interface Steps {
    [key: number]: {
      label?: string;
      cost?: number;
      fee?: string;
      earning?: number;
      connectUsd?: string;
      image: string;
      title: string;
      isChecked?: boolean;
      isChecked1?: boolean;
      isChecked2?: boolean;
      currency: number;
      listPrice: string;
      nftAvax: string;
    };
  }
  const [steps, setSteps] = React.useState<Steps>();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  useEffect(() => {
    if (nfts.length === 1) {
      setTitle('single');
    }
    if (nfts.length > 1) {
      setMaxSteps(nfts.length);
      setSteps((prevSteps) => {
        const newSteps = { ...prevSteps };
        nfts.forEach((nft, key) => {
          newSteps[key] = {
            label: nft.name,
            cost: 0,
            fee: '0',
            earning: 0,
            connectUsd: '0',
            image: nft.image,
            title: nft.name,
            isChecked: false,
            isChecked1: false,
            isChecked2: false,
            currency: 0,
            listPrice: '0',
            nftAvax: 'Avax',
          };
        });
        return newSteps;
      });
    }
  }, [nfts]);
  const [info, setInfo] = useState({
    label: '',
    image: '',
    text: '',
    currency: 0,
    isChecked: false,
    isChecked1: false,
    isChecked2: false,
    activeStep: 0,
  });
  const handleChangeAdvanced_Price = (
    event: React.ChangeEvent<HTMLInputElement>,
    label: string,
    image: string,
    text: string,
    currency: number,
    isChecked: boolean,
    isChecked1: boolean,
    isChecked2: boolean,
    activeStep: number
  ) => {
    if (event?.target.value.length < 20) {
      setListPrice(event?.target.value);
      setInfo({
        label: label,
        image: image,
        text: text,
        currency: currency,
        isChecked: isChecked,
        isChecked1: isChecked1,
        isChecked2: isChecked2,
        activeStep: activeStep,
      });
    }
  };

  /////////////////////////////////////////////////////

  const matchLgUp = useMediaQuery(theme.breakpoints.up('sm'));
  const matchSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const balance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');

  const { data: usdFromThor } = useGetUsdFromThor('1', chain);
  const { data: usdFromAvax } = useGetUsdFromAvax('1', chain);
  const { data: avaxFromThor } = useGetAvaxFromThor('1', chain);
  const { data: thorFromAvax } = useGetThorFromAvax('1', chain);

  const {
    data: nftApproval,
    refetch: refetchNFTApproval,
    isLoading: getNFTApprovalLoading,
  } = useGetApproval(accountAddress, approvalAddress);
  const {
    write: approveNFT,
    isLoading: approveNFTLoading,
    isSuccess: approveNFTSuccess,
  } = useSetApproval(approvalAddress);
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
  const listNFTToast = {
    message: 'NFTs Listing...',
    severity: ToastSeverity.INFO,
    image: nfts[0]?.image || 'images/nft-placeholder.png',
  };
  const txnToast = {
    message: 'NFTs Listed',
    severity: ToastSeverity.SUCCESS,
    image: nfts[0]?.image || 'images/nft-placeholder.png',
    autoHideDuration: 5000,
  };
  const {
    write: listNFTWrite,
    data: executeData,
    isLoading: isExecuteLoading,
  } = useListNFT(listNFTToast);
  const { isLoading: transactionLoading, isSuccess: isTransactionSuccess } =
    useGetTransaction(executeData?.hash, txnToast);
  // const { isLoading: transactionLoading, isSuccess: isTransactionSuccess } =
  //   useWaitForTransaction({ hash: executeData?.hash });
  const feePercentage = 2;
  const totalPriceByCurrency = useMemo(() => {
    if (!nfts || !avaxFromThor || !thorFromAvax)
      return [BigNumber.from(0), BigNumber.from(0)];

    const _totalPriceByCurrency = [BigNumber.from(0), BigNumber.from(0)];
    const _currencys: any[] = [];
    const _nftAddress: any[] = [];
    const _tokenId: any[] = [];
    const _priceInWei: any[] = [];
    const _expiresAt: any[] = [];
    const _priceByCurrency: any[] = [[], []];
    const avaxPriceByNFT: any[] = [];
    const thorPriceByNFT: any[] = [];
    nfts.forEach((item: any) => {
      const listprice_val = listPrice.toString() || '0';
      const val = ethers.utils.parseEther(listprice_val);
      // const val = new BigNumber(listPrice);
      if (Number(currency) === 0) {
        _totalPriceByCurrency[0] = _totalPriceByCurrency[0].add(val);
        avaxPriceByNFT.push(listPrice);
        _totalPriceByCurrency[1] = _totalPriceByCurrency[1].add(
          val.mul(thorFromAvax as BigNumberish).div('1000000000000000000')
        );
        thorPriceByNFT.push(
          val.mul(thorFromAvax as BigNumberish).div('1000000000000000000')
        );
      } else {
        _totalPriceByCurrency[0] = _totalPriceByCurrency[0].add(
          val.mul(avaxFromThor as BigNumberish).div('1000000000000000000')
        );
        avaxPriceByNFT.push(
          val.mul(avaxFromThor as BigNumberish).div('1000000000000000000')
        );
        _totalPriceByCurrency[1] = _totalPriceByCurrency[1].add(val);
        thorPriceByNFT.push(listPrice);
      }
      _nftAddress.push(item.token_address.toLowerCase());
      _tokenId.push(item.token_id);
      _priceInWei.push(val);
      _expiresAt.push(9999999999999);
      _currencys.push(currency);
    });
    _priceByCurrency[0] = avaxPriceByNFT;
    _priceByCurrency[1] = thorPriceByNFT;
    setNftAddress(_nftAddress);
    setTokenId(_tokenId);
    setPriceInWei(_priceInWei);
    setExpiredsAt(_expiresAt);
    setCurrencys(_currencys);
    return _totalPriceByCurrency;
  }, [nfts, avaxFromThor, thorFromAvax, listPrice, currency]);

  const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target.value.length < 20) {
      setListPrice(event?.target.value);
      //   setListFee((feePercentage / 100) * Number(event?.target.value));
    }
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
          Number(
            ethers.utils.formatEther(totalPriceByCurrency[currency] || 0)
          )) ||
      (balance &&
        Number(formatDecimals(balance)) <
          Number(ethers.utils.formatEther(totalPriceByCurrency[currency] || 0)))
    );
  }, [balance, thorBalance, currency, totalPriceByCurrency]);

  const listPriceUSD = React.useMemo(() => {
    if (listPrice) {
      return (
        Number(listPrice) *
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
  }, [listPrice, currency, usdFromAvax, usdFromThor]);

  const listFeeUSD = useMemo(() => {
    if (listPriceUSD) {
      return (feePercentage / 100) * listPriceUSD;
    } else {
      return 0;
    }
  }, [listPriceUSD]);
  // Refetch approval amount when approval success
  useEffect(() => {
    refetchGetApproval();
  }, [setApprovalSuccess, refetchGetApproval]);

  useEffect(() => {
    refetchNFTApproval();
  }, [approveNFTSuccess, refetchNFTApproval]);

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
    if (modal_method === 'detail') {
      setTitle('detail');
    }
    if (modal_method === 'advanced') {
      setTitle('advanced');
    }
  }, [
    currency,
    tokenApproval,
    setApprovalSuccess,
    approveThorLoading,
    totalPriceByCurrency,
    modal_method,
  ]);

  useEffect(() => {
    setSteps((prevSteps) => {
      const updatedSteps = { ...prevSteps };
      updatedSteps[info.activeStep] = {
        label: info.label,
        cost: Number(listPrice),
        fee: formatNumber(listFeeUSD * nfts.length),
        earning: parseFloat((Number(listPrice) * nfts.length)?.toFixed(3)),
        connectUsd: (listPriceUSD * nfts.length).toFixed(3),
        image: info.image,
        title: info.text,
        isChecked: info.isChecked,
        isChecked1: info.isChecked1,
        isChecked2: info.isChecked2,
        currency: info.currency,
        listPrice: listPrice,
        nftAvax: nftAvax,
      };
      return updatedSteps;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPrice]);

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
    setIsChecked(false);
    setIsChecked1(false);
    setIsChecked2(false);
    setSteps((prev) => ({
      ...prev,
      [activeStep]: {
        ...prev[activeStep],
        isChecked: false,
        isChecked1: false,
        isChecked2: false,
        currency: Number(event.target.value),
      },
    }));
    if (Number(event.target.value) === 0) {
      setNftAvax('AVAX');
      setSteps((prev) => ({
        ...prev,
        [activeStep]: {
          ...prev[activeStep],
          nftAvax: 'AVAX',
        },
      }));
    }
    if (Number(event.target.value) === 1) {
      setNftAvax('THOR');
      setSteps((prev) => ({
        ...prev,
        [activeStep]: {
          ...prev[activeStep],
          nftAvax: 'THOR',
        },
      }));
    }
    if (Number(event.target.value) === 2) {
      setNftAvax('USDC.e');
      setSteps((prev) => ({
        ...prev,
        [activeStep]: {
          ...prev[activeStep],
          nftAvax: 'USDC.e',
        },
      }));
    }
  };

  const handleListOrApproval = async () => {
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
    } else if (!nftApproval) {
      approveNFT({
        recklesslySetUnpreparedArgs: [marketplaceAddress, true],
      });
    }
    // Purchase by AVAX
    else {
      listNFTWrite({
        recklesslySetUnpreparedArgs: [
          1,
          currencys,
          nftAddress,
          tokenId,
          priceInWei,
          expiresAt,
        ],
      });
      handleClose();
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
            maxWidth: '1000px !important',
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
            flexGrow: 1,
          }}
        >
          <Grid container>
            <Grid
              item
              xs={2}
              md={2}
              miniMobile={12}
              sm={10}
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
                      sx={{
                        color: '#fff',
                        fontSize: { miniMobile: '12px' },
                      }}
                    >
                      NFT BEING LISTED
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'inline-flex' }}>
                    {title === 'advanced' && (
                      <NFTSlider
                        slides={nfts.map(
                          () =>
                            ({
                              key: steps[activeStep].title,
                              image: steps[activeStep].image,
                              title: steps[activeStep].title,
                              isChecked: steps[activeStep].isChecked,
                              isChecked1: steps[activeStep].isChecked1,
                              isChecked2: steps[activeStep].isChecked2,
                              currency: steps[activeStep].currency,
                              listPrice: steps[activeStep].listPrice,
                              nftAvax: steps[activeStep].nftAvax,
                            } as NFTSlide)
                        )}
                        direction={matchLgUp ? 'vertical' : 'horizontal'}
                        size={matchSmDown ? 'small' : 'medium'}
                        hideTitle={matchSmDown}
                        fullHeightOffset={matchSmDown ? 72 : 48}
                      />
                    )}
                    {title !== 'advanced' && (
                      <NFTSlider
                        slides={nfts.map(
                          (item: any) =>
                            ({
                              key: item.token_id,
                              image: item.image,
                              title: item.name,
                              isChecked: isChecked,
                              isChecked1: isChecked1,
                              isChecked2: isChecked2,
                              currency: currency,
                              listPrice: listPrice,
                              nftAvax: nftAvax,
                            } as NFTSlide)
                        )}
                        direction={matchLgUp ? 'vertical' : 'horizontal'}
                        size={matchSmDown ? 'small' : 'medium'}
                        hideTitle={matchSmDown}
                        fullHeightOffset={matchSmDown ? 72 : 48}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid xs={0.5} md={0.5}></Grid>
            <Grid item xs={6} md={6} miniMobile={12} sm={10}>
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
                  sx={{
                    position: 'absolute',
                    right: 20,
                    cursor: 'pointer',
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
                    List NFT
                  </Typography>
                  <Box sx={{ border: 'solid', borderRadius: 0 }}>
                    <Box sx={{ borderRadius: 0 }}>
                      <Card
                        sx={{
                          background: 'transparent',
                          border: 0,
                          borderRadius: 0,
                          boxShadow: 'none',
                        }}
                      >
                        {title === 'detail' && (
                          <>
                            <CardActions
                              disableSpacing
                              sx={{
                                backgroundColor: 'black',
                                display: 'flex',
                                justifyContent: 'space-between',
                                p: '16px',
                              }}
                            >
                              <Typography
                                sx={{ color: 'white' }}
                                variant="p-md"
                              >
                                {nfts.length} Items
                              </Typography>

                              <Box
                                display={'flex'}
                                sx={{
                                  color: '#F3523F',
                                  alignItems: 'center',
                                }}
                              >
                                <Typography
                                  variant="p-md"
                                  sx={{ cursor: 'pointer' }}
                                >
                                  Details
                                </Typography>
                                <ExpandMore
                                  expand={expanded}
                                  onClick={handleExpandClick}
                                  aria-expanded={expanded}
                                  aria-label="show more"
                                  sx={{ color: '#F3523F', p: '0px' }}
                                >
                                  <ExpandMoreIcon />
                                </ExpandMore>
                              </Box>
                            </CardActions>
                            <Collapse
                              in={expanded}
                              timeout="auto"
                              sx={{
                                pb: '5px',
                                color: 'white',
                                pl: 2,
                                pr: 2,
                                backgroundColor: 'black',
                              }}
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
                                      {nft.name}
                                    </Typography>
                                    <Typography
                                      variant="p-md"
                                      sx={{
                                        minWidth: '140px',
                                        textAlign: 'right',
                                        lineHeight: '24px',
                                      }}
                                    >
                                      {listPriceUSD &&
                                        listPriceUSD.toFixed(3) + ' USD'}
                                    </Typography>
                                  </Box>
                                ))}
                              </CardContent>
                            </Collapse>
                          </>
                        )}
                        {title === 'single' && (
                          <>
                            <CardActions
                              disableSpacing
                              sx={{
                                backgroundColor: 'black',
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderRadius: 0,
                                p: '16px',
                              }}
                            >
                              <Typography
                                sx={{ color: 'white', mb: 1 }}
                                variant="p-md"
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
                                      {nft.name}
                                    </Typography>
                                  </Box>
                                ))}
                              </Typography>
                            </CardActions>
                          </>
                        )}
                        {title === 'advanced' && (
                          <CardActions
                            disableSpacing
                            sx={{
                              backgroundColor: 'black',
                              display: 'flex',
                              justifyContent: 'space-between',
                              p: '16px',
                            }}
                          >
                            <Typography sx={{ color: 'white' }} variant="p-md">
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography
                                  variant="p-md"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    lineHeight: '24px',
                                    // fontSize: '18px',
                                    justifyContent: 'start',
                                  }}
                                >
                                  {steps[activeStep].label}
                                </Typography>
                              </Box>
                            </Typography>
                            <MobileStepper
                              variant="text"
                              steps={maxSteps}
                              sx={{
                                backgroundColor: 'black',
                                color: 'red',
                              }}
                              position="static"
                              activeStep={activeStep}
                              nextButton={
                                <Button
                                  size="small"
                                  onClick={handleNext}
                                  sx={{ color: 'red', minWidth: 'auto' }}
                                  disabled={activeStep === maxSteps - 1}
                                >
                                  {theme.direction === 'rtl' ? (
                                    <KeyboardArrowLeft sx={{ color: 'red' }} />
                                  ) : (
                                    <KeyboardArrowRight sx={{ color: 'red' }} />
                                  )}
                                </Button>
                              }
                              backButton={
                                <Button
                                  size="small"
                                  onClick={handleBack}
                                  sx={{ color: 'red', minWidth: 'auto' }}
                                  disabled={activeStep === 0}
                                >
                                  {theme.direction === 'rtl' ? (
                                    <KeyboardArrowRight sx={{ color: 'red' }} />
                                  ) : (
                                    <KeyboardArrowLeft sx={{ color: 'red' }} />
                                  )}
                                </Button>
                              }
                            />
                          </CardActions>
                        )}
                      </Card>
                    </Box>
                    {/* ============= */}
                    <Box sx={{ display: 'flex', mt: '8px' }}>
                      {title === 'advanced' && (
                        <Box
                          sx={{
                            width: '75%',
                            position: 'relative',
                            ml: '16px',
                            mb: '4px',
                            mt: '4px',
                          }}
                        >
                          <TextField
                            inputProps={{
                              sx: {
                                fontSize: '18px',
                                color: 'rgba(0, 0, 0, 0.9)',
                                with: '100%',
                                ml: '8px',
                              },
                            }}
                            sx={{ width: '95%' }}
                            fullWidth
                            name="price"
                            value={steps[activeStep].cost}
                            type="number"
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              handleChangeAdvanced_Price(
                                event,
                                steps[activeStep].label,
                                steps[activeStep].image,
                                steps[activeStep].title,
                                steps[activeStep].currency,
                                steps[activeStep].isChecked,
                                steps[activeStep].isChecked1,
                                steps[activeStep].isChecked2,
                                activeStep
                              )
                            }
                            id="price"
                            label={
                              <Typography
                                sx={{
                                  fontSize: '22px',
                                  fontFamily: 'Nexa-Bold',
                                }}
                                variant="p-md"
                              >
                                List Price
                              </Typography>
                            }
                            variant="standard"
                          />
                        </Box>
                      )}
                      {title !== 'advanced' && (
                        <Box
                          sx={{
                            width: '75%',
                            position: 'relative',
                            ml: '16px',
                            mb: '4px',
                            mt: '4px',
                          }}
                        >
                          <TextField
                            inputProps={{
                              sx: {
                                fontSize: '18px',
                                color: 'rgba(0, 0, 0, 0.9)',
                                with: '100%',
                                ml: '8px',
                              },
                            }}
                            sx={{
                              width: '95%',
                            }}
                            fullWidth
                            name="price"
                            value={listPrice}
                            type="number"
                            onChange={handleChangePrice}
                            id="price"
                            label={
                              <Typography
                                sx={{
                                  fontSize: '22px',
                                  fontFamily: 'Nexa-Bold',
                                }}
                                variant="p-md"
                              >
                                List Price
                              </Typography>
                            }
                            variant="standard"
                          />
                        </Box>
                      )}

                      <Box
                        sx={{
                          'display': 'flex',
                          'alignItems': 'center',
                          'borderBottom': '1px solid rgba(0, 0, 0)',
                          'borderRight': '1px solid rgba(0, 0, 0)',
                          '&:hover': {
                            borderBottom: '2px solid rgba(0, 0, 0)',
                            borderRight: '2px solid rgba(0, 0, 0)',
                          },
                          'mr': '16px',
                          'mb': '4px',
                          'mt': '1pc',
                        }}
                      >
                        {title === 'advanced' && (
                          <>
                            <Box>
                              {steps[activeStep].currency === 0 && (
                                <Image
                                  src="/images/avaxIcon.svg"
                                  width={24}
                                  height={24}
                                  objectFit="contain"
                                />
                              )}
                              {steps[activeStep].currency === 1 && (
                                <Image
                                  src="/images/thorIcon.svg"
                                  width={24}
                                  height={24}
                                  objectFit="contain"
                                />
                              )}
                              {steps[activeStep].currency === 2 && (
                                <Image
                                  src="/images/usdcIcon.svg"
                                  width={24}
                                  height={24}
                                  objectFit="contain"
                                />
                              )}
                            </Box>
                            <SelectBox
                              onChange={handleSelectCurrency}
                              defaultValue={steps[activeStep].currency}
                              options={currencies}
                              value={steps[activeStep].currency}
                            />
                          </>
                        )}
                        {title !== 'advanced' && (
                          <>
                            <Box>
                              {currency === 0 && (
                                <Image
                                  src="/images/avaxIcon.svg"
                                  width={24}
                                  height={24}
                                  objectFit="contain"
                                />
                              )}
                              {currency === 1 && (
                                <Image
                                  src="/images/thorIcon.svg"
                                  width={24}
                                  height={24}
                                  objectFit="contain"
                                />
                              )}
                              {currency === 2 && (
                                <Image
                                  src="/images/usdcIcon.svg"
                                  width={24}
                                  height={24}
                                  objectFit="contain"
                                />
                              )}
                            </Box>
                            <SelectBox
                              onChange={handleSelectCurrency}
                              defaultValue={currency}
                              options={currencies}
                              value={currency}
                            />
                          </>
                        )}
                      </Box>
                    </Box>
                    {/* ============= */}
                    <Box sx={{ mt: 0.5 }}>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: 'rgba(0, 0, 0, 0.24)',
                          ml: '16px',
                        }}
                      >
                        {listPriceUSD && listPriceUSD.toFixed(3) + ' USD'}
                      </Typography>
                    </Box>
                    {/* ============= */}
                    <Box>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          sx={{
                            border: 'none',
                            borderStyle: 'none',
                            backgroundColor: '#FAFAFA',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '16px',
                              fontWeight: '400',
                            }}
                          >
                            Also accept payment in
                          </Typography>
                        </AccordionSummary>
                        {currency === 0 && (
                          <>
                            <AccordionDetails
                              sx={{ pl: 2, backgroundColor: '#FAFAFA' }}
                            >
                              <FormGroup
                                row={true}
                                sx={{
                                  display: 'flex',
                                  flexGrow: 1,
                                  justifyContent: 'space-between',
                                  backgroundColor: '#FAFAFA',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'inline-flex',
                                  }}
                                >
                                  <Image
                                    src={`/images/thorIcon.svg`}
                                    height={14}
                                    width={14}
                                    objectFit="contain"
                                  />
                                  <Box sx={{ ml: 1 }}>
                                    <Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '16px',
                                          fontWeight: '400',
                                          color: '#000000',
                                        }}
                                      >
                                        540 THOR
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '12px',
                                          fontWeight: '300',
                                          color: '#4C4C4C',
                                        }}
                                      >
                                        234 USD
                                      </Typography>
                                    </Typography>
                                  </Box>
                                </Box>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        title === 'advanced'
                                          ? steps[activeStep].isChecked1
                                          : isChecked1
                                      }
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        title === 'advanced'
                                          ? setSteps((prev) => ({
                                              ...prev,
                                              [activeStep]: {
                                                ...prev[activeStep],
                                                isChecked1: e.target.checked,
                                              },
                                            }))
                                          : setIsChecked1(e.target.checked);
                                      }}
                                    />
                                  }
                                  label={''}
                                  sx={{
                                    justifyContent: 'space-between',
                                    mr: '-10px',
                                  }}
                                />
                              </FormGroup>
                              <FormGroup
                                row={true}
                                sx={{
                                  display: 'flex',
                                  flexGrow: 1,
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'inline-flex',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Image
                                    src={`/images/${'usdc'}Icon.svg`}
                                    height={14}
                                    width={14}
                                    objectFit="contain"
                                  />
                                  <Box sx={{ ml: 1 }}>
                                    <Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '16px',
                                          fontWeight: '400',
                                          color: '#000000',
                                        }}
                                      >
                                        540 USDC.e
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '12px',
                                          fontWeight: '300',
                                          color: '#4C4C4C',
                                        }}
                                      >
                                        234 USD
                                      </Typography>
                                    </Typography>
                                  </Box>
                                </Box>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        title === 'advanced'
                                          ? steps[activeStep].isChecked2
                                          : isChecked2
                                      }
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        title === 'advanced'
                                          ? setSteps((prev) => ({
                                              ...prev,
                                              [activeStep]: {
                                                ...prev[activeStep],
                                                isChecked2: e.target.checked,
                                              },
                                            }))
                                          : setIsChecked2(e.target.checked);
                                      }}
                                    />
                                  }
                                  label={''}
                                  sx={{
                                    justifyContent: 'space-between',
                                    mr: '-10px',
                                  }}
                                />
                              </FormGroup>
                            </AccordionDetails>
                          </>
                        )}
                        {currency === 1 && (
                          <>
                            <AccordionDetails sx={{ pl: 2 }}>
                              <FormGroup
                                row={true}
                                sx={{
                                  flexGrow: 1,
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Box sx={{ display: 'inline-flex' }}>
                                  <Image
                                    src={`/images/${'avax'}Icon.svg`}
                                    height={14}
                                    width={14}
                                    objectFit="contain"
                                  />
                                  <Box sx={{ ml: 1 }}>
                                    <Typography
                                      sx={{
                                        fontSize: '16px',
                                        fontWeight: '400',
                                        color: '#000000',
                                      }}
                                    >
                                      320 AVAX
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: '12px',
                                        fontWeight: '300',
                                        color: '#4C4C4C',
                                      }}
                                    >
                                      234 USD
                                    </Typography>
                                  </Box>
                                </Box>

                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        title === 'advanced'
                                          ? steps[activeStep].isChecked
                                          : isChecked
                                      }
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        title === 'advanced'
                                          ? setSteps((prev) => ({
                                              ...prev,
                                              [activeStep]: {
                                                ...prev[activeStep],
                                                isChecked: e.target.checked,
                                              },
                                            }))
                                          : setIsChecked(e.target.checked);
                                      }}
                                    />
                                  }
                                  label={''}
                                  sx={{
                                    justifyContent: 'space-between',
                                    mr: '-10px',
                                  }}
                                />
                              </FormGroup>
                              <FormGroup
                                row={true}
                                sx={{
                                  display: 'flex',
                                  flexGrow: 1,
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'inline-flex',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Image
                                    src={`/images/${'usdc'}Icon.svg`}
                                    height={14}
                                    width={14}
                                    objectFit="contain"
                                  />
                                  <Box sx={{ ml: 1 }}>
                                    <Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '16px',
                                          fontWeight: '400',
                                          color: '#000000',
                                        }}
                                      >
                                        540 USDC.e
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '12px',
                                          fontWeight: '300',
                                          color: '#4C4C4C',
                                        }}
                                      >
                                        234 USD
                                      </Typography>
                                    </Typography>
                                  </Box>
                                </Box>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        title === 'advanced'
                                          ? steps[activeStep].isChecked2
                                          : isChecked2
                                      }
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        title === 'advanced'
                                          ? setSteps((prev) => ({
                                              ...prev,
                                              [activeStep]: {
                                                ...prev[activeStep],
                                                isChecked2: e.target.checked,
                                              },
                                            }))
                                          : setIsChecked2(e.target.checked);
                                      }}
                                    />
                                  }
                                  label={''}
                                  sx={{
                                    justifyContent: 'space-between',
                                    mr: '-10px',
                                  }}
                                />
                              </FormGroup>
                            </AccordionDetails>
                          </>
                        )}
                        {currency === 2 && (
                          <>
                            <AccordionDetails sx={{ pl: 2 }}>
                              <FormGroup
                                row={true}
                                sx={{
                                  flexGrow: 1,
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Box sx={{ display: 'inline-flex' }}>
                                  <Image
                                    src={`/images/${'avax'}Icon.svg`}
                                    height={14}
                                    width={14}
                                    objectFit="contain"
                                  />
                                  <Box sx={{ ml: 1 }}>
                                    <Typography
                                      sx={{
                                        fontSize: '16px',
                                        fontWeight: '400',
                                        color: '#000000',
                                      }}
                                    >
                                      320 AVAX
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: '12px',
                                        fontWeight: '300',
                                        color: '#4C4C4C',
                                      }}
                                    >
                                      234 USD
                                    </Typography>
                                  </Box>
                                </Box>

                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        title === 'advanced'
                                          ? steps[activeStep].isChecked
                                          : isChecked
                                      }
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        title === 'advanced'
                                          ? setSteps((prev) => ({
                                              ...prev,
                                              [activeStep]: {
                                                ...prev[activeStep],
                                                isChecked: e.target.checked,
                                              },
                                            }))
                                          : setIsChecked(e.target.checked);
                                      }}
                                    />
                                  }
                                  label={''}
                                  sx={{
                                    justifyContent: 'space-between',
                                    mr: '-10px',
                                  }}
                                />
                              </FormGroup>
                              <FormGroup
                                row={true}
                                sx={{
                                  flexGrow: 1,
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'inline-flex',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Image
                                    src={`/images/${'thor'}Icon.svg`}
                                    height={14}
                                    width={14}
                                    objectFit="contain"
                                  />
                                  <Box sx={{ ml: 1 }}>
                                    <Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '16px',
                                          fontWeight: '400',
                                          color: '#000000',
                                        }}
                                      >
                                        540 THOR
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '12px',
                                          fontWeight: '300',
                                          color: '#4C4C4C',
                                        }}
                                      >
                                        234 USD
                                      </Typography>
                                    </Typography>
                                  </Box>
                                </Box>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        title === 'advanced'
                                          ? steps[activeStep].isChecked1
                                          : isChecked1
                                      }
                                      onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        setIsChecked1(e.target.checked);
                                      }}
                                    />
                                  }
                                  label={''}
                                  sx={{
                                    justifyContent: 'space-between',
                                    mr: '-10px',
                                  }}
                                />
                              </FormGroup>
                            </AccordionDetails>
                          </>
                        )}
                      </Accordion>
                    </Box>
                  </Box>
                  {/* ============= */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3,
                      mt: 3,
                    }}
                  >
                    <Typography variant="p-md-bk">Listing fee (2%)</Typography>

                    <Typography variant="p-md-bk">
                      {formatNumber(listFeeUSD * nfts.length)} USD
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 4,
                      mt: 4,
                    }}
                  >
                    <Typography variant="lbl-lg">
                      Your potential earning
                    </Typography>
                    <Typography
                      variant="lbl-lg"
                      sx={{ display: 'inline-flex' }}
                    >
                      {parseFloat(
                        (Number(listPrice) * nfts.length)?.toFixed(3)
                      )}{' '}
                      <Typography
                        sx={{
                          fontSize: '15px',
                          marginLeft: '5px',
                          marginTop: '-5px',
                        }}
                      >
                        {currencies[currency].label}
                      </Typography>
                    </Typography>
                  </Box>
                  {isInsufficientBalance && (
                    // <Box sx={{ mt: 3, textAlign: 'center', color: 'red' }}>
                    //   <Typography variant="p-md">
                    //     Insufficient balance
                    //   </Typography>
                    // </Box>
                    <></>
                  )}
                  <Box sx={{ display: 'flex', mt: 1, width: '100%' }}>
                    <Button
                      disabled={
                        listPriceError.isError ||
                        // isInsufficientBalance ||
                        getApprovalLoading ||
                        approveThorLoading ||
                        isExecuteLoading ||
                        transactionLoading ||
                        getNFTApprovalLoading ||
                        approveNFTLoading
                      }
                      variant="contained"
                      fullWidth
                      onClick={handleListOrApproval}
                      sx={{
                        borderRadius: '0%',
                      }}
                    >
                      <Typography variant="p-md">
                        {approved && nftApproval
                          ? 'list NFT'
                          : 'Approval Request'}
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid xs={0.25} md={0.25}></Grid>
            <Grid item xs={2.5} md={2.5} miniMobile={12} sm={10}>
              {/* ============= */}
              <Box
                sx={{
                  display: { miniMobile: 'content', sm: 'block' },
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 0.2,
                  p: 2,
                  border: '1px solid rgba(0, 0, 0, 0.3)',
                }}
              >
                <Box sx={{ justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <Box sx={{ height: '14px', mt: -1 }}>
                      <img src="/images/shaEllipse.png" alt="circle" />
                    </Box>
                    <Typography
                      sx={{
                        color: '#32B267',
                        mr: 1,
                        fontSize: '14px',
                        fontWeight: 300,
                      }}
                    >
                      CONNECTED
                    </Typography>
                  </Box>
                  <Typography
                    variant="p-md-bk"
                    sx={{
                      fontSize: { miniMobile: '12px', sm: '16px' },
                      mt: 1,
                    }}
                  >
                    {dottedAddress(accountAddress)}{' '}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      mt: 1,
                    }}
                  >
                    <Box sx={{ width: '25px', height: '25px' }}>
                      <Image
                        src="/images/redAvaxIcon.svg"
                        alt="triangle"
                        width={24}
                        height={24}
                      />
                    </Box>
                    <Typography sx={{ mt: 1 }} variant="lbl-lg">
                      AVAX
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 3,
                  }}
                >
                  <Typography variant="p-md-bk" sx={{ fontSize: '16px' }}>
                    Your wallet balance
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                    }}
                  >
                    <Typography variant="p-md-bk">
                      {currency === 0 &&
                        (balance &&
                          parseFloat(
                            Number(formatDecimals(balance)).toFixed(3)
                          )) + ' AVAX'}
                      {currency === 1 &&
                        (thorBalance &&
                          parseFloat(
                            Number(formatDecimals(thorBalance)).toFixed(3)
                          )) + ' THOR'}
                      {/* {currency === 2 && ()} */}
                    </Typography>

                    <Typography sx={{ fontSize: '16px', textAlign: 'left' }}>
                      {listPriceUSD &&
                        (listPriceUSD * nfts.length).toFixed(3) + ' USD'}
                    </Typography>
                  </Box>
                </Box>{' '}
              </Box>
              {/* ============= */}
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Box>
  );
};

export default BatchListNFTModal;
