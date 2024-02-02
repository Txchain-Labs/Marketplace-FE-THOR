import React from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

interface State {
  type?: string;
}
const EmptyStateArtwork = ({ type }: State) => {
  const description =
    type === 'owned'
      ? 'no NFTs'
      : type === 'on-sale'
      ? 'no NFTs onsale'
      : type === 'favorited'
      ? 'no favorited NFTs'
      : type === 'active-bids'
      ? 'no active bids'
      : type === 'received-bids'
      ? 'no bids received'
      : '';

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        p: '5%',
        marginTop: 2,
      }}
    >
      <Image
        src={'/images/logo/logo_48_36.svg'}
        width={48}
        height={36}
        alt={'Logo'}
      />
      <Typography variant={'lbl-lg'} color={'text.secondary'} mt={'16px'}>
        You have {description}
      </Typography>
    </Box>
  );
};

export default EmptyStateArtwork;
