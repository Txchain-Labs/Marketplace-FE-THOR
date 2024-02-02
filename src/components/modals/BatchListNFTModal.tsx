import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { BigNumberish, ethers } from 'ethers';
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
import { IconButtonProps } from '@mui/material/IconButton';
import { MODAL_TYPES, useGlobalModalContext } from './GlobleModal';
import CurrencySelect from '@/components/common/CurrencySelect';
import { dottedAddress, formatDecimals } from '../../shared/utils/utils';
import { formatNumber } from '../../utils/common';
import { useBalance } from '../../hooks/useToken';
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
import { useGetUsdFromAvax, useGetUsdFromThor } from '../../hooks/useOracle';
import NFTSlider, { NFTSlide } from '../common/NFTSlider';
import { resetAll, setNFTsRefetching } from '../../redux/slices/bagListSlice';
import { ToastSeverity } from '@/redux/slices/toastSlice';
import { KeyboardArrowLeft } from '@mui/icons-material';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const currencyOptions = [
  {
    value: 0,
    label: 'AVAX',
  },
  {
    value: 1,
    label: 'THOR',
  },
  {
    value: 2,
    label: 'USDC.e',
  },
];

type Props = {
  open: boolean;
  handleClose: any;
  handleModalBack?: any;
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

  const { open, handleClose, handleModalBack, nfts, modal_method } = props;

  const user = useSelector((state: any) => state.auth.user);

  interface Steps {
    [key: number]: {
      label?: string;
      cost?: number;
      connectUsd?: string;
      image: string;
      title: string;
      isChecked?: boolean;
      isChecked1?: boolean;
      isChecked2?: boolean;
      tokenId: string;
      tokenAddress: string;
      currency: number;
      acceptPayments: string[];
      listPrice: string;
      nftAvax: string;
    };
  }

  const [expanded, setExpanded] = useState(false);
  const [nftAddress, setNftAddress] = useState([]);
  const [tokenId, setTokenId] = useState([]);
  const [priceInWei, setPriceInWei] = useState([]);
  const [acceptPayment, setAcceptPayment] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [currentApprovalAddress, setCurrentApprovalAddress] = useState('');
  const [title, setTitle] = React.useState('');
  const [activeStep, setActiveStep] = React.useState(0);
  const [maxSteps, setMaxSteps] = useState(0);
  const [steps, setSteps] = React.useState<Steps>({});

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

  const pricebyCurrency = useMemo(() => {
    if (!(usdFromThor && usdFromAvax)) return [0, 0, 0];
    return [formatDecimals(usdFromAvax), formatDecimals(usdFromThor), '1'];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usdFromThor, usdFromAvax]);

  const listNFTToast = {
    message: 'NFTs Listing...',
    severity: ToastSeverity.INFO,
    image: nfts[0]?.image || 'images/nft-placeholder.png',
    itemCount: nfts ? nfts?.length : 0,
  };
  const txnToast = {
    message: 'NFTs Listed',
    severity: ToastSeverity.SUCCESS,
    image: nfts[0]?.image || 'images/nft-placeholder.png',
    autoHideDuration: 5000,
    itemCount: nfts ? nfts?.length : 0,
  };

  const approvalTxnToast = {
    message: 'Approval successfully',
    severity: ToastSeverity.SUCCESS,
    image: nfts[0]?.image || 'images/nft-placeholder.png',
    autoHideDuration: 5000,
    itemCount: 0,
  };

  const {
    write: listNFTWrite,
    data: executeData,
    isLoading: isExecuteLoading,
  } = useListNFT(listNFTToast);

  const { isLoading: transactionLoading, isSuccess: isTransactionSuccess } =
    useGetTransaction(executeData?.hash, txnToast);

  const {
    data: nftApproval,
    refetch: refetchNFTApproval,
    isLoading: getNFTApprovalLoading,
  } = useGetApproval(accountAddress, currentApprovalAddress);

  const {
    write: approveNFT,
    data: approveData,
    isLoading: approveNFTLoading,
    isSuccess: approveNFTSuccess,
  } = useSetApproval(currentApprovalAddress);

  const { isLoading: nftApprovalTransactionLoading } = useGetTransaction(
    approveData?.hash,
    approvalTxnToast
  );

  const listPriceError = useMemo(() => {
    if (modal_method === 'advanced') {
      if (steps) {
        const stepKeys = Object.keys(steps);
        for (let i = 0; i < stepKeys.length; i++) {
          const key = stepKeys[i];
          if (steps[Number(key)].cost === 0) {
            return {
              isError: true,
              message: 'Enter a valid number',
            };
          }
        }
        return {
          isError: false,
          message: '',
        };
      } else {
        return {
          isError: true,
          message: 'Enter a valid number',
        };
      }
    } else {
      if (Number.isNaN(Number(steps[activeStep]?.listPrice))) {
        return {
          isError: true,
          message: 'Enter a valid number',
        };
      } else if (Number(steps[activeStep]?.listPrice) <= 0) {
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
    }
  }, [steps, activeStep, modal_method]);

  useEffect(() => {
    if (nfts?.length > 0) {
      if (nfts[0]?.token_address !== currentApprovalAddress) {
        setCurrentApprovalAddress(nfts[0]?.token_address);
      }
    }
  }, [nfts, currentApprovalAddress]);

  useEffect(() => {
    setMaxSteps(nfts.length);
    setSteps(() => {
      const newSteps: Steps = {};
      nfts.forEach((nft, key) => {
        newSteps[key] = {
          label: nft.name,
          cost: 0,
          connectUsd: '0',
          image: nft.image,
          title: nft.name,
          isChecked: true,
          isChecked1: false,
          isChecked2: false,
          tokenId: nft.token_id,
          tokenAddress: nft.token_address,
          acceptPayments: ['0', '0', '0'],
          currency: 0,
          listPrice: '',
          nftAvax: 'AVAX',
        };
      });
      return newSteps;
    });
  }, [nfts, modal_method]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChangePrice = (
    event: React.ChangeEvent<HTMLInputElement>,
    activeStep: number
  ) => {
    if (event?.target.value.length < 20) {
      if (title === 'advanced') {
        setSteps((prev) => ({
          ...prev,
          [activeStep]: {
            ...prev[activeStep],
            connectUsd: (
              Number(event.target.value) *
              Number(pricebyCurrency[steps[activeStep].currency])
            ).toFixed(3),
            cost: Number(event.target.value),
            acceptPayments: [
              prev[activeStep].isChecked
                ? prev[activeStep].currency === 0
                  ? Number(event.target.value).toString()
                  : (
                      (Number(event.target.value) *
                        Number(pricebyCurrency[steps[activeStep].currency])) /
                      Number(pricebyCurrency[0])
                    ).toFixed(3)
                : '0',
              prev[activeStep].isChecked1
                ? prev[activeStep].currency === 1
                  ? Number(event.target.value).toString()
                  : (
                      (Number(event.target.value) *
                        Number(pricebyCurrency[steps[activeStep].currency])) /
                      Number(pricebyCurrency[1])
                    ).toFixed(3)
                : '0',
              prev[activeStep].isChecked2
                ? prev[activeStep].currency === 2
                  ? Number(event.target.value).toString()
                  : (
                      (Number(event.target.value) *
                        Number(pricebyCurrency[steps[activeStep].currency])) /
                      Number(pricebyCurrency[2])
                    ).toFixed(3)
                : '0',
            ],
            listPrice: event.target.value,
          },
        }));
      } else {
        setSteps(() => {
          const currentlySteps: Steps = { ...steps };
          nfts.forEach((_, key) => {
            currentlySteps[key] = {
              ...currentlySteps[key],
              connectUsd: (
                Number(event.target.value) *
                Number(pricebyCurrency[steps[0].currency])
              ).toFixed(3),
              acceptPayments: [
                steps[0].isChecked
                  ? currentlySteps[key].currency === 0
                    ? Number(event.target.value).toString()
                    : (
                        (Number(event.target.value) *
                          Number(pricebyCurrency[steps[0].currency])) /
                        Number(pricebyCurrency[0])
                      ).toFixed(3)
                  : '0',
                steps[0].isChecked1
                  ? currentlySteps[key].currency === 1
                    ? Number(event.target.value).toString()
                    : (
                        (Number(event.target.value) *
                          Number(pricebyCurrency[steps[0].currency])) /
                        Number(pricebyCurrency[1])
                      ).toFixed(3)
                  : '0',
                steps[0].isChecked2
                  ? currentlySteps[key].currency === 2
                    ? Number(event.target.value).toString()
                    : (
                        (Number(event.target.value) *
                          Number(pricebyCurrency[steps[0].currency])) /
                        Number(pricebyCurrency[2])
                      ).toFixed(3)
                  : '0',
              ],
              cost: Number(event.target.value),
              listPrice: event.target.value,
            };
          });
          return currentlySteps;
        });
      }
    }
  };

  const handleAcceptPaymentCheck = (value: boolean, index: number) => {
    if (title === 'advanced') {
      setSteps((prev) => ({
        ...prev,
        [activeStep]: {
          ...prev[activeStep],
          acceptPayments: [
            (index === 0 ? value : prev[activeStep].isChecked)
              ? prev[activeStep].currency === 0
                ? prev[activeStep].cost.toString()
                : (
                    Number(prev[activeStep].connectUsd) /
                    Number(pricebyCurrency[0])
                  ).toFixed(3)
              : '0',
            (index === 1 ? value : prev[activeStep].isChecked1)
              ? prev[activeStep].currency === 1
                ? prev[activeStep].cost.toString()
                : (
                    Number(prev[activeStep].connectUsd) /
                    Number(pricebyCurrency[1])
                  ).toFixed(3)
              : '0',
            (index === 2 ? value : prev[activeStep].isChecked2)
              ? prev[activeStep].currency === 2
                ? prev[activeStep].cost.toString()
                : (
                    Number(prev[activeStep].connectUsd) /
                    Number(pricebyCurrency[2])
                  ).toFixed(3)
              : '0',
          ],
          isChecked: index === 0 ? value : prev[activeStep].isChecked,
          isChecked1: index === 1 ? value : prev[activeStep].isChecked1,
          isChecked2: index === 2 ? value : prev[activeStep].isChecked2,
        },
      }));
    } else {
      setSteps(() => {
        const currentlySteps: Steps = { ...steps };
        nfts.forEach((_, key) => {
          currentlySteps[key] = {
            ...currentlySteps[key],
            acceptPayments: [
              (index === 0 ? value : currentlySteps[key].isChecked)
                ? currentlySteps[key].currency === 0
                  ? currentlySteps[key].cost.toString()
                  : (
                      Number(currentlySteps[key].connectUsd) /
                      Number(pricebyCurrency[0])
                    ).toFixed(3)
                : '0',
              (index === 1 ? value : currentlySteps[key].isChecked1)
                ? currentlySteps[key].currency === 1
                  ? currentlySteps[key].cost.toString()
                  : (
                      Number(currentlySteps[key].connectUsd) /
                      Number(pricebyCurrency[1])
                    ).toFixed(3)
                : '0',
              (index === 2 ? value : currentlySteps[key].isChecked2)
                ? currentlySteps[key].currency === 2
                  ? currentlySteps[key].cost.toString()
                  : (
                      Number(currentlySteps[key].connectUsd) /
                      Number(pricebyCurrency[2])
                    ).toFixed(3)
                : '0',
            ],
            isChecked: index === 0 ? value : currentlySteps[key].isChecked,
            isChecked1: index === 1 ? value : currentlySteps[key].isChecked1,
            isChecked2: index === 2 ? value : currentlySteps[key].isChecked2,
          };
        });
        return currentlySteps;
      });
    }
  };

  const handleSelectCurrency: React.EventHandler<any> = (value: number) => {
    if (title === 'advanced') {
      setSteps((prev) => ({
        ...prev,
        [activeStep]: {
          ...prev[activeStep],
          currency: Number(value),
          connectUsd: (
            prev[activeStep].cost * Number(pricebyCurrency[Number(value)])
          ).toFixed(3),
          acceptPayments: [
            value === 0
              ? prev[activeStep].currency === 2
                ? prev[activeStep].cost.toString()
                : (
                    (prev[activeStep].cost *
                      Number(pricebyCurrency[Number(value)])) /
                    Number(pricebyCurrency[0])
                  ).toFixed(3)
              : '0',
            value === 1
              ? prev[activeStep].currency === 2
                ? prev[activeStep].cost.toString()
                : (
                    (prev[activeStep].cost *
                      Number(pricebyCurrency[Number(value)])) /
                    Number(pricebyCurrency[1])
                  ).toFixed(3)
              : '0',
            value === 2
              ? prev[activeStep].currency === 2
                ? prev[activeStep].cost.toString()
                : (
                    (prev[activeStep].cost *
                      Number(pricebyCurrency[Number(value)])) /
                    Number(pricebyCurrency[2])
                  ).toFixed(3)
              : '0',
          ],
          isChecked: value === 0,
          isChecked1: value === 1,
          isChecked2: value === 2,
          nftAvax: currencyOptions[Number(value)].label,
        },
      }));
    } else {
      setSteps(() => {
        const currentlySteps: Steps = { ...steps };
        nfts.forEach((_, key) => {
          currentlySteps[key] = {
            ...currentlySteps[key],
            currency: Number(value),
            connectUsd: (
              currentlySteps[0].cost * Number(pricebyCurrency[Number(value)])
            ).toFixed(3),
            acceptPayments: [
              value === 0
                ? currentlySteps[0].currency === 0
                  ? currentlySteps[0].cost.toString()
                  : (
                      (currentlySteps[0].cost *
                        Number(pricebyCurrency[Number(value)])) /
                      Number(pricebyCurrency[0])
                    ).toFixed(3)
                : '0',
              value === 1
                ? currentlySteps[0].currency === 1
                  ? currentlySteps[0].cost.toString()
                  : (
                      (currentlySteps[0].cost *
                        Number(pricebyCurrency[Number(value)])) /
                      Number(pricebyCurrency[1])
                    ).toFixed(3)
                : '0',
              value === 2
                ? currentlySteps[0].currency === 2
                  ? currentlySteps[0].cost.toString()
                  : (
                      (currentlySteps[0].cost *
                        Number(pricebyCurrency[Number(value)])) /
                      Number(pricebyCurrency[2])
                    ).toFixed(3)
                : '0',
            ],
            isChecked: value === 0,
            isChecked1: value === 1,
            isChecked2: value === 2,
            nftAvax: currencyOptions[Number(value)].label,
          };
        });
        return currentlySteps;
      });
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

    if (!nftApproval) {
      approveNFT({
        recklesslySetUnpreparedArgs: [marketplaceAddress, true],
      });
    }
    // Purchase by AVAX
    else {
      listNFTWrite({
        recklesslySetUnpreparedArgs: [
          1,
          currencies,
          nftAddress,
          tokenId,
          priceInWei,
          acceptPayment,
        ],
      });
      handleClose();
    }
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const feePercentage = 2;

  const totalListPriceUSD = React.useMemo(() => {
    let value = 0;
    if (steps) {
      Object.keys(steps).forEach((key: string) => {
        value += Number(steps[Number(key)].connectUsd);
      });
    }
    return value;
  }, [steps]);

  useEffect(() => {
    refetchNFTApproval();
  }, [approveNFTSuccess, refetchNFTApproval]);

  useEffect(() => {
    if (modal_method === 'detail' && nfts.length > 1) {
      setTitle('detail');
    } else if (modal_method === 'advanced' && nfts.length > 1) {
      setTitle('advanced');
    } else {
      setTitle('single');
    }
  }, [modal_method, nfts]);

  useEffect(() => {
    if (Object.keys(steps).length) {
      const _currencies: any[] = [];
      const _nftAddress: any[] = [];
      const _tokenId: any[] = [];
      const _priceInWei: any[] = [];
      const _acceptPayment: any[] = [];
      Object.keys(steps).forEach((key: string) => {
        _currencies.push(steps[Number(key)].currency);
        _nftAddress.push(steps[Number(key)].tokenAddress);
        _tokenId.push(steps[Number(key)].tokenId);
        _priceInWei.push(
          steps[Number(key)].currency === 2
            ? ethers.utils
                .parseUnits(steps[Number(key)]?.cost.toString() ?? '0', 6)
                .toString()
            : ethers.utils
                .parseEther(steps[Number(key)]?.cost.toString() ?? '0')
                .toString()
        );
        _acceptPayment.push([
          ethers.utils
            .parseEther(steps[Number(key)]?.acceptPayments[0] ?? '0')
            .toString(),
          ethers.utils
            .parseEther(steps[Number(key)]?.acceptPayments[1] ?? '0')
            .toString(),
          ethers.utils
            .parseUnits(steps[Number(key)]?.acceptPayments[2] ?? '0', 6)
            .toString(),
        ]);
      });
      setNftAddress(_nftAddress);
      setTokenId(_tokenId);
      setPriceInWei(_priceInWei);
      setAcceptPayment(_acceptPayment);
      setCurrencies(_currencies);
    }
  }, [steps]);

  useEffect(() => {
    if (isTransactionSuccess) {
      dispatch(resetAll());
      dispatch(setNFTsRefetching());
    }
  }, [isTransactionSuccess, dispatch]);

  useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = open ? 'hidden' : 'auto';
    }
  }, [open]);

  return (
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
        <Grid sx={{ flexGrow: 1 }} container>
          <Grid item xs={12}>
            <Grid
              container
              justifyContent="center"
              columnSpacing={{ sm: 2, md: 3 }}
              rowSpacing={{ xs: 2, miniMobile: 1 }}
            >
              <Grid item sm={3} xs={12}>
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
                        width: matchSmDown ? '100%' : '209px',
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
                        NFT BEING LISTED
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'inline-flex' }}>
                      {steps && (
                        <NFTSlider
                          slides={nfts?.map(
                            (item: any) =>
                              ({
                                key: item.token_id,
                                image: item.image,
                                title: item.name,
                                isChecked: steps[activeStep]?.isChecked,
                                isChecked1: steps[activeStep]?.isChecked1,
                                isChecked2: steps[activeStep]?.isChecked2,
                                currency: steps[activeStep]?.currency,
                                listPrice: steps[activeStep]?.cost.toString(),
                                nftAvax: steps[activeStep]?.nftAvax,
                              } as NFTSlide)
                          )}
                          activeIndex={activeStep}
                          onChangeActiveIndex={(step: number) => {
                            setActiveStep(step);
                          }}
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
              <Grid item sm={6} xs={12}>
                <Box
                  sx={(theme) => ({
                    bgcolor: 'background.paper',
                    boxShadow: theme.shadows[1],
                    p: 2,
                    position: 'relative',
                  })}
                >
                  <Box
                    sx={{ display: 'flex', paddingBottom: matchSmDown ? 1 : 2 }}
                  >
                    <IconButton
                      aria-label="back"
                      sx={{
                        padding: '4px',
                        display: title === 'single' ? 'none' : 'flex',
                      }}
                      onClick={handleModalBack}
                    >
                      <ArrowBackIosNewIcon sx={{ color: 'text.primary' }} />
                    </IconButton>
                    <Typography
                      variant="sub-h"
                      sx={{
                        marginLeft: 1,
                        display: 'flex',
                        width: '100%',
                        letterSpacing: '0.04em',
                      }}
                    >
                      List NFT
                    </Typography>
                    <IconButton
                      aria-label="close"
                      onClick={handleClose}
                      sx={{
                        padding: '4px',
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Box
                    sx={(theme) => ({
                      mb: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      display: matchSmDown ? 'block' : 'none',
                    })}
                  >
                    <List>
                      <ListItem
                        sx={{ pl: 2, pr: 2, pt: 0, pb: 0 }}
                        secondaryAction={
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
                                fontWeight: 300,
                              }}
                            >
                              CONNECTED
                            </Typography>
                            <Box sx={{ height: '14px', mt: -1 }}>
                              <img src="/images/shaEllipse.png" alt="circle" />
                            </Box>
                          </Box>
                        }
                      >
                        <ListItemAvatar
                          sx={{
                            minWidth: '32px',
                            p: '5px',
                          }}
                        >
                          <Image
                            src="/images/redAvaxIcon.svg"
                            alt="triangle"
                            width={32}
                            height={32}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="p-md-bk"
                              sx={{
                                fontSize: '14px',
                              }}
                            >
                              {dottedAddress(accountAddress)}{' '}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="lbl-lg"
                              sx={{
                                lineHeight: 'normal',
                              }}
                            >
                              AVAX
                            </Typography>
                          }
                        />
                      </ListItem>
                      <ListItem
                        sx={{ pl: 2, pr: 2, pt: 0, pb: 0 }}
                        secondaryAction={
                          <Box sx={{ textAlign: 'end' }}>
                            <Typography
                              variant="p-md-bk"
                              sx={{
                                fontWeight: '700',
                                lineHeight: 'normal',
                              }}
                            >
                              {steps &&
                                steps[activeStep]?.currency === 0 &&
                                (balance &&
                                  parseFloat(
                                    Number(formatDecimals(balance)).toFixed(3)
                                  )) + ' AVAX'}
                              {steps &&
                                steps[activeStep]?.currency === 1 &&
                                (thorBalance &&
                                  parseFloat(
                                    Number(formatDecimals(thorBalance)).toFixed(
                                      3
                                    )
                                  )) + ' THOR'}
                              {steps &&
                                steps[activeStep]?.currency === 2 &&
                                (usdcBalance &&
                                  parseFloat(
                                    Number(
                                      formatDecimals(usdcBalance, 6)
                                    ).toFixed(3)
                                  )) + ' USDC.e'}
                            </Typography>
                            <Typography
                              variant="p-sm"
                              sx={{
                                lineHeight: 'normal',
                              }}
                            >
                              {steps &&
                                steps[activeStep]?.currency === 0 &&
                                (balance &&
                                  usdFromAvax &&
                                  parseFloat(
                                    (
                                      Number(formatDecimals(balance)) *
                                      Number(formatDecimals(usdFromAvax))
                                    ).toFixed(3)
                                  )) + ' USD'}
                              {steps &&
                                steps[activeStep]?.currency === 1 &&
                                (thorBalance &&
                                  usdFromThor &&
                                  parseFloat(
                                    (
                                      Number(formatDecimals(thorBalance)) *
                                      Number(formatDecimals(usdFromThor))
                                    ).toFixed(3)
                                  )) + ' USD'}
                              {steps &&
                                steps[activeStep]?.currency === 2 &&
                                (usdcBalance &&
                                  parseFloat(
                                    Number(
                                      formatDecimals(usdcBalance, 6)
                                    ).toFixed(3)
                                  )) + ' USD'}
                            </Typography>
                          </Box>
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="p-md-bk"
                              sx={{ fontSize: '16px', fontWeight: '700' }}
                            >
                              Your wallet balance
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>
                  </Box>
                  <Box>
                    <Box
                      sx={(theme) => ({
                        border: 'solid',
                        borderColor:
                          theme.palette.mode === 'light'
                            ? theme.palette.secondary.main
                            : theme.palette.primary.main,
                        borderRadius: 0,
                      })}
                    >
                      <Box sx={{ borderRadius: 0 }}>
                        <Card
                          sx={{
                            background: 'transparent',
                            border: 0,
                            borderRadius: 0,
                            boxShadow: 'none',
                          }}
                        >
                          <CardActions
                            disableSpacing
                            sx={(theme) => ({
                              bgcolor:
                                theme.palette.mode === 'light'
                                  ? 'secondary.main'
                                  : 'primary.main',
                              display: 'flex',
                              justifyContent: 'space-between',
                              borderRadius: 0,
                              p: { miniMobile: 1, sm: 2 },
                            })}
                          >
                            {title === 'single' && (
                              <Typography variant="p-md">
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
                                      pr: 2,
                                    }}
                                  >
                                    {nfts && nfts[0]?.name}
                                  </Typography>
                                </Box>
                              </Typography>
                            )}
                            {title === 'detail' && (
                              <>
                                <Typography
                                  variant="p-md"
                                  sx={{
                                    color:
                                      theme.palette.mode === 'light'
                                        ? 'secondary.contrastText'
                                        : 'primary.contrastText',
                                  }}
                                >
                                  {nfts.length} Items
                                </Typography>

                                <Box
                                  display={'flex'}
                                  sx={(theme) => ({
                                    color:
                                      theme.palette.mode === 'light'
                                        ? 'primary.main'
                                        : 'primary.contrastText',
                                    alignItems: 'center',
                                  })}
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
                                    sx={{
                                      color:
                                        theme.palette.mode === 'light'
                                          ? 'primary.main'
                                          : 'primary.contrastText',
                                      p: '0px',
                                    }}
                                  >
                                    <ExpandMoreIcon />
                                  </ExpandMore>
                                </Box>
                              </>
                            )}
                            {title === 'advanced' && (
                              <>
                                <Typography variant="p-md">
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
                                        width: '180px',
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
                                  sx={(theme) => ({
                                    bgcolor: 'transparent',
                                    color:
                                      theme.palette.mode === 'light'
                                        ? 'primary.main'
                                        : 'primary.contrastText',
                                    height: '24px',
                                    p: 0,
                                  })}
                                  position="static"
                                  activeStep={activeStep}
                                  nextButton={
                                    <Button
                                      size="small"
                                      onClick={handleNext}
                                      sx={{
                                        'color':
                                          theme.palette.mode === 'light'
                                            ? 'primary.main'
                                            : 'primary.contrastText',
                                        '&:hover': {
                                          color:
                                            theme.palette.mode === 'light'
                                              ? 'primary.main'
                                              : 'primary.contrastText',
                                        },
                                        'minWidth': 'auto',
                                      }}
                                      disabled={activeStep === maxSteps - 1}
                                    >
                                      {theme.direction === 'rtl' ? (
                                        <KeyboardArrowLeft
                                          sx={{ color: 'inherit' }}
                                        />
                                      ) : (
                                        <KeyboardArrowRight
                                          sx={{ color: 'inherit' }}
                                        />
                                      )}
                                    </Button>
                                  }
                                  backButton={
                                    <Button
                                      size="small"
                                      onClick={handleBack}
                                      sx={{
                                        'color':
                                          theme.palette.mode === 'light'
                                            ? 'primary.main'
                                            : 'primary.contrastText',
                                        '&:hover': {
                                          color:
                                            theme.palette.mode === 'light'
                                              ? 'primary.main'
                                              : 'primary.contrastText',
                                        },
                                        'minWidth': 'auto',
                                      }}
                                      disabled={activeStep === 0}
                                    >
                                      {theme.direction === 'rtl' ? (
                                        <KeyboardArrowRight
                                          sx={{ color: 'inherit' }}
                                        />
                                      ) : (
                                        <KeyboardArrowLeft
                                          sx={{ color: 'inherit' }}
                                        />
                                      )}
                                    </Button>
                                  }
                                />
                              </>
                            )}
                          </CardActions>
                          {title === 'detail' && (
                            <Collapse
                              in={expanded}
                              timeout="auto"
                              sx={(theme) => ({
                                pb: '5px',
                                color:
                                  theme.palette.mode === 'light'
                                    ? 'secondary.contrastText'
                                    : 'primary.contrastText',
                                pl: 2,
                                pr: 2,
                                bgcolor:
                                  theme.palette.mode === 'light'
                                    ? 'secondary.main'
                                    : 'primary.main',
                              })}
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
                                        width: '180px',
                                        pr: 2,
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
                                      {((steps &&
                                        steps[activeStep]?.connectUsd) ??
                                        '0') + ' USD'}
                                    </Typography>
                                  </Box>
                                ))}
                              </CardContent>
                            </Collapse>
                          )}
                        </Card>
                      </Box>
                      {/* ============= */}

                      <Box
                        sx={{
                          display: 'flex',
                          mt: '8px',
                          alignItems: 'flex-end',
                        }}
                      >
                        <Box
                          sx={{
                            width: '75%',
                            position: 'relative',
                            ml: { miniMobile: 1, sm: 2 },
                            mb: '4px',
                            pr: 0.5,
                            mt: '4px',
                          }}
                        >
                          <TextField
                            InputProps={{
                              sx: {
                                fontSize: '18px',
                                color: 'text.secondary',
                                with: '100%',
                                lineHeight: '2.4375em',
                              },
                            }}
                            fullWidth
                            name="price"
                            value={
                              (steps && steps[activeStep]?.listPrice) ?? ''
                            }
                            type="number"
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                              handleChangePrice(event, activeStep)
                            }
                            id="price"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            label={
                              <Typography
                                sx={{
                                  fontSize: '22px',
                                  color: 'text.primary',
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
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mr: { miniMobile: 1, sm: 2 },
                            ml: { miniMobile: 0.5, sm: 1 },
                            mb: '4px',
                            mt: '1pc',
                          }}
                        >
                          <CurrencySelect
                            value={(steps && steps[activeStep]?.currency) ?? 0}
                            onChange={(value) => handleSelectCurrency(value)}
                          />
                        </Box>
                      </Box>
                      {/* ============= */}
                      <Box sx={{ mt: 0.5 }}>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            color: 'text.secondary',
                            ml: 2,
                          }}
                        >
                          {((steps && steps[activeStep]?.connectUsd) ?? '0') +
                            ' USD'}
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
                              'border': 'none',
                              'borderStyle': 'none',
                              'bgcolor': 'background.paper',
                              'minHeight': 'auto !important',
                              'pr': 2,
                              'pl': 2,
                              '& .MuiAccordionSummary-content': {
                                m: '12px 0 !important',
                              },
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
                          <AccordionDetails
                            sx={{ pl: 2, bgcolor: 'background.paper' }}
                          >
                            <FormGroup
                              row={true}
                              sx={{
                                display:
                                  steps && steps[activeStep]?.currency === 0
                                    ? 'none'
                                    : 'flex',
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
                                    }}
                                  >
                                    {steps &&
                                      usdFromAvax &&
                                      (
                                        Number(steps[activeStep]?.connectUsd) /
                                        Number(
                                          ethers.utils.formatEther(
                                            usdFromAvax as BigNumberish
                                          )
                                        )
                                      ).toFixed(3)}
                                    {' AVAX'}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '12px',
                                      fontWeight: '300',
                                      color: 'text.secondary',
                                    }}
                                  >
                                    {((steps &&
                                      steps[activeStep]?.connectUsd) ??
                                      '0') + ' USD'}
                                  </Typography>
                                </Box>
                              </Box>

                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      (steps && steps[activeStep]?.isChecked) ??
                                      false
                                    }
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      handleAcceptPaymentCheck(
                                        e.target.checked,
                                        0
                                      );
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
                                display:
                                  steps && steps[activeStep]?.currency === 1
                                    ? 'none'
                                    : 'flex',
                                flexGrow: 1,
                                justifyContent: 'space-between',
                                // bgcolor: 'primary.contrastText',
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
                                  <Typography
                                    sx={{
                                      fontSize: '16px',
                                      fontWeight: '400',
                                    }}
                                  >
                                    {steps &&
                                      usdFromThor &&
                                      (
                                        Number(steps[activeStep]?.connectUsd) /
                                        Number(
                                          ethers.utils.formatEther(
                                            usdFromThor as BigNumberish
                                          )
                                        )
                                      ).toFixed(3) + ' THOR'}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '12px',
                                      fontWeight: '300',
                                      color: 'text.secondary',
                                    }}
                                  >
                                    {((steps &&
                                      steps[activeStep]?.connectUsd) ??
                                      '0') + ' USD'}
                                  </Typography>
                                </Box>
                              </Box>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      (steps &&
                                        steps[activeStep]?.isChecked1) ??
                                      false
                                    }
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      handleAcceptPaymentCheck(
                                        e.target.checked,
                                        1
                                      );
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
                                display:
                                  steps && steps[activeStep]?.currency === 2
                                    ? 'none'
                                    : 'flex',
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
                                  <Typography
                                    sx={{
                                      fontSize: '16px',
                                      fontWeight: '400',
                                    }}
                                  >
                                    {((steps &&
                                      steps[activeStep]?.connectUsd) ??
                                      '0') + ' USDC.e'}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '12px',
                                      fontWeight: '300',
                                      color: 'text.secondary',
                                    }}
                                  >
                                    {((steps &&
                                      steps[activeStep]?.connectUsd) ??
                                      '0') + ' USD'}
                                  </Typography>
                                </Box>
                              </Box>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      (steps &&
                                        steps[activeStep]?.isChecked2) ??
                                      false
                                    }
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      handleAcceptPaymentCheck(
                                        e.target.checked,
                                        2
                                      );
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
                        </Accordion>
                      </Box>
                    </Box>
                    {/* ============= */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        mt: 2,
                      }}
                    >
                      <Typography variant="p-md-bk">
                        Listing fee (2%)
                      </Typography>
                      {
                        <Typography variant="p-md-bk">
                          {formatNumber(
                            (totalListPriceUSD * feePercentage) / 100
                          )}{' '}
                          USD
                        </Typography>
                      }
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        mt: 3,
                      }}
                    >
                      <Typography variant="lbl-lg">
                        Your potential earning
                      </Typography>
                      <Typography variant="lbl-lg">
                        {parseFloat(Number(totalListPriceUSD)?.toFixed(3))} USD
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mt: 1, width: '100%' }}>
                      <Button
                        disabled={
                          listPriceError.isError ||
                          // isInsufficientBalance ||
                          // getApprovalLoading ||
                          // approveNFTLoading ||
                          isExecuteLoading ||
                          transactionLoading ||
                          nftApprovalTransactionLoading ||
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
                          {nftApproval ? 'list NFT' : 'Approval Request'}
                        </Typography>
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid
                item
                sm={3}
                xs={12}
                sx={{ display: { miniMobile: 'none', sm: 'block' } }}
              >
                <Box
                  sx={(theme) => ({
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 0.2,
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  })}
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
                          color: 'success.main',
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
                      <Box sx={{ mt: '5px' }}>
                        <Image
                          src="/images/redAvaxIcon.svg"
                          alt="triangle"
                          width={20}
                          height={20}
                        />
                      </Box>
                      <Typography sx={{ mt: 1, ml: 1 }} variant="lbl-lg">
                        AVAX
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 2,
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
                        {steps &&
                          steps[activeStep]?.currency === 0 &&
                          (balance &&
                            parseFloat(
                              Number(formatDecimals(balance)).toFixed(3)
                            )) + ' AVAX'}
                        {steps &&
                          steps[activeStep]?.currency === 1 &&
                          (thorBalance &&
                            parseFloat(
                              Number(formatDecimals(thorBalance)).toFixed(3)
                            )) + ' THOR'}
                        {steps &&
                          steps[activeStep]?.currency === 2 &&
                          (usdcBalance &&
                            parseFloat(
                              Number(formatDecimals(usdcBalance, 6)).toFixed(3)
                            )) + ' USDC.e'}
                      </Typography>
                      <Typography sx={{ fontSize: '16px', textAlign: 'left' }}>
                        {steps &&
                          steps[activeStep]?.currency === 0 &&
                          (balance &&
                            usdFromAvax &&
                            parseFloat(
                              (
                                Number(formatDecimals(balance)) *
                                Number(formatDecimals(usdFromAvax))
                              ).toFixed(3)
                            )) + ' USD'}
                        {steps &&
                          steps[activeStep]?.currency === 1 &&
                          (thorBalance &&
                            usdFromThor &&
                            parseFloat(
                              (
                                Number(formatDecimals(thorBalance)) *
                                Number(formatDecimals(usdFromThor))
                              ).toFixed(3)
                            )) + ' USD'}
                        {steps &&
                          steps[activeStep]?.currency === 2 &&
                          (usdcBalance &&
                            parseFloat(
                              Number(formatDecimals(usdcBalance, 6)).toFixed(3)
                            )) + ' USD'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default BatchListNFTModal;
