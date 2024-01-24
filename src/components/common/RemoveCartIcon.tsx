import { Icon } from '@mui/material';
import Image from 'next/image';

export default function RemoveCartIcon() {
  return (
    <Icon>
      <Image
        alt="RemoveCartIcon"
        src="/images/icons/removeCartIcon.svg"
        height={23}
        width={23}
      />
    </Icon>
  );
}
