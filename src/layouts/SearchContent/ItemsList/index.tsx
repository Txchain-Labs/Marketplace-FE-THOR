import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, ListSubheader, Stack, Typography } from '@mui/material';

import { useChain } from '@/utils/web3Utils';
import { useGetUsdFromAvax, useGetUsdFromThor } from '@/hooks/useOracle';
import { useAddRecentSearch } from '@/hooks/useRecentSearches';

import { Nft } from '@/models/Nft';
import { Collection } from '@/models/Collection';
import { User } from '@/models/User';

import NFTItem from '../items/NFTItem';
import CollectionItem from '../items/CollectionItem';
import UserItem from '../items/UserItem';

const LIMIT_COUNT = 2;

interface ItemsListProps {
  category: string;
  itemType: string;
  items: Nft[] | Collection[] | User[];
  isLoadingItems?: boolean;
  onClose: () => void;
}

const ItemsList: FC<ItemsListProps> = ({
  category,
  itemType,
  items,
  onClose,
}) => {
  const chain = useChain();
  const { data: avaxPrice } = useGetUsdFromAvax('1', chain);
  const { data: thorPrice } = useGetUsdFromThor('1', chain);

  const addRecentSearch = useAddRecentSearch();

  const user = useSelector((state: any) => state?.auth.user);

  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const toggleShowMore = () => {
    setIsShowMore(!isShowMore);
  };

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
    switch (itemType) {
      case 'NFT':
        return (items as Nft[])
          .slice(0, isShowMore ? items.length : LIMIT_COUNT)
          .map((nft) => (
            <NFTItem
              key={nft.collection_address + nft.token_id}
              nft={nft}
              avaxPrice={avaxPrice}
              thorPrice={thorPrice}
              onClick={() => handleVisit(itemType, nft)}
            />
          ));
      case 'COLLECTION':
        return (items as Collection[])
          .slice(0, isShowMore ? items.length : LIMIT_COUNT)
          .map((collection) => (
            <CollectionItem
              key={collection.address}
              collection={collection}
              avaxPrice={avaxPrice}
              thorPrice={thorPrice}
              onClick={() => handleVisit(itemType, collection)}
            />
          ));
      case 'USER':
        return (items as User[])
          .slice(0, isShowMore ? items.length : LIMIT_COUNT)
          .map((user) => (
            <UserItem
              key={user.address}
              user={user}
              onClick={() => handleVisit(itemType, user)}
            />
          ));
      default:
        return null;
    }
  };

  return (
    <ul>
      <ListSubheader
        sx={{
          lineHeight: '36px',
        }}
      >
        <Stack
          direction={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography variant={'lbl-md'} lineHeight={'36px'}>
            {category}
          </Typography>
          {items.length > LIMIT_COUNT && (
            <Button size={'small'} onClick={toggleShowMore}>
              Show {isShowMore ? 'less' : 'more'}
            </Button>
          )}
        </Stack>
      </ListSubheader>
      {renderItems()}
    </ul>
  );
};

export default ItemsList;
