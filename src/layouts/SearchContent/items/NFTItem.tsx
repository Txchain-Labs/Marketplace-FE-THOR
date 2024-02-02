import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Stack,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material';
import FiberManualRecordSharpIcon from '@mui/icons-material/FiberManualRecordSharp';
import AccessTimeSharpIcon from '@mui/icons-material/AccessTimeSharp';

import { formatPriceByDefaultCurrency } from '@/utils/helper';
import { formatNumber } from '@/utils/common';
import { useCollection } from '@/hooks/useCollections';
import { useGetListingByNft } from '@/hooks/useListings';

import { Nft } from '@/models/Nft';

import { NextLinkComposed } from '@/components/common/Link';
import { CurrencyIcon } from '@/components/common/CurrencyIcon';

interface NFTItemProps {
  nft: Nft;
  avaxPrice: any;
  thorPrice: any;
  isRecentItem?: boolean;
  onClick: () => void;
}

const NFTItem: FC<NFTItemProps> = ({
  nft,
  avaxPrice,
  thorPrice,
  isRecentItem = false,
  onClick,
}) => {
  const user = useSelector((state: any) => state?.auth.user);

  const { data: collection } = useCollection(nft.collection_address);

  const { data: listingData } = useGetListingByNft(
    nft.collection_address,
    Number(nft.token_id)
  );

  const listing = useMemo(() => {
    if (!listingData) return null;

    return listingData.data.data.listings[0];
  }, [listingData]);

  const formattedPrice: number = useMemo(() => {
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

  return (
    <ListItem disablePadding disableGutters sx={{ height: '51px' }}>
      <ListItemButton
        sx={{ py: '4px', my: '2px' }}
        to={{
          pathname: `/nft/${nft.collection_address}/${nft.token_id}`,
        }}
        component={NextLinkComposed}
        onClick={onClick}
      >
        <ListItemAvatar
          sx={{
            minWidth: 'unset',
            width: '38px',
            position: 'relative',
            height: '39px',
            mr: '8px',
          }}
        >
          <Avatar
            src={nft.img}
            alt={nft.name}
            sx={{
              width: '36px',
              height: '36px',
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          />
          <Avatar
            src={collection?.profile_image}
            alt={collection?.name}
            sx={{
              width: '16px',
              height: '16px',
              position: 'absolute',
              right: 0,
              bottom: 0,
              boxShadow: 1,
            }}
          />
        </ListItemAvatar>
        <ListItemText
          disableTypography
          primary={
            <Typography
              variant={'lbl-md'}
              fontWeight={700}
              lineHeight={'21px'}
              // color={palette.primary.storm}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {nft.name}
            </Typography>
          }
          secondary={
            <Stack direction={'row'} alignItems={'center'}>
              <Typography
                variant={'p-sm'}
                fontWeight={300}
                lineHeight={'18px'}
                color={'accent.contrastText'}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '120px',
                }}
              >
                {collection?.name}
              </Typography>
              <FiberManualRecordSharpIcon
                sx={{
                  fontSize: '8px',
                  color: 'accent.contrastText',
                  mx: '4px',
                }}
              />
              <Typography
                variant={'p-sm'}
                fontWeight={300}
                lineHeight={'18px'}
                color={'accent.contrastText'}
              >
                {listing ? formatNumber(formattedPrice) : 'Not listed'}
              </Typography>
              {listing && (
                <Stack ml={'4px'} height={'18px'} lineHeight={'12px'}>
                  <CurrencyIcon defaultCurrency={user?.default_currency} />
                </Stack>
              )}
            </Stack>
          }
          sx={{ m: 0 }}
        />
        {isRecentItem && (
          <ListItemIcon>
            <AccessTimeSharpIcon
              fontSize={'small'}
              sx={{ color: 'accent.contrastText' }}
            />
          </ListItemIcon>
        )}
      </ListItemButton>
    </ListItem>
  );
};

export default NFTItem;
