import React, { FC } from 'react';
import Image from 'next/image';
import { Stack, Typography } from '@mui/material';
import { palette } from '@/theme/palette';

const NoResult: FC = () => (
  <Stack
    height={'170px'}
    alignItems={'center'}
    justifyContent={'center'}
    color={palette.secondary.storm[70]}
  >
    <Image
      src={'/images/logo/logo_48_36.svg'}
      width={48}
      height={36}
      alt={'Logo'}
    />
    <Typography variant={'lbl-lg'} lineHeight={'21px'} mt={'16px'}>
      No result found
    </Typography>
    <Typography variant={'p-sm'} lineHeight={'18px'}>
      Try adjusting your search
    </Typography>
  </Stack>
);

export default NoResult;
