import React, { FC } from 'react';
import Image from 'next/image';
import Icon, { IconProps } from '@mui/material/Icon';

const Avax: FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Image
        alt={'avax'}
        src={'/images/icons/avax.svg'}
        height={24}
        width={24}
      />
    </Icon>
  );
};

export default Avax;
