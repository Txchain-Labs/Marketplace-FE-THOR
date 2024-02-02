import { Icon } from '@mui/material';
import Image from 'next/image';

export default function EmptyTract() {
  return (
    <Icon>
      <Image
        alt="empty-tract"
        src="/images/empty-tract.svg"
        height={24}
        width={16}
      />
    </Icon>
  );
}
