import { useRouter } from 'next/router';
import React, { FC, useMemo, useState } from 'react';
import Sticky from 'react-stickynode';
import debounce from 'lodash.debounce';
import { useQueryState, useQueryStates, queryTypes } from 'next-usequerystate';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  ThemeProvider,
  useTheme,
} from '@mui/material';
import { ArrowBackIos, ShareSharp, FilterList } from '@mui/icons-material';
import { useSearchFieldTheme } from '@/themes';

import { Collection } from '@/models/Collection';

import { SortDirection, SortOption } from '@/components/common/SortMenu';
import { SearchField, SortMenu } from '@/components/common';

import FilterModal from './FilterModal';
import { defaultFilterValues } from '../NFTsList';
import { exploreandCollectionDetailFilterStatus } from '@/utils/helper';

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

interface QueryHeaderProps {
  collection: Collection;
}

const QueryHeader: FC<QueryHeaderProps> = ({ collection }) => {
  const theme = useTheme();
  const searchFieldTheme = useSearchFieldTheme(theme);

  const router = useRouter();

  const [searchText, setSearchText] = useQueryState(
    'q',
    queryTypes.string.withDefault('')
  );
  const [sort, setSort] = useQueryStates({
    orderBy: queryTypes.string.withDefault('minted_at'),
    dir: queryTypes.string.withDefault('desc'),
  });

  const [_searchText, set_searchText] = useState<string>(searchText);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  const debouncedSetSearchText = useMemo(
    () =>
      debounce((value: string) => {
        if (value === '') value = null;

        setSearchText(value);
      }, 500),
    [setSearchText]
  );
  const handleSearchTextChange = (e: React.ChangeEvent) => {
    const value: string = (e.target as HTMLInputElement).value;
    set_searchText(value);
    debouncedSetSearchText(value);
  };

  const handleSearchTextClear = () => {
    set_searchText('');
    debouncedSetSearchText('');
  };

  const onSortChange = (orderBy: string, dir: SortDirection) => {
    setSort({ orderBy, dir } as {
      orderBy: string;
      dir: string;
    });
  };

  const handleFilterModalOpen = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterModalClose = () => {
    setIsFilterModalOpen(false);
  };

  const handleBack = () => {
    router.back();
  };

  const [filter] = useQueryStates({
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
        '& .header': {
          display: 'none',
        },
        '& .sticky-header-active .sticky-header': {
          'boxShadow': theme.shadows[1],
          'mx': '-108px',
          'px': '108px',
          [theme.breakpoints.down('sm')]: { mx: '-16px', px: '16px' },
          '& .header': {
            display: 'flex',
          },
        },
      })}
    >
      <Sticky top={48} innerZ={3} innerActiveClass={'sticky-header-active'}>
        <Box
          sx={{
            bgcolor: 'background.default',
          }}
          className={'sticky-header'}
        >
          <Box
            sx={(theme) => ({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: theme.palette.divider,
              height: '78px',
              [theme.breakpoints.down('sm')]: {
                height: '48px',
              },
            })}
            className={'header'}
          >
            <Button
              onClick={handleBack}
              sx={{
                'color': 'text.secondary',
                '&:hover': { color: 'text.secondary' },
                'textTransform': 'none',
              }}
            >
              <ArrowBackIos /> <Typography variant="lbl-md">Explore</Typography>
            </Button>
            <Avatar
              sx={(theme) => ({
                width: '64px',
                height: '64px',
                boxShadow: theme.shadows[1],
                [theme.breakpoints.down('sm')]: {
                  width: '32px',
                  height: '32px',
                },
              })}
              alt={collection.name}
              src={collection.profile_image}
            />
            <IconButton
              sx={(theme) => ({
                'color': 'text.secondary',
                '&:hover': { color: 'text.secondary' },
                'fontSize': '16px',
                'zIndex': 1,
                'visibility': 'hidden',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '18px',
                },
              })}
            >
              <ShareSharp fontSize={'inherit'} />
            </IconButton>
          </Box>
          <Box
            sx={(theme) => ({
              display: 'flex',
              justifyContent: 'space-between',
              py: '24px',
              [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
                py: '16px',
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
                  value={_searchText}
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
                direction={sort.dir as SortDirection}
                onChange={onSortChange}
              />
              <IconButton
                sx={{ position: 'relative' }}
                onClick={handleFilterModalOpen}
              >
                {filterStatus && (
                  <img
                    src="/images/active-dot.png"
                    style={{ position: 'absolute', right: 5, top: 5 }}
                  />
                )}
                <FilterList />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Sticky>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleFilterModalClose}
      />
    </Box>
  );
};

export default QueryHeader;
