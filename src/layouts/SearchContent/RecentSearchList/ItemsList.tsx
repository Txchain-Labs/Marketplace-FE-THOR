import { FC } from 'react';
import { useSelector } from 'react-redux';
import { ListSubheader, Typography } from '@mui/material';

import { useChain } from '@/utils/web3Utils';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import { useAddRecentSearch } from '@/hooks/useRecentSearches';

import { RecentSearch } from '@/models/RecentSearch';
import { Nft } from '@/models/Nft';
import { Collection } from '@/models/Collection';
import { User } from '@/models/User';

import NFTItem from '../items/NFTItem';
import CollectionItem from '../items/CollectionItem';
import UserItem from '../items/UserItem';

interface ItemsListProps {
  category: string;
  items: RecentSearch[];
  isLoadingItems?: boolean;
  onClose: () => void;
}

const ItemsList: FC<ItemsListProps> = ({ category, items, onClose }) => {
  const chain = useChain();
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const addRecentSearch = useAddRecentSearch();

  const user = useSelector((state: any) => state?.auth.user);

  const handleVisit = (itemType: string, item: Nft | Collection | User) => {
    setTimeout(() => {
      onClose();
    });
    if (user?.id) {
      const refinedItem: {
        collection_address?: string;
        token_id?: string;
        user_address?: string;
      } = {};

      switch (itemType) {
        case 'NFT':
          refinedItem.collection_address = (item as Nft).collection_address;
          refinedItem.token_id = (item as Nft).token_id;
          break;
        case 'COLLECTION':
          refinedItem.collection_address = (item as Collection).address;
          break;
        case 'USER':
          refinedItem.user_address = (item as User).address;
          break;
        default:
      }

      addRecentSearch.mutate({
        user_id: user?.id,
        item_type: itemType,
        item: refinedItem,
      });
    }
  };

  const renderItems = () => {
    return items.map((item) => {
      switch (item.item_type) {
        case 'NFT':
          return (
            <NFTItem
              key={item.id}
              nft={item.nft}
              avaxPrice={avaxPrice}
              thorPrice={thorPrice}
              isRecentItem
              onClick={() => handleVisit(item.item_type, item.nft)}
            />
          );
        case 'COLLECTION':
          return (
            <CollectionItem
              key={item.id}
              collection={item.collection}
              avaxPrice={avaxPrice}
              thorPrice={thorPrice}
              isRecentItem
              onClick={() => handleVisit(item.item_type, item.collection)}
            />
          );
        case 'USER':
          return (
            <UserItem
              key={item.id}
              user={item.user}
              isRecentItem
              onClick={() => handleVisit(item.item_type, item.user)}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <ul>
      <ListSubheader
        sx={{
          lineHeight: '36px',
        }}
      >
        <Typography
          variant={'lbl-md'}
          lineHeight={'36px'}
          // color={palette.secondary.storm[50]}
        >
          {category}
        </Typography>
      </ListSubheader>
      {renderItems()}
    </ul>
  );
};

export default ItemsList;
