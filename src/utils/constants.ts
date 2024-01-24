import { Chain } from 'wagmi';
import { avalanche /* avalancheFuji */ } from 'wagmi/chains';
// import { BigNumber } from 'ethers';

export const bidType = {
  DEFAULT: 'default',
  OTC: 'otc',
};

export type AddressString = `0x${string}`;
// const BIG_ZERO = BigNumber.from(0);
export const tokensMainnet = {
  AVAX: '0x0000000000000000000000000000000000000000',
  THOR: '0x8F47416CaE600bccF9530E9F3aeaA06bdD1Caa79',
  USDCE: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
};
export const tokensFuji = {
  AVAX: '0x0000000000000000000000000000000000000000',
  THOR: '0xDd86402fcb3bA0656074542ADE23EE3e8ca3ab0f',
  USDCE: '0xE1719615Fa18f978aFE7296E96882eA4E61BbCEc',
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
export type TokenNameType = keyof typeof tokensMainnet;

export const DEFAULT_CHAIN_ID = 43114; // 43114
export const defaultChain = avalanche; //avalanche

export const TOKEN_CONTRACT = '0x8F47416CaE600bccF9530E9F3aeaA06bdD1Caa79';

type SubgraphMap = {
  [key: number]: string;
};

const subgraph: SubgraphMap = {
  43113: `https://api.thegraph.com/subgraphs/name/forseticameron/thor-marketplace`,
  43114: `https://api.thegraph.com/subgraphs/name/forseticameron/thorfi-marketplace`,
};
// const subgraph: SubgraphMap = {
//   43113: `${process.env.NEXT_PUBLIC_BACKEND_URL}/subgraphs/43113`,
//   43114: `${process.env.NEXT_PUBLIC_BACKEND_URL}/subgraphs/43114`,
// };

const OG_ODIN = '0x7325e3564B89968D102B3261189EA44c0f5f1a8e';
const OG_THOR = '0x825189515d0A7756436F0eFb6e4bE5A5aF87e21D';
// const DRIFT_ODIN = '';
// const DRIFT_THOR = '';
const CAPSULE = '';
const KEY_ODIN = '';
const KEY_THOR = '';

const OG_ODIN_FUJI = '0x1De3ebd258f7603888c83A339049501AeaFc6581';
const OG_THOR_FUJI = '0x0Be69fbD4955eB19E4F6D2f58338592be75476A8';
// const DRIFT_ODIN_FUJI = '0x6bD051664aaBdE5398E3Fd77BE1BF5Ed83484f68';
// const DRIFT_THOR_FUJI = '0x609dfb159EA5773708A97A954713dB9CbFB9D5f5';
const CAPSULE_FUJI = '0xa166642C9e5D4241e5F235015D194062621279f6';
const KEY_ODIN_FUJI = '0x087Da99a33819AD8d6A585068598E13209Ad9e9B';
const KEY_THOR_FUJI = '0x15fA5cFc301b466aD0BdAb040ce95C7766eEbbC1';

export const getSubgraphUrl = (chainId: number | undefined) => {
  return subgraph[chainId];
};

export type ThorfiNFTType = 'nodes' | 'capsule' | 'keys';

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
        name: 'Origin',
        tier: 'ODIN',
        contract: (chain?.id === 43113 ? OG_ODIN_FUJI : OG_ODIN).toLowerCase(),
        image:
          'https://ipfs.io/ipfs/QmdG2DWqJMhS6EDc4nrUFvEWrLTDadZEkcbJ4L6xJAZQfH',
      },
      {
        name: 'Origin',
        tier: 'THOR',
        contract: (chain?.id === 43113 ? OG_THOR_FUJI : OG_THOR).toLowerCase(),
        image:
          'https://ipfs.io/ipfs/QmQvPYdCh1BdyDFHE9ANepxx3VfqTujwJfXwWKFEksyv1H',
      },
      // {
      //   name: 'DRIFT',
      //   tier: 'ODIN',
      //   contract: (chain?.id === 43113
      //     ? DRIFT_ODIN_FUJI
      //     : DRIFT_ODIN
      //   ).toLowerCase(),
      //   image: '/images/nfts/nftdetailImg.png',
      // },
      // {
      //   name: 'DRIFT',
      //   tier: 'THOR',
      //   contract: (chain?.id === 43113
      //     ? DRIFT_THOR_FUJI
      //     : DRIFT_THOR
      //   ).toLowerCase(),
      //   image: '/images/nfts/nftdetailImg.png',
      // },
    ],
    capsule: [
      {
        name: 'Capsule',
        tier: 'THOR',
        contract: (chain?.id === 43113 ? CAPSULE_FUJI : CAPSULE).toLowerCase(),
        image: '/images/thorfi/Capsule.png',
      },
    ],
    keys: [
      {
        name: 'KEY',
        tier: 'ODIN',
        contract: (chain?.id === 43113
          ? KEY_ODIN_FUJI
          : KEY_ODIN
        ).toLowerCase(),
        image: '/images/thorfi/Key.png',
      },
      {
        name: 'KEY',
        tier: 'THOR',
        contract: (chain?.id === 43113
          ? KEY_THOR_FUJI
          : KEY_THOR
        ).toLowerCase(),
        image: '/images/thorfi/Key.png',
      },
    ],
  };
  return obj[type];
};

export const getNodesContractByChain = (chain: Chain | undefined) => {
  if (!chain) {
    chain = defaultChain;
  }
  if (chain?.id === 43113) {
    return [OG_ODIN_FUJI, OG_THOR_FUJI].map((v) => v.toLowerCase());
  }
  return [OG_ODIN, OG_THOR].map((v) => v.toLowerCase());
};

export const MAIN_ORACLE_ADDRESS = '0x3d67eF921510cAA0A650e8E64a542d223CF41F02';
export const FUJI_ORACLE_ADDRESS = '0x81da68FBaecA130bf11FD8647d04906799A005fE';

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

export const Currencies = [
  {
    value: 0,
    label: 'AVAX',
  },
  {
    value: 1,
    label: 'THOR',
  },
];
