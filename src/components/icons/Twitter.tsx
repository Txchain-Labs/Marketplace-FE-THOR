import React, { FC } from 'react';
import Image from 'next/image';
import { Icon } from '@mui/material';

interface TwitterProps {
  size?: 'small' | 'medium';
}

const Twitter: FC<TwitterProps> = () => {
  return (
    <Icon>
      <Image
        alt="twitter"
        src="/images/icons/twitter.svg"
        height={24}
        width={24}
      />
    </Icon>
  );
};

export default Twitter;
