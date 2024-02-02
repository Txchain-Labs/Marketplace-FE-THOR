import { useGetPerk } from '@/hooks/usePerks';
import { useMemo } from 'react';
import { getPerkTier } from './Helper';
import SubTract from '@/components/common/SubTract';
import DTract from '@/components/common/DTract';
import GTract from '@/components/common/GTract';

interface perk {
  perkId: number;
}

const GetPerk = ({ perkId }: perk) => {
  const { data: perkData } = useGetPerk(perkId);
  const type = useMemo(() => {
    return getPerkTier(
      Number((perkData as any)?.perkType?.toString()),
      Number((perkData as any)?.value?.toString())
    );
  }, [perkData]);
  return type === 'SIGMA' ? (
    <SubTract />
  ) : type === 'DELTA' ? (
    <DTract />
  ) : (
    <GTract />
  );
};
export default GetPerk;
