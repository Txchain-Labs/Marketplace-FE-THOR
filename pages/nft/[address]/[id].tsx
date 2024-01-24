import React, { useMemo, useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Divider,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Tooltip,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import BuyNft from '../../../src/components/modals/BuyNft';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import PlaceBid from '../../../src/components/modals/PlaceBid';
import Image from 'next/image';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { dottedAddress, formatDecimals } from '../../../src/shared/utils/utils';
import {
  MODAL_TYPES,
  useGlobalModalContext,
} from '../../../src/components/modals';
import { palette } from '../../../src/theme/palette';
import {
  useGetNFTOwner,
  useGetOtcTokenBids,
  useGetBidsByOrderId,
  useGetUserByAddress,
  useUnListNFT,
  useGetNFTDetail,
} from '../../../src/hooks/useNFTDetail';
import { useBalance } from '../../../src/hooks/useToken';
import { useRouter } from 'next/router';
import {
  formatNumber,
  formattedTime,
  getMetaDataAttributes,
  getMetaDataDescription,
  isNode as isNodeNFT,
  getMetaData,
  getMetaDataName,
} from '../../../src/utils/common';
import { collectionsService } from '../../../src/services/collection.service';
import { Collection } from '../../../src/models/Collection';
import { Attribute } from '../../../src/models/Metadata';
import { Listing } from '../../../src/models/Listing';

import styles from './style.module.css';
import { useChain } from '../../../src/utils/web3Utils';
import { isMobile, isTablet } from 'react-device-detect';

import {
  useMarketplaceAddress,
  useGetBidByNft,
  useExecuteOrder,
  useGetOtcBid,
  useCancelOtcBid,
  useCancelBid,
  useGetTransaction,
} from '../../../src/hooks/Marketplace';
import ListNft from '../../../src/components/modals/ListNft';
import { bidType } from '../../../src/utils/constants';
import BuyNFTModal from '../../../src/components/modals/BuyNFTModal';
import {
  useGetUsdFromAvax,
  useGetUsdFromThor,
} from '../../../src/hooks/useOracle';
import moment from 'moment';
import { useGetListingByNft } from '../../../src/hooks/useListings';
import AcceptBid from '../../../src/components/modals/AcceptBid';
import { ToastSeverity } from '../../../src/redux/slices/toastSlice';
import Link from 'next/link';
import { NftDataType } from '../../../src/utils/types';
import { LikeButton } from '../../../src/components/common';
import axios from 'axios';
import { useSetAttribute } from '../../../src/hooks/uiHooks';
const titlee = {
  typography: { md: 'h3-bk', miniMobile: 'h4' },
  lineHeight: { md: '54.58px', miniMobile: '48.51px' },
  display: 'block',
  textAlign: 'center',
  color: palette.primary.storm,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '90%',
  whiteSpace: 'nowrap',
};
const imgStyle = { display: 'flex', alignItems: 'baseline' };

const box1 = { mt: { xs: 4, md: 8 }, ml: { xs: 1.5, md: 5 }, margin: 'auto' };
const box2 = { mt: 4, ml: { xs: 1.5, md: 5 } };
const ownertext = {
  fontFamily: 'Nexa',
  fontSize: '14px',
  fontWeight: isMobile ? 700 : 400,
  lineHeight: '21px',
  letterSpacing: '0.04em',
  textAlign: 'left',
  color: palette.primary.storm,
};
const ownerDetail = { fontWeight: 500, ml: 1, color: palette.primary.storm };

const buttonBox = {
  // display: { xs: 'block', sm: 'block', md: 'block' },
  // mt: { xs: 3, md: 6 },
  // ml: { xs: 0, md: 5 },
  // mb: { xs: 0, md: 3 },
  // p: { xs: 1.5, md: 0 },
  // textAlign: 'center',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  zIndex: '1000',
  width: '100%',
  position: 'absolute',
  bottom: 0,
  marginLeft: '5px',
  gap: '10px',
};
const buttonBoxMobile = {
  ...buttonBox,
  position: 'fixed',
  flexDirection: 'column',
  left: '10px',
  right: '10px',
  marginLeft: '0px',
  width: 'auto',
  backgroundColor: 'white',
};

const divider = {
  background: 'rgba(0, 0, 0, 0.4)',
  width: { xs: '100%', md: '1px' },
  height: { xs: '1%', md: '80%' },
  mt: 8,
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledTabs: any = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    top: '25px',
  },
  '& .MuiTabs-indicatorSpan': {
    // minWidth: 40,
    width: isMobile ? 100 : 40,
    height: isMobile ? 8 : 'auto',
    backgroundColor: palette.primary.fire,
  },
  '& .MuiButtonBase-root.MuiTab-root': {
    color: '#808080!important',
    marginBottom: 0,
    fontFamily: 'Nexa',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '15px',
    letterSpacing: '0em',
    textAlign: 'left',
    // margin: '0!important',
  },
  '& .MuiButtonBase-root.MuiTab-root.Mui-selected': {
    color: 'black!important',
  },
});

type BuyerButtonProps = {
  user: any;
  setOpenType: any;
  showModal: any;
  setIsOpen: any;
  listing: any;
  isExpired: boolean;
  isInvalidOwner: boolean;
  // isOldOwner: boolean;
  collectionAddress: string;
  tokenId: number;
  setActiveBidType(val: string): void;
  isPrivate: boolean;
  isNormal: boolean;
  nftData: any;
};

type OwnerButtonProps = {
  user: any;
  setOpenType: any;
  showModal: any;
  setIsOpen: any;
  listing: any;
  isExpired: boolean;
  isInvalidOwner: boolean;
  collectionAddress: string;
  tokenId: number;
  showListModal: boolean;
  setShowListModal(val: boolean): void;
  activeTab: number;
  refetchListing(): void;
  nftData: any;
};

