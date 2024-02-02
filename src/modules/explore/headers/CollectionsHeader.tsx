import React, { FC, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { useQueryState, useQueryStates, queryTypes } from 'next-usequerystate';
import { Box, ThemeProvider, useTheme } from '@mui/material';

import { SearchField, SortMenu } from '@/components/common';

import { SortOption, SortDirection } from '@/components/common/SortMenu';
import { useSearchFieldTheme } from '@/themes';

const sortOptions: SortOption[] = [
  {
    label: 'Floor Price',
    directionLabels: { desc: 'High to low', asc: 'Low to high' },
    directions: ['desc', 'asc'],
    field: 'floor_price',
  },
  {
    label: 'Volume',
    directionLabels: { desc: 'High to low', asc: 'Low to high' },
    directions: ['desc', 'asc'],
    field: 'total_volume_usd',
  },
  {
    label: 'Added',
    directionLabels: { desc: 'Recent to oldest', asc: 'Oldest to recent' },
    directions: ['desc', 'asc'],
    field: 'listed_time',
  },
  {
    label: 'NFTs listed',
    directionLabels: { desc: 'Most to least', asc: 'Least to most' },
    directions: ['desc', 'asc'],
    field: 'listed_count',
  },
];

const CollectionsHeader: FC = () => {
  const theme = useTheme();

  const searchFieldTheme = useSearchFieldTheme(theme);

  const [querySearchText, setQuerySearchText] = useQueryState(
    'q',
    queryTypes.string.withDefault('')
  );
  const [querySort, setQuerySort] = useQueryStates({
    orderBy: queryTypes.string.withDefault('floor_price'),
    dir: queryTypes.string.withDefault('desc'),
  });

  const [searchText, setSearchText] = useState<string>(querySearchText);
  const [sort, setSort] = useState<any>(querySort);

  const debouncedSetQuerySearchText = useMemo(
    () => debounce(setQuerySearchText, 500),
    [setQuerySearchText]
  );
  const debouncedSetQuerySort = useMemo(
    () => debounce(setQuerySort, 500),
    [setQuerySort]
  );
  const handleSearchTextChange = (e: React.ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setSearchText(value);
    debouncedSetQuerySearchText(value === '' ? null : value, {
      scroll: false,
      shallow: true,
    });
  };

  const handleSearchTextClear = () => {
    setSearchText('');
    debouncedSetQuerySearchText(null, {
      scroll: false,
      shallow: true,
    });
  };
  const onSortChange = (orderBy: string, dir: SortDirection) => {
    setSort({ orderBy, dir });
    debouncedSetQuerySort(
      { orderBy, dir },
      {
        scroll: false,
        shallow: true,
      }
    );
  };
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
        },
      })}
    >
      <Box
        sx={(theme) => ({
          [theme.breakpoints.down('sm')]: {
            mb: '8px',
          },
        })}
      >
        <ThemeProvider theme={searchFieldTheme}>
          <SearchField
            placeholder={'Search collections'}
            fullWidth
            value={searchText}
            onChange={handleSearchTextChange}
            onClear={handleSearchTextClear}
          />
        </ThemeProvider>
      </Box>
      <SortMenu
        sortOptions={sortOptions}
        selectedField={sort.orderBy}
        direction={sort.dir as SortDirection}
        onChange={onSortChange}
      />
    </Box>
  );
};

export default CollectionsHeader;
