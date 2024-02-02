import React, { FC } from 'react';
import { ethers } from 'ethers';
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

import { convertPriceFromUSD, formatNumber } from '@/utils/common';

import { Collection } from '@/models/Collection';

import { NextLinkComposed } from '@/components/common/Link';
import { CurrencyIcon } from '@/components/common/CurrencyIcon';

interface CollectionItemProps {
  collection: Collection;
  avaxPrice: any;
  thorPrice: any;
  isRecentItem?: boolean;
  onClick: () => void;
}

const CollectionItem: FC<CollectionItemProps> = ({
  collection,
  avaxPrice,
  thorPrice,
  isRecentItem = false,
  onClick,
}) => {
  const user = useSelector((state: any) => state?.auth.user);

  const floorPrice = avaxPrice
    ? Number(ethers.utils.formatEther(collection.floor_price ?? 0)) *
      Number(ethers.utils.formatEther(avaxPrice))
    : 0;

  return (
    <ListItem disablePadding disableGutters sx={{ height: '51px' }}>
      <ListItemButton
        sx={{ py: '4px', my: '2px' }}
        to={{
          pathname: `/collection/${collection.address}`,
        }}
        component={NextLinkComposed}
        onClick={onClick}
      >
        <ListItemAvatar sx={{ minWidth: '48px' }}>
          <Avatar
            src={collection.profile_image}
            alt={collection.name}
            sx={{ width: '36px', height: '36px' }}
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
              {collection.name}
            </Typography>
          }
          secondary={
            <Stack direction={'row'} alignItems={'center'}>
              <Typography
                variant={'p-sm'}
                fontWeight={300}
                lineHeight={'18px'}
                color={'accent.contrastText'}
              >
                {collection.collection_size
                  ? formatNumber(
                      +collection.collection_size,
                      +collection.collection_size > 999 ? 1 : 0
                    )
                  : '---'}
                {' Items'}
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
                Floor price{' '}
                {formatNumber(
                  convertPriceFromUSD(
                    floorPrice,
                    avaxPrice,
                    thorPrice,
                    user?.default_currency
                  )
                )}
              </Typography>
              <Stack ml={'4px'} height={'18px'} lineHeight={'12px'}>
                <CurrencyIcon defaultCurrency={user?.default_currency} />
              </Stack>
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

export default CollectionItem;
