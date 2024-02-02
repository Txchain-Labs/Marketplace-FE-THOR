import React, { FC } from 'react';
import Image from 'next/image';
import { Icon } from '@mui/material';

interface DiscordProps {
  size?: 'small' | 'medium';
}

const Discord: FC<DiscordProps> = () => {
  return (
    <Icon>
      <Image
        alt="discord"
        src="/images/icons/discord.svg"
        height={24}
        width={24}
      />
    </Icon>
  );
};

export default Discord;
