import { FC } from 'react';
import {
  Badge,
  Box,
  IconButton,
  Stack,
  ThemeProvider,
  useTheme,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FilterListIcon from '@mui/icons-material/FilterList';

import { SearchField, SortMenu } from '@/components/common';
import { SortDirection, SortOption } from '@/components/common/SortMenu';
import { useSearchFieldTheme } from '@/themes';

interface ActionBarProps {
  sortOptions: SortOption[];
  selectedSortField: string;
  sortDirection: SortDirection;
  onSortChange: (orderBy: string, orderDirection: SortDirection) => void;
  searchValue: string;
  onSearchValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear: () => void;
  onFilterModalOpen: () => void;
  isFiltered: boolean;
  onShowCart: () => void;
  cartedCount: number;
  showingCartIcon: boolean;
}

const ActionBar: FC<ActionBarProps> = ({
  sortOptions,
  selectedSortField,
  sortDirection,
  onSortChange,
  searchValue,
  onSearchValueChange,
  onSearchClear,
  onFilterModalOpen,
  isFiltered,
  onShowCart,
  cartedCount,
  showingCartIcon,
}) => {
  const theme = useTheme();
  const searchFieldTheme = useSearchFieldTheme(theme);

  return (
    <Stack>
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box width={'40px'}>
          {showingCartIcon && (
            <IconButton onClick={onShowCart}>
              <Badge color={'primary'} badgeContent={cartedCount}>
                <ShoppingBagIcon sx={{ color: 'text.primary' }} />
              </Badge>
            </IconButton>
          )}
        </Box>

        <ThemeProvider theme={searchFieldTheme}>
          <SearchField
            value={searchValue}
            onChange={onSearchValueChange}
            onClear={onSearchClear}
          />
        </ThemeProvider>

        <Stack
          direction={'row'}
          justifyContent={'flex-end'}
          alignItems={'center'}
          width={'250px'}
        >
          <SortMenu
            sortOptions={sortOptions}
            selectedField={selectedSortField}
            direction={sortDirection}
            onChange={onSortChange}
          />
          <IconButton onClick={onFilterModalOpen}>
            <Badge color={'primary'} variant={'dot'} invisible={!isFiltered}>
              <FilterListIcon />
            </Badge>
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ActionBar;
