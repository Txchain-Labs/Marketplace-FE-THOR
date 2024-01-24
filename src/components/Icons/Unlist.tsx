import React, { FC } from 'react';
import Image from 'next/image';
import { Icon } from '@mui/material';

interface UnlistProps {
  size?: 'small' | 'medium';
}

const Unlist: FC<UnlistProps> = () => {
  return (
    <Icon>
      <Image
        alt="unlist"
        src="/images/icons/unlist.svg"
        height={24}
        width={24}
      />
    </Icon>
  );
};

export default Unlist;
