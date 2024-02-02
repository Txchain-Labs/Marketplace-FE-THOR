import React, { FC, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useGetNodeRewards, useGetTokenURI } from '@/hooks/useNodes';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import { BigNumberish, ethers } from 'ethers';
import { formatWei, useChain } from '@/utils/web3Utils';
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
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '@/redux/slices/cartSlice';
import RemoveCartIcon from '@/components/common/RemoveCartIcon';
import { useMarketplaceAddress } from '@/hooks/Marketplace';
import { useGetNFTOwner } from '@/hooks/useNFTDetail';
import { showToast, ToastSeverity } from '@/redux/slices/toastSlice';
import { useSetAttribute } from '@/hooks/uiHooks';
import { thorNodesType, ThorTier } from '@/utils/types';
import EmptyTract from '@/components/common/EmptyTract';
import SubTract from '@/components/common/SubTract';
import DTract from '@/components/common/DTract';

interface NodeCardProps {
  listing: Listing;
  isCarted: boolean;
  type: thorNodesType;
  setSelectedTile: any;
  user: any;
  viewPlaceBidModal?: () => void;
  refresh?: () => void;
  tier?: ThorTier;
  isActive?: boolean;
}

const NodeCard: FC<NodeCardProps> = (props) => {
  const {
    listing,
    isCarted,
    type,
    setSelectedTile,
    user,
    viewPlaceBidModal,
    refresh,
    tier,
    isActive,
  } = props;
  const chain = useChain();

  const [fav, setFav] = useState(listing.isLiked);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data: rewards } = useGetNodeRewards(
    listing.nftAddress,
    listing.tokenId,
    type
  );
  const { data: tokenURI } = useGetTokenURI(
    listing.nftAddress,
    listing.tokenId,
    type
  );

  const marketplaceAddress = useMarketplaceAddress();

  const dispatch = useDispatch();

  useEffect(() => {
    setFav(listing?.isLiked);
  }, [listing]);

  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const open = Boolean(anchorEl);
  const matches = useMediaQuery('(max-width:600px)');

  const { data: nftOwner } = useGetNFTOwner(
    listing.nftAddress,
    listing.tokenId
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
  // useSelector((state: any) => state.auth);

  const handleAddToCart = () => {
    const payload: Listing = {
      ...listing,
      metadata,
      image,
      nodeType: type,
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
              xs: '12.5em',
              sm: '12.5em',
              md: '13em',
            },
            'width': {
              xs: '12.5em',
              sm: '12.5em',
              md: '13em',
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              height: '100%',
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
                      <a href={`/nft/${listing.nftAddress}/${listing.tokenId}`}>
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
                </Box>
              )}
              {/* </Box> */}
            </Box>
            <Box>
              <Box>
                <Typography
                  variant={'lbl-md'}
                  sx={{
                    lineHeight: matches ? '18px' : '21px',
                    fontSize: matches ? '12px' : '14px',
                    textAlign: 'left',
                    color: 'black',
                  }}
                >
                  PRICE
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant={matches ? 'lbl-lg' : 'h5'}
                    sx={{
                      textAlign: 'left',
                      fontSize: matches ? '18px' : '26px',
                      lineHeight: matches ? '27px' : '40px',
                      color: 'black',
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
                      color: 'black',
                    }}
                  >
                    USD
                  </Typography>
                </Box>
                <Typography
                  variant={'lbl-md'}
                  sx={{
                    lineHeight: '15px',
                    letterSpacing: '0.02em',
                    textAlign: 'left',
                    color: 'black',
                  }}
                >
                  {formatedRewards} THOR Pending Rewards
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
                    width: type === 'ORIGIN' ? '100px' : '90px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {metadata.name}
                </Typography>
                <Box sx={{ display: 'flex' }}>
                  {type === 'ORIGIN' ? (
                    tier === 'ODIN' ? (
                      <>
                        <SubTract />
                        <SubTract />
                      </>
                    ) : (
                      <>
                        <DTract />
                        <EmptyTract />
                      </>
                    )
                  ) : (
                    <Typography
                      sx={{
                        padding: '5px 10px',
                        background: !isActive ? '' : '#000000',
                        color: !isActive ? '#000000' : '#F8F8F8',
                        border: !isActive
                          ? '1px solid #000000'
                          : '1px solid #F8F8F8',
                      }}
                      variant={'p-sm'}
                    >
                      {!isActive ? 'INACTIVE' : 'ACTIVE'}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default NodeCard;
