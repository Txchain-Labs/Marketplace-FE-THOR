import React, { FC } from 'react';

import { ThorTier } from '@/utils/types';
import Toggle from '@/components/common/Toggle';

const TIERS: ThorTier[] = ['THOR', 'ODIN'];

interface TiersFilterProps {
  selectedTier: ThorTier;
  onSelectedTierChange: (tier: ThorTier) => void;
}

const TiersFilter: FC<TiersFilterProps> = ({
  selectedTier,
  onSelectedTierChange,
}) => {
  const onChange = (tier: string) => {
    onSelectedTierChange(tier as ThorTier);
  };

  return <Toggle options={TIERS} value={selectedTier} onChange={onChange} />;
};

export default TiersFilter;
