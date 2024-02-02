import { FC, useMemo } from 'react';
import { BigNumber } from 'ethers';
import { useDebounce } from 'use-debounce';
import { List } from '@mui/material';

import { useNFTs } from '@/hooks/useNfts';
import { useCollections } from '@/hooks/useCollections';
import { useUsers } from '@/hooks/useUsers';

import { CommonLoader } from '@/components/common';
import RecentSearchList from './RecentSearchList';
import Placeholder from './Placeholder';
import NoResult from './NoResult';
import ItemsList from './ItemsList';

interface SearchContentProps {
  searchText: string;
  onClose: () => void;
}

const SearchContent: FC<SearchContentProps> = ({ searchText, onClose }) => {
  const [debouncedSearchText] = useDebounce(searchText, 500);

  const enableSearch = useMemo<boolean>(() => {
    return debouncedSearchText !== '' && debouncedSearchText.length >= 3;
  }, [debouncedSearchText]);

  const { data: gameloopNfts, isLoading: isLoadingGameloopNfts } = useNFTs(
    enableSearch,
    debouncedSearchText,
    {
      orderBy: 'name',
      dir: 'asc',
    },
    { nftType: 'thorfi' },
    BigNumber.from(0),
    BigNumber.from(0)
  );

  const { data: collections, isLoading: isLoadingCollections } = useCollections(
    enableSearch,
    debouncedSearchText,
    {
      orderBy: 'name',
      dir: 'asc',
    }
  );

  const { data: artworks, isLoading: isLoadingArtworks } = useNFTs(
    enableSearch,
    debouncedSearchText,
    {
      orderBy: 'name',
      dir: 'asc',
    },
    { nftType: 'artwork' },
    BigNumber.from(0),
    BigNumber.from(0)
  );

  const { data: users, isLoading: isLoadingUsers } = useUsers(
    enableSearch,
    debouncedSearchText
  );

  const isLoading = useMemo<boolean>(() => {
    return enableSearch
      ? isLoadingGameloopNfts ||
          isLoadingCollections ||
          isLoadingArtworks ||
          isLoadingUsers
      : false;
  }, [
    enableSearch,
    isLoadingGameloopNfts,
    isLoadingCollections,
    isLoadingArtworks,
    isLoadingUsers,
  ]);

  const searchResult = useMemo(() => {
    return [
      gameloopNfts?.pages.flatMap((page: any) => page.records).length > 0
        ? {
            category: 'GAMELOOP',
            itemType: 'NFT',
            items: gameloopNfts?.pages.flatMap((page: any) => page.records),
            isLoading: isLoadingGameloopNfts,
          }
        : undefined,
      collections?.pages.flatMap((page: any) => page.records).length > 0
        ? {
            category: 'COLLECTIONS',
            itemType: 'COLLECTION',
            items: collections?.pages.flatMap((page: any) => page.records),
            isLoading: isLoadingCollections,
          }
        : undefined,
      artworks?.pages.flatMap((page: any) => page.records).length > 0
        ? {
            category: 'NFTs',
            itemType: 'NFT',
            items: artworks?.pages.flatMap((page: any) => page.records),
            isLoading: isLoadingArtworks,
          }
        : undefined,
      users?.pages.flatMap((page: any) => page.records).length > 0
        ? {
            category: 'USERS',
            itemType: 'USER',
            items: users?.pages.flatMap((page: any) => page.records),
            isLoading: isLoadingUsers,
          }
        : undefined,
    ].filter((item) => !!item);
  }, [
    artworks,
    gameloopNfts,
    isLoadingGameloopNfts,
    collections,
    isLoadingArtworks,
    isLoadingCollections,
    users,
    isLoadingUsers,
  ]);

  return debouncedSearchText === '' ? (
    <RecentSearchList onClose={onClose} />
  ) : !enableSearch ? (
    <Placeholder />
  ) : (
    <>
      {searchResult.length > 0 ? (
        <List
          sx={{
            'width': '100%',
            'bgcolor': 'background.paper',
            'position': 'relative',
            '& ul': { padding: 0 },
          }}
          subheader={<li />}
        >
          {searchResult.map((result) => (
            <li key={result.category}>
              <ItemsList
                category={result.category}
                itemType={result.itemType}
                items={result.items}
                isLoadingItems={result.isLoading}
                onClose={onClose}
              />
            </li>
          ))}
        </List>
      ) : (
        !isLoading && <NoResult />
      )}
      {isLoading && (
        <CommonLoader size={undefined} width={'100%'} height={'170px'} />
      )}
    </>
  );
};

export default SearchContent;
