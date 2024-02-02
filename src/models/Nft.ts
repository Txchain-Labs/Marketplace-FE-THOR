export interface Nft {
  collection_address: string;
  token_address?: string;
  token_id: string;
  name?: string;
  description?: string;
  metadata?: string;
  thumbnail_medium?: string;
  thumbnail_small?: string;
  asset?: string;
  likes?: number;
  is_synced?: boolean;
  img?: string;
  liked?: boolean;
  metadataUrl?: string;
}
