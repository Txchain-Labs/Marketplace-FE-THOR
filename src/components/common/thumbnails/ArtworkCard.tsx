import React, { FC, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSelector } from '@/redux/store';
import { BigNumberish } from 'ethers';
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
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditIcon from '@mui/icons-material/Edit';
import { presetColors } from '@/themes/palette';

import { bidType } from '@/utils/constants';
import { formatNumber } from '@/utils/common';

import { useGetTransaction, useMarketplaceAddress } from '@/hooks/Marketplace';
import { useGetListingByNft } from '@/hooks/useListings';
import { useGetNFTOwner, useUnListNFT } from '@/hooks/useNFTDetail';

import { Nft } from '@/models/Nft';
import { Collection } from '@/models/Collection';
import { useCollection } from '@/hooks/useCollections';
import { formatPriceByDefaultCurrency } from '@/utils/helper';

import PlaylistRemoveIcon from '@/components/icons/PlaylistRemoveIcon';
import UnlistIcon from '@/components/icons/Unlist';
import { ToastSeverity } from '@/redux/slices/toastSlice';

interface ArtworkCardProps {
  nft: Nft;
  collection?: Collection;
  isLiked?: boolean;
  onLike?: () => void;
  avaxPrice?: BigNumberish;
  thorPrice?: BigNumberish;
  handlePlaceBid?: (nft: Nft, activeBidType: string) => void;
  handleEditList?: (nft: Nft) => void;
  isCarted?: boolean;
  handleCart?: (nft: Nft) => void;
  showingCartIcon?: boolean;
  width?: string;
  height?: string;
}

const ArtworkCard: FC<ArtworkCardProps> = ({
  nft,
  collection,
  isLiked,
  onLike,
  avaxPrice,
  thorPrice,
  handlePlaceBid,
  handleEditList,
  isCarted = false,
  handleCart,
  showingCartIcon = false,
  width = '209px',
  height,
}) => {
  const user = useSelector((state: any) => state.auth.user);

  const { data: fetchedCollection } = useCollection(
    !collection ? nft.collection_address : undefined
  );

  const marketplaceAddress = useMarketplaceAddress();

  const { data: listingData } = useGetListingByNft(
    nft.collection_address,
    Number(nft.token_id)
  );

  const { data: nftOwner } = useGetNFTOwner(
    nft.collection_address,
    Number(nft.token_id)
  );

  const unListNFTToast = {
    message: 'NFT Unlisting...',
    severity: ToastSeverity.INFO,
    image: nft.img,
    autoHideDuration: 5000,
  };
  const txnToast = {
    message: 'NFT Unlisted',
    severity: ToastSeverity.SUCCESS,
    image: nft.img,
    autoHideDuration: 5000,
  };

  const {
    data: unlistTransactionData,
    write: unListNFTWrite,
    // isLoading: unListNFTLoading,
  } = useUnListNFT(unListNFTToast);

  useGetTransaction(unlistTransactionData?.hash, txnToast);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const moreActionsMenuOpen = Boolean(anchorEl);

  const listing = useMemo(() => {
    if (!listingData) return null;

    return listingData?.data?.data?.listings[0];
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

  const onBidClick = () => {
    handlePlaceBid &&
      handlePlaceBid(nft, listing ? bidType.DEFAULT : bidType.OTC);
  };

  const onEditListClick = () => {
    handleEditList && handleEditList(nft);
  };

  const onUnlistClick = () => {
    unListNFTWrite({
      recklesslySetUnpreparedArgs: [nft?.collection_address, nft?.token_id],
    });
  };

  const onCartClick = () => {
    handleCart && handleCart(nft);
  };

  return (
    <Box
      sx={(theme) => ({
        'bgcolor': 'background.paper',
        'width': width,
        'height': height ? height : '314px',
        [theme.breakpoints.down('sm')]: {
          height: height ? height : '261px',
        },
        'm': '2px',
        '&:hover': {
          boxShadow: theme.shadows[1],
        },
        'display': 'flex',
        'flexDirection': 'column',
        'position': 'relative',
        '& .artwork-actions': {
          visibility: moreActionsMenuOpen || isCarted ? 'visible' : 'hidden',
        },
        '&:hover .artwork-actions': {
          visibility: 'visible',
        },
        'border': isCarted ? '3px solid' : 'none',
        'borderColor': theme.palette.primary.main,
      })}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '16px',
          right: '16px',
          top: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          sx={{
            '& .action-button': {
              'p': '4px',
              'backgroundColor': 'rgba(248, 248, 248, .6)',
              '&:hover': {
                bgcolor: presetColors.ash,
              },
            },
          }}
          className={'artwork-actions'}
        >
          <Box>
            <IconButton
              onClick={handleClickMoreActionsButton}
              size={'small'}
              className={'action-button'}
            >
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
              {isOwner && (
                <>
                  {handleEditList && (
                    <MenuItem onClick={onEditListClick}>
                      <ListItemIcon>
                        <EditIcon style={{ color: 'black' }} />
                      </ListItemIcon>
                      <ListItemText>Edit price</ListItemText>
                    </MenuItem>
                  )}
                  {false && (
                    <MenuItem onClick={onUnlistClick}>
                      <ListItemIcon>
                        <UnlistIcon />
                      </ListItemIcon>
                      <ListItemText>Unlist</ListItemText>
                    </MenuItem>
                  )}
                </>
              )}
            </Menu>
          </Box>
          <Box
            sx={{
              '& .action-button:not(:first-child)': {
                marginLeft: '16px',
              },
            }}
          >
            {
              <>
                {user?.address && (
                  <IconButton
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
                )}
                {!isOwner && handlePlaceBid && (
                  <Tooltip title={'Place a bid'} placement={'bottom-start'}>
                    <IconButton
                      onClick={onBidClick}
                      size={'small'}
                      className={'action-button'}
                    >
                      <LocalOfferIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                )}
                {showingCartIcon && (
                  <IconButton
                    onClick={onCartClick}
                    size={'small'}
                    className={'action-button'}
                  >
                    {isCarted ? (
                      <PlaylistRemoveIcon />
                    ) : (
                      <PlaylistAddIcon color="primary" />
                    )}
                  </IconButton>
                )}
              </>
            }
          </Box>
        </Box>
      </Box>
      <Link href={`/nft/${nft.collection_address}/${nft.token_id}`}>
        <a
          href={`/nft/${nft.collection_address}/${nft.token_id}`}
          style={{
            display: 'block',
            width: '100%',
            flex: '1 1',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${nft.img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </a>
      </Link>
      <Box m={'8px 16px 16px 16px'}>
        <Box display={'flex'} alignItems={'center'}>
          <Avatar
            alt={collection?.name ?? fetchedCollection?.name}
            src={
              collection?.profile_image ??
              fetchedCollection?.profile_image ??
              '/images/random.png'
            }
            sx={{
              width: '18px',
              height: '18px',
              marginRight: '4px',
            }}
          />
          <Typography
            variant={'lbl-md'}
            sx={{
              maxWidth: '112px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {nft.name}
          </Typography>
        </Box>
        <Box mt={'12px'}>
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
              {listing ? formatNumber(formatedPrice) : '----'}
            </Typography>
            <Typography variant={'lbl-md'}>
              {user?.default_currency
                ? user?.default_currency.replace('USDC', 'USD')
                : 'USD'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ArtworkCard;
