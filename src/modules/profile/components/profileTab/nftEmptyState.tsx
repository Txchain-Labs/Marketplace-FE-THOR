import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import React from 'react';

const nftEmptyState = () => {
  return (
    <Box
      sx={{
        width: '230px',
        height: '240px',
        border: '2px dashed rgba(0, 0, 0, 0.4)',
        boxSizing: 'border-box',
        textAlign: 'center',
        color: '#808080',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Image src="/images/emptyNode.svg" height={64} width={55} alt="Twitter" />
      <Typography
        variant="sub-h"
        sx={{
          marginTop: '25px',
          fontFamily: 'Nexa',
          lineHeight: '21px',
          letterSpacing: '0em',
          textAlign: 'center',
          color: '#808080',
        }}
      >
        No Items
      </Typography>
    </Box>
  );
};

export default nftEmptyState;
