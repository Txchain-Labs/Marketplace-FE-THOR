import React from 'react';
import { Chain } from 'wagmi';
import { avalanche /* avalancheFuji */ } from 'wagmi/chains';
import contractReferences from './contractsReferences.json';
import { GameloopAssetsType } from './types';
import type { ThorTier } from './types';
import AvaxIcon from '@/components/icons/currencies/Avax';
import ThorIcon from '@/components/icons/currencies/Thor';
import UsdceIcon from '@/components/icons/currencies/Usdce';
import { Currency } from '@/components/common/CurrencySelect/CurrencySelect';
// import { BigNumber } from 'ethers';

export const bidType = {
  DEFAULT: 'default',
  OTC: 'otc',
};

export const assetsType = ['artwork', 'nodes', 'keycards', 'capsules', 'perks'];
export const assetsType_ext = [
  'artwork',
  'origin',
  'drift',
  'keycards',
  'capsules',
  'perks',
];

export const nodeType = ['ORIGIN', 'DRIFT'];

export const tier = {
  ODIN: 0,
  THOR: 1,
  SIGMA: 1001,
  DELTA: 2001,
  BONUS: 3001,
  GAMMA: 2002,
};

type ContractsReferencesType = {
  [key: number]: {
    contracts: {
      [key: string]: string;
    };
  };
};

const ContractsReferences: ContractsReferencesType =
  contractReferences as unknown as ContractsReferencesType;

export enum SupportedChains {
  Avalanche = 43114,
  Fuji = 43113,
  Localhost = 31337,
}

export type AddressString = `0x${string}`;
// const BIG_ZERO = BigNumber.from(0);
export const tokensMainnet = {
  AVAX: '0x0000000000000000000000000000000000000000',
  THOR: '0x8F47416CaE600bccF9530E9F3aeaA06bdD1Caa79',
  USDCE: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
};
export const tokensFuji = {
  AVAX: '0x0000000000000000000000000000000000000000',
  THOR: '0xb529782800e4a0feac1A01aE410E99E90c4C28AB',
  USDCE: '0x4de3AB78287A8930eBd2cC95ABC2a24221412521',
};

export const thorTokenAddress = (chain: Chain | undefined) => {
  if (chain) {
    if (chain.id === 43113) {
      return tokensFuji['THOR'];
    }
    if (chain.id === 43114) {
      return tokensMainnet['THOR'];
    }
    return tokensMainnet['THOR'];
  }
  return tokensMainnet['THOR'];
};

export const usdceTokenAddress = (chain: Chain | undefined) => {
  if (chain) {
    if (chain.id === 43113) {
      return tokensFuji['USDCE'];
    }
    if (chain.id === 43114) {
      return tokensMainnet['USDCE'];
    }
    return tokensMainnet['USDCE'];
  }
  return tokensMainnet['USDCE'];
};

export type TokenNameType = keyof typeof tokensMainnet;

export const DEFAULT_CHAIN_ID = 43114; // 43114
export const defaultChain = avalanche; //avalanche

export const TOKEN_CONTRACT = '0x8F47416CaE600bccF9530E9F3aeaA06bdD1Caa79';

type SubgraphMap = {
  [key: number]: string;
};

// const subgraph: SubgraphMap = {
//   43113: `https://api.thegraph.com/subgraphs/name/forseticameron/thor-marketplace`,
//   43114: `https://api.thegraph.com/subgraphs/name/forseticameron/thorfi-marketplace`,
//   // 43114: `https://api.thegraph.com/subgraphs/name/forseticameron/test-thorfi`,
// };
const subgraph: SubgraphMap = {
  43113: `${process.env.NEXT_PUBLIC_BACKEND_URL}/subgraphs/43113`,
  43114: `${process.env.NEXT_PUBLIC_BACKEND_URL}/subgraphs/43114`,
};

// const DRIFT_ODIN = '';
// const DRIFT_THOR = '';

// const DRIFT_ODIN_FUJI = '0x6bD051664aaBdE5398E3Fd77BE1BF5Ed83484f68';
// const DRIFT_THOR_FUJI = '0x609dfb159EA5773708A97A954713dB9CbFB9D5f5';

