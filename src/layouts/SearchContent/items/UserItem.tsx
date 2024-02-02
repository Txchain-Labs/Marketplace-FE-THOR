import React, { FC } from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material';
import AccessTimeSharpIcon from '@mui/icons-material/AccessTimeSharp';

import { User } from '@/models/User';

import { NextLinkComposed } from '@/components/common/Link';

interface UserItemProps {
  user: User;
  isRecentItem?: boolean;
  onClick: () => void;
}

const UserItem: FC<UserItemProps> = ({
  user,
  isRecentItem = false,
  onClick,
}) => {
  return (
    <ListItem disablePadding disableGutters sx={{ height: '51px' }}>
      <ListItemButton
        sx={{ py: '4px', my: '2px' }}
        to={{
          pathname: `/profile/${user.address}`,
        }}
        component={NextLinkComposed}
        onClick={onClick}
      >
        <ListItemAvatar sx={{ minWidth: '48px' }}>
          <Avatar
            src={user.profile_picture}
            alt={user.username}
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
              {user.username}
            </Typography>
          }
          // secondary={
          //   <Typography
          //     variant={'p-sm'}
          //     fontWeight={300}
          //     lineHeight={'18px'}
          //     color={palette.secondary.storm[70]}
          //     sx={{
          //       overflow: 'hidden',
          //       textOverflow: 'ellipsis',
          //       whiteSpace: 'nowrap',
          //     }}
          //   >
          //     {user.bio}
          //   </Typography>
          // }
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

export default UserItem;
