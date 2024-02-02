import { BigNumber } from 'ethers';
import { Attribute } from '../models/Metadata';

export interface NftType {
  [x: string]: any;
  img: string;
  id: string;
}
export interface ActiveBidsDataType {
  data: NftType[];
  enableActions?: boolean;
  nftType: string;
  refetches(): void;
  searchkey: string;
  emptyStateType?: string;
}

export interface ReceivedBidsDataType {
  data: NftType[];
  enableActions?: boolean;
  nftType: string;
  refetches(): void;
  searchkey: string;
  emptyStateType?: string;
}
export type ThorTier = 'ODIN' | 'THOR' | 'SIGMA' | 'DELTA' | 'GAMMA' | 'BONUS';

export type thorNodesType = 'ORIGIN' | 'DRIFT';

export type listedCountsType = {
  nodes: number;
  keycards: number;
  capsules: number;
  perks: number;
};
export type listedCountsType_ext = {
  origin: number;
  drift: number;
  keycards: number;
  capsules: number;
  perks: number;
};

type NodeBaseType = {
  tokenId: BigNumber;
  name: string;
  creationTime: number;
  lastClaimTime: number;
  rewards: string;
  dueDate: number; // TODO this would be undefined for DRIFT
  perks?: number[];
};

export type NodeType = NodeBaseType & {
  nodeType: 'ORIGIN' | 'DRIFT';
  tier: 'THOR' | 'ODIN';
  image: string;
};

export interface NftDataType {
  nftName?: string;
  by?: string;
  nftImage?: string;
  nftAddress?: string;
  tokenId?: string;
  nftDescription?: string;
  nftAttributes?: Array<Attribute> | null;
}

export interface UserAllFavorites {
  collection_address: string;
  token_id: number;
}

export interface CurrencyType {
  label: string;
  value: number;
}

export interface GameloopAssetsType {
  0: Array<CapsuleType>; // capsule gameloop data
  1: Array<MarketplaceDataType>; // capsule marketplace data
  2: Array<PerkType>; // perk gameloop data
  3: Array<MarketplaceDataType>; // perk marketplace data
  4: Array<KeycardType>; // keycard gameloop data
  5: Array<MarketplaceDataType>; // kaycard marketplace data
}

type MarketplaceDataType = {
  hasBid: boolean;
  bidExpiresAt: BigNumber;
  bidPaymentType: number;
  bidPrice: BigNumber;
  bidder: string;
  otcExpiresAt: BigNumber;
  otcPaymentType: number;
  otcPrice: BigNumber;
  otcBidder: string;
  isListed: boolean;
  orderId: BigNumber;
  paymentType: number;
  price: BigNumber;
  saleType: BigNumber;
};

export type KeycardType = MarketplaceDataType & {
  image: string;
  isOdinCard: boolean;
  isDirectBurnCard: boolean;
  tokenId: string | BigNumber;
  name?: string;
};

export type CapsuleType = MarketplaceDataType & {
  image: string;
  isOriginCapsule: boolean;
  tokenId: string | BigNumber;
  name?: string;
};

export type PerkType = MarketplaceDataType & {
  image: string;
  duration: BigNumber;
  perkType: BigNumber;
  value: BigNumber;
  tokenId: string | BigNumber;
  nodeType: BigNumber | string;
  name?: string;
};

export interface BagInitialState {
  isModalOpen: boolean;
  totalItems: number;
  node: {
    ORIGIN: {
      ODIN: Array<any>;
      THOR: Array<any>;
    };
    DRIFT: {
      ODIN: Array<any>;
      THOR: Array<any>;
    };
  };

  keyCard: {
    ORIGIN: {
      ODIN: Array<any>;
      THOR: Array<any>;
    };
    DRIFT: {
      ODIN: Array<any>;
      THOR: Array<any>;
    };
  };

  capsule: {
    ORIGIN: Array<any>;
    DRIFT: Array<any>;
  };
  perk: {
    ORIGIN: {
      SIGMA: Array<any>;
      DELTA: Array<any>;
      BONUS: Array<any>;
    };
    DRIFT: {
      SIGMA: Array<any>;
      GAMMA: Array<any>;
      BONUS: Array<any>;
    };
  };
}
