import React, { FC, useState, useMemo } from 'react';
import { useQueryState, useQueryStates, queryTypes } from 'next-usequerystate';
import debounce from 'lodash.debounce';
import { Box, IconButton, useTheme, ThemeProvider, Badge } from '@mui/material';
import { SearchField, SortMenu } from '@/components/common';
import FilterListIcon from '@mui/icons-material/FilterList';
import { SortDirection, SortOption } from '@/components/common/SortMenu';

import FilterModal from './FilterModal';
import { defaultFilterValues } from '../../tabs/NFTsTab';
import { exploreandCollectionDetailFilterStatus } from '@/utils/helper';
import { useSearchFieldTheme } from '@/themes';

const sortOptions: SortOption[] = [
  {
    label: 'Price',
    directionLabels: { desc: 'High to low', asc: 'Low to high' },
    directions: ['desc', 'asc'],
    field: 'avax_price',
  },
  {
    label: 'Sold',
    directionLabels: {
      desc: 'Most Recent to Oldest',
      asc: 'Oldest to Most Recent',
    },
    directions: ['desc', 'asc'],
    field: 'sold_at',
  },
  {
    label: 'Last sale',
    directionLabels: {
      desc: 'High to Low',
      asc: 'Low to High',
    },
    directions: ['desc', 'asc'],
    field: 'last_sale_avax_price',
  },
  {
    label: 'Listed',
    directionLabels: {
      desc: 'Most Recent to Oldest',
      asc: 'Oldest to Most Recent',
    },
    directions: ['desc', 'asc'],
    field: 'listed_at',
  },
  {
    label: 'Minted',
    directionLabels: {
      desc: 'Most Recent to Oldest',
      asc: 'Oldest to Most Recent',
    },
    directions: ['desc', 'asc'],
    field: 'minted_at',
  },
];

const NFTsHeader: FC = () => {
  const theme = useTheme();

  const searchFieldTheme = useSearchFieldTheme(theme);

  const [querySearchText, setQuerySearchText] = useQueryState(
    'q',
    queryTypes.string.withDefault('')
  );
  const [querySort, setQuerySort] = useQueryStates({
    orderBy: queryTypes.string.withDefault('minted_at'),
    dir: queryTypes.string.withDefault('desc'),
  });

  const [searchText, setSearchText] = useState<string>(querySearchText);
  const [sort, setSort] = useState<any>(querySort);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

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

  const handleFilterModalOpen = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterModalClose = () => {
    setIsFilterModalOpen(false);
  };
  const [filter] = useQueryStates({
    favourited: queryTypes.boolean.withDefault(defaultFilterValues.favourited),
    notFavourited: queryTypes.boolean.withDefault(
      defaultFilterValues.notFavourited
    ),
    listed: queryTypes.boolean.withDefault(defaultFilterValues.listed),
    notListed: queryTypes.boolean.withDefault(defaultFilterValues.notListed),
    privateBids: queryTypes.boolean.withDefault(
      defaultFilterValues.privateBids
    ),
    bids: queryTypes.boolean.withDefault(defaultFilterValues.bids),
    noBids: queryTypes.boolean.withDefault(defaultFilterValues.noBids),
    currency: queryTypes.integer.withDefault(defaultFilterValues.currency),
    priceMin: queryTypes.string.withDefault(defaultFilterValues.priceMin),
    priceMax: queryTypes.string.withDefault(defaultFilterValues.priceMax),
  });
  const filterStatus = useMemo(() => {
    return exploreandCollectionDetailFilterStatus(filter);
  }, [filter]);

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
            placeholder={'Search NFTs'}
            fullWidth
            value={searchText}
            onChange={handleSearchTextChange}
            onClear={handleSearchTextClear}
          />
        </ThemeProvider>
      </Box>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <SortMenu
          sortOptions={sortOptions}
          selectedField={sort.orderBy}
          direction={sort.dir}
          onChange={onSortChange}
        />
        <IconButton
          sx={{ position: 'relative' }}
          onClick={handleFilterModalOpen}
        >
          <Badge color={'primary'} variant={'dot'} invisible={filterStatus}>
            <FilterListIcon />
          </Badge>
        </IconButton>
      </Box>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleFilterModalClose}
      />
    </Box>
  );
};

export default NFTsHeader;
