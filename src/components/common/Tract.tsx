import React, { FC } from 'react';

import Tract0 from '@/components/icons/tracts/Tract0';
import Tract1001 from '@/components/icons/tracts/Tract1001';
import Tract2001 from '@/components/icons/tracts/Tract2001';
import Tract2002 from '@/components/icons/tracts/Tract2002';

interface TractProps {
  type?: number;
}
const Tract: FC<TractProps> = ({ type = 1001 }) => {
  return type === 0 ? (
    <Tract0 viewBox={'0 0 18 26'} sx={{ width: '26px', height: '26px' }} />
  ) : type === 1001 ? (
    <Tract1001 viewBox={'0 0 18 26'} sx={{ width: '26px', height: '26px' }} />
  ) : type === 2001 ? (
    <Tract2001 viewBox={'0 0 19 26'} sx={{ width: '26px', height: '26px' }} />
  ) : type === 2002 ? (
    <Tract2002 viewBox={'0 0 19 26'} sx={{ width: '26px', height: '26px' }} />
  ) : null;
};
export default Tract;
