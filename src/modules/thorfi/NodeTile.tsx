import React, { FC, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useGetNodeRewards, useGetTokenURI } from '../../hooks/useNodes';
import { useGetUsdFromAvax, useGetUsdFromThor } from '../../hooks/useOracle';
import { BigNumberish, ethers } from 'ethers';
import { formatWei } from '../../utils/web3Utils';
import { formatNumber, getJsonFromURI } from '../../utils/common';
import axios from 'axios';
import ConnectingLoader from '../../components/common/ConnectingLoader';
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
import { Listing } from '../../models/Listing';
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/slices/cartSlice';
import RemoveCartIcon from '../../components/common/RemoveCartIcon';
import { useMarketplaceAddress } from '../../hooks/Marketplace';
import { useGetNFTOwner } from '../../hooks/useNFTDetail';
import { showToast, ToastSeverity } from '../../redux/slices/toastSlice';
import { useSetAttribute } from '../../hooks/uiHooks';

interface NodeTileProps {
  listing: Listing;
  isCarted: boolean;
  type: string | undefined;
  contract: string | undefined;
  setSelectedTile: any;
  chain: any;
  user: any;
  viewPlaceBidModal?: () => void;
  refresh?: () => void;
}

const NodeTile: FC<NodeTileProps> = (props) => {
  const {
    listing,
    isCarted,
    type,
    contract,
    setSelectedTile,
    chain,
    user,
    viewPlaceBidModal,
    refresh,
  } = props;

  const [fav, setFav] = useState(listing.isLiked);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data: rewards } = useGetNodeRewards(contract, listing.tokenId, type);
  const { data: tokenURI } = useGetTokenURI(contract, listing.tokenId, type);

  const marketplaceAddress = useMarketplaceAddress();

  const dispatch = useDispatch();

  useEffect(() => {
    setFav(listing?.isLiked);
  }, [listing]);

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const open = Boolean(anchorEl);
  const matches = useMediaQuery('(max-width:600px)');

  const { data: nftOwner } = useGetNFTOwner(contract, listing?.tokenId);

  const isOwner = useMemo(() => {
    const realNftOwner =
      (nftOwner as string)?.toLowerCase() === marketplaceAddress.toLowerCase()
        ? (listing as any)?.seller
        : nftOwner;

    return (
      user?.address?.toLowerCase() === (realNftOwner as string)?.toLowerCase()
    );
  }, [listing, marketplaceAddress, nftOwner, user]);

  const formatedPrice: number = useMemo(() => {
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

  const formatedRewards = useMemo(
    () => (rewards ? formatWei(rewards as string) : '0'),
    [rewards]
  );
  const metadata = useMemo(
    () => getJsonFromURI(tokenURI as string),
    [tokenURI]
  );

  const likeNFT = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/favs/like-unsynced`, {
        user_id: user?.id,
        chainid: chain?.id,
        collection_address: contract,
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
  // useSelector((state: any) => state.auth);

  const handleAddToCart = () => {
    const payload: any = {
      ...listing,
      metadata,
      image,
      type,
    };
    dispatch(addToCart(payload));
    dispatch(
      showToast({
        message: 'Added to cart',
        severity: ToastSeverity.SUCCESS,
        image: image,
      })
    );
    refresh && refresh();
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
            'height': {
              xs: '13em',
              sm: '13em',
              md: '13em',
              lg: '14em',
              xl: '15em',
            },

            'outline': isCarted ? '5px solid #F3523F' : '1px solid #000000',
            'aspectRatio': '1/1',
            'padding': '0.5em',
            '& .actionButtons': {
              visibility: isCarted
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
              opacity: isCarted ? 0 : matches ? 0.3 : open ? 0 : 0.3,
            },
            '&:hover::before': {
              opacity: matches ? 0.3 : 0,
            },
            '&:hover .actionButtons': {
              visibility: 'unset',
            },
          }}
        >
          <Box sx={{ position: 'relative', height: '100%' }}>
            {type === 'DRIFT' ? (
              <Box
                sx={{
                  justifyContent: 'flex-start',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  pb: 1,
                  opacity: 1,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Nexa',
                    fontSize: '1.25em',
                    fontWeight: '400',
                    lineHeight: '1.875',
                    letterSpacing: '-0.02em',
                    textAlign: 'center',
                  }}
                >
                  24
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Nexa',
                    fontSize: '0.563em',
                    fontWeight: '400',
                    lineHeight: '0.875em',
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                  }}
                >
                  DAYS
                </Typography>
              </Box>
            ) : (
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
                <Box>
                  {user?.id && (
                    <>
                      <IconButton onClick={likeNFT}>
                        {fav ? (
                          <FavoriteIcon color="primary" />
                        ) : (
                          <FavoriteBorderIcon color="primary" />
                        )}
                      </IconButton>
                      {isOwner ? (
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
                    </>
                  )}
                </Box>
              </Box>
            )}
            <Box>
              {type === 'DRIFT' ? (
                <Box
                  sx={{
                    background: 'black',
                    borderRadius: '2em',
                    width: '2em',
                    height: '2em',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Nexa',
                      fontSize: '0.563em',
                      fontWeight: '700',
                      lineHeight: '0.75em',
                      letterSpacing: '0em',
                      textAlign: 'center',
                      color: 'white',
                      paddingTop: '1.5em',
                    }}
                  >
                    {metadata?.attributes?.[0]?.value}X
                  </Typography>
                </Box>
              ) : (
                <></>
              )}
              {type === 'OG' && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Nexa',
                      fontSize: '11px',
                      fontWeight: '700',
                      letterSpacing: '0em',
                      textAlign: 'left',
                      color: 'black',
                      opacity: '0.5',
                    }}
                  >
                    Temp:
                  </Typography>
                  <Box
                    sx={{
                      background: 'black',
                      // borderRadius: '2em',
                      width: '2em',
                      height: '2em',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Nexa',
                        fontSize: '0.563em',
                        fontWeight: '700',
                        lineHeight: '0.75em',
                        letterSpacing: '0em',
                        textAlign: 'center',
                        color: 'white',
                        paddingTop: '1.5em',
                      }}
                    >
                      {metadata?.attributes?.[0]?.value}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: 'Nexa',
                      fontSize: '11px',
                      fontWeight: '700',
                      letterSpacing: '0em',
                      textAlign: 'left',
                      color: 'black',
                    }}
                  >
                    Fixed:
                  </Typography>
                  <Box
                    sx={{
                      background: 'black',
                      // borderRadius: '2em',
                      width: '2em',
                      height: '2em',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Nexa',
                        fontSize: '0.563em',
                        fontWeight: '700',
                        lineHeight: '0.75em',
                        letterSpacing: '0em',
                        textAlign: 'center',
                        color: 'white',
                        paddingTop: '1.5em',
                      }}
                    >
                      {metadata?.attributes?.[1]?.value}
                    </Typography>
                  </Box>
                </Box>
              )}
              <Typography
                sx={{
                  fontFamily: 'Nexa',
                  fontSize: '0.75em',
                  fontWeight: '700',
                  lineHeight: '1.137em',
                  letterSpacing: '0em',
                  textAlign: 'left',
                  color: 'black',

                  paddingTop: 1,
                }}
              >
                PRICE
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    fontFamily: 'Nexa',
                    fontSize: { miniMobile: '1.8em', md: '2.5em' },
                    fontWeight: '700',
                    //   lineHeight: '5.306em',
                    letterSpacing: '-0.04em',
                    textAlign: 'left',
                    color: 'black',
                    //   paddingTop: 1
                  }}
                >
                  {formatedPrice ? formatNumber(formatedPrice) : '----'}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: '0.625em',
                    fontWeight: '700',
                    lineHeight: '0.75em',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    color: 'black',
                    pl: 1,
                  }}
                >
                  {/* {listing.paymentType === 1 ? 'THOR' : 'AVAX'} */}
                  USD
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: 'Nexa',
                  fontSize: '10px',
                  fontWeight: '700',
                  lineHeight: '12.3px',
                  letterSpacing: '0em',
                  textAlign: 'left',
                  color: 'black',
                }}
              >
                {formatedRewards} THOR Pending Rewards
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              left: '5px',
              bottom: '5px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              width: '143px',
            }}
          >
            {metadata.name}
          </Box>
        </Box>
      )}
    </>
  );
};

export default NodeTile;