export const getSubgraphUrl = (chainId: number | undefined) => {
  return subgraph[chainId];
};

export type ThorfiNFTType = 'nodes' | 'capsules' | 'keycards' | 'perks';
export type ThorfiNFTType_ext =
  | 'origin'
  | 'drift'
  | 'capsules'
  | 'keycards'
  | 'perks';

export const feePercentage = 2;

export const thorfiNfts = (
  type: ThorfiNFTType = 'nodes',
  chain: Chain | undefined
) => {
  if (chain === undefined) {
    chain = defaultChain;
  }
  const obj = {
    nodes: [
      {
        name: 'Origin Odin Node',
        nodeType: 'ORIGIN',
        tier: 'ODIN',
        contract: ContractsReferences[chain.id]?.contracts.OGNodeOdin,
        poster: '/images/odinOrigin.png',
        video: '/images/manager/videos/Odin Origin NFT Node (Light).mp4',
      },
      {
        name: 'Origin Thor Node',
        nodeType: 'ORIGIN',
        tier: 'THOR',
        contract: ContractsReferences[chain.id]?.contracts.OGNodeThor,
        poster: '/images/thorOrigin.png',
        video: '/images/manager/videos/Thor Origin NFT Node (Light).mp4',
      },
      {
        name: 'Drift Odin Node',
        nodeType: 'DRIFT',
        tier: 'ODIN',
        contract: ContractsReferences[chain.id]?.contracts.DriftNodeOdin,
        poster: '/images/odinDrift.png',
        video: '/images/manager/videos/Odin Drift NFT Node (Light) .mp4',
      },
      {
        name: 'Drift Thor Node',
        nodeType: 'DRIFT',
        tier: 'THOR',
        contract: ContractsReferences[chain.id]?.contracts.DriftNodeThor,
        poster: '/images/thorDrift.png',
        video: '/images/manager/videos/Thor Drift NFT Node (Light).mp4',
      },
    ],
    keycards: [
      {
        name: 'Origin Odin Keycard',
        nodeType: 'ORIGIN',
        tier: 'ODIN',
        contract: ContractsReferences[chain.id]?.contracts.ThorKeyNFT,
        poster: '/images/manager/stills/odincard_rare.png',
        video: '/images/manager/videos/Odin_card_rare.mp4',
      },
      {
        name: 'Origin Thor Keycard',
        nodeType: 'ORIGIN',
        tier: 'THOR',
        contract: ContractsReferences[chain.id]?.contracts.ThorKeyNFT,
        poster: '/images/manager/stills/thorcard_rare.png',
        video: '/images/manager/videos/Thor_card_rare.mp4',
      },
      {
        name: 'Drift Odin Keycard',
        nodeType: 'DRIFT',
        tier: 'ODIN',
        contract: ContractsReferences[chain.id]?.contracts.ThorKeyNFT,
        poster: '/images/manager/stills/odincard_normal.png',
        video: '/images/manager/videos/Odin_card_normal.mp4',
      },
      {
        name: 'Drift Thor Keycard',
        nodeType: 'DRIFT',
        tier: 'THOR',
        contract: ContractsReferences[chain.id]?.contracts.ThorKeyNFT,
        poster: '/images/manager/stills/thorcard_normal.png',
        video: '/images/manager/videos/Thor_card_normal.mp4',
      },
    ],
    capsules: [
      {
        name: 'Origin Capsule',
        nodeType: 'ORIGIN',
        tier: '',
        contract: ContractsReferences[chain.id]?.contracts.ThorCapsuleNFT,
        poster: '/images/manager/stills/OriginCapsule.jpg',
        video: '/images/manager/videos/Origin_capsule_closed.mp4',
      },
      {
        name: 'Drift Keycard',
        nodeType: 'DRIFT',
        tier: '',
        contract: ContractsReferences[chain.id]?.contracts.ThorCapsuleNFT,
        poster: '/images/manager/stills/DriftCapsule.jpg',
        video: '/images/manager/videos/Drift_capsule_closed.mp4',
      },
    ],
    perks: [
      {
        name: 'Sigma Perk',
        nodeType: '',
        tier: 'SIGMA',
        contract: ContractsReferences[chain.id]?.contracts.ThorPerkNFT,
        poster: '/images/manager/stills/Origin_sigma.png',
        video: '/images/manager/videos/Origin_capsule_sigma_perknft.mp4',
      },
      {
        name: 'Delta Perk',
        nodeType: '',
        tier: 'DELTA',
        contract: ContractsReferences[chain.id]?.contracts.ThorPerkNFT,
        poster: '/images/manager/stills/Origin_delta.png',
        video: '/images/manager/videos/Origin_capsule_delta_perknft.v2.mp4',
      },
      {
        name: 'Gamma Perk',
        nodeType: '',
        tier: 'GAMMA',
        contract: ContractsReferences[chain.id]?.contracts.ThorPerkNFT,
        poster: '/images/manager/stills/Origin_gamma.png',
        video: '/images/manager/videos/Origin_capsule_gamma_perknft.mp4',
      },
      {
        name: 'Bonus Perk',
        nodeType: '',
        tier: 'BONUS',
        contract: ContractsReferences[chain.id]?.contracts.ThorPerkNFT,
        poster: '/images/manager/stills/OriginBonus.png',
        video: '/images/manager/videos/Origin_capsule_bonus_perknft.mp4',
      },
    ],
  };
  return obj[type];
};

