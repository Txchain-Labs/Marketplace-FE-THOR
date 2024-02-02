import React, { FC } from 'react';
import Image from 'next/image';
import { Icon } from '@mui/material';

interface MediumProps {
  size?: 'small' | 'medium';
}

const Medium: FC<MediumProps> = () => {
  return (
    <Icon>
      <Image
        alt="medium"
        src="/images/icons/medium.svg"
        height={24}
        width={24}
      />
    </Icon>
  );
};

export default Medium;
