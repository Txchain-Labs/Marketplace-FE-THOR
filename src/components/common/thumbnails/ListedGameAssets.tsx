import React, { FC, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useGetAcceptPaymentsByNFT, useGetTokenURI } from '@/hooks/useNodes';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useChain } from '@/utils/web3Utils';
import { formatNumber, getJsonFromURI } from '@/utils/common';
import axios from 'axios';
import ConnectingLoader from '@/components/common/ConnectingLoader';
import {
  Box,
  Typography,
  IconButton,
  Popover,
  MenuItem,
  ListItemIcon,
  ListItemText,
  MenuList,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TocIcon from '@mui/icons-material/Toc';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Listing } from '@/models/Listing';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  selectCarted,
} from '@/redux/slices/cartSlice';
import RemoveCartIcon from '@/components/common/RemoveCartIcon';
import { useMarketplaceAddress } from '@/hooks/Marketplace';
import { useGetNFTOwner, useGetNFTsByWallet } from '@/hooks/useNFTDetail';
import { showToast, ToastSeverity } from '@/redux/slices/toastSlice';
import { useSetAttribute } from '@/hooks/uiHooks';
import { thorNodesType, ThorTier } from '@/utils/types';
import Tract from '@/components/common/Tract';
import { ThorfiNFTType_ext, getOGNodeContractByChain } from '@/utils/constants';
import { AttachedPerks, Attribute } from '@/models/Metadata';
import { formatDecimals } from '@/shared/utils/utils';
import { useAccount } from 'wagmi';
import { formatPriceByDefaultCurrency } from '@/utils/helper';
import MultiCurrency from '@/components/icons/MultiCurrency';

interface ListedGameAssetsCardProps {
  listing: Listing;
  isCarted: boolean;
  assetType: ThorfiNFTType_ext;
  type: thorNodesType;
  setSelectedTile: any;
  setSelectedAcceptPayments?: any;
  user: any;
  viewPlaceBidModal?: () => void;
  refresh?: () => void;
  tier?: ThorTier;
  isActive?: boolean;
  avaxPrice?: BigNumber;
  thorPrice?: BigNumber;
}

