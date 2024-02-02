import { useMemo } from 'react';
import { useChain } from '@/utils/web3Utils';

import { thorfiNfts } from '@/utils/constants';

import { GameloopAssetsType } from '@/utils/types';
import { GamificationItems, PERK_TYPE_LABELS, PERK_TYPES } from '../types';
import { BigNumber } from 'ethers';

const useFormattedGamificationItems = (assets: GameloopAssetsType) => {
  const chain = useChain();

  return useMemo<GamificationItems>(() => {
    if (!assets) {
      return {
        keycards: [],
        capsules: [],
        perks: [],
      };
    }

    return {
      keycards: assets[4]
        .filter((_item, index) => assets[5][index].isListed === false)
        .map((item) => ({
          contractAddress: thorfiNfts('keycards', chain)[0].contract,
          id: item.tokenId,
          type: 'keycards',
          isOGKey: item.isDirectBurnCard,
          tier: item.isOdinCard ? 'ODIN' : 'THOR',
          isOrigin: item.isDirectBurnCard,
          name: item.name,
        })),
      capsules: assets[0]
        .filter((_item, index) => assets[1][index].isListed === false)
        .map((item) => ({
          contractAddress: thorfiNfts('capsules', chain)[0].contract,
          id: item.tokenId,
          type: 'capsules',
          isOriginCapsule: item.isOriginCapsule,
          isDriftCapsule: !item.isOriginCapsule,
          isOrigin: item.isOriginCapsule,
          name: item.name,
        })),
      perks: assets[2]
        .filter((_item, index) => assets[3][index].isListed === false)
        .map((item) => ({
          contractAddress: thorfiNfts('perks', chain)[0].contract,
          id: item.tokenId,
          type: 'perks',
          perk: {
            perkType: item.perkType.toNumber() as PERK_TYPES,
            duration: item.duration.toNumber(),
            value: item.value,
          },
          isOrigin: (item.nodeType as BigNumber).eq(BigNumber.from('1')),
          isOriginPerk: (item.nodeType as BigNumber).eq(BigNumber.from('1')),
          isDriftPerk: !(item.nodeType as BigNumber).eq(BigNumber.from('1')),
          perkTypeLabel:
            PERK_TYPE_LABELS[item.perkType.toNumber() as PERK_TYPES],
          name: item.name,
        })),
    };
  }, [assets, chain]);
};

export default useFormattedGamificationItems;
