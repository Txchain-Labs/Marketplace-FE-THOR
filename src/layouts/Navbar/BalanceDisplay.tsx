import React, { FC } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box, Typography } from '@mui/material';

import { formatDecimals } from '@/shared/utils/utils';

import { useBalance } from '@/hooks/useToken';
import { useSelector } from 'react-redux';

const BalanceDisplay: FC = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const avaxBalance = useBalance('AVAX');
  const thorBalance = useBalance('THOR');
  const user = useSelector((state: any) => state?.auth?.user);

  return (
    <Box hidden={smDown}>
      <Box
        display={'flex'}
        fontFamily="Nexa"
        fontStyle="normal"
        fontWeight={300}
        fontSize="14px"
        lineHeight="120%"
        alignItems="baseline"
      >
        {thorBalance && user?.address ? formatDecimals(thorBalance) : '---'}
        <Typography fontWeight={600} fontFamily={'Nexa-Bold'} marginLeft={1}>
          THOR
        </Typography>
        <Typography fontWeight={400} margin="0 20px">
          |
        </Typography>
        {avaxBalance && user?.address ? formatDecimals(avaxBalance) : '---'}
        <Typography fontWeight={600} fontFamily={'Nexa-Bold'} marginLeft={1}>
          AVAX
        </Typography>
      </Box>
    </Box>
  );
};

export default BalanceDisplay;
