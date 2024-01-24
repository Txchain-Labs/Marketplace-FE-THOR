export interface Collection {
  id?: string;
  address?: string;
  owner?: string;
  name?: string;
  symbol?: string;
  chainid?: number;
  description?: string;
  metadata_url?: string;
  cover_image?: string;
  profile_image?: string;
  category?: string;
  collection_size?: number;
  is_thor_collection?: boolean;
  is_erc731?: boolean;
  is_erc1155?: boolean;
  is_verified?: boolean;
  is_p2e?: boolean;
  twitter?: string;
  discord?: string;
  web?: string;
  listed_time?: string;
  update_time?: string;
}