export const thorfiNfts_ext = (
  type: ThorfiNFTType_ext = 'origin',
  chain: Chain | undefined
) => {
  if (chain === undefined) {
    chain = defaultChain;
  }
  const obj = {
    origin: [
      {
        name: 'Origin Odin Node',
        nodeType: 'ORIGIN',
        tier: 'ODIN',
        contract: ContractsReferences[chain.id]?.contracts.OGNodeOdin,
        poster: '/images/odinOrigin.png',
        video: '/images/manager/videos/Odin Origin NFT Node (Light).mp4',
      },
      {
        name: 'Origin Thor Node',
        nodeType: 'ORIGIN',
        tier: 'THOR',
        contract: ContractsReferences[chain.id]?.contracts.OGNodeThor,
        poster: '/images/thorOrigin.png',
        video: '/images/manager/videos/Thor Origin NFT Node (Light).mp4',
      },
    ],
    drift: [
      {
        name: 'Drift Odin Node',
        nodeType: 'DRIFT',
        tier: 'ODIN',
        contract: ContractsReferences[chain.id]?.contracts.DriftNodeOdin,
        poster: '/images/odinDrift.png',
        video: '/images/manager/videos/Odin Drift NFT Node (Light) .mp4',
      },
      {
        name: 'Drift Thor Node',
        nodeType: 'DRIFT',
        tier: 'THOR',
        contract: ContractsReferences[chain.id]?.contracts.DriftNodeThor,
        poster: '/images/thorDrift.png',
        video: '/images/manager/videos/Thor Drift NFT Node (Light).mp4',
      },
    ],
    keycards: [
      {
        name: 'Origin Odin Keycard',
        nodeType: 'ORIGIN',
        tier: 'ODIN',
        contract: ContractsReferences[chain.id]?.contracts.ThorKeyNFT,
        poster: '/images/manager/stills/odincard_rare.png',
        video: '/images/manager/videos/Odin_card_rare.mp4',
      },
      {
        name: 'Origin Thor Keycard',
        nodeType: 'ORIGIN',
        tier: 'THOR',
        contract: ContractsReferences[chain.id]?.contracts.ThorKeyNFT,
        poster: '/images/manager/stills/thorcard_rare.png',
        video: '/images/manager/videos/Thor_card_rare.mp4',
      },
      {
        name: 'Drift Odin Keycard',
        nodeType: 'DRIFT',
        tier: 'ODIN',
        contract: ContractsReferences[chain.id]?.contracts.ThorKeyNFT,
        poster: '/images/manager/stills/odincard_normal.png',
        video: '/images/manager/videos/Odin_card_normal.mp4',
      },
      {
        name: 'Drift Thor Keycard',
        nodeType: 'DRIFT',
        tier: 'THOR',
        contract: ContractsReferences[chain.id]?.contracts.ThorKeyNFT,
        poster: '/images/manager/stills/thorcard_normal.png',
        video: '/images/manager/videos/Thor_card_normal.mp4',
      },
    ],
    capsules: [
      {
        name: 'Origin Capsule',
        nodeType: 'ORIGIN',
        tier: '',
        contract: ContractsReferences[chain.id]?.contracts.ThorCapsuleNFT,
        poster: '/images/manager/stills/OriginCapsule.jpg',
        video: '/images/manager/videos/Origin_capsule_closed.mp4',
      },
      {
        name: 'Drift Keycard',
        nodeType: 'DRIFT',
        tier: '',
        contract: ContractsReferences[chain.id]?.contracts.ThorCapsuleNFT,
        poster: '/images/manager/stills/DriftCapsule.jpg',
        video: '/images/manager/videos/Drift_capsule_closed.mp4',
      },
    ],
    perks: [
      {
        name: 'Sigma Perk',
        nodeType: '',
        tier: 'SIGMA',
        contract: ContractsReferences[chain.id]?.contracts.ThorPerkNFT,
        poster: '/images/manager/stills/Origin_sigma.png',
        video: '/images/manager/videos/Origin_capsule_sigma_perknft.mp4',
      },
      {
        name: 'Delta Perk',
        nodeType: '',
        tier: 'DELTA',
        contract: ContractsReferences[chain.id]?.contracts.ThorPerkNFT,
        poster: '/images/manager/stills/Origin_delta.png',
        video: '/images/manager/videos/Origin_capsule_delta_perknft.v2.mp4',
      },
      {
        name: 'Gamma Perk',
        nodeType: '',
        tier: 'GAMMA',
        contract: ContractsReferences[chain.id]?.contracts.ThorPerkNFT,
        poster: '/images/manager/stills/Origin_gamma.png',
        video: '/images/manager/videos/Origin_capsule_gamma_perknft.mp4',
      },
      {
        name: 'Bonus Perk',
        nodeType: '',
        tier: 'BONUS',
        contract: ContractsReferences[chain.id]?.contracts.ThorPerkNFT,
        poster: '/images/manager/stills/OriginBonus.png',
        video: '/images/manager/videos/Origin_capsule_bonus_perknft.mp4',
      },
    ],
  };
  return obj[type];
};

