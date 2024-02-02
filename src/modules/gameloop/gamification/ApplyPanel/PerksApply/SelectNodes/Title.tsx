import React, { FC } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

const Title: FC = () => {
  return (
    <Box mb={'36px'}>
      <Typography variant={'h4'} fontWeight={300} lineHeight={'49px'}>
        Select the NFT you want to apply perk to...
      </Typography>
      <Box display={'flex'} alignItems={'center'}>
        <Typography variant={'p-md'} lineHeight={'24px'}>
          *Perks can be applied to both Odin & Thor NFTs.
        </Typography>
        <Tooltip
          title={
            'Only unlisted active NFTs can participate in GameLoop features'
          }
          placement={'right'}
        >
          <InfoOutlined sx={{ ml: '8px' }} />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Title;
