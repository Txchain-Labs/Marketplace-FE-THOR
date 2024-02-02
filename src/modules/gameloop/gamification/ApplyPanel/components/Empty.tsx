import React, { FC } from 'react';

import { GamificationItemType } from '../../types';
import { Grid, Box } from '@mui/material';

interface EmptyProps {
  type: GamificationItemType;
}

const Empty: FC<EmptyProps> = ({ type }) => {
  const label = type === 'capsules' ? 'Capsules' : 'Perks';

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: 600,
      }}
    >
      <Grid container textAlign="center">
        <Grid
          item
          miniMobile={12}
          xs={12}
          sx={(theme) => ({
            fontSize: '14px',
            lineHeight: '17px',
            color: theme.palette.mode === 'dark' ? 'text.secondary' : undefined,
            opacity: theme.palette.mode === 'light' ? 0.24 : undefined,
          })}
        >
          SELECT
        </Grid>
        <Grid
          item
          miniMobile={12}
          xs={12}
          sx={(theme) => ({
            fontSize: '24px',
            lineHeight: '29px',
            color: theme.palette.mode === 'dark' ? 'text.secondary' : undefined,
            opacity: theme.palette.mode === 'light' ? 0.24 : undefined,
          })}
        >
          {label}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Empty;