export const getThorfiNftAddress = (
  chainId: number,
  type: ThorfiNFTType_ext = 'origin',
  tier: ThorTier
) => {
  if (!chainId) {
    chainId = DEFAULT_CHAIN_ID;
  }

  const obj = {
    origin: {
      ODIN: ContractsReferences[chainId]?.contracts.OGNodeOdin,
      THOR: ContractsReferences[chainId]?.contracts.OGNodeThor,
      SIGMA: '',
      DELTA: '',
      GAMMA: '',
      BONUS: '',
    },
    drift: {
      ODIN: ContractsReferences[chainId]?.contracts?.DriftNodeOdin,
      THOR: ContractsReferences[chainId]?.contracts?.DriftNodeThor,
      SIGMA: '',
      DELTA: '',
      GAMMA: '',
      BONUS: '',
    },
    keycards: ContractsReferences[chainId]?.contracts?.ThorKeyNFT,
    capsules: ContractsReferences[chainId]?.contracts?.ThorCapsuleNFT,
    perks: ContractsReferences[chainId]?.contracts?.ThorPerkNFT,
  };

  switch (type) {
    case 'origin':
    case 'drift':
      return obj[type][tier];
    case 'keycards':
    case 'capsules':
    case 'perks':
      return obj[type];
  }
};

