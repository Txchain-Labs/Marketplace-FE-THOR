import React, { FC } from 'react';

import { useGetPerk } from '@/hooks/usePerks';

import Tract from '@/components/common/Tract';

interface PerkTrackProps {
  id: number;
}

const PerkTrack: FC<PerkTrackProps> = ({ id }) => {
  const { data } = useGetPerk(id);

  const perkType = data ? (data as any).perkType?.toString() : 0;

  return <Tract type={perkType} />;
};

export default PerkTrack;
