import React, { useMemo, useState, useEffect, useCallback } from 'react';
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
  Avatar,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import PlaceBid from '../../../src/components/modals/PlaceBid';
import Image from 'next/image';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../../src/redux/store';
import { showToast, ToastSeverity } from '../../../src/redux/slices/toastSlice';
import { dottedAddress, formatDecimals } from '@/shared/utils/utils';
import { MODAL_TYPES, useGlobalModalContext } from '@/components/modals';
import UpdateListNft from '../../../src/components/modals/UpdateListNft';
import {
  useGetNFTOwner,
  useGetOtcTokenBids,
  useGetBidsByOrderId,
  useGetUserByAddress,
  useUnListNFT,
  useGetNFTsFavrt,
  useGetNFTDetail,
} from '@/hooks/useNFTDetail';
import {
  useGetAcceptPaymentsByNFT,
  useGetActivePerks,
  useGetNFTsListed,
  useGetTokenURI,
} from '@/hooks/useNodes';

import { useBalance } from '@/hooks/useToken';
import { useRouter } from 'next/router';
import {
  formatNumber,
  formattedTime,
  isNode as isNodeNFT,
  getJsonFromURI,
  getMetaDataName,
  getMetaDataDescription,
  getMetaData,
  getMetaDataAttributes,
  useIsPerk,
} from '../../../src/utils/common';
import { collectionsService } from '@/services/collection.service';
import { Collection } from '@/models/Collection';
import { Attribute } from '@/models/Metadata';
import { Listing } from '@/models/Listing';

import styles from './style.module.css';
import { useChain } from '@/utils/web3Utils';
import { isMobile, isTablet } from 'react-device-detect';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  useMarketplaceAddress,
  useGetBidByNft,
  useExecuteOrder,
  useGetOtcBid,
  useCancelOtcBid,
  useCancelBid,
  useGetTransaction,
} from '@/hooks/Marketplace';
import { useGetPerk } from '@/hooks/usePerks';
import { bidType, getOGNodeContractByChain } from '@/utils/constants';
import BuyNFTModal from '../../../src/components/modals/BuyNFTModal';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import moment from 'moment';
import { useGetListingByNft } from '@/hooks/useListings';
import AcceptBid from '../../../src/components/modals/AcceptBid';
import Link from 'next/link';
import { NftDataType } from '@/utils/types';
import axios from 'axios';
import { useSetAttribute } from '@/hooks/uiHooks';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MultiCurrency from '@/components/icons/MultiCurrency';
import BatchListNFTModal from '@/components/modals/BatchListNFTModal';
import { formatPriceByDefaultCurrency } from '@/utils/helper';
import SortLabel from '@/components/common/SortMenu/SortLabel';

const titleStyle = {
  typography: { md: 'h3-bk', miniMobile: 'h4' },
  lineHeight: { md: '54.58px', miniMobile: '48.51px' },
  display: 'block',
  textAlign: 'left',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '90%',
  whiteSpace: 'nowrap',
};
const imgStyle = {
  display: 'flex',
  alignItems: 'baseline',
  // ml: { md: 3 },
};

const box1 = { mt: { xs: 0, md: 4 }, ml: { xs: 0, md: 7 }, margin: 'auto' };
const ownerText = {
  fontFamily: isMobile ? 'Nexa-Bold' : 'Nexa',
  fontSize: '14px',
  lineHeight: '21px',
  letterSpacing: '0.04em',
  textAlign: 'left',
};
const ownerDetail = { fontWeight: 500, ml: 1, color: 'primary.main' };

const buttonBox = {
  position: 'fixed',
  bottom: 0,

  paddingBottom: '60px',
  width: '35%',
  gap: '25px',

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  zIndex: '1000',
  ml: isMobile ? 0 : 5,
};
const buttonBoxMobile = {
  ...buttonBox,

  paddingBottom: '10px',
  gap: '10px',

  flexDirection: 'column',
  left: '10px',
  right: '10px',
  marginLeft: '0px',
  width: 'auto',
  backgroundColor: 'background.default',
};

