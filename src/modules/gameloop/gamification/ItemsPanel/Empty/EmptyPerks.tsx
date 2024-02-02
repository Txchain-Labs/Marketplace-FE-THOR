import React, { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { NextLinkComposed } from '@/components/common/Link';

const EmptyKeycards: FC = () => {
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
      <img src="/images/manager/perk/perkEmpty.png" alt="Empty" />
      <Typography variant="p-lg" color={'text.secondary'} mt={2}>
        You have no Perks
      </Typography>
      <Typography variant="caption" color={'text.secondary'} mt={1}>
        Get them opening Capsules or Buy them
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          color={'secondary'}
          sx={{ minWidth: '165px', marginTop: 2 }}
          to={{
            pathname: '/gameloop/gamification/capsules',
          }}
          component={NextLinkComposed}
        >
          <Typography variant="lbl-md">Go to Capsules</Typography>
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ minWidth: '165px', marginTop: 2 }}
          to={{
            pathname: '/buyassets/perks',
          }}
          component={NextLinkComposed}
        >
          <Typography variant="lbl-md">Buy Perks</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default EmptyKeycards;
