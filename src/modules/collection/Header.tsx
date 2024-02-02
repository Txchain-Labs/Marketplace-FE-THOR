import React, { FC } from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';

import { Collection } from '@/models/Collection';

import { NextLinkComposed } from '@/components/common/Link';

interface HeaderProps {
  collection: Collection;
}

const Header: FC<HeaderProps> = ({ collection }) => {
  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        height: '200px',
        mb: '39px',
        overflow: 'visible',
        [theme.breakpoints.down('sm')]: {
          height: '148px',
          mb: '32px',
        },
        color: collection.cover_image ? 'background.default' : 'text.secondary',
        bgcolor: 'accent.main',
        backgroundImage: collection.cover_image
          ? `url(${collection.cover_image})`
          : `url(/images/placeholder.svg)`,
        backgroundSize: collection.cover_image ? 'cover' : 'auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative',
      })}
    >
      <Button
        to={{
          pathname: '/explore/collections',
        }}
        component={NextLinkComposed}
        sx={{
          'position': 'absolute',
          'left': '14px',
          'top': '14px',
          'color': 'inherit',
          '&:hover': { color: 'inherit' },
          'textTransform': 'none',
          'px': '16px',
        }}
      >
        <ArrowBackIos /> <Typography variant="lbl-md">Explore</Typography>
      </Button>
      <Avatar
        sx={(theme) => ({
          position: 'absolute',
          left: '108px',
          bottom: '-39px',
          width: '78px',
          height: '78px',
          boxShadow: theme.shadows[1],
          [theme.breakpoints.down('sm')]: {
            width: '64px',
            height: '64px',
            left: '16px',
            bottom: '-32px',
          },
        })}
        alt={collection.name}
        src={collection.profile_image}
      />
      {/*<IconButton*/}
      {/*  sx={(theme) => ({*/}
      {/*    'position': 'absolute',*/}
      {/*    'right': '108px',*/}
      {/*    'bottom': '25px',*/}
      {/*    'color': 'inherit',*/}
      {/*    '&:hover': { color: 'inherit' },*/}
      {/*    'fontSize': '16px',*/}
      {/*    'zIndex': 1,*/}
      {/*    [theme.breakpoints.down('sm')]: {*/}
      {/*      right: '16px',*/}
      {/*      top: '16px',*/}
      {/*      bottom: 'unset',*/}
      {/*      fontSize: '18px',*/}
      {/*    },*/}
      {/*  })}*/}
      {/*>*/}
      {/*  <ShareSharp fontSize={'inherit'} />*/}
      {/*</IconButton>*/}
    </Box>
  );
};

export default Header;
