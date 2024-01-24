import React, { useState, useMemo, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Grid, TextField, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { MODAL_TYPES, useGlobalModalContext } from './GlobleModal';
import { palette } from '../../theme/palette';
import {
  useGetApproval,
  useListNFT,
  useSetApproval,
} from '../../hooks/useNFTDetail';
import { BigNumberish, ethers } from 'ethers';
import { useAccount } from 'wagmi';
import Loader from '../common/Loader';
import {
  useGetTransaction,
  useMarketplaceAddress,
} from '../../hooks/Marketplace';
import { dottedAddress, formatDecimals } from '../../shared/utils/utils';
import { useGetUsdFromAvax, useGetUsdFromThor } from '../../hooks/useOracle';
import { useChain } from '../../utils/web3Utils';
import {
  formatNumber,
  getValidCurrency,
  isNode as isNodeNFT,
} from '../../utils/common';
import { useTheme } from '@mui/material/styles';
import { ToastSeverity } from '../../redux/slices/toastSlice';
import { NftDataType } from '../../utils/types';
import SelectBox from '../common/SelectBox';
import { useBalance } from '../../hooks/useToken';

type Props = {
  open: boolean;
  handleClose: any;
  openToast?: any;
  refetches?: any[];
  listNFT?: NftDataType;
};

const ListNft = (props: Props) => {
  const marketplaceAddress = useMarketplaceAddress();
  const { open, handleClose, listNFT, refetches } = props;
  const user = useSelector((state: any) => state.auth.user);
  const { showModal } = useGlobalModalContext();
  const [listPrice, setListPrice] = useState('0');
  const feePercentage = 2;
  const [listFee, setListFee] = useState(0);
  const [isNode, setIsNode] = useState(true);
  const { address: accountAddress } = useAccount();
  const currencies = getValidCurrency(isNode);
  const [currency, setCurrency] = useState(currencies[0].value);

  const nftImage = listNFT?.nftImage;
  const listNFTToast = {
    message: 'NFT Listing...',
    severity: ToastSeverity.INFO,
    image: nftImage,
  };
  const txnToast = {
    message: 'NFT Listed',
    severity: ToastSeverity.SUCCESS,
    image: nftImage,
    autoHideDuration: 5000,
  };
  const {
    write: listNFTWrite,
    isLoading: listNFTLoading,
    data: listTransactionData,
  } = useListNFT(listNFTToast);
  const {
    data: writeTransactionResult,
    isError: writeTransactionError,
    isLoading: writeTransactionLoading,
  } = useGetTransaction(listTransactionData?.hash, txnToast);

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
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);

  const balance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');

  const listPriceUSD = useMemo(() => {
    if (listPrice) {
      return (
        Number(listPrice) *
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
  }, [listPrice, currency, avaxPrice, thorPrice]);
  const listFeeUSD = useMemo(() => {
    if (listPriceUSD) {
      return (feePercentage / 100) * listPriceUSD;
    } else {
      return 0;
    }
  }, [listPriceUSD]);

  const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target.value.length < 20) {
      setListPrice(event?.target.value);
      setListFee((feePercentage / 100) * Number(event?.target.value));
    }
  };

  const handleSelectCurrency: React.ChangeEventHandler<HTMLSelectElement> = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrency(Number(event.target.value));
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
  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  React.useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.style.overflow = bigScreen && open ? 'hidden' : 'auto';
    }
  }, [open, bigScreen]);

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
      listNFTWrite({
        recklesslySetUnpreparedArgs: [
          1,
          [currency],
          [listNFT?.nftAddress],
          [listNFT?.tokenId],
          [ethers.utils.parseEther(listPrice.toString())],
          // TODO: must be updated according to contract update
          [9999999999999],
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

  useEffect(() => {
    if (listNFT && listNFT?.nftAddress) {
      const isNodeNFTAddress = isNodeNFT(listNFT?.nftAddress, chain);
      setIsNode(isNodeNFTAddress);
    }
  }, [listNFT, chain]);

  const usdBalancePrice = useMemo(() => {
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

  return (
    <Box>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{
          'zIndex': 10006,
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
                      NFT BEING LISTED
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
                      // position: 'absolute',
                    }}
                  >
                    <img
                      src={listNFT?.nftImage || '/images/nftImage.png'}
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
                    {listNFT?.nftName}
                  </Typography>
                  <Typography
                    sx={{
                      width: '100%',
                      display: 'flex',
                      aligItems: 'center',

                      marginTop: 1,
                    }}
                  >
                    by {listNFT?.by}
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
                    List NFT
                  </Typography>
                  {/* ======= */}
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

                  <Box sx={{ mt: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'rgba(0, 0, 0, 0.24)',
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
                        color: '#181F3F',
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
                      onClick={handleClick}
                      sx={{
                        'borderRadius': '0%',
                        'width': '100%',
                        'maxWidth': '100%',
                        ':disabled': {
                          backgroundColor: '#F3523F',
                          color: 'white',
                          opacity: 0.5,
                        },
                      }}
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
                          {userApproval ? 'List NFT' : 'Approval Request'}
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
};

export default ListNft;
