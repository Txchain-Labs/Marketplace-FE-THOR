import { Attribute } from '../models/Metadata';

export interface NftType {
  img: string;
  id: string;
}
export interface ActiveBidsDataType {
  data: NftType[];
  enableActions?: boolean;
  nftType: string;
  refetches(): void;
}

export interface ReceivedBidsDataType {
  data: NftType[];
  enableActions?: boolean;
  nftType: string;
  refetches(): void;
}

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
