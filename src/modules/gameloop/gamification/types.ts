import { BigNumberish, BigNumber } from 'ethers';
import { ThorTier } from '@/utils/types';

export enum PERK_TYPES {
  PERK_TYPE_BOOST_PERM10 = 1001,
  PERK_TYPE_BOOST_TEMP35 = 2002,
  PERK_TYPE_BOOST_TEMP50 = 2001,
  PERK_TYPE_VOUCHER200 = 3001,
}

export type GamificationItemType = 'keycards' | 'capsules' | 'perks';
export type PerkTypeLabel = 'gamma' | 'delta' | 'sigma' | 'bonus';

export const PERK_TYPE_LABELS: { [key in PERK_TYPES]: PerkTypeLabel } = {
  [PERK_TYPES.PERK_TYPE_BOOST_PERM10]: 'sigma',
  [PERK_TYPES.PERK_TYPE_BOOST_TEMP35]: 'gamma',
  [PERK_TYPES.PERK_TYPE_BOOST_TEMP50]: 'delta',
  [PERK_TYPES.PERK_TYPE_VOUCHER200]: 'bonus',
};

type BaseGamificationItem = {
  contractAddress: string;
  id: BigNumberish;
  type: GamificationItemType;
  isOrigin: boolean;
  name?: string;
};

export type PerkDetails = {
  perkType: PERK_TYPES;
  duration: number;
  value: BigNumber;
};

export type KeyCardItem = {
  tier: ThorTier;
  isOGKey: boolean;
};

export type CapsuleItem = {
  isOriginCapsule: boolean;
  isDriftCapsule: boolean;
};

export type PerkItem = {
  perk: PerkDetails;
  isOriginPerk: boolean;
  isDriftPerk: boolean;
  perkTypeLabel: PerkTypeLabel;
};

export type GamificationItem<T = unknown> = BaseGamificationItem & T;

export type GamificationItems = {
  keycards: GamificationItem<KeyCardItem>[];
  capsules: GamificationItem<CapsuleItem>[];
  perks: GamificationItem<PerkItem>[];
};

export type FilterGamificationItems = {
  isOrigin: boolean | null;
  tier: ThorTier | null;
  perkTypeLabel: PerkTypeLabel | null;
};