const BuyerButtons = (props: BuyerButtonProps) => {
  const {
    user,
    setOpenType,
    showModal,
    setIsOpen,
    listing,
    isExpired,
    isInvalidOwner,
    // isOldOwner,
    collectionAddress,
    tokenId,
    setActiveBidType,
    isPrivate,
    isNormal,
    nftData,
  } = props;

  const { write } = useExecuteOrder();
  const cancelBidToast = {
    message: 'Bid Cancelling...',
    severity: ToastSeverity.INFO,
    image: nftData?.nftImage,
    autoHideDuration: 5000,
  };
  const txnToast = {
    message: 'Bid Cancelled',
    severity: ToastSeverity.SUCCESS,
    image: nftData?.nftImage,
    autoHideDuration: 5000,
  };
  const {
    data: cancelOtcBidData,
    write: writeCancelOtcBid,
    isLoading: cancelOtcBidLoading,
  } = useCancelOtcBid(cancelBidToast);
  const {
    data: cancelSimpleBidData,
    write: writeCancelSimpleBid,
    isLoading: cancelSimpleBidLoading,
  } = useCancelBid(cancelBidToast);
  useGetTransaction(
    cancelOtcBidData?.hash || cancelSimpleBidData?.hash,
    txnToast
  );
  const {
    data: simpleBidData,
    isLoading: simpleBidLoading,
    refetch: refetchSimpleBid,
  } = useGetBidByNft(collectionAddress, tokenId);
  const {
    data: otcBidData,
    isLoading: otcBidLoading,
    refetch: refetchOtcBid,
  } = useGetOtcBid(collectionAddress, Number(tokenId));
  const chain = useChain();
  const isNode = isNodeNFT(collectionAddress, chain);

  const avaxBalance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');
  const thorBalanceValue =
    thorBalance && parseFloat(formatDecimals(thorBalance));
  const avaxBalanceValue =
    avaxBalance && parseFloat(formatDecimals(avaxBalance));

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const formatedPrice = useMemo(() => {
    if (listing && (listing as any).priceInWei) {
      return (
        Number(ethers.utils.formatEther((listing as any)?.priceInWei)) *
        ((listing as any)?.paymentType === '0'
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
  }, [thorPrice, avaxPrice, listing]);

  const handleExecuteOrder = () => {
    write({
      recklesslySetUnpreparedArgs: [
        [collectionAddress],
        [tokenId],
        [listing?.priceInWei],
        0,
      ],
      recklesslySetUnpreparedOverrides: {
        from: user?.address,
        value: BigNumber.from(listing?.priceInWei),
      },
    });
  };
  const placeBidMobileButtonRef = useSetAttribute([
    { key: 'id', value: 'place-bid-mobile-button' },
    { key: 'dusk', value: 'place-bid-mobile-button' },
  ]);
  const removeBidMobileButtonRef = useSetAttribute([
    { key: 'id', value: 'remove-bid-mobile-button' },
    { key: 'dusk', value: 'remove-bid-mobile-button' },
  ]);
  const removePrivateBidMobileButtonRef = useSetAttribute([
    { key: 'id', value: 'remove-private-bid-mobile-button' },
    { key: 'dusk', value: 'remove-private-bid-mobile-button' },
  ]);
  const expireBuyButtonRef = useSetAttribute([
    { key: 'id', value: 'expire-buy-button' },
    { key: 'dusk', value: 'expire-buy-button' },
  ]);
  const buyButtonRef = useSetAttribute([
    { key: 'id', value: 'buy-button' },
    { key: 'dusk', value: 'buy-button' },
  ]);
  const placeBidButtonRef = useSetAttribute([
    { key: 'id', value: 'place-bid-button' },
    { key: 'dusk', value: 'place-bid-button' },
  ]);
  const removeBidButtonRef = useSetAttribute([
    { key: 'id', value: 'remove-bid-button' },
    { key: 'dusk', value: 'remove-bid-button' },
  ]);

  const insufficientBalance = useMemo(() => {
    return (
      (isNode &&
        listing &&
        (listing as any).priceInWei &&
        (listing as any)?.paymentType === '0' &&
        Number(ethers.utils.formatEther((listing as any)?.priceInWei)) >
          avaxBalanceValue &&
        Number(ethers.utils.formatEther((listing as any)?.priceInWei)) *
          Number(ethers.utils.formatEther(avaxPrice as BigNumberish)) >
          thorBalanceValue *
            Number(ethers.utils.formatEther(thorPrice as BigNumberish))) ||
      (isNode &&
        listing &&
        (listing as any).priceInWei &&
        (listing as any)?.paymentType !== '0' &&
        Number(ethers.utils.formatEther((listing as any)?.priceInWei)) >
          thorBalanceValue &&
        Number(ethers.utils.formatEther((listing as any)?.priceInWei)) *
          Number(ethers.utils.formatEther(thorPrice as BigNumberish)) >
          avaxBalanceValue *
            Number(ethers.utils.formatEther(avaxPrice as BigNumberish))) ||
      (!isNode &&
        listing &&
        (listing as any).priceInWei &&
        Number(ethers.utils.formatEther((listing as any)?.priceInWei)) >
          avaxBalanceValue &&
        Number(ethers.utils.formatEther((listing as any)?.priceInWei)) *
          Number(ethers.utils.formatEther(avaxPrice as BigNumberish)) >
          thorBalanceValue *
            Number(ethers.utils.formatEther(thorPrice as BigNumberish)))
    );
  }, [
    thorBalanceValue,
    avaxBalanceValue,
    listing,
    isNode,
    avaxPrice,
    thorPrice,
  ]);

  useEffect(() => {
    refetchOtcBid();
  }, [cancelOtcBidLoading, refetchOtcBid]);

  useEffect(() => {
    refetchSimpleBid();
  }, [cancelSimpleBidLoading, refetchSimpleBid]);
  return (
    <>
      {listing && !isExpired && !isInvalidOwner && !listing?.sold ? (
        simpleBidLoading ? (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={isMobile || isTablet ? buttonBoxMobile : buttonBox}>
            {!isPrivate && (
              <React.Fragment>
                {insufficientBalance ? (
                  <Tooltip title="You do not have enough balance on your wallet">
                    <Button
                      ref={expireBuyButtonRef}
                      variant="nft_primary"
                      disabled={true}
                      onClick={() => {
                        if (!user?.address) {
                          showModal(MODAL_TYPES.CONNECT_WALLET, {
                            title: 'Create instance form',
                            confirmBtn: 'Save',
                          });
                        } else {
                          setOpenType('purchase');
                          if (isNode) {
                            setIsOpen(true);
                          } else {
                            handleExecuteOrder();
                          }
                        }
                      }}
                    >
                      {isNode ? (
                        <Typography variant="lbl-md">
                          {' '}
                          Buy for {formatNumber(formatedPrice)} USD{' '}
                        </Typography>
                      ) : (
                        <Typography variant="lbl-md">
                          {' '}
                          Buy for{' '}
                          {formatDecimals(
                            listing?.priceInWei,
                            18,
                            true
                          )} AVAX{' '}
                        </Typography>
                      )}
                    </Button>
                  </Tooltip>
                ) : (
                  <Button
                    ref={buyButtonRef}
                    variant="nft_primary"
                    disabled={!(collectionAddress && tokenId)}
                    onClick={() => {
                      if (!user?.address) {
                        showModal(MODAL_TYPES.CONNECT_WALLET, {
                          title: 'Create instance form',
                          confirmBtn: 'Save',
                        });
                      } else {
                        setOpenType('purchase');
                        if (isNode) {
                          setIsOpen(true);
                        } else {
                          handleExecuteOrder();
                        }
                      }
                    }}
                  >
                    {isNode ? (
                      <Typography variant="lbl-md">
                        {' '}
                        Buy for {formatNumber(formatedPrice)} USD{' '}
                      </Typography>
                    ) : (
                      <Typography variant="lbl-md">
                        {' '}
                        Buy for {formatDecimals(
                          listing?.priceInWei,
                          18,
                          true
                        )}{' '}
                        AVAX{' '}
                      </Typography>
                    )}
                  </Button>
                )}
                <Button
                  ref={placeBidButtonRef}
                  variant="nft_secondary"
                  // sx={btn1}
                  onClick={() => {
                    if (!user?.address) {
                      showModal(MODAL_TYPES.CONNECT_WALLET, {
                        title: 'Create instance form',
                        confirmBtn: 'Save',
                      });
                    } else {
                      setActiveBidType(bidType.DEFAULT);
                      setOpenType('bid');
                      setIsOpen(true);
                    }
                  }}
                >
                  <Typography variant="lbl-md"> Place a Bid</Typography>
                </Button>
              </React.Fragment>
            )}
            {(simpleBidData as any)?.bidder?.toLowerCase() ===
              user?.address?.toLowerCase() &&
              !isPrivate && (
                <Button
                  ref={removeBidButtonRef}
                  disabled={cancelSimpleBidLoading}
                  variant="nft_text"
                  // sx={btn1}
                  onClick={() => {
                    if (!user?.address) {
                      showModal(MODAL_TYPES.CONNECT_WALLET, {
                        title: 'Create instance form',
                        confirmBtn: 'Save',
                      });
                    } else {
                      writeCancelSimpleBid({
                        recklesslySetUnpreparedArgs: [
                          collectionAddress,
                          tokenId,
                        ],
                      });
                    }
                  }}
                >
                  {/* {cancelSimpleBidLoading ? (
                    <CircularProgress size="2.5rem" sx={{ color: 'white' }} />
                  ) : ( */}
                  <Typography variant="lbl-md">Remove my Bid</Typography>
                  {/* )} */}
                </Button>
              )}
          </Box>
        )
      ) : (
        <Box sx={isMobile || isTablet ? buttonBoxMobile : buttonBox}>
          {otcBidLoading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                sx={{
                  px: 2,
                  pt: 2,
                  fontKerning: 'none',
                  lineHeight: '130%',
                  textAlign: 'center',
                }}
                variant="p-lg-bk"
              >
                This NFT has not been listed yet, seller might not see the bid.
              </Typography>
              <Box
                sx={{ display: 'flex', justifyContent: 'center', gap: '15px' }}
              >
                {!isNormal && (
                  <Button
                    ref={placeBidMobileButtonRef}
                    variant="nft_secondary"
                    // sx={btn1}
                    onClick={() => {
                      if (!user?.address) {
                        showModal(MODAL_TYPES.CONNECT_WALLET, {
                          title: 'Create instance form',
                          confirmBtn: 'Save',
                        });
                      } else {
                        setActiveBidType(bidType.OTC);
                        setOpenType('bid');
                        setIsOpen(true);
                      }
                    }}
                  >
                    <Typography variant="lbl-md"> Place a Bid</Typography>
                  </Button>
                )}
                {otcBidData?.bidder?.toLowerCase() === user?.address &&
                  !isNormal && (
                    <Button
                      ref={removePrivateBidMobileButtonRef}
                      disabled={cancelOtcBidLoading}
                      variant="nft_text"
                      // sx={btn1}
                      onClick={() => {
                        if (!user?.address) {
                          showModal(MODAL_TYPES.CONNECT_WALLET, {
                            title: 'Create instance form',
                            confirmBtn: 'Save',
                          });
                        } else {
                          writeCancelOtcBid({
                            recklesslySetUnpreparedArgs: [
                              collectionAddress,
                              tokenId,
                            ],
                          });
                        }
                      }}
                    >
                      {/* {cancelOtcBidLoading ? (
                        <CircularProgress
                          size="2.5rem"
                          sx={{ color: 'white' }}
                        />
                      ) : ( */}
                      <Typography variant="lbl-md">
                        {' '}
                        Remove my Private Bid
                      </Typography>
                      {/* )} */}
                    </Button>
                  )}
                {listing &&
                  (isExpired || isInvalidOwner) &&
                  (simpleBidData as any)?.bidder?.toLowerCase() ===
                    user?.address?.toLowerCase() &&
                  !isPrivate && (
                    <Button
                      ref={removeBidMobileButtonRef}
                      disabled={cancelSimpleBidLoading}
                      variant="nft_text"
                      // sx={btn1}
                      onClick={() => {
                        if (!user?.address) {
                          showModal(MODAL_TYPES.CONNECT_WALLET, {
                            title: 'Create instance form',
                            confirmBtn: 'Save',
                          });
                        } else {
                          writeCancelSimpleBid({
                            recklesslySetUnpreparedArgs: [
                              collectionAddress,
                              tokenId,
                            ],
                          });
                        }
                      }}
                    >
                      {/* {cancelSimpleBidLoading ? (
                        <CircularProgress
                          size="2.5rem"
                          sx={{ color: 'white' }}
                        />
                      ) : ( */}
                      <Typography variant="lbl-md">Remove my Bid</Typography>
                      {/* )} */}
                    </Button>
                  )}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

const OwnerButtons = (props: OwnerButtonProps) => {
  const {
    user,
    setOpenType,
    showModal,
    listing,
    isExpired,
    isInvalidOwner,
    collectionAddress,
    tokenId,
    showListModal,
    setShowListModal,
    activeTab,
    refetchListing,
    nftData,
  } = props;
  const { data: lastBid, refetch: lastBidRefetch } = useGetBidByNft(
    collectionAddress,
    tokenId
  );
  const [showAcceptModel, setShowAcceptModal] = useState(false);
  const handleAcceptModalClose = () => {
    setShowAcceptModal(false);
  };
  const [acceptBidType, setAcceptBidType] = useState(bidType.DEFAULT);

  const { data: lastOtcBid, refetch: lastOtcBidRefetch } = useGetOtcBid(
    collectionAddress,
    tokenId
  );
  const unListNFTToast = {
    message: 'NFT Unlisting...',
    severity: ToastSeverity.INFO,
    image: nftData?.nftImage,
    autoHideDuration: 5000,
  };
  const txnToast = {
    message: 'NFT Unlisted',
    severity: ToastSeverity.SUCCESS,
    image: nftData?.nftImage,
    autoHideDuration: 5000,
  };
  const {
    data: unlistTransactionData,
    write: unListNFTWrite,
    isLoading: unListNFTLoading,
  } = useUnListNFT(unListNFTToast);
  useGetTransaction(unlistTransactionData?.hash, txnToast);

  const handleUnlistNFT = async () => {
    await unListNFTWrite({
      recklesslySetUnpreparedArgs: [collectionAddress, tokenId],
    });
    lastBidRefetch();
    lastOtcBidRefetch();
    refetchListing();
  };

  const chain = useChain();
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);

  const lastOtcBidUSD = useMemo(() => {
    if (lastOtcBid && (lastOtcBid as any).price) {
      return (
        Number(ethers.utils.formatEther((lastOtcBid as any)?.price)) *
        ((lastOtcBid as any)?.paymentType
          ? thorPrice
            ? Number(ethers.utils.formatEther(thorPrice as BigNumberish))
            : 0
          : avaxPrice
          ? Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
          : 0)
      );
    } else {
      return 0;
    }
  }, [thorPrice, avaxPrice, lastOtcBid]);

  const listButtonRef = useSetAttribute([
    { key: 'id', value: 'list-button' },
    { key: 'dusk', value: 'list-button' },
  ]);
  const acceptBidButtonRef = useSetAttribute([
    { key: 'id', value: 'accept-bid-button' },
    { key: 'dusk', value: 'accept-bid-button' },
  ]);
  const acceptPrivateBidButtonRef = useSetAttribute([
    { key: 'id', value: 'accept-private-bid-button' },
    { key: 'dusk', value: 'accept-private-bid-button' },
  ]);
  const unListButtonRef = useSetAttribute([
    { key: 'id', value: 'unlist-button' },
    { key: 'dusk', value: 'unlist-button' },
  ]);
  const unListButtonRef2 = useSetAttribute([
    { key: 'id', value: 'unlist-expired-button' },
    { key: 'dusk', value: 'unlist-expired-button' },
  ]);

  const [acceptBidData, setAcceptBidData] = useState({
    bidPrice: formatDecimals((lastBid as any)?.price, 18, true),
    bidExpiresAt: formattedTime((lastBid as any)?.expiresAt),
    paymentType: (lastBid as any)?.paymentType,
  });

  const handleAcceptBid = (_bidType: string) => {
    setAcceptBidType(_bidType);
    if (_bidType === bidType.DEFAULT) {
      // simple
      setAcceptBidData((prevState) => ({
        ...prevState,
        bidPrice: formatDecimals((lastBid as any)?.price, 18, true),
        bidExpiresAt: (lastBid as any)?.expiresAt.toString(),
        paymentType: (lastBid as any)?.paymentType,
      }));
      setShowAcceptModal(true);
    } else if (_bidType === bidType.OTC) {
      // otc
      setAcceptBidData((prevState) => ({
        ...prevState,
        bidPrice: lastOtcBidUSD.toFixed(2),
        bidExpiresAt: (lastOtcBid as any)?.expiresAt.toString(),
        paymentType: (lastOtcBid as any)?.paymentType,
      }));
      setShowAcceptModal(true);
    }
  };

  const acceptBidResponse = (response: any) => {
    if (response?.isSuccess) {
      lastBidRefetch();
      lastOtcBidRefetch();
      refetchListing();
    }
  };

  return (
    <Box sx={isMobile || isTablet ? buttonBoxMobile : buttonBox}>
      {listing && !isExpired && !isInvalidOwner && !listing?.sold ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {(lastOtcBid as any)?.price &&
            (lastOtcBid as any)?.bidder !== ethers.constants.AddressZero &&
            activeTab === 2 && (
              <Typography
                sx={{
                  px: 2,
                  pt: 2,
                  fontKerning: 'none',
                  lineHeight: '130%',
                  textAlign: 'center',
                }}
                variant="p-lg-bk"
              >
                To accept Private Bid, you have to Unlist NFT.
              </Typography>
            )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              width: '100%',
            }}
          >
            {(lastBid as any)?.price &&
              (lastBid as any)?.bidder !== ethers.constants.AddressZero &&
              ((isMobile && activeTab === 1) ||
                (!isMobile && activeTab === 0)) && (
                <Button
                  ref={acceptBidButtonRef}
                  variant="nft_primary"
                  disabled={showAcceptModel}
                  onClick={() => {
                    if (!user?.address) {
                      showModal(MODAL_TYPES.CONNECT_WALLET, {
                        title: 'Create instance form',
                        confirmBtn: 'Save',
                      });
                    } else {
                      setOpenType('purchase');
                      handleAcceptBid(bidType.DEFAULT);
                    }
                  }}
                >
                  <Typography variant="lbl-md">
                    {' '}
                    Accept Bid for{' '}
                    {formatDecimals((lastBid as any)?.price, 18, true)}{' '}
                    {Number(acceptBidData.paymentType) === 0 ? 'AVAX' : 'THOR'}{' '}
                  </Typography>
                </Button>
              )}

            <Button
              ref={unListButtonRef}
              variant="nft_outlined"
              disabled={unListNFTLoading}
              onClick={() => {
                if (!user?.address) {
                  showModal(MODAL_TYPES.CONNECT_WALLET, {
                    title: 'Create instance form',
                    confirmBtn: 'Save',
                  });
                } else {
                  // setOpenType('purchase');
                  handleUnlistNFT();
                }
              }}
            >
              {/* {unListNFTLoading ? (
                <CircularProgress size="2.5rem" sx={{ color: 'white' }} />
              ) : ( */}
              <Typography variant="lbl-md">Unlist NFT</Typography>
              {/* )} */}
            </Button>
            {/* <Box>
            <Typography sx={priceText}>
              {formatNumber(listingUSD)} USD
            </Typography>
          </Box> */}
          </Box>
        </Box>
      ) : (
        <>
          {(lastOtcBid as any)?.price &&
            (lastOtcBid as any)?.bidder !== ethers.constants.AddressZero &&
            ((isMobile && activeTab === 1) ||
              (!isMobile && activeTab === 0)) && (
              <Button
                ref={acceptPrivateBidButtonRef}
                variant="nft_primary"
                disabled={showAcceptModel}
                onClick={() => {
                  if (!user?.address) {
                    showModal(MODAL_TYPES.CONNECT_WALLET, {
                      title: 'Create instance form',
                      confirmBtn: 'Save',
                    });
                  } else {
                    setOpenType('purchase');
                    handleAcceptBid(bidType.OTC);
                  }
                }}
              >
                <Typography variant="lbl-md">
                  {' '}
                  Accept Private Bid for {lastOtcBidUSD.toFixed(2)} USD{' '}
                </Typography>
              </Button>
            )}
          {(!listing || (listing && isInvalidOwner)) && (
            <Button
              ref={listButtonRef}
              variant="nft_primary"
              // sx={btn1}
              onClick={() => {
                if (!user?.address) {
                  showModal(MODAL_TYPES.CONNECT_WALLET, {
                    title: 'Create instance form',
                    confirmBtn: 'Save',
                  });
                } else {
                  setShowListModal(!showListModal);
                }
              }}
            >
              <Typography variant="lbl-md">List for Sale</Typography>
            </Button>
          )}
        </>
      )}
      {listing && isExpired && (
        <React.Fragment>
          <Tooltip title="This listing was expired">
            <Button
              ref={unListButtonRef2}
              variant="nft_outlined"
              disabled={unListNFTLoading}
              onClick={() => {
                if (!user?.address) {
                  showModal(MODAL_TYPES.CONNECT_WALLET, {
                    title: 'Create instance form',
                    confirmBtn: 'Save',
                  });
                } else {
                  // setOpenType('purchase');
                  handleUnlistNFT();
                }
              }}
            >
              {/* {unListNFTLoading ? (
                <CircularProgress size="2.5rem" sx={{ color: 'white' }} />
              ) : ( */}
              <Typography variant="lbl-md">Unlist NFT</Typography>
              {/* )} */}
            </Button>
          </Tooltip>
          {/* <Box>
            <Typography sx={priceText}>
              {formatNumber(listingUSD)} USD
            </Typography>
          </Box> */}
        </React.Fragment>
      )}
      <AcceptBid
        open={showAcceptModel}
        handleClose={handleAcceptModalClose}
        bidData={acceptBidData}
        acceptBidType={acceptBidType}
        nftData={nftData}
        acceptBidResponse={acceptBidResponse}
      />
    </Box>
  );
};

const NFTdetailV2 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery(theme.breakpoints.between(600, 900));
  const router = useRouter();
  const marketplaceAddress = useMarketplaceAddress();
  const chain = useChain();
  // const pathname = router.query.id;
  const { address, id } = router.query;
  const collectionAddress = useMemo(() => '' + address, [address]);
  const nftId = useMemo(() => '' + id, [id]);
  // const [dataid] = useState(0);
  const [loading] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  // const data = useSelector((state: any) => state.dummy.data);
  const [isOpen, setIsOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openType, setOpenType] = React.useState('bid');
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openSnackSuccess, setOpenSnackSuccess] = React.useState(false);
  const [seeall, setseeall] = React.useState(false);
  const [tab, settab] = React.useState(0);
  const [priceSort, setPriceSort] = React.useState(true); // true => asc , false => desc
  const [otcPriceSort, setOtcPriceSort] = React.useState(true); // true => asc , false => desc
  // const [isExpired, setIsExpired] = useState<boolean>(false);
  const isExpired = false;
  const [isInvalidOwner, setIsInvalidOwner] = useState<boolean>(false);
  const { showModal } = useGlobalModalContext();
  const [isLiked, setIsLiked] = useState(false);

  const isNode = isNodeNFT(collectionAddress, chain);
  const { data: nftOwner, refetch: nftOwnerRefetch } = useGetNFTOwner(
    collectionAddress,
    Number(nftId)
  );
  const { data } = useGetNFTDetail(collectionAddress, nftId);

  // const [, setNextCollectionAddress] = useState('');
  const [currentCollection, setCurrentCollection] = useState<Collection>({});
  const [listing, setListing] = useState();
  const { data: listingData, refetch: refetchListing } = useGetListingByNft(
    collectionAddress,
    Number(nftId)
  );
  useEffect(() => {
    if (!listingData) return;

    const listing = listingData.data.data.listings[0];
    setListing(listing);

    if (!listing) return;

    // setIsExpired(
    //   listing.expiredAt && Number(listing.expiredAt) < Date.now() / 1000
    // );
    setIsInvalidOwner(!!listing.isInvalidOwner);
  }, [listingData]);

  const [showListModal, setShowListModal] = useState(false);
  const [activeBidType, setActiveBidType] = useState(bidType.DEFAULT);

  const _nftOwner = useMemo(() => {
    if (
      (nftOwner as string)?.toLowerCase() === marketplaceAddress.toLowerCase()
    ) {
      return (listing as any)?.sellerAddress;
    }
    return nftOwner;
  }, [listing, nftOwner, marketplaceAddress]);

  const { data: bidsData } = useGetBidsByOrderId(
    listing &&
      (listing as Listing).id &&
      BigNumber.from((listing as Listing).id).toString()
  );
  const { data: otcBidsData } = useGetOtcTokenBids(
    collectionAddress,
    Number(nftId)
  );

  const { data: publicUser, isLoading: pulicUserDataLoading } =
    useGetUserByAddress(_nftOwner);

  const handleModalClick = () => {
    setShowListModal(!showListModal);
  };
  const ListModalResponse = ({ isSuccess }: any) => {
    if (isSuccess) {
      nftOwnerRefetch();
    }
  };
  const nftData: NftDataType = {
    nftName: getMetaDataName(data) || '',
    by: 'Thorfi',
    nftImage: getMetaData(data),
    nftAddress: collectionAddress,
    tokenId: nftId,
    nftDescription: getMetaDataDescription(data) || '',
    nftAttributes: getMetaDataAttributes(data),
  };
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const listingUSD = useMemo(() => {
    if (listing && (listing as any).priceInWei) {
      return (
        Number(ethers.utils.formatEther((listing as any)?.priceInWei)) *
        ((listing as any)?.paymentType === '0'
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
  }, [thorPrice, avaxPrice, listing]);
  useEffect(() => {
    if (chain?.id && collectionAddress) {
      // collectionsService
      //   .getNextCollection('' + collectionAddress)
      //   .then((res) => {
      //     if (res.data.data) {
      //       setNextCollectionAddress(res.data.data.address);
      //     } else {
      //       collectionsService.getNextCollection('0').then((res) => {
      //         if (res.data.data) {
      //           setNextCollectionAddress(res.data.data.address);
      //         } else {
      //           setNextCollectionAddress('');
      //         }
      //       });
      //     }
      //   });
      collectionsService
        .getCollectionByAddress('' + collectionAddress, chain.id)
        .then((res) => {
          setCurrentCollection(res.data.data);
        });
    }
  }, [collectionAddress, chain]);
  // console.log(currentCollection);
  // const moveToNextCollection = () => {
  //   if (nextCollectionAddress) {
  //     window.location.href = `/nft/${nextCollectionAddress}/1`; // router.push(...) doesn't work
  //   }
  // };
  useEffect(() => {
    if (chain && user?.id && collectionAddress && nftId)
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/is-liked-unsynced/${chain?.id}/${user?.id}/${collectionAddress}/${nftId}`
        )
        .then((res) => {
          if (res.data.code === 200) {
            setIsLiked(res.data.data.liked ? true : false);
          }
          console.log(res);
        });
  }, [nftId, chain, user, collectionAddress]);
  const likeNFT = (collectionAddr: string, nftId: string) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/like-unsynced`, {
        user_id: user?.id,
        chainid: chain?.id,
        collection_address: collectionAddr,
        token_id: nftId,
      })
      .then((res) => {
        if (res.data.code === 200) {
          setIsLiked(!isLiked);
          console.log(res.data);
        }
      });
  };
  const backMobileButtonRef = useSetAttribute([
    { key: 'id', value: 'back-mobile-button' },
    { key: 'dusk', value: 'back-mobile-button' },
  ]);
  const backButtonRef = useSetAttribute([
    { key: 'id', value: 'back-button' },
    { key: 'dusk', value: 'back-button' },
  ]);
  const attributesMobileButtonRef = useSetAttribute([
    { key: 'id', value: 'attributes-mobile-button' },
    { key: 'dusk', value: 'attributes-mobile-button' },
  ]);
  const attributesButtonRef = useSetAttribute([
    { key: 'id', value: 'attributes-button' },
    { key: 'dusk', value: 'attributes-button' },
  ]);
  const bidsMobileButtonRef = useSetAttribute([
    { key: 'id', value: 'bids-mobile-button' },
    { key: 'dusk', value: 'bids-mobile-button' },
  ]);
  const bidsButtonRef = useSetAttribute([
    { key: 'id', value: 'bids-button' },
    { key: 'dusk', value: 'bids-button' },
  ]);
  const privateBidsMobileButtonRef = useSetAttribute([
    { key: 'id', value: 'private-bids-mobile-button' },
    { key: 'dusk', value: 'private-bids-mobile-button' },
  ]);
  const privateBidsButtonRef = useSetAttribute([
    { key: 'id', value: 'private-bids-button' },
    { key: 'dusk', value: 'private-bids-button' },
  ]);

  const bidsInfo = useMemo(() => {
    const data: any = [];
    const _bids = bidsData?.data?.data?.bids;
    if (_bids && _bids?.length) {
      _bids.map((_bid: any) =>
        data.push({
          user: dottedAddress(_bid.bidder),
          fulladdress: _bid.bidder,
          price: ethers.utils.formatEther(_bid.priceInWei),
          userImage: '/images/userBidAvatar.png',
          bidPlacedAt: formattedTime(_bid.blockTimestamp),
          expiresAt: _bid.expiresAt,
          paymentType: _bid.paymentType,
          isExpired:
            Math.ceil(Number((new Date() as any) / 1000)) >
            Number(_bids[0].blockTimestamp) + Number(_bids[0].expiresAt) / 1000,
        })
      );
    }
    return data;
  }, [bidsData]);

  const otcBidsInfo = useMemo(() => {
    const data: any = [];
    const _otcBids = otcBidsData?.data?.data?.otcbidTokens?.[0]?.bids;

    if (_otcBids && _otcBids?.length) {
      _otcBids.map((_bid: any) =>
        data.push({
          user: dottedAddress(_bid.bidder),
          fulladdress: _bid.bidder,
          price: ethers.utils.formatEther(_bid.priceInWei),
          userImage: '/images/userBidAvatar.png',
          bidPlacedAt: formattedTime(_bid.blockTimestamp),
          paymentType: _bid.paymentType,
        })
      );
    }
    return data;
  }, [otcBidsData]);

  const isOwner = useMemo(() => {
    return (
      user?.address?.toLowerCase() === (_nftOwner as string)?.toLowerCase()
    );
  }, [_nftOwner, user]);

  // const isOldOwner = useMemo(() => {
  //   return (
  //     (listing as any)?.isInvalidOwner &&
  //     user?.address?.toLowerCase() ===
  //       (listing as any)?.sellerAddress?.toLowerCase()
  //   );
  // }, [listing, user]);

  const placingBid = (val: boolean) => {
    setOpenSnack(val);
  };

  const openToast = () => {
    setOpenSnack(true);
    setTimeout(() => {
      setOpenSnackSuccess(true);
    }, 2000);
  };
  const closeSnackbar = () => {
    setOpenSnack(false);
  };

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
  };
  const closeSnackbarSuccess = () => {
    setOpenSnackSuccess(false);
  };

  const getSortedBids = () => {
    if (priceSort) {
      return bidsInfo.sort((a: any, b: any) => (a?.price > b?.price ? 1 : -1));
    }
    return bidsInfo.sort((a: any, b: any) => (a?.price > b?.price ? -1 : 1));
  };

  const getSortedOtcBids = () => {
    if (otcPriceSort) {
      return otcBidsInfo.sort((a: any, b: any) =>
        a?.price > b?.price ? 1 : -1
      );
    }
    return otcBidsInfo.sort((a: any, b: any) => (a?.price > b?.price ? -1 : 1));
  };

  const MaxStringLength = 120;

  if (!isMobile && !isTablet) {
    return (
      <Box sx={{ alignItems: 'center', margin: 'auto', height: '92vh' }}>
        <Box
          sx={{
            padding: '5px 20px',
          }}
        >
          <Button ref={backButtonRef} onClick={() => router.back()}>
            {' '}
            <ArrowBackIos
              sx={{ height: '1.2em', color: palette.secondary.storm[70] }}
            />
            <Typography
              sx={{ mt: '5px', color: palette.secondary.storm[70] }}
              variant="lbl-md"
            >
              {' '}
              Back
            </Typography>
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid
            item
            miniMobile={12}
            xs={12}
            md={4}
            padding={4}
            sx={{ position: 'relative' }}
          >
            <Box sx={box1}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  paddingBottom: '10px',
                }}
              >
                {loading ? (
                  <CircularProgress />
                ) : currentCollection?.profile_image ? (
                  <Link href={`/collections/${currentCollection.address}`}>
                    <img
                      style={{ cursor: 'pointer' }}
                      src={currentCollection?.profile_image}
                      width="88px"
                      height="88px"
                    />
                  </Link>
                ) : (
                  <img src={nftData?.nftImage} width="88px" height="88px" />
                )}
                {currentCollection?.name && (
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: 'Nexa',
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '21.22px',
                      letterSpacing: '0.04em',
                      textAlign: 'left',
                      paddingTop: '20px',
                      color: palette.primary.storm,
                    }}
                  >
                    {currentCollection?.name}
                  </Typography>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    wordWrap: 'break-word',
                  }}
                >
                  <Typography sx={titlee}>
                    {loading ? null : nftData?.nftName}
                  </Typography>
                </Box>

                <Typography
                  className="colDetail"
                  variant="p-md-bk"
                  sx={{
                    lineHeight: '24.26px',
                    textOverflow: 'ellipsis',
                    overflowY: seeall ? 'visible' : 'hidden',
                    color: palette.primary.storm,
                  }}
                  // height={seeall ? 'auto' : '77px'}
                >
                  {loading ? (
                    <CircularProgress />
                  ) : !seeall ? (
                    nftData?.nftDescription.substring(0, MaxStringLength)
                  ) : (
                    nftData?.nftDescription
                  )}

                  {nftData?.nftDescription.length > MaxStringLength && !seeall
                    ? '...'
                    : ''}
                </Typography>
              </Box>
              {nftData?.nftDescription.length > MaxStringLength && (
                <Box
                  onClick={() => setseeall(!seeall)}
                  sx={{ pt: 1, display: 'flex' }}
                >
                  <Typography
                    variant="p-sm"
                    sx={{
                      fontWeight: '700',
                      lineHeight: '18px',
                      letterSpacing: '0.04em',
                      textAlign: 'left',
                      color: '#00000066',
                    }}
                  >
                    SEE {!seeall ? 'MORE' : 'LESS'}
                    <img
                      style={{
                        marginLeft: 3,
                        marginBottom: 1,
                        transform: `rotate(${seeall ? '180deg' : '0deg'})`,
                      }}
                      src="/images/showall.png"
                      width="13px"
                      height="7px"
                    />
                  </Typography>
                </Box>
              )}
            </Box>
            {isOwner ? (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  ml: '25px',
                }}
              >
                <Box>
                  <Typography variant="p-md-bk" sx={ownertext}>
                    Current Owner
                  </Typography>
                  <Box sx={imgStyle}>
                    <img
                      src="/images/Rectangle.png"
                      width="15px"
                      height="15px"
                    />
                    <Typography variant="lbl-md" sx={ownerDetail}>
                      You are the owner
                    </Typography>
                  </Box>
                </Box>
                {listing && !isExpired && (
                  <Box>
                    <Typography
                      variant="lbl-md"
                      sx={{ mb: '5px', color: palette.secondary.storm[70] }}
                    >
                      PRICE
                    </Typography>
                    <Typography
                      variant="p-lg-bk"
                      sx={{ color: palette.primary.storm }}
                    >
                      {formatNumber(listingUSD)} USD
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  ml: '25px',
                }}
              >
                <Box>
                  <Box sx={imgStyle}>
                    <Typography variant="lbl-md" sx={ownerDetail}>
                      {!pulicUserDataLoading ? (
                        publicUser?.address ? (
                          <>
                            <Typography variant="p-md-bk" sx={ownertext}>
                              Current Owner
                            </Typography>
                            <Box sx={{ display: 'flex' }}>
                              <img
                                src="/images/Rectangle.png"
                                width="15px"
                                height="15px"
                              />
                              <Link
                                href={`/profile/${_nftOwner}`}
                                style={{ marginLeft: '10px' }}
                              >
                                {_nftOwner ? dottedAddress(_nftOwner) : '...'}
                              </Link>
                            </Box>
                          </>
                        ) : (
                          <>
                            <Typography variant="p-md-bk" sx={ownertext}>
                              Current Owner
                            </Typography>

                            <Box sx={{ display: 'flex' }}>
                              <img
                                src="/images/Rectangle.png"
                                width="15px"
                                height="15px"
                              />
                              <Typography
                                sx={{
                                  marginLeft: '10px',
                                  color: palette.primary.storm,
                                }}
                              >
                                {_nftOwner ? dottedAddress(_nftOwner) : '...'}
                              </Typography>
                            </Box>
                          </>
                        )
                      ) : (
                        ''
                      )}
                    </Typography>
                  </Box>
                </Box>
                {listing && !isExpired && (
                  <Box>
                    <Typography
                      variant="lbl-md"
                      sx={{ mb: '5px', color: palette.secondary.storm[70] }}
                    >
                      PRICE
                    </Typography>
                    <Typography
                      variant="p-lg-bk"
                      sx={{ color: palette.primary.storm }}
                    >
                      {formatNumber(listingUSD)} USD
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'transparent',
                ml: { xs: 1.5, md: 2 },
                mt: 4,
                mb: -2,
              }}
            >
              <StyledTabs
                sx={{ width: 'fit-content' }}
                value={tab}
                onChange={(e: any, n: number) => e && settab(n)}
              >
                <Tab label="ATTRIBUTES" ref={attributesButtonRef} />
                <Tab label="BIDS" ref={bidsButtonRef} />
                <Tab label="Private Bids" ref={privateBidsButtonRef} />
              </StyledTabs>
            </Box>
            {tab === 1 ? (
              <TableContainer
                sx={{
                  'height': '320px',
                  'width': '100%',
                  'overflowY': 'scroll',
                  'overflowX': 'hidden',
                  '&::-webkit-scrollbar': {
                    width: 0,
                  },
                  'borderColor': 'transparent',
                  // background: 'green',
                  // ml: 2
                  // pr: 2
                }}
              >
                <Table
                  sx={{
                    'ml': { xs: 1.5, md: 3 },
                    '& .MuiTableCell-root': {
                      paddingTop: '10px',
                      paddingBottom: '10px',
                    },
                    // background: 'red'
                  }}
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                          <Typography
                            variant="lbl-sm"
                            sx={{
                              letterSpacing: '0em',
                              textAlign: 'left',
                              color: '#00000080',
                            }}
                          >
                            User
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'baseline',
                          }}
                        >
                          <Typography
                            variant="lbl-sm"
                            sx={{
                              letterSpacing: '0em',
                              textAlign: 'right',
                              color: '#00000080',
                            }}
                          >
                            Price
                          </Typography>
                          <IconButton onClick={() => setPriceSort(!priceSort)}>
                            <img
                              style={{
                                transform: `rotate(${
                                  priceSort ? '0deg' : '180deg'
                                })`,
                              }}
                              src="/images/priceFilter.png"
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {bidsInfo?.length && !isExpired && !isInvalidOwner ? (
                    <TableBody>
                      {getSortedBids().map((bid: any, _index: number) => (
                        <TableRow key={_index}>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                              }}
                            >
                              <img src={bid.userImage} width="34" height="34" />
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-start',
                                  pl: '20px',
                                }}
                              >
                                <Typography
                                  variant="lbl-sm"
                                  sx={{
                                    letterSpacing: '0em',
                                    textAlign: 'left',
                                  }}
                                >
                                  {bid.user}
                                </Typography>
                                <Typography
                                  variant="lbl-md"
                                  sx={{
                                    fontWeight: 400,
                                    lineHeight: '21px',
                                    letterSpacing: '0em',
                                    textAlign: 'left',
                                    color: '#00000066',
                                  }}
                                >
                                  {bid.bidPlacedAt}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {bid.isExpired && (
                              <Typography
                                sx={{
                                  color: palette.primary.fire,
                                }}
                              >
                                Expired
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                pr: 2,
                              }}
                            >
                              <Box sx={{ display: 'flex' }}>
                                <img
                                  src={`/images/${
                                    isNode
                                      ? Number(bid.paymentType) === 0
                                        ? 'avax'
                                        : 'thor'
                                      : 'avax'
                                  }Icon.svg`}
                                  width="24"
                                  height="20"
                                />
                                <Typography
                                  variant="p-md-bk"
                                  sx={{
                                    lineHeight: '24px',
                                    letterSpacing: '0em',
                                    textAlign: 'right',
                                  }}
                                >
                                  {bid.price}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <Box
                      sx={{
                        border: '1px dashed rgba(0, 0, 0, 0.4)',
                        width: '100%',
                        height: '40px',
                        padding: '0!important',
                        ml: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant={'lbl-md'}
                        sx={{ color: '#808080', textAlign: 'center' }}
                      >
                        No bids have been made
                      </Typography>
                    </Box>
                  )}
                </Table>
              </TableContainer>
            ) : tab === 2 ? (
              <TableContainer
                sx={{
                  'height': '320px',
                  'width': '100%',
                  'overflowY': 'scroll',
                  'overflowX': 'hidden',
                  '&::-webkit-scrollbar': {
                    width: 0,
                  },
                  'borderColor': 'transparent',
                  // background: 'green',
                  // ml: 2
                  // pr: 2
                }}
              >
                <Table
                  sx={{
                    'ml': { xs: 1.5, md: 3 },
                    '& .MuiTableCell-root': {
                      paddingTop: '10px',
                      paddingBottom: '10px',
                    },
                    // background: 'red'
                  }}
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                          <Typography
                            variant="lbl-sm"
                            sx={{
                              letterSpacing: '0em',
                              textAlign: 'left',
                              color: '#00000080',
                            }}
                          >
                            User
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'baseline',
                          }}
                        >
                          <Typography
                            variant="lbl-sm"
                            sx={{
                              letterSpacing: '0em',
                              textAlign: 'right',
                              color: '#00000080',
                            }}
                          >
                            Price
                          </Typography>
                          <IconButton
                            onClick={() => setOtcPriceSort(!otcPriceSort)}
                          >
                            <img
                              style={{
                                transform: `rotate(${
                                  otcPriceSort ? '0deg' : '180deg'
                                })`,
                              }}
                              src="/images/priceFilter.png"
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {otcBidsInfo?.length ? (
                    <TableBody>
                      {getSortedOtcBids().map((bid: any, _index: number) => (
                        <TableRow key={_index}>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                              }}
                            >
                              <img src={bid.userImage} width="34" height="34" />
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-start',
                                  pl: '20px',
                                }}
                              >
                                <Typography
                                  variant="lbl-sm"
                                  sx={{
                                    letterSpacing: '0em',
                                    textAlign: 'left',
                                  }}
                                >
                                  {bid.user}
                                </Typography>
                                <Typography
                                  variant="lbl-md"
                                  sx={{
                                    fontWeight: 400,
                                    lineHeight: '21px',
                                    letterSpacing: '0em',
                                    textAlign: 'left',
                                    color: '#00000066',
                                  }}
                                >
                                  {bid.bidPlacedAt}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                pr: 2,
                              }}
                            >
                              <Box sx={{ display: 'flex' }}>
                                <img
                                  src="/images/avaxIcon.svg"
                                  width="24"
                                  height="20"
                                />
                                <Typography
                                  variant="p-md-bk"
                                  sx={{
                                    lineHeight: '24px',
                                    letterSpacing: '0em',
                                    textAlign: 'right',
                                  }}
                                >
                                  {bid.price}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <Box
                      sx={{
                        border: '1px dashed rgba(0, 0, 0, 0.4)',
                        width: '100%',
                        height: '40px',
                        padding: '0!important',
                        ml: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant={'lbl-md'}
                        sx={{ color: '#808080', textAlign: 'center' }}
                      >
                        No private bids have been made
                      </Typography>
                    </Box>
                  )}
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  maxHeight: '40%',
                  overflowY: 'scroll',
                  minHeight: '320px',
                }}
                className={styles.hideScroll}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    pl: 4,
                    pt: 2,
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                    // maxHeight: '40%',
                    // overflowY: 'scroll',
                  }}
                >
                  {nftData?.nftAttributes &&
                    nftData?.nftAttributes.map(
                      (attribute: Attribute, _index: number) => (
                        <Box
                          key={_index}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            border: '1px solid',
                            borderColor: 'black',
                            justifyContent: 'space-between',
                            padding: 1,
                            margin: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              color: palette.secondary.storm[70],
                              textTransform: 'uppercase',
                              lineHeight: '15px',
                            }}
                            variant="lbl-md"
                          >
                            {isNodeNFT(collectionAddress, chain) &&
                            'rewards' === attribute?.trait_type?.toLowerCase()
                              ? 'Rewards (THOR)'
                              : 'due date' ===
                                attribute?.trait_type?.toLowerCase()
                              ? 'Due date (Days)'
                              : attribute.trait_type}
                          </Typography>
                          <Typography
                            sx={{ color: palette.primary.storm }}
                            variant="p-lg-bk"
                          >
                            {isNodeNFT(collectionAddress, chain) &&
                            'rewards' === attribute?.trait_type?.toLowerCase()
                              ? formatDecimals(
                                  attribute.value.toString(),
                                  18,
                                  false,
                                  6
                                )
                              : 'due date' ===
                                attribute?.trait_type?.toLowerCase()
                              ? moment
                                  .duration(
                                    moment(
                                      parseInt(attribute.value.toString()) *
                                        1000
                                    ).diff(moment())
                                  )
                                  .days() >= 0
                                ? moment
                                    .duration(
                                      moment(
                                        parseInt(attribute.value.toString()) *
                                          1000
                                      ).diff(moment())
                                    )
                                    .days()
                                : 'Inactive'
                              : attribute.value}
                          </Typography>
                        </Box>
                      )
                    )}
                </Box>
              </Box>
            )}
            {/* {(!bidsInfo?.length && tab === 1) ||
              (!otcBidsInfo?.length && tab === 2) ? (
                <Box
                  sx={{
                    border: '1px dashed rgba(0, 0, 0, 0.4)',
                    width: '100%',
                    height: '5%',
                    padding: '0!important',
                    ml: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant={'lbl-md'}
                    sx={{ color: '#808080', textAlign: 'center' }}
                  >
                    No bids have been made
                  </Typography>
                </Box>
              ):''} */}
            {isOwner ? (
              <>
                <OwnerButtons
                  user={user}
                  setOpenType={setOpenType}
                  showModal={showModal}
                  setIsOpen={setIsOpen}
                  listing={listing}
                  isExpired={isExpired}
                  isInvalidOwner={isInvalidOwner}
                  collectionAddress={collectionAddress}
                  tokenId={Number(nftId)}
                  showListModal={showListModal}
                  setShowListModal={handleModalClick}
                  activeTab={tab}
                  refetchListing={refetchListing}
                  nftData={nftData}
                />
                <ListNft
                  open={showListModal}
                  listNFT={nftData}
                  handleClose={handleModalClick}
                  openToast={ListModalResponse}
                />
              </>
            ) : (
              <BuyerButtons
                user={user}
                setOpenType={setOpenType}
                showModal={showModal}
                setIsOpen={setIsOpen}
                listing={listing}
                isExpired={isExpired}
                isInvalidOwner={isInvalidOwner}
                collectionAddress={collectionAddress}
                tokenId={Number(nftId)}
                setActiveBidType={setActiveBidType}
                isPrivate={tab === 2}
                isNormal={tab === 1}
                nftData={nftData}
              />
            )}
          </Grid>
          <Grid item xs={12} md={1}>
            <Divider sx={divider} />
          </Grid>
          <Grid
            item
            miniMobile={12}
            md={6}
            mt={10}
            sx={{
              '&.MuiGrid-item': { padding: '0px' },
              'display': 'flex',
              'justifyContent': 'center',
            }}
          >
            <Box
              sx={{
                height: {
                  lg: '580px',
                  sm: '500px',
                  miniMobile: '300px',
                },
              }}
            >
              <Paper
                elevation={0}
                style={{
                  aspectRatio: '1',
                  height: '100%',
                  backgroundImage: `url(${nftData?.nftImage})`, // THis is the what you want, I guess
                  position: 'relative',
                  transitionDuration: '0.1s',
                  zIndex: 2,
                  maxWidth: 'auto',
                  // paddingTop: '20px',
                  // paddingBottom: '20px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <Box position="absolute" top="18.7px" right="18.7px">
                  <LikeButton
                    isChecked={isLiked}
                    id={nftId}
                    nftId={nftId}
                    collectionAddr={collectionAddress}
                    likeNFTHandler2={likeNFT}
                  />
                </Box>
              </Paper>
            </Box>
          </Grid>

          {/* </Grid> */}

          <BuyNft open={open} handleClose={handleClose} openToast={openToast} />
          <PlaceBid
            collectionAddress={collectionAddress}
            tokenId={Number(nftId)}
            open={isOpen}
            handleClose={handleClose}
            openToast={openToast}
            placingBid={placingBid}
            nft={{ image: nftData?.nftImage, title: nftData?.nftName }}
            activeBidType={activeBidType}
          />
          <BuyNFTModal
            collectionAddress={collectionAddress}
            tokenId={Number(nftId)}
            open={isOpen && openType === 'purchase'}
            handleClose={handleClose}
            openToast={openToast}
            refresh={refetchListing}
            nft={{ image: nftData?.nftImage, title: nftData?.nftName }}
          />
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={openSnack}
            autoHideDuration={1800}
            onClose={closeSnackbar}
          >
            <Box
              sx={{
                'display': 'flex',
                'alignItems': 'center',
                '& .MuiAlert-root': {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            >
              {/* <img src="/images/nftImage.png" width="50px" /> */}

              <Alert
                icon={
                  <Image width={40} height={40} src="/images/nftImage.png" />
                }
                severity="success"
                sx={{
                  'width': '100%',
                  'padding': '0px 32px 0px 0px',
                  'background': 'black',
                  '& .MuiAlert-icon': { padding: '0px !important', mr: 4 },
                  '& .MuiButtonBase-root-MuiIconButton-root': {
                    display: 'none',
                  },
                }}
              >
                <Typography variant="p-md-bk">
                  {openType === 'bid'
                    ? 'PLACING A BID...'
                    : 'PROCESSING PURCHASE...'}
                </Typography>
              </Alert>
            </Box>
          </Snackbar>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={openSnackSuccess}
            autoHideDuration={9000}
            onClose={closeSnackbarSuccess}
          >
            <Box
              sx={{
                'display': 'flex',
                'alignItems': 'center',
                '& .MuiAlert-root': {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            >
              <Alert
                icon={
                  <Image width={40} height={40} src="/images/nftImage.png" />
                }
                severity="success"
                sx={{
                  'width': '100%',
                  'padding': '0px 16px 0px 0px',
                  'background': '#30B82D',
                  'marginLeft': '4px',

                  '& .MuiAlert-icon': { padding: '0px !important', mr: 4 },
                  '& .css-1e0d89p-MuiButtonBase-root-MuiIconButton-root': {
                    display: 'none',
                  },
                }}
              >
                <Box
                  style={{
                    display: 'flex',
                    justifyItems: 'center',
                    paddingRight: '10px',
                  }}
                >
                  <Typography variant="p-md" sx={{ marginTop: '4px' }}>
                    {openType === 'bid' ? 'VIEW RECENT BID' : 'VIEW MY NEW NFT'}
                  </Typography>
                  <ArrowForwardIos
                    fontSize="small"
                    style={{ color: 'white', marginLeft: '8px' }}
                  />
                </Box>
              </Alert>
            </Box>
          </Snackbar>
        </Grid>
      </Box>
    );
  } else {
    ///// if mobile or tablet
    return (
      <Box
        sx={{
          alignItems: 'center',
          margin: 'auto',
          marginLeft: 'auto',
          width: '100%',
        }}
      >
        <Box
          sx={{
            padding: '5px 20px',
          }}
        >
          <Button ref={backMobileButtonRef} onClick={() => router.back()}>
            {' '}
            <ArrowBackIos
              sx={{ height: '1.2em', color: palette.secondary.storm[70] }}
            />
            <Typography
              sx={{ mt: '5px', color: palette.secondary.storm[70] }}
              variant="lbl-md"
            >
              {' '}
              Back
            </Typography>
          </Button>
        </Box>
        <Grid container spacing={0}>
          {/* <Grid md={isTablet ? 10 : 12} xs={12} mt={2}>
            <img width="100%" height="auto" src={nftData?.nftImage} />
          </Grid> */}
          <Grid
            item
            miniMobile={12}
            xs={12}
            md={12}
            padding={2}
            sx={{ margin: 'auto' }}
          >
            <Box sx={box1}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  paddingBottom: '10px',
                }}
              >
                {loading ? (
                  <CircularProgress />
                ) : currentCollection?.profile_image ? (
                  <Link href={`/collections/${currentCollection.address}`}>
                    <img
                      style={{ cursor: 'pointer' }}
                      src={currentCollection?.profile_image}
                      width="88px"
                      height="88px"
                    />
                  </Link>
                ) : (
                  <img src={nftData?.nftImage} width="88px" height="88px" />
                )}
                {currentCollection?.name && (
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: 'Nexa',
                      fontSize: '14px',
                      fontWeight: 400,
                      lineHeight: '21.22px',
                      letterSpacing: '0.04em',
                      textAlign: 'left',
                      paddingTop: '20px',
                      color: palette.primary.storm,
                    }}
                  >
                    {currentCollection?.name}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography sx={titlee}>
                  {loading ? null : nftData?.nftName}
                </Typography>
                <Typography
                  className="colDetail"
                  variant="p-lg-bk"
                  sx={{
                    lineHeight: '27.29px',
                    // textAlign: 'left',
                    textOverflow: 'ellipsis',
                    // overflowX: 'auto',
                    overflowY: seeall ? 'visible' : 'hidden',
                    height: '100%',
                    color: palette.primary.storm,
                  }}
                  height={
                    seeall
                      ? 'auto'
                      : nftData?.nftDescription || nftData?.nftName
                      ? '7px'
                      : '0px'
                  }
                >
                  {loading ? <CircularProgress /> : nftData?.nftDescription}
                </Typography>
              </Box>
            </Box>
            {isOwner ? (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="p-md-bk" sx={ownertext}>
                    Current Owner
                  </Typography>
                  <Box sx={imgStyle}>
                    <img
                      src="/images/Rectangle.png"
                      width="15px"
                      height="15px"
                    />
                    <Typography variant="p-lg" sx={ownerDetail}>
                      You are the owner
                    </Typography>
                  </Box>
                </Box>
                {listing && !isExpired && (
                  <Box>
                    <Typography
                      variant="lbl-md"
                      sx={{ mb: '5px', color: palette.secondary.storm[70] }}
                    >
                      PRICE
                    </Typography>
                    <Typography
                      variant="p-lg-bk"
                      sx={{ color: palette.primary.storm }}
                    >
                      {formatNumber(listingUSD)} USD
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={box2}>
                  <Typography variant="p-md-bk" sx={ownertext}>
                    Current Owner
                  </Typography>
                  <Box sx={imgStyle}>
                    <img
                      src="/images/Rectangle.png"
                      width="15px"
                      height="15px"
                    />
                    <Link
                      href={`/profile/${_nftOwner}`}
                      style={{ marginLeft: '10px' }}
                    >
                      {_nftOwner ? dottedAddress(_nftOwner) : '...'}
                    </Link>
                  </Box>
                </Box>
                {listing && !isExpired && (
                  <Box>
                    <Typography
                      variant="lbl-md"
                      sx={{ mb: '5px', color: palette.secondary.storm[70] }}
                    >
                      PRICE
                    </Typography>
                    <Typography
                      variant="p-lg-bk"
                      sx={{ color: palette.primary.storm }}
                    >
                      {formatNumber(listingUSD)} USD
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            <Box
              sx={{
                borderBottom: 1,
                borderColor: 'transparent',
                ml: { xs: 1.5, md: 2 },
                mt: 4,
                mb: -2,
              }}
            >
              <StyledTabs
                sx={{ width: 'fit-content' }}
                value={tab}
                onChange={(e: any, n: number) => e && settab(n)}
              >
                {' '}
                <Tab label="ATTRIBUTES" ref={attributesMobileButtonRef} />
                <Tab label="BIDS" ref={bidsMobileButtonRef} />
                <Tab label="Private Bids" ref={privateBidsMobileButtonRef} />
              </StyledTabs>
            </Box>

            {tab === 1 ? (
              <TableContainer
                sx={{
                  'height': '320px',
                  'width': '100%',
                  'overflowY': 'scroll',
                  'overflowX': 'hidden',
                  '&::-webkit-scrollbar': {
                    width: 0,
                  },
                  'borderColor': 'transparent',
                  'pb': 3,
                }}
              >
                <Table
                  sx={{
                    'ml': { xs: 1.5, md: 3 },
                    '& .MuiTableCell-root': {
                      paddingTop: '10px',
                      paddingBottom: '10px',
                    },
                    // background: 'red'
                  }}
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                          <Typography
                            variant="lbl-sm"
                            sx={{
                              letterSpacing: '0em',
                              textAlign: 'left',
                              color: '#00000080',
                            }}
                          >
                            User
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'baseline',
                          }}
                        >
                          <Typography
                            variant="lbl-sm"
                            sx={{
                              letterSpacing: '0em',
                              textAlign: 'right',
                              color: '#00000080',
                            }}
                          >
                            Price
                          </Typography>
                          <IconButton onClick={() => setPriceSort(!priceSort)}>
                            <img
                              style={{
                                transform: `rotate(${
                                  priceSort ? '0deg' : '180deg'
                                })`,
                              }}
                              src="/images/priceFilter.png"
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {bidsInfo?.length && !isExpired && !isInvalidOwner ? (
                    <TableBody>
                      {getSortedBids().map((bid: any, _index: number) => (
                        <TableRow key={_index}>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                              }}
                            >
                              <img src={bid.userImage} width="34" height="34" />
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-start',
                                  pl: '20px',
                                }}
                              >
                                <Typography
                                  variant="lbl-sm"
                                  sx={{
                                    letterSpacing: '0em',
                                    textAlign: 'left',
                                  }}
                                >
                                  {bid.user}
                                </Typography>
                                <Typography
                                  variant="lbl-md"
                                  sx={{
                                    fontWeight: 400,
                                    lineHeight: '21px',
                                    letterSpacing: '0em',
                                    textAlign: 'left',
                                    color: '#00000066',
                                  }}
                                >
                                  {bid.bidPlacedAt}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {bid.isExpired && (
                              <Typography
                                sx={{
                                  color: palette.primary.fire,
                                }}
                              >
                                Expired
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                pr: 2,
                              }}
                            >
                              <Box sx={{ display: 'flex' }}>
                                <img
                                  src={`/images/${
                                    isNode
                                      ? Number(bid.paymentType) === 0
                                        ? 'avax'
                                        : 'thor'
                                      : 'avax'
                                  }Icon.svg`}
                                  width="24"
                                  height="20"
                                />
                                <Typography
                                  variant="p-md-bk"
                                  sx={{
                                    lineHeight: '24px',
                                    letterSpacing: '0em',
                                    textAlign: 'right',
                                  }}
                                >
                                  {bid.price}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <Box
                      sx={{
                        border: '1px dashed rgba(0, 0, 0, 0.4)',
                        width: '100%',
                        height: '40px',
                        padding: '0!important',
                        ml: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant={'lbl-md'}
                        sx={{ color: '#808080', textAlign: 'center' }}
                      >
                        No bids have been made
                      </Typography>
                    </Box>
                  )}
                </Table>
              </TableContainer>
            ) : tab === 2 ? (
              <TableContainer
                sx={{
                  'height': '320px',
                  'width': '100%',
                  'overflowY': 'scroll',
                  'overflowX': 'hidden',
                  '&::-webkit-scrollbar': {
                    width: 0,
                  },
                  'borderColor': 'transparent',
                  'pb': 3,
                }}
              >
                <Table
                  sx={{
                    'ml': { xs: 1.5, md: 3 },
                    '& .MuiTableCell-root': {
                      paddingTop: '10px',
                      paddingBottom: '10px',
                    },
                    // background: 'red'
                  }}
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                          <Typography
                            variant="lbl-sm"
                            sx={{
                              letterSpacing: '0em',
                              textAlign: 'left',
                              color: '#00000080',
                            }}
                          >
                            User
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'baseline',
                          }}
                        >
                          <Typography
                            variant="lbl-sm"
                            sx={{
                              letterSpacing: '0em',
                              textAlign: 'right',
                              color: '#00000080',
                            }}
                          >
                            Price
                          </Typography>
                          <IconButton
                            onClick={() => setOtcPriceSort(!otcPriceSort)}
                          >
                            <img
                              style={{
                                transform: `rotate(${
                                  otcPriceSort ? '0deg' : '180deg'
                                })`,
                              }}
                              src="/images/priceFilter.png"
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {otcBidsInfo?.length ? (
                    <TableBody>
                      {getSortedOtcBids().map((bid: any, _index: number) => (
                        <TableRow key={_index}>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                              }}
                            >
                              <img src={bid.userImage} width="34" height="34" />
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'flex-start',
                                  pl: '20px',
                                }}
                              >
                                <Typography
                                  variant="lbl-sm"
                                  sx={{
                                    letterSpacing: '0em',
                                    textAlign: 'left',
                                  }}
                                >
                                  {bid.user}
                                </Typography>
                                <Typography
                                  variant="lbl-md"
                                  sx={{
                                    fontWeight: 400,
                                    lineHeight: '21px',
                                    letterSpacing: '0em',
                                    textAlign: 'left',
                                    color: '#00000066',
                                  }}
                                >
                                  {bid.bidPlacedAt}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                pr: 2,
                              }}
                            >
                              <Box sx={{ display: 'flex' }}>
                                <img
                                  src="/images/avaxIcon.svg"
                                  width="24"
                                  height="20"
                                />
                                <Typography
                                  variant="p-md-bk"
                                  sx={{
                                    lineHeight: '24px',
                                    letterSpacing: '0em',
                                    textAlign: 'right',
                                  }}
                                >
                                  {bid.price}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  ) : (
                    <Box
                      sx={{
                        border: '1px dashed rgba(0, 0, 0, 0.4)',
                        width: '100%',
                        height: '40px',
                        padding: '0!important',
                        ml: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant={'lbl-md'}
                        sx={{ color: '#808080', textAlign: 'center' }}
                      >
                        No private bids have been made
                      </Typography>
                    </Box>
                  )}
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  maxHeight: '40%',
                  overflowY: 'scroll',
                  minHeight: '320px',
                  pb: 3,
                }}
                className={styles.hideScroll}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    // pl: 4,
                    pt: 2,
                    justifyContent: 'flex-start',
                    flexWrap: 'wrap',
                  }}
                >
                  {nftData?.nftAttributes &&
                    nftData?.nftAttributes.map(
                      (attribute: Attribute, _index: number) => (
                        <Box
                          key={_index}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            border: '1px solid',
                            borderColor: 'black',
                            justifyContent: 'space-between',
                            padding: 1,
                            margin: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              color: palette.secondary.storm[70],
                              textTransform: 'uppercase',
                              lineHeight: '15px',
                            }}
                            variant="lbl-md"
                          >
                            {isNodeNFT(collectionAddress, chain) &&
                            'rewards' === attribute?.trait_type?.toLowerCase()
                              ? 'Rewards (THOR)'
                              : 'due date' ===
                                attribute?.trait_type?.toLowerCase()
                              ? 'Due date (Days)'
                              : attribute.trait_type}
                          </Typography>
                          <Typography
                            sx={{ color: palette.primary.storm }}
                            variant="p-lg-bk"
                          >
                            {isNodeNFT(collectionAddress, chain) &&
                            'rewards' === attribute?.trait_type?.toLowerCase()
                              ? formatDecimals(
                                  attribute.value.toString(),
                                  18,
                                  false,
                                  6
                                )
                              : 'due date' ===
                                attribute?.trait_type?.toLowerCase()
                              ? moment
                                  .duration(
                                    moment(
                                      parseInt(attribute.value.toString()) *
                                        1000
                                    ).diff(moment())
                                  )
                                  .days() >= 0
                                ? moment
                                    .duration(
                                      moment(
                                        parseInt(attribute.value.toString()) *
                                          1000
                                      ).diff(moment())
                                    )
                                    .days()
                                : 'Inactive'
                              : attribute.value}
                          </Typography>
                        </Box>
                      )
                    )}
                </Box>
              </Box>
            )}

            {/* {(!bidsInfo?.length && tab === 1) ||
              (!otcBidsInfo?.length && tab === 2 && (
                <Box
                  sx={{
                    border: '1px dashed rgba(0, 0, 0, 0.4)',
                    width: '100%',
                    height: '5%',
                    padding: '0!important',
                    ml: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant={'lbl-md'}
                    sx={{ color: '#808080', textAlign: 'center' }}
                  >
                    No bids have been made
                  </Typography>
                </Box>
              ))} */}

            {isOwner ? (
              <>
                <OwnerButtons
                  user={user}
                  setOpenType={setOpenType}
                  showModal={showModal}
                  setIsOpen={setIsOpen}
                  listing={listing}
                  isExpired={isExpired}
                  isInvalidOwner={isInvalidOwner}
                  collectionAddress={collectionAddress}
                  tokenId={Number(nftId)}
                  showListModal={showListModal}
                  setShowListModal={handleModalClick}
                  activeTab={tab}
                  refetchListing={refetchListing}
                  nftData={nftData}
                />
                <ListNft
                  open={showListModal}
                  listNFT={nftData}
                  handleClose={handleModalClick}
                  openToast={ListModalResponse}
                />
              </>
            ) : (
              <BuyerButtons
                user={user}
                setOpenType={setOpenType}
                showModal={showModal}
                setIsOpen={setIsOpen}
                listing={listing}
                isExpired={isExpired}
                isInvalidOwner={isInvalidOwner}
                collectionAddress={collectionAddress}
                tokenId={Number(nftId)}
                setActiveBidType={setActiveBidType}
                isPrivate={tab === 2}
                isNormal={tab === 1}
                nftData={nftData}
              />
            )}
          </Grid>
          <Grid item xs={12} md={12}>
            <Divider sx={divider} />
          </Grid>
          <BuyNft open={open} handleClose={handleClose} openToast={openToast} />
          <PlaceBid
            collectionAddress={collectionAddress}
            tokenId={Number(nftId)}
            open={isOpen}
            handleClose={handleClose}
            openToast={openToast}
            placingBid={placingBid}
            nft={{ image: nftData?.nftImage, title: nftData?.nftName }}
            activeBidType={activeBidType}
          />
          <BuyNFTModal
            collectionAddress={collectionAddress}
            tokenId={Number(nftId)}
            open={isOpen && openType === 'purchase'}
            handleClose={handleClose}
            openToast={openToast}
            refresh={refetchListing}
            nft={{ image: nftData?.nftImage, title: nftData?.nftName }}
          />
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={openSnack}
            autoHideDuration={1800}
            onClose={closeSnackbar}
          >
            <Box
              sx={{
                'display': 'flex',
                'alignItems': 'center',
                '& .MuiAlert-root': {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            >
              {/* <img src="/images/nftImage.png" width="50px" /> */}

              <Alert
                icon={
                  <Image width={40} height={40} src="/images/nftImage.png" />
                }
                severity="success"
                sx={{
                  'width': '100%',
                  'padding': '0px 32px 0px 0px',
                  'background': 'black',
                  '& .MuiAlert-icon': { padding: '0px !important', mr: 4 },
                  '& .MuiButtonBase-root-MuiIconButton-root': {
                    display: 'none',
                  },
                }}
              >
                <Typography variant="p-md-bk">
                  {openType === 'bid'
                    ? 'PLACING A BID...'
                    : 'PROCESSING PURCHASE...'}
                </Typography>
              </Alert>
            </Box>
          </Snackbar>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={openSnackSuccess}
            autoHideDuration={9000}
            onClose={closeSnackbarSuccess}
          >
            <Box
              sx={{
                'display': 'flex',
                'alignItems': 'center',
                '& .MuiAlert-root': {
                  display: 'flex',
                  alignItems: 'center',
                },
              }}
            >
              <Alert
                icon={
                  <Image width={40} height={40} src="/images/nftImage.png" />
                }
                severity="success"
                sx={{
                  'width': '100%',
                  'padding': '0px 16px 0px 0px',
                  'background': '#30B82D',
                  'marginLeft': '4px',

                  '& .MuiAlert-icon': { padding: '0px !important', mr: 4 },
                  '& .css-1e0d89p-MuiButtonBase-root-MuiIconButton-root': {
                    display: 'none',
                  },
                }}
              >
                <Box
                  style={{
                    display: 'flex',
                    justifyItems: 'center',
                    paddingRight: '10px',
                  }}
                >
                  <Typography variant="p-md" sx={{ marginTop: '4px' }}>
                    {openType === 'bid' ? 'VIEW RECENT BID' : 'VIEW MY NEW NFT'}
                  </Typography>
                  <ArrowForwardIos
                    fontSize="small"
                    style={{ color: 'white', marginLeft: '8px' }}
                  />
                </Box>
              </Alert>
            </Box>
          </Snackbar>
        </Grid>
      </Box>
    );
  }
};

export default NFTdetailV2;
