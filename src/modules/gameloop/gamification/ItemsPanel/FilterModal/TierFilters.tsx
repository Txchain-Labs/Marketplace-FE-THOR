import React, { FC } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { blockFilterStyle, blockFilterHeaderStyle } from './common/sharedStyle';

import { ThorTier } from '@/utils/types';
// import { FilterGamificationItems } from '../../types';

interface TierFiltersProps {
  filters: any;
  updateFilters: (filter: any, propertiesToRemove?: string[]) => void;
}

const TierFilters: FC<TierFiltersProps> = ({ filters, updateFilters }) => {
  return (
    <Grid container sx={blockFilterStyle}>
      <Box sx={blockFilterHeaderStyle}>
        <Typography variant="p-lg">Warrior</Typography>
        <Button size={'small'} onClick={() => updateFilters(null, ['tier'])}>
          VIEW ALL
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flex: '1 1 100%',
        }}
      >
        {['THOR', 'ODIN'].map((tier) => (
          <Box
            sx={{
              'cursor': `url("/images/cursor-pointer.svg"), auto`,

              '&:first-of-type': {
                marginRight: '8px',
              },
            }}
            key={tier}
            onClick={() => updateFilters({ tier: tier as ThorTier })}
          >
            <img
              src={`/images/thorfi/gamification/filter-${tier}${
                filters?.tier && filters?.tier !== tier ? '-grayed-out' : ''
              }.png`}
              alt=""
            />
          </Box>
        ))}
      </Box>
    </Grid>
  );
};

export default TierFilters;
