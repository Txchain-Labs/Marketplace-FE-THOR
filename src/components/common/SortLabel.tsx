import React, { FC } from 'react';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

interface SortLabelProps {
  text: string;
  active?: boolean;
  direction?: 'asc' | 'desc';
}

const SortLabel: FC<SortLabelProps> = ({
  text,
  active = true,
  direction = 'asc',
}) => {
  return (
    <Box display={'flex'} alignItems={'center'}>
      <Typography
        variant="lbl-sm"
        sx={{
          letterSpacing: '0em',
          textAlign: 'right',
          color: '#00000080',
          mr: '8px',
          marginLeft: '5px',
        }}
      >
        {text}
      </Typography>
      <Box
        sx={{
          padding: '5px',
          lineHeight: 0,
        }}
      >
        {active ? (
          <Image
            width={16}
            height={16}
            style={{
              transform: `rotate(${direction === 'asc' ? '0deg' : '180deg'})`,
            }}
            src="/images/icons/sort.svg"
          />
        ) : (
          <Image
            width={16}
            height={16}
            style={{
              transform: `rotate(${direction === 'asc' ? '0deg' : '180deg'})`,
            }}
            src="/images/icons/sort-disabled.svg"
          />
        )}
      </Box>
    </Box>
  );
};

export default SortLabel;