const divider = {
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
    width: isMobile ? 100 : 40,
    height: isMobile ? 8 : 'auto',
    bgcolor: 'primary.main',
  },
  '& .MuiButtonBase-root.MuiTab-root': {
    marginBottom: 0,
    fontFamily: 'Nexa',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: '15px',
    letterSpacing: '0em',
    textAlign: 'left',
    fontStyle: 'normal',
    textTransform: 'capitalize',
    minHeight: '26px',
    padding: '0px',
    margin: '0px 20px 45px 0px',
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
  cta?: any;
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
      return formatPriceByDefaultCurrency(
        (listing as any)?.priceInWei,
        (listing as any)?.paymentType,
        user?.default_currency,
        avaxPrice,
        thorPrice
      );
    } else {
      return 0;
    }
  }, [thorPrice, avaxPrice, listing, user?.default_currency]);

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
      {!isInvalidOwner &&
        (listing && !isExpired && !listing?.sold ? (
          simpleBidLoading ? (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={isMobile || isTablet ? buttonBoxMobile : buttonBox}>
              {!isPrivate && user?.address && (
                <React.Fragment>
                  {insufficientBalance ? (
                    <Tooltip title="You do not have enough balance on your wallet">
                      <Button
                        ref={expireBuyButtonRef}
                        variant="contained"
                        fullWidth
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
                            Buy for {formatNumber(formatedPrice)}{' '}
                            {user?.default_currency
                              ? user?.default_currency.replace('USDC', 'USD')
                              : 'USD'}
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
                      variant="contained"
                      fullWidth
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
                          Buy for {formatNumber(formatedPrice)}{' '}
                          {user?.default_currency
                            ? user?.default_currency.replace('USDC', 'USD')
                            : 'USD'}
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
                  )}
                  {user?.address && (
                    <Button
                      ref={placeBidButtonRef}
                      variant="contained"
                      fullWidth
                      color={'secondary'}
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
                      <Typography variant="lbl-md">Place a Bid</Typography>
                    </Button>
                  )}
                </React.Fragment>
              )}
              {(simpleBidData as any)?.bidder?.toLowerCase() ===
                user?.address?.toLowerCase() &&
                !isPrivate && (
                  <Button
                    ref={removeBidButtonRef}
                    disabled={cancelSimpleBidLoading}
                    variant="text"
                    fullWidth
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
                  This NFT has not been listed yet, seller might not see the
                  bid.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                  }}
                >
                  {!isNormal && user?.address && (
                    <Button
                      ref={placeBidMobileButtonRef}
                      variant="contained"
                      fullWidth
                      color={'secondary'}
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
                      <Typography variant="lbl-md">Place a Bid</Typography>
                    </Button>
                  )}
                  {otcBidData?.bidder?.toLowerCase() === user?.address &&
                    !isNormal && (
                      <Button
                        ref={removePrivateBidMobileButtonRef}
                        disabled={cancelOtcBidLoading}
                        variant="text"
                        fullWidth
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
                        variant="text"
                        fullWidth
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
        ))}
    </>
  );
};

let firstLoading = true;

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
    cta,
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [listNFT, setListNFT] = useState(null);

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
      recklesslySetUnpreparedArgs: [[collectionAddress], [tokenId]],
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
      if (Number((lastOtcBid as any)?.paymentType) === 2) {
        return Number(ethers.utils.formatUnits((lastOtcBid as any)?.price, 6));
      }

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
    bidPrice: formatDecimals(
      (lastBid as any)?.price,
      Number((lastBid as any)?.paymentType) === 2 ? 6 : 18,
      true
    ),
    bidExpiresAt: formattedTime((lastBid as any)?.expiresAt),
    paymentType: (lastBid as any)?.paymentType,
  });

  const handleAcceptBid = useCallback(
    (_bidType: string) => {
      setAcceptBidType(_bidType);
      if (_bidType === bidType.DEFAULT) {
        // simple
        setAcceptBidData((prevState) => ({
          ...prevState,
          bidPrice: formatDecimals(
            (lastBid as any)?.price,
            Number((lastBid as any)?.paymentType) === 2 ? 6 : 18,
            true
          ),
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
    },
    [lastBid, lastOtcBid, lastOtcBidUSD]
  );

  const handleNormalBidAccept = useCallback(() => {
    if (!user?.address) {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
    } else {
      setOpenType('purchase');
      handleAcceptBid(bidType.DEFAULT);
    }
  }, [handleAcceptBid, setOpenType, showModal, user?.address]);
  const handlePrivateBidAccept = useCallback(() => {
    if (!user?.address) {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
    } else {
      setOpenType('purchase');
      handleAcceptBid(bidType?.OTC);
    }
  }, [handleAcceptBid, setOpenType, showModal, user?.address]);

  const acceptBidResponse = (response: any) => {
    if (response?.isSuccess) {
      lastBidRefetch();
      lastOtcBidRefetch();
      refetchListing();
    }
  };

  const handleEdit = useCallback(() => {
    setShowEditModal(!showEditModal);

    setListNFT({
      nftName: nftData?.nftName,
      by: nftData?.by,
      nftImage: nftData?.nftImage,
      nftAddress: nftData?.nftAddress,
      tokenId: nftData?.tokenId,
      status: 'edit',
    });
  }, [showEditModal, nftData]);

  const handleModalClick = () => {
    setShowEditModal(!showEditModal);
  };

  const handleList = useCallback(() => {
    if (!user?.address) {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
    } else {
      setShowListModal(!showListModal);
    }
  }, [showModal, user?.address, showListModal, setShowListModal]);

  const callbackHandleEdit = useCallback(() => {
    handleEdit();
  }, [handleEdit]);
  const callbackHandleList = useCallback(() => {
    handleList();
  }, [handleList]);
  const callbackHandleNormalBidAccept = useCallback(() => {
    handleNormalBidAccept();
  }, [handleNormalBidAccept]);
  const callbackHandlePrivateBidAccept = useCallback(() => {
    handlePrivateBidAccept();
  }, [handlePrivateBidAccept]);

  if (firstLoading) {
    setTimeout(() => {
      if (cta === 'edit') callbackHandleEdit();
      else if (cta === 'list') callbackHandleList();
      else if (cta === 'accept_bid') callbackHandleNormalBidAccept();
      else if (cta === 'accept_otc_bid') callbackHandlePrivateBidAccept();
    }, 1000);

    firstLoading = false;
  }

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
                (!isMobile && activeTab === 0)) &&
              user?.address && (
                <Button
                  ref={acceptBidButtonRef}
                  variant="contained"
                  fullWidth
                  disabled={showAcceptModel}
                  onClick={handleNormalBidAccept}
                >
                  <Typography variant="lbl-md">
                    {' '}
                    Accept Bid for{' '}
                    {formatDecimals(
                      (lastBid as any)?.price,
                      Number(acceptBidData?.paymentType) === 2 ? 6 : 18,
                      true
                    )}{' '}
                    {Number(acceptBidData?.paymentType) === 0
                      ? 'AVAX'
                      : Number(acceptBidData?.paymentType) === 1
                      ? 'THOR'
                      : 'USD'}{' '}
                  </Typography>
                </Button>
              )}
            {user?.address && (
              <Button
                ref={unListButtonRef}
                variant={'outlined'}
                color={'secondary'}
                fullWidth
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
            )}
            <Button
              variant="contained"
              fullWidth
              disabled={unListNFTLoading}
              onClick={handleEdit}
            >
              {/* {unListNFTLoading ? (
                <CircularProgress size="2.5rem" sx={{ color: 'white' }} />
              ) : ( */}
              <Typography variant="lbl-md">Edit</Typography>
              {/* )} */}
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          {(lastOtcBid as any)?.price &&
            (lastOtcBid as any)?.bidder !== ethers.constants.AddressZero &&
            ((isMobile && activeTab === 1) || (!isMobile && activeTab === 0)) &&
            user?.address && (
              <Button
                ref={acceptPrivateBidButtonRef}
                variant="contained"
                fullWidth
                disabled={showAcceptModel}
                onClick={handlePrivateBidAccept}
              >
                <Typography variant="lbl-md">
                  {' '}
                  Accept Private Bid for {lastOtcBidUSD.toFixed(2)} USD{' '}
                </Typography>
              </Button>
            )}
          {(!listing || (listing && isInvalidOwner)) && user?.address && (
            <Button
              ref={listButtonRef}
              variant={'contained'}
              fullWidth
              onClick={handleList}
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
              variant={'outlined'}
              color={'secondary'}
              fullWidth
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
      <UpdateListNft
        open={showEditModal}
        listNFT={listNFT}
        handleClose={handleModalClick}
        // openToast={openToast}
        // refetches={refetches}
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
  const dispatch = useDispatch();
  const { address, id, cta } = router.query;
  const collectionAddress = useMemo(() => '' + address, [address]);
  const nftId = useMemo(() => '' + id, [id]);
  const [loading] = useState(false);
  const user = useSelector((state: any) => state?.auth.user);
  const [isOpen, setIsOpen] = React.useState(false);
  const [openType, setOpenType] = React.useState('bid');
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openSnackSuccess, setOpenSnackSuccess] = React.useState(false);
  const [seeAll, setSeeAll] = React.useState(false);
  const [tab, setTab] = React.useState(0);
  const [priceSort, setPriceSort] = React.useState(true); // true => asc , false => desc
  const [otcPriceSort, setOtcPriceSort] = React.useState(true); // true => asc , false => desc
  const isExpired = false;
  const [isInvalidOwner, setIsInvalidOwner] = useState<boolean>(false);
  const { showModal } = useGlobalModalContext();
  const [isLiked, setIsLiked] = useState(false);

  const isNode = isNodeNFT(collectionAddress, chain);
  const isPerk = useIsPerk(collectionAddress, chain);
  const { data: nftOwner } = useGetNFTOwner(collectionAddress, Number(nftId));
  const { data } = useGetNFTDetail(collectionAddress, nftId);
  const { data: perkData } = useGetPerk(isPerk ? Number(id) : -1);
  const [currentCollection, setCurrentCollection] = useState<Collection>({});
  const [listing, setListing] = useState();
  const { data: listingData, refetch: refetchListing } = useGetListingByNft(
    collectionAddress,
    Number(nftId)
  );

  const { refetch: refetchFavorates } = useGetNFTsFavrt(user?.id);

  const { data: NFTListInfo } = useGetNFTsListed(collectionAddress, [nftId]);
  useEffect(() => {
    if (nftOwner === '0x000000000000000000000000000000000000dEaD')
      setIsInvalidOwner(true);
    if (!listingData || !NFTListInfo) return;
    if (!(NFTListInfo as any[])[0]?.isListed) return;

    const length = listingData?.data?.data?.listings.length;
    const listing = listingData?.data?.data?.listings[length - 1];
    if (!listing) return;
    setListing(listing);
    setIsInvalidOwner(!!listing?.isInvalidOwner);
  }, [listingData, NFTListInfo, nftOwner]);

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

  //also changed this from const to const
  let { data: tokenURI } = useGetTokenURI(collectionAddress, Number(nftId));
  const { refetch: refetchTokenURI } = useGetTokenURI(
    collectionAddress,
    Number(nftId)
  );

  const metadata = useMemo(
    () => getJsonFromURI(tokenURI as string),
    [tokenURI]
  );

  const nftImage = useMemo(() => {
    if (metadata && isNode) {
      const img = metadata?.image;
      if (img) {
        const array = img.split('//');
        return 'https://ipfs.io/ipfs/' + array[1];
      }
      return '/images/nft-placeholder.png';
    }
    return '/images/nft-placeholder.png';
  }, [metadata, isNode]);

  const refetchTokenMetadata = async () => {
    //Fetch Metadata URI
    const newData: any = await refetchTokenURI();
    let newURI: string = newData.data;

    //Fetch Metadata itself
    if (newURI.includes('ipfs://')) {
      newURI = newURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    const res = await axios.get(newURI);
    const newMetadata = res.data; //already in JSON

    //If it hasn't changed, don't do anything
    if (JSON.stringify(newMetadata) === data.metadata) {
      //console.log('same metadata');
      return;
    } else {
      //console.log('new metadata');
      //If it has changed, update data
      data.metadata = JSON.stringify(newMetadata);
      data.token_uri = newURI;
      tokenURI = newURI;
    }
  };

  const { data: publicUser, isLoading: publicUserDataLoading } =
    useGetUserByAddress(_nftOwner);

  const handleModalClick = () => {
    setShowListModal(!showListModal);
  };

  const nftData = useMemo<NftDataType>(() => {
    if (isNode) {
      return {
        nftName: metadata?.name || '',
        by: 'Thorfi',
        nftImage: nftImage,
        nftAddress: collectionAddress,
        tokenId: nftId,
        nftDescription: metadata?.description || '',
        nftAttributes: metadata?.attributes,
      };
    } else {
      return {
        nftName: getMetaDataName(data) || '',
        by: 'Thorfi',
        nftImage: getMetaData(data),
        nftAddress: collectionAddress,
        tokenId: nftId,
        nftDescription: getMetaDataDescription(data) || '',
        nftAttributes: getMetaDataAttributes(data),
      };
    }
  }, [metadata, data, isNode, collectionAddress, nftId, nftImage]);

  const nftInfor = useMemo(() => {
    return [
      {
        image: isNode ? nftImage : getMetaData(data),
        name: isNode ? metadata?.name : getMetaDataName(data),
        token_address: collectionAddress,
        token_id: nftId,
      },
    ];
  }, [collectionAddress, data, isNode, metadata?.name, nftId, nftImage]);

  const OGNodesContracts = getOGNodeContractByChain(chain);
  const isOG = Object.values(OGNodesContracts).includes(
    collectionAddress.toLowerCase()
  );
  const { data: _activePerks } = useGetActivePerks(
    collectionAddress,
    nftId,
    isOG
  );

  const {
    data: baseAcceptPayments,
    isError: fetchingError,
  }: { data: any[]; isError: boolean } = useGetAcceptPaymentsByNFT(
    collectionAddress,
    nftId
  );

  const acceptPayments = useMemo(() => {
    let value = ['0', '0', '0'];
    if (baseAcceptPayments && listing && !fetchingError) {
      const filteredArr = baseAcceptPayments.filter(
        (element) => element === null
      );
      if (filteredArr.length === 3) {
        value[Number((listing as any)?.paymentType)] = (
          listing as any
        )?.priceInWei;
      } else {
        value = baseAcceptPayments.map((element) => {
          return element ? element.toString() : '0';
        });
      }
    }
    return value;
  }, [baseAcceptPayments, listing, fetchingError]);

  const activePerks = useMemo(() => {
    if (!_activePerks) return [];
    let result: any[] = [];
    (_activePerks as any[])
      .filter(
        (perk: any) =>
          perk &&
          (perk?.pct.toString() === '5000' || perk?.pct.toString() === '3500')
      )
      .sort((a: any, b: any) =>
        moment
          .duration(moment(a?.endTime.toNumber() * 1000).diff(moment()))
          .asDays() >
        moment
          .duration(moment(b?.endTime.toNumber() * 1000).diff(moment()))
          .asDays()
          ? -1
          : 1
      )
      .map((perk: any) => {
        const days = moment
          .duration(moment(perk?.endTime.toNumber() * 1000).diff(moment()))
          .asDays();
        if (days > 0) {
          result.push(days.toFixed(0) + ' DAYS');
        } else {
          result = ['INACTIVE'];
        }
      });
    return result;
  }, [_activePerks]);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const listingUSD = useMemo(() => {
    if (listing && (listing as any).priceInWei) {
      return formatPriceByDefaultCurrency(
        (listing as any)?.priceInWei,
        (listing as any)?.paymentType,
        user?.default_currency,
        avaxPrice,
        thorPrice
      );
    } else {
      return 0;
    }
  }, [thorPrice, avaxPrice, listing, user?.default_currency]);
  const handleLikeNFT = () => {
    if (user?.address) {
      axios
        .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/like-unsynced`, {
          user_id: user?.id,
          chainid: chain?.id,
          collection_address: collectionAddress,
          token_id: nftId,
        })
        .then((res) => {
          if (res?.data.code === 200) {
            setIsLiked(!isLiked);
            refetchFavorates();
          }
        });
    } else {
      showModal(MODAL_TYPES.CONNECT_WALLET, {
        title: 'Create instance form',
        confirmBtn: 'Save',
      });
    }
  };

  useEffect(() => {
    if (chain?.id && collectionAddress) {
      collectionsService
        .getCollectionByAddress('' + collectionAddress, chain?.id)
        .then((res) => {
          setCurrentCollection(res?.data?.data);
        });
    }
  }, [collectionAddress, chain]);

  useEffect(() => {
    if (chain && user?.id && collectionAddress && nftId)
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/is-liked-unsynced/${chain?.id}/${user?.id}/${collectionAddress}/${nftId}`
        )
        .then((res) => {
          if (res?.data?.code === 200) {
            setIsLiked(res?.data.data.liked ? true : false);
          }
        });
  }, [nftId, chain, user, collectionAddress]);

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
          user: dottedAddress(_bid?.bidder),
          fulladdress: _bid?.bidder,
          price: ethers.utils.formatUnits(
            _bid?.priceInWei,
            Number(_bid?.paymentType) === 2 ? 6 : 18
          ),
          userImage: '/images/userBidAvatar.png',
          bidPlacedAt: formattedTime(_bid?.blockTimestamp),
          expiresAt: _bid?.expiresAt,
          paymentType: _bid?.paymentType,
          isExpired:
            Math.ceil(Number((new Date() as any) / 1000)) >
            (Number(_bid.expiredAt) <= 1814400
              ? Number(_bid.expiresAt)
              : Number(_bid.expiredAt)),
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
          user: dottedAddress(_bid?.bidder),
          fulladdress: _bid?.bidder,
          price: ethers.utils.formatEther(_bid?.priceInWei),
          userImage: '/images/userBidAvatar.png',
          bidPlacedAt: formattedTime(_bid?.blockTimestamp),
          expiresAt: _bid?.expiresAt,
          paymentType: _bid?.paymentType,
          isExpired:
            Math.ceil(Number((new Date() as any) / 1000)) >
            (Number(_bid.expiredAt) <= 1814400
              ? Number(_bid.expiresAt)
              : Number(_bid.expiredAt)),
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

  const placingBid = (val: boolean) => {
    setOpenSnack(val);
  };

  const closeSnackbar = () => {
    setOpenSnack(false);
  };

  const handleClose = () => {
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

  useEffect(() => {
    if (cta) {
      setTimeout(() => {
        if (user?.address && nftOwner && !isOwner) {
          dispatch(
            showToast({
              message: 'This NFT is not owned by you anymore.',
              severity: ToastSeverity.ERROR,
              image: nftData?.nftImage,
            })
          );
        }
      }, 2000);
    }
  }, [cta, dispatch, nftOwner, isOwner, nftData?.nftImage, user?.address]);

  return (
    <Box>
      {!isMobile && !isTablet ? (
        <Box
          sx={{
            alignItems: 'center',
            margin: 'auto',
            height: 'calc( 100vh - 49px)',
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              padding: '5px 20px',
            }}
          >
            <Button
              color={'secondary'}
              size={'small'}
              ref={backButtonRef}
              onClick={() => router.back()}
            >
              <ArrowBackIos />
              Back
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid
              item
              miniMobile={12}
              xs={12}
              md={5}
              padding={4}
              sx={{ position: 'relative' }}
            >
              <Box sx={box1}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
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
                    <Typography sx={titleStyle}>
                      {loading ? null : nftData?.nftName}
                    </Typography>
                  </Box>

                  {currentCollection?.name && (
                    <Box sx={{ display: 'flex' }}>
                      {' '}
                      <img
                        width={'18.77px'}
                        height={'18.77px'}
                        src="/images/logo.svg"
                      />
                      <Link
                        className="asdfsadfs"
                        href={`/collection/${currentCollection?.address}`}
                      >
                        <Typography
                          variant="h2"
                          sx={{
                            fontFamily: 'Nexa-Bold',
                            fontSize: '18px',
                            lineHeight: '21.22px',
                            letterSpacing: '0.04em',
                            textAlign: 'left',
                            color: 'primary.main',
                            ml: 1,
                            cursor: `url("/images/cursor-pointer.svg"), auto`,
                          }}
                        >
                          {currentCollection?.name}
                        </Typography>
                      </Link>
                    </Box>
                  )}

                  <Typography
                    className="colDetail"
                    variant="p-md-bk"
                    sx={{
                      lineHeight: '24.26px',
                      textOverflow: 'ellipsis',
                      overflowY: seeAll ? 'visible' : 'hidden',
                      pt: '10px',
                    }}
                  >
                    {loading ? (
                      <CircularProgress />
                    ) : !seeAll ? (
                      nftData?.nftDescription.substring(0, MaxStringLength)
                    ) : (
                      nftData?.nftDescription
                    )}

                    {nftData?.nftDescription.length > MaxStringLength && !seeAll
                      ? '...'
                      : ''}
                  </Typography>
                </Box>
                {nftData?.nftDescription.length > MaxStringLength && (
                  <Box
                    onClick={() => setSeeAll(!seeAll)}
                    sx={{ pt: 1, display: 'flex' }}
                  >
                    <Typography
                      variant="p-sm"
                      sx={{
                        fontWeight: '700',
                        lineHeight: '18px',
                        letterSpacing: '0.04em',
                        textAlign: 'left',
                        color: 'text.secondary',
                        cursor: `url("/images/cursor-pointer.svg"), auto`,
                      }}
                    >
                      SEE {!seeAll ? 'ALL' : 'LESS'}
                      <img
                        style={{
                          marginLeft: 3,
                          marginBottom: 1,
                          transform: `rotate(${seeAll ? '180deg' : '0deg'})`,
                        }}
                        src="/images/showall.png"
                        width="13px"
                        height="7px"
                      />
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  ml: 7,
                  mt: 3,
                }}
              >
                <Box>
                  <Typography variant="p-md-bk" sx={ownerText}>
                    Current Owner
                  </Typography>
                  {user?.address && isOwner ? (
                    <Box sx={imgStyle}>
                      <Avatar
                        alt="none"
                        src="/images/Rectangle.png"
                        sx={{
                          width: '15px',
                          height: '15px',
                        }}
                      />
                      <Typography variant="lbl-md" sx={ownerDetail}>
                        You are the owner
                      </Typography>
                    </Box>
                  ) : !publicUserDataLoading ? (
                    publicUser?.address ? (
                      <Box
                        sx={{
                          display: 'flex',
                          cursor: `url("/images/cursor-pointer.svg"), auto`,
                        }}
                      >
                        <Avatar
                          alt="none"
                          src="/images/Rectangle.png"
                          sx={{
                            width: '15px',
                            height: '15px',
                          }}
                        />
                        <Link
                          className="asdfsadfs"
                          href={`/profile/${_nftOwner}`}
                        >
                          <Typography
                            sx={{
                              marginLeft: '10px',
                              color: 'primary.main',
                            }}
                          >
                            {_nftOwner ? dottedAddress(_nftOwner) : '...'}
                          </Typography>
                        </Link>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          cursor: `url("/images/cursor-pointer.svg"), auto`,
                        }}
                      >
                        <Avatar
                          alt="none"
                          src="/images/Rectangle.png"
                          sx={{
                            width: '15px',
                            height: '15px',
                          }}
                        />
                        <Typography
                          sx={{
                            marginLeft: '10px',
                            color: 'primary.main',
                          }}
                        >
                          {_nftOwner ? dottedAddress(_nftOwner) : '...'}
                        </Typography>
                      </Box>
                    )
                  ) : (
                    ``
                  )}
                </Box>
                {listing && !isInvalidOwner && (
                  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Box>
                      <Typography
                        variant="lbl-md"
                        sx={{ mb: '5px', color: 'text.secondary' }}
                      >
                        PRICE
                      </Typography>
                      <Typography
                        variant="p-lg-bk"
                        sx={{
                          lineHeight: '24px',
                        }}
                      >
                        {formatNumber(listingUSD)}{' '}
                        {user?.default_currency
                          ? user?.default_currency.replace('USDC', 'USD')
                          : 'USD'}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        ml: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography
                        variant="lbl-md"
                        sx={{ mb: '5px', color: 'text.secondary' }}
                      >
                        RECEIVE
                      </Typography>
                      <MultiCurrency
                        nftAddress={collectionAddress}
                        tokenId={nftId}
                        paymentType={(listing as any)?.paymentType}
                        priceWei={(listing as any)?.priceInWei}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: 'transparent',
                  ml: { xs: 1.5, md: 6 },
                  mt: 4,
                  mb: -2,
                }}
              >
                <StyledTabs
                  sx={{ width: 'fit-content' }}
                  value={tab}
                  onChange={(e: any, n: number) => e && setTab(n)}
                >
                  <Tab label="ATTRIBUTES" ref={attributesButtonRef} />
                  <Tab label="BIDS" ref={bidsButtonRef} />
                  <Tab label="HISTORY" ref={privateBidsButtonRef} />
                </StyledTabs>
              </Box>
              {tab === 1 ? (
                <TableContainer
                  sx={{
                    // 'height': '320px',
                    'margin-bottom': '50px',
                    'width': '100%',
                    'overflowY': 'scroll',
                    'overflowX': 'hidden',
                    '&::-webkit-scrollbar': {
                      width: 0,
                    },
                    'borderColor': 'transparent',
                    // background: 'green',
                    'ml': 3,
                    // pr: 2
                  }}
                >
                  <Table
                    sx={{
                      // 'ml': { xs: 1.5, md: 5.5 },
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
                                color: 'text.secondary',
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
                            <Button
                              onClick={() => setPriceSort(!priceSort)}
                              size={'small'}
                              sx={{
                                borderRadius: 0,
                                textTransform: 'none',
                                padding: '2px',
                                color: 'text.secondary',
                              }}
                            >
                              <SortLabel
                                text={'Price'}
                                direction={priceSort ? 'asc' : 'desc'}
                              />
                            </Button>
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
                                <img
                                  src={bid?.userImage}
                                  width="34"
                                  height="34"
                                />
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
                                    {bid?.user}
                                  </Typography>
                                  <Typography
                                    variant="lbl-md"
                                    sx={{
                                      fontWeight: 400,
                                      lineHeight: '21px',
                                      letterSpacing: '0em',
                                      textAlign: 'left',
                                      color: 'text.secondary',
                                    }}
                                  >
                                    {bid?.bidPlacedAt}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {bid?.isExpired && (
                                <Typography
                                  sx={{
                                    color: 'primary.main',
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
                                        ? Number(bid?.paymentType) === 0
                                          ? 'avax'
                                          : Number(bid?.paymentType) === 1
                                          ? 'thor'
                                          : 'usdc'
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
                                    {bid?.price}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Box
                            sx={(theme) => ({
                              border: `1px dashed ${theme.palette.text.secondary}`,
                              width: '100%',
                              height: '40px',
                              padding: '0!important',
                              ml: 2,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            })}
                          >
                            <Typography
                              variant={'lbl-md'}
                              sx={{
                                color: 'text.secondary',
                                textAlign: 'center',
                              }}
                            >
                              No bids have been made
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </Table>
                </TableContainer>
              ) : tab === 2 ? (
                <TableContainer
                  sx={{
                    // 'height': '320px',
                    'margin-bottom': '50px',
                    'width': '100%',
                    'overflowY': 'scroll',
                    'overflowX': 'hidden',
                    '&::-webkit-scrollbar': {
                      width: 0,
                    },
                    'borderColor': 'transparent',
                    // background: 'green',
                    'ml': 3,
                    // pr: 2
                  }}
                >
                  <Table
                    sx={{
                      // 'ml': { xs: 1.5, md: 5.5 },
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
                                color: 'text.secondary',
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
                            <Button
                              onClick={() => setOtcPriceSort(!otcPriceSort)}
                              size={'small'}
                              sx={{
                                borderRadius: 0,
                                textTransform: 'none',
                                padding: '2px',
                                color: 'text.secondary',
                              }}
                            >
                              <SortLabel
                                text={'Price'}
                                direction={otcPriceSort ? 'asc' : 'desc'}
                              />
                            </Button>
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
                                <img
                                  src={bid?.userImage}
                                  width="34"
                                  height="34"
                                />
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
                                    {bid?.user}
                                  </Typography>
                                  <Typography
                                    variant="lbl-md"
                                    sx={{
                                      fontWeight: 400,
                                      lineHeight: '21px',
                                      letterSpacing: '0em',
                                      textAlign: 'left',
                                      color: 'text.secondary',
                                    }}
                                  >
                                    {bid?.bidPlacedAt}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {bid?.isExpired && (
                                <Typography
                                  sx={{
                                    color: 'primary.main',
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
                                    {bid?.price}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Box
                            sx={(theme) => ({
                              border: `1px dashed ${theme.palette.text.secondary}`,
                              width: '100%',
                              height: '40px',
                              padding: '0!important',
                              ml: 2,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            })}
                          >
                            <Typography
                              variant={'lbl-md'}
                              sx={{
                                color: 'text.secondary',
                                textAlign: 'center',
                              }}
                            >
                              No private bids have been made
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </Table>
                </TableContainer>
              ) : (
                <Box
                  sx={{
                    maxHeight: '40%',
                    overflowY: 'scroll',
                    mb: '50px',
                  }}
                  className={styles.hideScroll}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      pl: 6,
                      pt: 2,
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                      // maxHeight: '40%',
                      // overflowY: 'scroll',
                    }}
                  >
                    {nftData?.nftAttributes &&
                      nftData?.nftAttributes.map(
                        (attribute: Attribute, _index: number) =>
                          'attechedperks' !==
                            attribute?.trait_type?.toLowerCase() &&
                          'isodinkey' !==
                            attribute?.trait_type?.toLowerCase() && (
                            <Box
                              key={_index}
                              sx={(theme) => ({
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                border: '1px solid',
                                borderColor: theme.palette.text.primary,
                                justifyContent: 'space-between',
                                padding: 1,
                                margin: 1,
                              })}
                            >
                              <Typography
                                sx={{
                                  color: 'text.secondary',
                                  textTransform: 'uppercase',
                                  lineHeight: '15px',
                                }}
                                variant="lbl-md"
                              >
                                {isNodeNFT(collectionAddress, chain) &&
                                'rewards' ===
                                  attribute?.trait_type?.toLowerCase()
                                  ? 'Rewards (THOR)'
                                  : 'due date' ===
                                    attribute?.trait_type?.toLowerCase()
                                  ? 'Due date (Days)'
                                  : 'isdirectburnkey' ===
                                    attribute?.trait_type?.toLowerCase()
                                  ? 'Type'
                                  : attribute.trait_type}
                              </Typography>
                              <Typography variant="p-lg-bk">
                                {isNodeNFT(collectionAddress, chain) &&
                                'rewards' ===
                                  attribute?.trait_type?.toLowerCase()
                                  ? formatDecimals(
                                      attribute?.value.toString(),
                                      18,
                                      false,
                                      6
                                    )
                                  : 'due date' ===
                                    attribute?.trait_type?.toLowerCase()
                                  ? moment
                                      .duration(
                                        moment(
                                          parseInt(
                                            attribute?.value.toString()
                                          ) * 1000
                                        ).diff(moment())
                                      )
                                      .asDays() >= 0
                                    ? moment
                                        .duration(
                                          moment(
                                            parseInt(
                                              attribute?.value.toString()
                                            ) * 1000
                                          ).diff(moment())
                                        )
                                        .asDays()
                                        .toFixed(0)
                                    : 'Inactive'
                                  : 'isdirectburnkey' ===
                                    attribute?.trait_type?.toLowerCase()
                                  ? `${attribute?.value ? 'Origin' : 'Drift'}`
                                  : 'vrr multiplier' ===
                                    attribute?.trait_type?.toLowerCase()
                                  ? `${Number(attribute?.value) / 10}`
                                  : 'voucher' ===
                                    attribute?.trait_type?.toLowerCase()
                                  ? `${formatDecimals(
                                      attribute?.value.toString(),
                                      18,
                                      false,
                                      0
                                    )} THOR`
                                  : `${attribute?.value}${
                                      attribute?.display_type ===
                                      'boost_percentage'
                                        ? attribute?.trait_type.toLocaleLowerCase() ===
                                          'temporary booster'
                                          ? activePerks &&
                                            activePerks.length !== 0
                                            ? `% (${activePerks.join(',')})`
                                            : `%`
                                          : '%'
                                        : ''
                                    }`}
                              </Typography>
                            </Box>
                          )
                      )}
                    {isPerk && perkData && (
                      <Box
                        sx={(theme) => ({
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          border: '1px solid',
                          borderColor: theme.palette.text.primary,
                          justifyContent: 'space-between',
                          padding: 1,
                          margin: 1,
                        })}
                      >
                        <Typography
                          sx={{
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                            lineHeight: '15px',
                          }}
                          variant="lbl-md"
                        >
                          Days
                        </Typography>
                        {(perkData as any).duration.toString() === '0' ? (
                          <Typography
                            sx={{
                              fontSize: '30px',
                              lineHeight: '18px',
                            }}
                            variant="p-lg-bk"
                          >
                            &infin;
                          </Typography>
                        ) : (
                          <Typography variant="p-lg-bk">30</Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
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
                    cta={cta}
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
            <Grid
              item
              miniMobile={12}
              md={7}
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
                    miniMobile: '343px',
                  },
                  marginLeft: '50px',
                }}
              >
                <Button
                  onClick={() => {
                    refetchTokenMetadata();
                  }}
                >
                  Refresh Metadata
                </Button>
                <Paper
                  elevation={0}
                  style={{
                    aspectRatio: '1',
                    width: '35vw',
                    backgroundImage: `url(${nftData?.nftImage}), url(${
                      'https://d3nzng6t9rclwr.cloudfront.net/collections/chain_' +
                      chain.id +
                      '/collection_' +
                      nftData?.nftAddress +
                      '/images/' +
                      nftData?.tokenId +
                      '.jpg'
                    })`, // THis is the what you want, I guess
                    position: 'relative',
                    transitionDuration: '0.1s',
                    zIndex: 2,
                    maxWidth: 'auto',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {user?.address ? (
                    <Box position="absolute" top="18.7px" right="18.7px">
                      <IconButton
                        sx={{
                          'width': '32px',
                          'height': '32px',
                          'backgroundColor': 'rgba(256, 256, 256, 0.6)',
                          '&:hover': {
                            backgroundColor: 'rgba(256, 256, 256, 0.6)',
                          },
                        }}
                        onClick={handleLikeNFT}
                        size={'small'}
                        className={'action-button'}
                      >
                        {isLiked ? (
                          <FavoriteIcon color="primary" />
                        ) : (
                          <FavoriteBorderIcon color={'primary'} />
                        )}
                      </IconButton>
                    </Box>
                  ) : (
                    <div></div>
                  )}
                </Paper>
              </Box>
            </Grid>
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
                    'bgcolor': 'success.main',
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
                      {openType === 'bid'
                        ? 'VIEW RECENT BID'
                        : 'VIEW MY NEW NFT'}
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
      ) : (
        <Box
          sx={{
            alignItems: 'center',
            margin: 'auto',
            marginLeft: 'auto',
            width: '100%',
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              padding: '5px 20px',
            }}
          >
            <Button
              color={'secondary'}
              size={'small'}
              ref={backMobileButtonRef}
              onClick={() => router.back()}
            >
              <ArrowBackIos />
              Back
            </Button>
          </Box>
          <Grid container spacing={0}>
            <Grid
              item
              miniMobile={12}
              xs={12}
              md={12}
              padding={2}
              sx={{ ml: 'auto', mr: 'auto' }}
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
                  ) : nftData?.nftImage ? (
                    <Grid
                      item
                      miniMobile={12}
                      md={6}
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
                            miniMobile: '343px',
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
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                          }}
                        >
                          {user?.address ? (
                            <Box
                              position="absolute"
                              top="18.7px"
                              right="18.7px"
                            >
                              <IconButton
                                sx={{
                                  'width': '32px',
                                  'height': '32px',
                                  'backgroundColor': 'rgba(256, 256, 256, 0.6)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(256, 256, 256, 0.6)',
                                  },
                                }}
                                onClick={handleLikeNFT}
                                size={'small'}
                                className={'action-button'}
                              >
                                {isLiked ? (
                                  <FavoriteIcon color="primary" />
                                ) : (
                                  <FavoriteBorderIcon color={'primary'} />
                                )}
                              </IconButton>
                            </Box>
                          ) : (
                            <div></div>
                          )}
                        </Paper>
                      </Box>
                    </Grid>
                  ) : (
                    <Link href={`/collections/${currentCollection?.address}`}>
                      <img
                        style={{
                          cursor: `url("/images/cursor-pointer.svg"), auto`,
                        }}
                        src={currentCollection?.profile_image}
                        width="100%"
                        height="100%"
                      />
                    </Link>
                  )}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography sx={titleStyle}>
                    {loading ? null : nftData?.nftName}
                  </Typography>
                  {currentCollection?.name && (
                    <Box sx={{ display: 'flex' }}>
                      {' '}
                      <img
                        width={'18.77px'}
                        height={'18.77px'}
                        src="/images/logo.svg"
                      />
                      <Link
                        className="asdfsadfs"
                        href={`/collection/${currentCollection?.address}`}
                      >
                        <Typography
                          variant="h2"
                          sx={{
                            fontFamily: 'Nexa-Bold',
                            fontSize: '18px',
                            lineHeight: '21.22px',
                            letterSpacing: '0.04em',
                            textAlign: 'left',
                            color: 'primary.main',
                            ml: 1,
                          }}
                        >
                          {currentCollection?.name}
                        </Typography>
                      </Link>
                    </Box>
                  )}
                  <Typography
                    className="colDetail"
                    variant="p-lg-bk"
                    sx={{
                      lineHeight: '27.29px',
                      // textAlign: 'left',
                      textOverflow: 'ellipsis',
                      // overflowX: 'auto',
                      overflowY: seeAll ? 'visible' : 'hidden',
                      height: '100%',
                      mt: 2,
                    }}
                    height={
                      seeAll
                        ? 'auto'
                        : nftData?.nftDescription || nftData?.nftName
                        ? '7px'
                        : '0px'
                    }
                  >
                    {loading ? (
                      <CircularProgress />
                    ) : !seeAll ? (
                      nftData?.nftDescription.substring(0, MaxStringLength)
                    ) : (
                      nftData?.nftDescription
                    )}

                    {nftData?.nftDescription.length > MaxStringLength && !seeAll
                      ? '...'
                      : ''}
                  </Typography>
                </Box>
                {nftData?.nftDescription.length > MaxStringLength && (
                  <Box
                    onClick={() => setSeeAll(!seeAll)}
                    sx={{ pt: 1, display: 'flex' }}
                  >
                    <Typography
                      variant="p-sm"
                      sx={{
                        fontWeight: '700',
                        lineHeight: '18px',
                        letterSpacing: '0.04em',
                        textAlign: 'left',
                        color: 'text.secondary',
                      }}
                    >
                      SEE {!seeAll ? 'ALL' : 'LESS'}
                      <img
                        style={{
                          marginLeft: 3,
                          marginBottom: 1,
                          transform: `rotate(${seeAll ? '180deg' : '0deg'})`,
                        }}
                        src="/images/showall.png"
                        width="13px"
                        height="7px"
                      />
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  ml: 1.5,
                  mt: 2,
                }}
              >
                <Box>
                  <Typography variant="p-md-bk" sx={ownerText}>
                    Current Owner
                  </Typography>
                  <Box sx={imgStyle}>
                    <img
                      src="/images/Rectangle.png"
                      width="15px"
                      height="15px"
                    />
                    {user?.address && isOwner ? (
                      <Typography variant="p-lg" sx={ownerDetail}>
                        You are the owner
                      </Typography>
                    ) : (
                      <Link
                        href={`/profile/${_nftOwner}`}
                        style={{ marginLeft: '10px' }}
                      >
                        <Typography
                          sx={{
                            marginLeft: '10px',
                            color: 'primary.main',
                            cursor: `url("/images/cursor-pointer.svg"), auto`,
                          }}
                        >
                          {_nftOwner ? dottedAddress(_nftOwner) : '...'}
                        </Typography>
                      </Link>
                    )}
                  </Box>
                </Box>

                {listing && (
                  <Box sx={{ display: 'flex', width: '100%', mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography
                          variant="lbl-md"
                          sx={{ mb: '5px', color: 'text.secondary' }}
                        >
                          PRICE
                        </Typography>
                        <Typography
                          variant="p-lg-bk"
                          sx={{
                            lineHeight: '24px',
                          }}
                        >
                          {formatNumber(listingUSD)}{' '}
                          {user?.default_currency
                            ? user?.default_currency.replace('USDC', 'USD')
                            : 'USD'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            ml: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Typography
                            variant="lbl-md"
                            sx={{
                              mb: '5px',
                              color: 'text.secondary',
                            }}
                          >
                            RECEIVE
                          </Typography>
                          <MultiCurrency
                            nftAddress={collectionAddress}
                            tokenId={nftId}
                            paymentType={(listing as any)?.paymentType}
                            priceWei={(listing as any)?.priceInWei}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>

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
                  onChange={(e: any, n: number) => e && setTab(n)}
                >
                  {' '}
                  <Tab label="ATTRIBUTES" ref={attributesMobileButtonRef} />
                  <Tab label="BIDS" ref={bidsMobileButtonRef} />
                  <Tab label="PRIVATE BIDS" ref={privateBidsMobileButtonRef} />
                </StyledTabs>
              </Box>

              {tab === 1 ? (
                <TableContainer
                  sx={{
                    // 'height': '320px',
                    'margin-bottom': '50px',
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
                      // 'ml': { xs: 1.5, md: 3 },
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
                                color: 'text.secondary',
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
                            <Button
                              onClick={() => setPriceSort(!priceSort)}
                              size={'small'}
                              sx={{
                                borderRadius: 0,
                                textTransform: 'none',
                                padding: '2px',
                                color: 'text.secondary',
                              }}
                            >
                              <SortLabel
                                text={'Price'}
                                direction={priceSort ? 'asc' : 'desc'}
                              />
                            </Button>
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
                                <img
                                  src={bid?.userImage}
                                  width="34"
                                  height="34"
                                />
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
                                    {bid?.user}
                                  </Typography>
                                  <Typography
                                    variant="lbl-md"
                                    sx={{
                                      fontWeight: 400,
                                      lineHeight: '21px',
                                      letterSpacing: '0em',
                                      textAlign: 'left',
                                      color: 'text.secondary',
                                    }}
                                  >
                                    {bid?.bidPlacedAt}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {bid?.isExpired && (
                                <Typography
                                  sx={{
                                    color: 'primary.main',
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
                                        ? Number(bid?.paymentType) === 0
                                          ? 'avax'
                                          : Number(bid?.paymentType) === 1
                                          ? 'thor'
                                          : 'usdc'
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
                                    {bid?.price}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Box
                            sx={(theme) => ({
                              border: `1px dashed ${theme.palette.text.secondary}`,
                              width: '100%',
                              height: '40px',
                              padding: '0!important',
                              // ml: 2,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            })}
                          >
                            <Typography
                              variant={'lbl-md'}
                              sx={{
                                color: 'text.secondary',
                                textAlign: 'center',
                              }}
                            >
                              No bids have been made
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </Table>
                </TableContainer>
              ) : tab === 2 ? (
                <TableContainer
                  sx={{
                    // 'height': '320px',
                    'margin-bottom': '50px',
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
                      // 'ml': { xs: 1.5, md: 3 },
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
                            <Button
                              onClick={() => setOtcPriceSort(!otcPriceSort)}
                              size={'small'}
                              sx={{
                                borderRadius: 0,
                                textTransform: 'none',
                                padding: '2px',
                                color: 'text.secondary',
                              }}
                            >
                              <SortLabel
                                text={'Price'}
                                direction={otcPriceSort ? 'asc' : 'desc'}
                              />
                            </Button>
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
                                <img
                                  src={bid?.userImage}
                                  width="34"
                                  height="34"
                                />
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
                                    {bid?.user}
                                  </Typography>
                                  <Typography
                                    variant="lbl-md"
                                    sx={{
                                      fontWeight: 400,
                                      lineHeight: '21px',
                                      letterSpacing: '0em',
                                      textAlign: 'left',
                                      color: 'text.secondary',
                                    }}
                                  >
                                    {bid?.bidPlacedAt}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              {bid?.isExpired && (
                                <Typography
                                  sx={{
                                    color: 'primary.main',
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
                                    {bid?.price}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Box
                            sx={(theme) => ({
                              border: `1px dashed ${theme.palette.text.secondary}`,
                              width: '100%',
                              height: '40px',
                              padding: '0!important',
                              // ml: 2,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            })}
                          >
                            <Typography
                              variant={'lbl-md'}
                              sx={{
                                color: 'text.secondary',
                                textAlign: 'center',
                              }}
                            >
                              No private bids have been made
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </Table>
                </TableContainer>
              ) : (
                <Box
                  sx={{
                    maxHeight: '40%',
                    overflowY: 'scroll',
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
                        (attribute: Attribute, _index: number) =>
                          'attechedperks' !==
                            attribute?.trait_type?.toLowerCase() &&
                          'isodinkey' !==
                            attribute?.trait_type?.toLowerCase() && (
                            <Box
                              key={_index}
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                border: '1px solid',
                                // bgcolor: 'background.default',
                                justifyContent: 'space-between',
                                padding: 1,
                                margin: 1,
                              }}
                            >
                              <Typography
                                sx={{
                                  color: 'text.secondary',
                                  textTransform: 'uppercase',
                                  lineHeight: '15px',
                                }}
                                variant="lbl-md"
                              >
                                {isNodeNFT(collectionAddress, chain) &&
                                'rewards' ===
                                  attribute?.trait_type?.toLowerCase()
                                  ? 'Rewards (THOR)'
                                  : 'due date' ===
                                    attribute?.trait_type?.toLowerCase()
                                  ? 'Due date (Days)'
                                  : 'isdirectburnkey' ===
                                    attribute?.trait_type?.toLowerCase()
                                  ? 'Type'
                                  : attribute.trait_type}
                              </Typography>
                              <Typography variant="p-lg-bk">
                                {isNodeNFT(collectionAddress, chain) &&
                                'rewards' ===
                                  attribute?.trait_type?.toLowerCase()
                                  ? formatDecimals(
                                      attribute?.value.toString(),
                                      18,
                                      false,
                                      6
                                    )
                                  : 'due date' ===
                                    attribute?.trait_type?.toLowerCase()
                                  ? moment
                                      .duration(
                                        moment(
                                          parseInt(
                                            attribute?.value.toString()
                                          ) * 1000
                                        ).diff(moment())
                                      )
                                      .asDays() >= 0
                                    ? moment
                                        .duration(
                                          moment(
                                            parseInt(
                                              attribute?.value.toString()
                                            ) * 1000
                                          ).diff(moment())
                                        )
                                        .asDays()
                                        .toFixed(0)
                                    : 'Inactive'
                                  : 'isdirectburnkey' ===
                                    attribute?.trait_type?.toLowerCase()
                                  ? `${attribute?.value ? 'Origin' : 'Drift'}`
                                  : 'vrr multiplier' ===
                                    attribute?.trait_type?.toLowerCase()
                                  ? `${Number(attribute?.value) / 10}`
                                  : 'voucher' ===
                                    attribute?.trait_type?.toLowerCase()
                                  ? `${formatDecimals(
                                      attribute?.value.toString(),
                                      18,
                                      false,
                                      0
                                    )} THOR`
                                  : `${attribute?.value}${
                                      attribute?.display_type ===
                                      'boost_percentage'
                                        ? attribute?.trait_type.toLocaleLowerCase() ===
                                          'temporary booster'
                                          ? activePerks &&
                                            activePerks.length !== 0
                                            ? `% (${activePerks.join(',')})`
                                            : `%`
                                          : '%'
                                        : ''
                                    }`}
                              </Typography>
                            </Box>
                          )
                      )}
                    {isPerk && perkData && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          border: '1px solid',
                          bgcolor: 'text.primary',
                          justifyContent: 'space-between',
                          padding: 1,
                          margin: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                            lineHeight: '15px',
                          }}
                          variant="lbl-md"
                        >
                          Days
                        </Typography>
                        {(perkData as any).duration.toString() === '0' ? (
                          <Typography
                            sx={{
                              fontSize: '30px',
                              lineHeight: '18px',
                            }}
                            variant="p-lg-bk"
                          >
                            &infin;
                          </Typography>
                        ) : (
                          <Typography variant="p-lg-bk">30</Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

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
                    cta={cta}
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
                    'bgcolor': 'text.primary',
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
                    'bgcolor': 'success.main',
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
                      {openType === 'bid'
                        ? 'VIEW RECENT BID'
                        : 'VIEW MY NEW NFT'}
                    </Typography>
                    <ArrowForwardIos
                      fontSize="small"
                      style={{ marginLeft: '8px' }}
                    />
                  </Box>
                </Alert>
              </Box>
            </Snackbar>
          </Grid>
        </Box>
      )}
      {isOpen && openType === 'bid' && (
        <PlaceBid
          collectionAddress={collectionAddress}
          tokenId={Number(nftId)}
          open={isOpen && openType === 'bid'}
          handleClose={handleClose}
          placingBid={placingBid}
          acceptPayments={acceptPayments}
          nft={{ image: nftData?.nftImage, title: nftData?.nftName }}
          activeBidType={activeBidType}
        />
      )}
      {isOpen && openType === 'purchase' && (
        <BuyNFTModal
          collectionAddress={collectionAddress}
          tokenId={Number(nftId)}
          open={isOpen && openType === 'purchase'}
          handleClose={handleClose}
          acceptPayments={acceptPayments}
          refresh={refetchListing}
          nft={{ image: nftData?.nftImage, title: nftData?.nftName }}
          listing={listing}
        />
      )}
      {isOwner && showListModal && (
        <BatchListNFTModal
          open={showListModal}
          nfts={nftInfor}
          handleClose={handleModalClick}
        />
      )}
    </Box>
  );
};

export default NFTdetailV2;
