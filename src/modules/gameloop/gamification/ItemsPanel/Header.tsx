import React, { FC, useMemo, useState } from 'react';
import { queryTypes, useQueryStates } from 'next-usequerystate';
import { Box, IconButton, Tab } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import { FilterList } from '@mui/icons-material';
import { NextLinkComposed } from '@/components/common/Link';

import { GamificationItemType } from '../types';

import { SortMenu } from '@/components/common';
import { SortDirection, SortOption } from '@/components/common/SortMenu';
import FilterModal from './FilterModal';
import { activityPanelFilterStatus } from '@/utils/helper';

const sortOptions: SortOption[] = [
  {
    label: 'Price',
    directionLabels: { desc: 'High to low', asc: 'Low to high' },
    directions: ['desc', 'asc'],
    field: 'price',
  },
  {
    label: 'Sold',
    directionLabels: {
      desc: 'Most Recent to Oldest',
      asc: 'Oldest to Most Recent',
    },
    directions: ['desc', 'asc'],
    field: 'sold',
  },
  {
    label: 'Last sale',
    directionLabels: {
      desc: 'High to Low',
      asc: 'Low to High',
    },
    directions: ['desc', 'asc'],
    field: 'last_sale',
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
];

interface HeaderProps {
  type: GamificationItemType;
  itemCounts: {
    keycards: number;
    capsules: number;
    perks: number;
  };
}

const Header: FC<HeaderProps> = ({ type, itemCounts }) => {
  const [sort, setSort] = useQueryStates({
    orderBy: queryTypes.string.withDefault('price'),
    orderDirection: queryTypes.string.withDefault('desc'),
  });
  const [filters] = useQueryStates({
    isOrigin: queryTypes.boolean,
    tier: queryTypes.string,
    perkTypeLabel: queryTypes.string,
  });
  const filterStatus = useMemo(() => {
    return activityPanelFilterStatus(filters, type);
  }, [filters, type]);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  const onSortChange = (orderBy: string, orderDirection: SortDirection) => {
    setSort({ orderBy, orderDirection } as {
      orderBy: string;
      orderDirection: string;
    });
  };

  const handleFilterModalOpen = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterModalClose = () => {
    setIsFilterModalOpen(false);
  };

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('lg')]: {
          flexDirection: 'column',
        },
      })}
    >
      <Box
        sx={(theme) => ({
          [theme.breakpoints.down('lg')]: {
            mb: '20px',
            alignSelf: 'flex-start',
          },
        })}
      >
        <TabContext value={type}>
          <TabList
            aria-label={'Gameloop tabs'}
            sx={{
              'minHeight': 'unset',
              '& .MuiTabs-indicator': { display: 'none' },
            }}
          >
            {(['keycards', 'capsules', 'perks'] as GamificationItemType[]).map(
              (item) => (
                <Tab
                  key={item}
                  label={`${item} ${itemCounts[item]}`}
                  value={item}
                  to={{
                    pathname: `/gameloop/gamification/${item}`,
                  }}
                  component={NextLinkComposed}
                  sx={{
                    'textTransform': 'capitalize',
                    'fontSize': '16px',
                    'lineHeight': '24px',
                    'fontWeight': 700,
                    'p': '1.5px 16px',
                    'minHeight': 'unset',
                    '&.Mui-selected': {
                      bgcolor: 'text.primary',
                      color: 'background.default',
                      borderRadius: '27px',
                    },
                  }}
                />
              )
            )}
          </TabList>
        </TabContext>
      </Box>
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'space-between',
          [theme.breakpoints.down('lg')]: {
            alignSelf: 'flex-end',
          },
        })}
      >
        <Box display={'none'}>
          <SortMenu
            sortOptions={sortOptions}
            selectedField={sort.orderBy}
            direction={sort.orderDirection as SortDirection}
            onChange={onSortChange}
          />
        </Box>
        <IconButton
          sx={{ position: 'relative' }}
          size={'small'}
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

      <FilterModal
        type={type}
        open={isFilterModalOpen}
        onClose={handleFilterModalClose}
      />
    </Box>
  );
};

export default Header;