const ListedGameAssetsCard: FC<ListedGameAssetsCardProps> = (props) => {
  const {
    listing,
    isCarted,
    assetType,
    type,
    setSelectedTile,
    setSelectedAcceptPayments,
    user,
    viewPlaceBidModal,
    refresh,
    tier,
    avaxPrice,
    thorPrice,
  } = props;
  const chain = useChain();

  const [fav, setFav] = useState(listing.isLiked);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [availablePayment, setAvailablePayment] = useState(true);
  const { data: tokenURI } = useGetTokenURI(
    listing.nftAddress,
    listing.tokenId,
    type
  );

  const cartedItems = useSelector(selectCarted);

  const marketplaceAddress = useMarketplaceAddress();

  const dispatch = useDispatch();

  useEffect(() => {
    setFav(listing?.isLiked);
  }, [listing]);

  const open = Boolean(anchorEl);
  const matches = useMediaQuery('(max-width:600px)');

  const { data: nftOwner } = useGetNFTOwner(
    listing.nftAddress,
    listing.tokenId
  );
  const { address } = useAccount();
  const { data: nftsByWallet, isLoading: ownedLoading } =
    useGetNFTsByWallet(address);

  const NODES_CONTRACTS = useMemo(
    () => Object.values(getOGNodeContractByChain(chain)),
    [chain]
  );
  const artOwnedNFTs = nftsByWallet?.filter(
    (nft: any) => !NODES_CONTRACTS.includes(nft.token_address)
  );

  const isOwner = useMemo(() => {
    const realNftOwner =
      (nftOwner as string)?.toLowerCase() === marketplaceAddress.toLowerCase()
        ? (listing as any)?.seller
        : nftOwner;

    return (
      user?.address?.toLowerCase() === (realNftOwner as string)?.toLowerCase()
    );
  }, [listing, marketplaceAddress, nftOwner, user]);

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

  const {
    data: baseAcceptPayments,
    isError: fetchingError,
  }: { data: any[]; isError: boolean } = useGetAcceptPaymentsByNFT(
    listing.nftAddress,
    listing.tokenId
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

  const metadata = useMemo(
    () => getJsonFromURI(tokenURI as string),
    [tokenURI]
  );

  const isDriftActive = useMemo<boolean | undefined>(() => {
    if (metadata && type === 'DRIFT' && assetType === 'drift') {
      const rewards = metadata?.attributes?.filter(
        (item: Attribute) => item.trait_type.toLowerCase() === 'pending rewards'
      )[0];
      return rewards?.value === 0 ? false : true;
    } else {
      return undefined;
    }
  }, [metadata, type, assetType]);

  const OGnodeRewards = useMemo<string | undefined>(() => {
    if (metadata && type === 'ORIGIN' && assetType === 'origin') {
      const reward = metadata?.attributes?.filter(
        (item: Attribute) => item.trait_type.toLowerCase() === 'rewards'
      )[0];
      return reward?.value.toString();
    } else {
      return undefined;
    }
  }, [metadata, type, assetType]);

  const driftMultiplier = useMemo<number | undefined>(() => {
    if (metadata && type === 'DRIFT' && assetType === 'drift') {
      const multiplier = metadata?.attributes?.filter(
        (item: Attribute) => item.trait_type.toLowerCase() === 'vrr multiplier'
      )[0];
      return Number(multiplier?.value) / 10;
    } else {
      return undefined;
    }
  }, [metadata, type, assetType]);

  const perkBoost = useMemo<number | undefined>(() => {
    if (metadata && tier !== 'BONUS' && assetType === 'perks') {
      const boost = metadata?.attributes?.filter(
        (item: Attribute) => item.trait_type.toLowerCase() === 'boost %'
      )[0];
      return Number(boost?.value);
    } else {
      return undefined;
    }
  }, [metadata, tier, assetType]);

  const voucher = useMemo<number | undefined>(() => {
    if (metadata && tier === 'BONUS' && assetType === 'perks') {
      const _voucher = metadata?.attributes?.filter(
        (item: Attribute) => item.trait_type.toLowerCase() === 'voucher'
      )[0];
      return _voucher
        ? Number(ethers.utils.formatEther(_voucher?.value))
        : undefined;
    } else {
      return undefined;
    }
  }, [metadata, tier, assetType]);

  const solts = useMemo<number[]>(() => {
    if (metadata && type === 'ORIGIN' && assetType === 'origin') {
      const defaultValue = [0, 0];
      const perks = metadata?.attributes?.filter(
        (item: Attribute) => item.trait_type.toLowerCase() === 'attechedperks'
      )[0]?.value;
      perks?.map(
        (perk: AttachedPerks, index: number) =>
          (defaultValue[index] = perk.type)
      );
      return defaultValue;
    } else {
      return undefined;
    }
  }, [metadata, type, assetType]);

  const likeNFT = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/like-unsynced`, {
        user_id: user?.id,
        chainid: chain?.id,
        collection_address: listing.nftAddress,
        token_id: listing.tokenId,
      })
      .then((res) => {
        if (res.data.code === 200) {
          setFav(!fav);
          refresh && refresh();
        }
      });
  };

  function getMetaData(metadata: any) {
    if (metadata) {
      const img = metadata?.image;
      if (img) {
        // if (/(http(s?)):\/\//i.test(img)) {
        //   return img;
        // }
        const array = img.split('//');
        return 'https://ipfs.io/ipfs/' + array[1];
      }
      return '/images/nft-placeholder.png';
    }
    return '/images/nft-placeholder.png';
  }

  const image = getMetaData(metadata);

  const loading = false;
  useEffect(() => {
    const payload: Listing = {
      ...listing,
      metadata,
      acceptPayments,
      image,
    };
    const cartedNFTs = [...cartedItems, payload];
    const availablePaymentType = [true, true, true];
    for (const item of cartedNFTs) {
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
    if (availablePaymentType.every((type) => !type)) {
      setAvailablePayment(false);
    } else {
      setAvailablePayment(true);
    }
  }, [acceptPayments, cartedItems, image, listing, metadata]);

  const handleAddToCart = () => {
    const usdPrice =
      Number(
        listing?.paymentType === '2'
          ? ethers.utils.formatUnits(listing?.priceInWei, 6)
          : ethers.utils.formatEther(listing?.priceInWei)
      ) *
      (listing?.paymentType === '0'
        ? avaxPrice
          ? Number(ethers.utils.formatEther(avaxPrice as BigNumberish))
          : 0
        : listing?.paymentType === '1'
        ? thorPrice
          ? Number(ethers.utils.formatEther(thorPrice as BigNumberish))
          : 0
        : 1);

    const payload: Listing = {
      ...listing,
      metadata,
      acceptPayments,
      image,
      usdPrice,
    };
    const cartedNFTs = [...cartedItems, payload];
    const availablePaymentType = [true, true, true];
    for (const item of cartedNFTs) {
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

    let add_flag = true;
    if (availablePaymentType.every((type) => !type)) {
      add_flag = false;
      dispatch(
        showToast({
          message: 'This NFT cannot batch buying',
          severity: ToastSeverity.ERROR,
          image: image,
        })
      );
      refresh && refresh();
    }
    if (!ownedLoading) {
      artOwnedNFTs.map((ownNft: any) => {
        if (
          ownNft.token_address.toLowerCase() ===
            payload.nftAddress.toLowerCase() &&
          ownNft.token_id === payload.tokenId
        ) {
          add_flag = false;
          dispatch(
            showToast({
              message: 'Self-purchasing is not allowed',
              severity: ToastSeverity.ERROR,
              image: image,
            })
          );
        }
        return 1;
      });

      if (add_flag) {
        dispatch(addToCart(payload));
        dispatch(
          showToast({
            message: 'Added to cart',
            severity: ToastSeverity.SUCCESS,
            image: image,
          })
        );
        refresh && refresh();
      }
    }
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(listing.nftAddress + listing.tokenId));
    refresh && refresh();
  };
  const handleSecActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSecActionClose = () => {
    setAnchorEl(null);
  };

  const handlePlaceBid = () => {
    setSelectedTile(listing.tokenId);
    setSelectedAcceptPayments(acceptPayments);
    viewPlaceBidModal();
  };

  const bidButtonRef = useSetAttribute([
    { key: 'id', value: 'bid-button-nodes' },
    { key: 'dusk', value: 'bid-button-nodes' },
  ]);

  return (
    <>
      {loading ? (
        <ConnectingLoader size={undefined} />
      ) : (
        <Box
          sx={{
            'position': 'relative',
            'height': 'auto',
            'width': '100%',
            'border': isCarted ? '4px solid #F3523F' : undefined,
            'aspectRatio': '1/1',
            'padding': '0.5em',
            '& .actionButtons': {
              '& button': { backgroundColor: 'rgba(248, 248, 248, .6)' },
              'visibility': isCarted
                ? 'unset'
                : matches
                ? 'unset'
                : open
                ? 'unset'
                : 'hidden',
            },
            '&::before': {
              content: '""',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              position: 'absolute',
              top: '0px',
              right: '0px',
              left: '0px',
              bottom: '0px',
              opacity: assetType === 'drift' ? 1 : 0.6,
            },
            '&:hover .actionButtons': {
              visibility: 'unset',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: 'relative',
              height: '100%',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                zIndex: '1',
                top: '0',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
                className="actionButtons"
              >
                <Box>
                  <IconButton onClick={handleSecActionClick}>
                    <MoreVertIcon color="primary" />
                  </IconButton>
                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleSecActionClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <MenuList>
                      <Link
                        key={listing.tokenId}
                        href={`/nft/${listing.nftAddress}/${listing.tokenId}`}
                        color="inherit"
                      >
                        <a
                          href={`/nft/${listing.nftAddress}/${listing.tokenId}`}
                        >
                          <MenuItem>
                            <ListItemIcon>
                              <TocIcon />
                            </ListItemIcon>
                            <ListItemText>View details</ListItemText>
                          </MenuItem>
                        </a>
                      </Link>
                    </MenuList>
                  </Popover>
                </Box>
                {/* <Box> */}
                {user?.id && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      flexGrow: 1,
                    }}
                  >
                    <IconButton onClick={likeNFT}>
                      {fav ? (
                        <FavoriteIcon color="primary" />
                      ) : (
                        <FavoriteBorderIcon color="primary" />
                      )}
                    </IconButton>
                    {isOwner || !availablePayment ? (
                      ''
                    ) : (
                      <>
                        {isCarted ? (
                          <IconButton onClick={handleRemoveFromCart}>
                            <RemoveCartIcon />
                          </IconButton>
                        ) : (
                          <>
                            <Tooltip
                              disableFocusListener
                              title="Place a Bid"
                              placement="bottom-start"
                            >
                              <IconButton
                                ref={bidButtonRef}
                                onClick={handlePlaceBid}
                              >
                                <LocalOfferIcon color="primary" />
                              </IconButton>
                            </Tooltip>
                            <IconButton onClick={handleAddToCart}>
                              <AddShoppingCartSharpIcon color="primary" />
                            </IconButton>
                          </>
                        )}
                      </>
                    )}
                  </Box>
                )}
                {/* </Box> */}
              </Box>
            </Box>
            <Box>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant={'lbl-md'}
                    sx={{
                      fontSize: matches ? '12px' : '14px',
                      textAlign: 'left',
                      color:
                        assetType === 'drift'
                          ? 'primary.contrastText'
                          : undefined,
                    }}
                  >
                    PRICE
                  </Typography>
                  <MultiCurrency
                    nftAddress={(listing as any)?.nftAddress}
                    tokenId={(listing as any)?.tokenId}
                    paymentType={(listing as any)?.paymentType}
                    priceWei={(listing as any)?.priceInWei}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant={matches ? 'lbl-lg' : 'h5'}
                    sx={{
                      textAlign: 'left',
                      fontSize: matches ? '18px' : '26px',
                      lineHeight: matches ? '27px' : '40px',
                      color:
                        assetType === 'drift'
                          ? 'primary.contrastText'
                          : undefined,
                    }}
                  >
                    {formatedPrice ? formatNumber(formatedPrice) : '----'}
                  </Typography>{' '}
                  <Typography
                    variant={'lbl-md'}
                    sx={{
                      letterSpacing: '0.02em',
                      fontSize: matches ? '12px' : '14px',
                      textAlign: 'left',
                      marginLeft: '3px',
                      lineHeight: '15px',
                      color:
                        assetType === 'drift'
                          ? 'primary.contrastText'
                          : undefined,
                    }}
                  >
                    {user?.default_currency
                      ? user?.default_currency.replace('USDC', 'USD')
                      : 'USD'}
                  </Typography>
                </Box>
                <Typography
                  variant={'lbl-md'}
                  sx={{
                    lineHeight: '15px',
                    letterSpacing: '0.02em',
                    textAlign: 'left',

                    color:
                      assetType === 'drift'
                        ? 'primary.contrastText'
                        : undefined,

                    visibility:
                      assetType === 'keycards' || assetType === 'capsules'
                        ? 'hidden'
                        : 'unset',
                  }}
                >
                  {assetType === 'origin' || assetType === 'drift'
                    ? type === 'ORIGIN'
                      ? `${formatDecimals(
                          OGnodeRewards,
                          18,
                          false,
                          3
                        )} THOR Pending Rewards`
                      : driftMultiplier !== undefined &&
                        `${driftMultiplier}x Multiplier`
                    : ``}
                  {assetType === 'perks'
                    ? tier === 'BONUS'
                      ? `${voucher ? voucher : 0}THOR Voucher`
                      : `${perkBoost ? perkBoost : 0}%  ` +
                        `${
                          tier !== 'DELTA' && tier !== 'GAMMA'
                            ? 'PERMANENT'
                            : 'TEMPORARY'
                        } REWARD BOOST`
                    : ``}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '4px',
                  marginBottom: '4px',
                }}
              >
                <Typography
                  variant={'lbl-md'}
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    width:
                      assetType === 'origin' || assetType === 'drift'
                        ? '90px'
                        : '150px',
                    whiteSpace: 'nowrap',
                    color:
                      assetType === 'drift'
                        ? 'primary.contrastText'
                        : undefined,
                  }}
                >
                  {listing.nftName}
                </Typography>
                {(assetType === 'origin' || assetType === 'drift') && (
                  <Box
                    sx={{
                      display: 'flex',
                    }}
                  >
                    {solts !== undefined &&
                      solts.map((solt, index) => (
                        <Tract type={solt} key={index} />
                      ))}
                    {isDriftActive !== undefined && (
                      <Typography
                        sx={{
                          padding: '5px 10px',
                          background: !isDriftActive ? '' : '#000000',
                          color: '#F8F8F8',
                          border: !isDriftActive
                            ? '1px solid #000000'
                            : '1px solid #F8F8F8',
                        }}
                        variant={'p-sm'}
                      >
                        {!isDriftActive ? 'INACTIVE' : 'ACTIVE'}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Link href={`/nft/${listing.nftAddress}/${listing.tokenId}`}>
            <a
              href={`/nft/${listing.nftAddress}/${listing.tokenId}`}
              style={{
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '100%',
                height: '100%',
              }}
            >
              <></>
            </a>
          </Link>
        </Box>
      )}
    </>
  );
};

export default ListedGameAssetsCard;
