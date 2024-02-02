import React, { FC } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const FusingKeycardsLoader: FC = () => {
  return (
    <Box width={'280px'} textAlign={'center'}>
      <LinearProgress />
      <Typography
        variant={'p-sm'}
        fontWeight={300}
        lineHeight={'18px'}
        color={'#4C4C4C'}
        mt={'5px'}
      >
        Fusing keycards
      </Typography>
    </Box>
  );
};

export default FusingKeycardsLoader;