export const getOGNodeContractByChain = (chain: Chain | undefined) => {
  return {
    ODIN: ContractsReferences[
      chain?.id
    ]?.contracts.OGNodeOdin.toLocaleLowerCase(),
    THOR: ContractsReferences[
      chain?.id
    ]?.contracts.OGNodeThor.toLocaleLowerCase(),
  };
};
export const getDriftNodeContractByChain = (chain: Chain | undefined) => {
  return {
    ODIN: ContractsReferences[
      chain?.id
    ]?.contracts.DriftNodeOdin.toLocaleLowerCase(),
    THOR: ContractsReferences[
      chain?.id
    ]?.contracts.DriftNodeThor.toLocaleLowerCase(),
  };
};

export const getKeycardContractByChain = (chain: Chain | undefined) => {
  return {
    address:
      ContractsReferences[chain?.id]?.contracts.ThorKeyNFT.toLocaleLowerCase(),
  };
};

export const getCapsuleContractByChain = (chain: Chain | undefined) => {
  return {
    address:
      ContractsReferences[
        chain?.id
      ]?.contracts.ThorCapsuleNFT.toLocaleLowerCase(),
  };
};

export const getPerkContractByChain = (chain: Chain | undefined) => {
  return {
    address:
      ContractsReferences[chain?.id]?.contracts.ThorPerkNFT.toLocaleLowerCase(),
  };
};

export function getGamificationContractByChain(chain: Chain | undefined) {
  return ContractsReferences[chain?.id]?.contracts.ThorGamification;
}

export function getDappQueryContractByChain(chain: Chain | undefined) {
  return ContractsReferences[chain?.id].contracts.DappQueryV2;
}

export const MAIN_ORACLE_ADDRESS = '0xd2adeace09e724d5f8007094ab068f2ce44fa866';
export const FUJI_ORACLE_ADDRESS = '0x9966A9B995142E18292DEBf4791347Dc85ea5d4C';

export const getOracleAddress = (chain: any) => {
  switch (chain.id) {
    case 43113: // Fuji
      return FUJI_ORACLE_ADDRESS;
    case 43114: // Main C
      return MAIN_ORACLE_ADDRESS;
    default: // default main net
      return MAIN_ORACLE_ADDRESS;
  }
};

export const FirebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'capsule-7c13f.firebaseapp.com',
  projectId: 'capsule-7c13f',
  storageBucket: 'capsule-7c13f.appspot.com',
  messagingSenderId: '106402656477',
  appId: '1:106402656477:web:ba91027a35405ce7ef2b34',
  measurementId: 'G-RRZL3LTLMH',
};

export const HoverEffectTimerInSecs = 30 * 1000;

export const WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL = 1300;
export const WIDTH_THRESHOLD_4_RESPONSIVE_ACTIVITYPANEL_TWO_ROWS = 850;

export const MULTIFARM_TOKEN = 'bBbWj2S8hK0v3Mur33ZFgOeJXE9EI1gP';

export const Currencies: Currency[] = [
  {
    text: 'AVAX',
    icon: <AvaxIcon viewBox={'0 0 18 15'} />,
    value: 0,
  },
  {
    text: 'THOR',
    icon: <ThorIcon viewBox={'0 0 25 20'} />,
    value: 1,
  },
  {
    text: 'USDC.e',
    icon: <UsdceIcon viewBox={'0 0 15 14'} />,
    value: 2,
  },
];
export const DRAWER_WIDTH = { expanded: 280, collapsed: 88 };
export const NAVBAR_HEIGHT = { miniMobile: '80px', sm: '52px' };

export const userAssetsInitialState: GameloopAssetsType = {
  0: [],
  1: [],

  2: [],

  3: [],

  4: [],
  5: [],
};

const subgraphURLs4Gameloop: SubgraphMap = {
  // 43113: `https://api.thegraph.com/subgraphs/name/betothor/gameloop_fuji`,
  // 43114: `https://api.thegraph.com/subgraphs/name/betothor/gameloop`,
  43113: `${process.env.NEXT_PUBLIC_BACKEND_URL}/subgraphs/43113/gameloop`,
  43114: `${process.env.NEXT_PUBLIC_BACKEND_URL}/subgraphs/43114/gameloop`,
};
export const getSubgraphUrl4Gameloop = (chainId: number | undefined) => {
  return subgraphURLs4Gameloop[chainId];
};
