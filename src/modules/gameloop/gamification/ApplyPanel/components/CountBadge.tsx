import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { palette } from '@/theme/palette';

const POSITION_STYLES = {
  bottomRight: {
    bottom: '20px',
    right: '16px',
  },
  topLeft: {
    top: '20px',
    left: '16px',
  },
};

const POSITION_STYLES_MOBILE = {
  bottomRight: {
    bottom: '14px',
    right: '8px',
  },
  topLeft: {
    top: '14px',
    left: '8px',
  },
};

export type Position = 'bottomRight' | 'topLeft';

interface CountBadgeProps {
  count: number;
  position?: Position;
}

const CountBadge: FC<CountBadgeProps> = ({
  count,
  position = 'bottomRight',
}) => {
  return (
    <Box
      sx={(theme) => ({
        position: 'absolute',
        ...POSITION_STYLES[position],
        width: '32px',
        height: '32px',
        borderRadius: '16px',
        opacity: 0.6,
        backgroundColor: palette.primary.ash,
        color: 'black',
        textAlign: 'center',
        [theme.breakpoints.down('sm')]: POSITION_STYLES_MOBILE[position],
      })}
    >
      <Typography variant={'lbl-md'} lineHeight={'32px'}>
        {count}
      </Typography>
    </Box>
  );
};

export default CountBadge;
