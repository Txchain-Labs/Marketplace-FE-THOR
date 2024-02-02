import { Nft } from './Nft';
import { Collection } from './Collection';
import { User } from './User';

export interface RecentSearch {
  id?: string;
  user_id?: string;
  chain_id?: string;
  item_type: string;
  collection_address?: string;
  token_id?: string;
  user_address?: string;
  visited_at?: string;
  nft?: Nft;
  collection?: Collection;
  user?: User;
}
