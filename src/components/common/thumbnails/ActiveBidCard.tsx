import React, { FC, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSelector } from '@/redux/store';
import { ToastSeverity } from '@/redux/slices/toastSlice';
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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TocIcon from '@mui/icons-material/Toc';
import DeleteIcon from '@mui/icons-material/Delete';
import { palette } from '@/theme/palette';

import { formatPriceByDefaultCurrency } from '@/utils/helper';
import { formatNumber } from '@/utils/common';
import { useCollection } from '@/hooks/useCollections';
import {
  useCancelBid,
  useCancelOtcBid,
  useGetTransaction,
} from '@/hooks/Marketplace';

import { Nft } from '@/models/Nft';
import { ActiveBid } from '@/models/Listing';

interface ActiveBidCardProps {
  nft: Nft & ActiveBid;
  avaxPrice?: BigNumberish;
  thorPrice?: BigNumberish;
  width?: string;
  height?: string;
}

const ActiveBidCard: FC<ActiveBidCardProps> = ({
  nft,
  avaxPrice,
  thorPrice,
  width = '209px',
  height,
}) => {
  const user = useSelector((state: any) => state.auth.user);

  const cancelBidToast = {
    message: 'Bid Cancelling...',
    severity: ToastSeverity.INFO,
    image: nft.img,
    autoHideDuration: 5000,
  };
  const txnToast = {
    message: 'Bid Cancelled',
    severity: ToastSeverity.SUCCESS,
    image: nft.img,
    autoHideDuration: 5000,
  };

  const { data: collection } = useCollection(nft.collection_address);

  const { data: cancelOtcBidData, write: writeCancelOtcBid } =
    useCancelOtcBid(cancelBidToast);
  const { data: cancelSimpleBidData, write: writeCancelSimpleBid } =
    useCancelBid(cancelBidToast);
  useGetTransaction(
    cancelOtcBidData?.hash || cancelSimpleBidData?.hash,
    txnToast
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const moreActionsMenuOpen = Boolean(anchorEl);

  const formatedPrice = useCallback(
    (priceInWei: BigNumberish, paymentType: string) => {
      if (priceInWei) {
        return formatPriceByDefaultCurrency(
          priceInWei,
          paymentType,
          user?.default_currency,
          avaxPrice,
          thorPrice
        );
      } else {
        return 0;
      }
    },
    [avaxPrice, thorPrice, user?.default_currency]
  );

  const handleClickMoreActionsButton = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveBidClick = () => {
    if (nft.bidType === 'OTC') {
      writeCancelOtcBid({
        recklesslySetUnpreparedArgs: [nft.collection_address, nft.token_id],
      });
    } else if (nft.bidType === 'ORDER') {
      writeCancelSimpleBid({
        recklesslySetUnpreparedArgs: [nft.collection_address, nft.token_id],
      });
    }
  };

  return (
    <Box
      sx={(theme) => ({
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
          visibility: moreActionsMenuOpen ? 'visible' : 'hidden',
        },
        '&:hover .artwork-actions': {
          visibility: 'visible',
        },
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
                backgroundColor: palette.primary.ash,
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
                  <MenuItem divider={true}>
                    <ListItemIcon>
                      <TocIcon style={{ color: 'black' }} />
                    </ListItemIcon>
                    <ListItemText>View details</ListItemText>
                  </MenuItem>
                </a>
              </Link>
              <MenuItem onClick={handleRemoveBidClick} divider={true}>
                <ListItemIcon>
                  <DeleteIcon style={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText>Remove bid</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
          <Box
            sx={{
              '& .action-button:not(:first-child)': {
                marginLeft: '16px',
              },
            }}
          ></Box>
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
            alt={collection?.name}
            src={collection?.profile_image ?? '/images/random.png'}
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
          <Typography variant={'lbl-md'}>BID PRICE</Typography>
          <Box display={'flex'} alignItems={'center'}>
            <Typography
              sx={{
                fontWeight: 300,
                fontSize: '32px',
                lineHeight: '48px',
                marginRight: '8px',
              }}
            >
              {formatNumber(
                formatedPrice(nft.priceInWei, nft.paymentType.toString())
              ) || '----'}
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

export default ActiveBidCard;
