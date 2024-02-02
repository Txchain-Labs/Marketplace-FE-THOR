import React, { FC, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
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
  Stack,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TocIcon from '@mui/icons-material/Toc';
import LibraryAddCheckSharpIcon from '@mui/icons-material/LibraryAddCheckSharp';
import UnlistIcon from '@/components/icons/Unlist';
import { palette } from '@/theme/palette';

import { formatNumber } from '@/utils/common';
import { useCollection } from '@/hooks/useCollections';

import { Nft } from '@/models/Nft';
import { ActiveBid } from '@/models/Listing';
import Image from 'next/image';
import { useUnListNFT } from '@/hooks/useNFTDetail';
import { ToastSeverity } from '@/redux/slices/toastSlice';
import { useGetTransaction } from '@/hooks/Marketplace';
import { formatDecimals } from '@/shared/utils/utils';
import { bidType } from '@/utils/constants';

interface ReceivedBidCardProps {
  nft: Nft & ActiveBid;
  avaxPrice?: BigNumberish;
  thorPrice?: BigNumberish;
  width?: string;
  height?: string;
  setAcceptBid: any;
  setAcceptBidType: any;
  setNFTData: any;
  handleAcceptModalClose: any;
  refresh: any;
}

const ReceivedBidCard: FC<ReceivedBidCardProps> = ({
  nft,
  avaxPrice,
  thorPrice,
  width = '209px',
  height,
  setAcceptBid,
  setAcceptBidType,
  setNFTData,
  handleAcceptModalClose,
  refresh,
}) => {
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

  const { data: collection } = useCollection(nft.collection_address);

  const { isSuccess: unlistTransactionSuccess } = useGetTransaction(
    unlistTransactionData?.hash,
    txnToast
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const moreActionsMenuOpen = Boolean(anchorEl);

  const higherPriceUSD = useMemo(() => {
    if (nft && (nft as any).priceInWei) {
      return (
        Number(ethers.utils.formatEther((nft as any)?.priceInWei)) *
        ((nft as any)?.paymentType === '0'
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
  }, [thorPrice, avaxPrice, nft]);
  const listPriceUSD = useMemo(() => {
    if (nft && (nft as any).listingPrice) {
      return (
        Number(ethers.utils.formatEther((nft as any)?.listingPrice)) *
        ((nft as any)?.listingPricePaymentType === '1'
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
  }, [thorPrice, avaxPrice, nft]);

  const handleClickMoreActionsButton = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAcceptHigherBid = () => {
    handleActionsMenuClose();
    setAcceptBid({
      bidPrice: formatDecimals(nft.priceInWei, 18, true),
      bidExpiresAt: nft.expiresAt.toString(),
      paymentType: nft.paymentType ? nft.paymentType : 0,
    });
    setAcceptBidType(nft.bidType === 'OTC' ? bidType.OTC : bidType.DEFAULT);
    setNFTData({
      nftName: nft.name,
      by: 'Thorfi',
      nftImage: nft.img,
      nftAddress: nft.collection_address,
      tokenId: nft.token_id,
    });
    handleAcceptModalClose();
  };

  const handleUnlist = () => {
    unListNFTWrite({
      recklesslySetUnpreparedArgs: [nft?.collection_address, nft?.token_id],
    });
  };

  useEffect(() => {
    refresh();
  }, [unlistTransactionSuccess, refresh]);

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
              <MenuItem divider={true} onClick={handleAcceptHigherBid}>
                <ListItemIcon>
                  <LibraryAddCheckSharpIcon style={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText>Accept Higher Bid</ListItemText>
              </MenuItem>
              <MenuItem divider={true} onClick={handleUnlist}>
                <ListItemIcon>
                  <UnlistIcon />
                </ListItemIcon>
                <ListItemText>Unlist</ListItemText>
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
          <Box flexGrow={1} />
          <Box
            sx={{
              background: palette.primary.storm,
              border: '1px solid',
              borderColor: palette.primary.ash,
              p: '4px 12px',
            }}
          >
            <Typography
              sx={{
                color: palette.primary.ash,
                fontSize: '10px',
                fontWeight: 700,
                lineHeight: 'normal',
                textTransform: 'uppercase',
              }}
            >
              {nft.bidType === 'OTC' ? 'private' : 'simple'}
            </Typography>
          </Box>
        </Box>
        <Box mt={'16px'}>
          <Stack direction={'row'} alignItems={'flex-start'} height={'21px'}>
            <Typography fontSize={'12px'}>List price</Typography>
            <Box flexGrow={1} />
            <Typography
              mr={'5px'}
              fontSize={'14px'}
              fontWeight={700}
              lineHeight={'normal'}
            >
              {nft.listingPrice ? formatNumber(listPriceUSD) : '---'}
            </Typography>
            <Image
              src={'/images/icons/avax.svg'}
              alt={'avax'}
              width={16}
              height={16}
            />
          </Stack>
          <Stack direction={'row'} alignItems={'flex-start'} height={'21px'}>
            <Typography fontSize={'12px'}>Higher bid</Typography>
            <Box flexGrow={1} />
            <Typography
              mr={'5px'}
              fontSize={'14px'}
              fontWeight={700}
              lineHeight={'normal'}
            >
              {formatNumber(higherPriceUSD)}
            </Typography>
            <Image
              src={'/images/icons/avax.svg'}
              alt={'avax'}
              width={16}
              height={16}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default ReceivedBidCard;
