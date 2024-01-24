import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
const ProfileEmptyState = () => {
  return (
    <Box
      sx={{
        width: '100%',

        border: '2px dashed rgba(0, 0, 0, 0.4)',
        boxSizing: 'border-box',
        textAlign: 'center',
        color: '#808080',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant="sub-h"
        sx={{
          fontFamily: 'Nexa',
          lineHeight: '21px',
          letterSpacing: '0em',
          textAlign: 'center',
          color: '#808080',
          py: 5,
        }}
      >
        No Activity
      </Typography>
    </Box>
  );
};
export default ProfileEmptyState;
