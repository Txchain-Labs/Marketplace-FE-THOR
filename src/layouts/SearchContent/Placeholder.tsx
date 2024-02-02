import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { palette } from '@/theme/palette';

const Placeholder: FC = () => (
  <Stack
    height={'170px'}
    alignItems={'center'}
    justifyContent={'center'}
    color={palette.secondary.storm[50]}
  >
    <Typography variant={'lbl-md'}>
      Search by Assets, collection or user
    </Typography>
  </Stack>
);

export default Placeholder;
