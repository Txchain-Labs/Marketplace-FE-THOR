import React, { FC, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from '../../../redux/store';
import { BigNumberish, ethers } from 'ethers';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TocIcon from '@mui/icons-material/Toc';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import RemoveCartIcon from '../RemoveCartIcon';

import { addToCart, removeFromCart } from '../../../redux/slices/cartSlice';
import { showToast, ToastSeverity } from '../../../redux/slices/toastSlice';

import { bidType } from '../../../utils/constants';
import { formatNumber } from '../../../utils/common';

import { useMarketplaceAddress } from '../../../hooks/Marketplace';
import { useGetListingByNft } from '../../../hooks/useListings';
import { useGetNFTOwner } from '../../../hooks/useNFTDetail';

import PlaceBid from '../../modals/PlaceBid';

import { Nft } from '../../../models/Nft';
import { Collection } from '../../../models/Collection';

interface ArtworkCardProps {
  nft: Nft;
  collection?: Collection;
  isLiked?: boolean;
  onLike?: () => void;
  avaxPrice: undefined | BigNumberish;
  thorPrice: undefined | BigNumberish;
  isCarted?: boolean;
  refresh?: () => void;
}

const ArtworkCard: FC<ArtworkCardProps> = ({
  nft,
  collection,
  isLiked,
  onLike,
  avaxPrice,
  thorPrice,
  isCarted,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const marketplaceAddress = useMarketplaceAddress();

  const { data: listingData } = useGetListingByNft(
    nft.collection_address,
    Number(nft.token_id)
  );

  const { data: nftOwner } = useGetNFTOwner(
    nft.collection_address,
    Number(nft.token_id)
  );

  const [isBidModalOpen, setIsBidModalOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const moreActionsMenuOpen = Boolean(anchorEl);

  const listing = useMemo(() => {
    if (!listingData) return null;

    return listingData.data.data.listings[0];
  }, [listingData]);

  const _nftOwner = useMemo(() => {
    if (
      (nftOwner as string)?.toLowerCase() === marketplaceAddress.toLowerCase()
    ) {
      return (listing as any)?.sellerAddress;
    }
    return nftOwner;
  }, [listing, nftOwner, marketplaceAddress]);

  const isOwner = useMemo(() => {
    return (
      user?.address?.toLowerCase() === (_nftOwner as string)?.toLowerCase()
    );
  }, [_nftOwner, user]);

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

  const handleClickMoreActionsButton = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLikeNFT = () => {
    onLike && onLike();
  };

  const handleOpenPlaceBid = () => {
    setIsBidModalOpen(true);
  };

  const handleCloseBidModal = () => {
    setIsBidModalOpen(false);
  };

  const handleAddToCart = () => {
    const payload: any = {
      ...listing,
      metadata: {
        name: nft.name,
        description: '',
      },
      image: nft.img,
      type: 'ARTWORK',
    };
    dispatch(addToCart(payload));
    dispatch(
      showToast({
        message: 'Added to cart',
        severity: ToastSeverity.SUCCESS,
        image: nft.img,
      })
    );
    // refresh && refresh();
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(listing.nftAddress + listing.tokenId));
    // refresh && refresh();
  };

  return (
    <Box
      sx={(theme) => ({
        'height': '100%',
        'position': 'relative',
        'border': isCarted ? '5px solid' : undefined,
        'borderColor': theme.palette.primary.main,
        '& .artwork-actions': {
          visibility: moreActionsMenuOpen || isCarted ? 'visible' : 'hidden',
        },
        '&:hover .artwork-actions': {
          visibility: 'visible',
        },
        '& .background-image': {
          opacity: moreActionsMenuOpen || isCarted ? 0 : 0.7,
        },
        '&:hover .background-image': {
          opacity: 0,
        },
      })}
    >
      <img
        src={nft.img}
        width={'100%'}
        height={'100%'}
        className={'background-image'}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          className={'artwork-actions'}
        >
          <Box>
            <IconButton onClick={handleClickMoreActionsButton}>
              <MoreVertIcon color="primary" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={moreActionsMenuOpen}
              onClose={handleActionsMenuClose}
              transformOrigin={{ horizontal: 'left', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
              <Link
                href={`/nft/${nft.collection_address}/${nft.token_id}`}
                color="inherit"
              >
                <a href={`/nft/${nft.collection_address}/${nft.token_id}`}>
                  <MenuItem>
                    <ListItemIcon>
                      <TocIcon style={{ color: 'black' }} />
                    </ListItemIcon>
                    <ListItemText>View details</ListItemText>
                  </MenuItem>
                </a>
              </Link>
              {/*<MenuItem>*/}
              {/*  <ListItemIcon>*/}
              {/*    <EditIcon style={{ color: 'black' }} />*/}
              {/*  </ListItemIcon>*/}
              {/*  <ListItemText>Edit price</ListItemText>*/}
              {/*</MenuItem>*/}
              {/*<MenuItem>*/}
              {/*  <ListItemIcon>*/}
              {/*    <UnlistIcon />*/}
              {/*  </ListItemIcon>*/}
              {/*  <ListItemText>Unlist</ListItemText>*/}
              {/*</MenuItem>*/}
            </Menu>
          </Box>
          <Box>
            {user?.id && (
              <>
                <IconButton onClick={handleLikeNFT}>
                  {isLiked ? (
                    <FavoriteIcon color="primary" />
                  ) : (
                    <FavoriteBorderIcon color={'primary'} />
                  )}
                </IconButton>
                <Tooltip title={'Place a bid'} placement={'bottom-start'}>
                  <IconButton onClick={handleOpenPlaceBid} hidden={isOwner}>
                    <LocalOfferIcon color="primary" />
                  </IconButton>
                </Tooltip>
                {listing &&
                  (isCarted ? (
                    <IconButton onClick={handleRemoveFromCart}>
                      <RemoveCartIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={handleAddToCart}>
                      <AddShoppingCartSharpIcon color="primary" />
                    </IconButton>
                  ))}
              </>
            )}
          </Box>
        </Box>
        <Box flexGrow={1} display={'flex'} flexDirection={'column'}>
          <Box mt={'8px'} hidden={!listing}>
            <Typography variant={'lbl-md'}>PRICE</Typography>
            <Box display={'flex'} alignItems={'center'}>
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: '32px',
                  lineHeight: '48px',
                  marginRight: '8px',
                }}
              >
                {formatNumber(formatedPrice)}
              </Typography>
              <Typography variant={'lbl-md'}>USD</Typography>
            </Box>
          </Box>
          <Box flexGrow={1} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              src={collection?.profile_image || '/images/random.png'}
              alt={collection?.name}
              sx={{
                width: '24px',
                height: '24px',
                marginRight: '8px',
              }}
            />
            <Typography
              variant={'lbl-md'}
              sx={{
                lineHeight: '20px',
                flexGrow: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {nft.metadata ? JSON.parse(nft.metadata).name : nft.name}
            </Typography>
          </Box>
        </Box>
      </Box>
      {isBidModalOpen && (
        <PlaceBid
          open={isBidModalOpen}
          handleClose={handleCloseBidModal}
          openToast={undefined}
          collectionAddress={nft.collection_address}
          tokenId={Number(nft.token_id)}
          nft={{
            image: nft.img,
            title: nft.metadata ? JSON.parse(nft.metadata).name : nft.name,
          }}
          activeBidType={listing ? bidType.DEFAULT : bidType.OTC}
        />
      )}
    </Box>
  );
};

export default ArtworkCard;
