import { SearchField, SortMenu } from '@/components/common';
import {
  openBagModal,
  selectBagListedIds,
  selectBagState,
  selectBagUnListedIds,
} from '@/redux/slices/managerBagSlice';
import {
  dataActiveView,
  filterAppliedStatus,
  openFilterModal,
  selectSearchText,
  selectSort,
  setDataView,
  setSearchText,
  setSort,
} from '@/redux/slices/managerFilterSlice';
import {
  Box,
  IconButton,
  Typography,
  ThemeProvider,
  useTheme,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSelector } from '@/redux/store';
import { SortOption, SortDirection } from '@/components/common/SortMenu';
import { ShoppingBag, ViewList, ViewModule } from '@mui/icons-material';
import { useState } from 'react';
import { useSearchFieldTheme } from '@/themes';
// import { debounce } from 'lodash';

interface Header {
  type: string;
}
const ManagerHeader = ({ type }: Header) => {
  const theme = useTheme();
  const searchFieldTheme = useSearchFieldTheme(theme);

  const dispatch = useDispatch();
  const filterStatus = useSelector(filterAppliedStatus);
  const bagListedIds = useSelector(selectBagListedIds);
  const bagUnListedIds = useSelector(selectBagUnListedIds);
  const bagState = useSelector(selectBagState);
  const activeView = useSelector(dataActiveView);

  const searchText = useSelector(selectSearchText);
  const sort = useSelector(selectSort);

  const [, set_searchText] = useState<string>(searchText);
  // console.log(_searchText, 'search');
  // const debouncedSetSearchText = useMemo(
  //   () =>
  //     setTimeout((value: string) => {
  //       dispatch(setSearchText(value));
  //     }, 300),
  //   [dispatch]
  // );
  const handleSearchTextChange = (e: React.ChangeEvent) => {
    const value: string = (e.target as HTMLInputElement).value;
    set_searchText(value);
    dispatch(setSearchText(value));
    // debouncedSetSearchText(value);
  };

  const handleSearchTextClear = () => {
    set_searchText('');
    dispatch(setSearchText(''));
    // debouncedSetSearchText('');
  };

  const onSortChange = (orderBy: string, orderDirection: SortDirection) => {
    dispatch(setSort({ orderBy, orderDirection }));
  };

  const handleFilterModalOpen = () => {
    dispatch(openFilterModal());
  };
  const handleBagModalOpen = () => {
    dispatch(openBagModal());
  };
  const switchDataView = (val: string) => {
    dispatch(setDataView(val));
  };
  const sortOptions: SortOption[] = [
    {
      label: 'Price',
      directionLabels: { desc: 'High to low', asc: 'Low to high' },
      directions: ['desc', 'asc'],
      field: 'price',
    },
  ];

  if (type === 'Nodes') {
    sortOptions.push({
      label: 'Active Days Remaining',
      directionLabels: {
        desc: 'Most to least',
        asc: 'Least to most',
      },
      directions: ['desc', 'asc'],
      field: 'dueDate',
    });
    sortOptions.push({
      label: 'Pending rewards',
      directionLabels: { asc: 'High to low', desc: 'Low to high' },
      directions: ['asc', 'desc'],
      field: 'pendingRewards',
    });
  }

  return (
    <>
      <Box
        sx={{
          display: { sm: 'none', miniMobile: 'block' },
          width: '100%',
        }}
      >
        <ThemeProvider theme={searchFieldTheme}>
          <SearchField
            placeholder={`Search for ${type}`}
            fullWidth
            value={searchText}
            onChange={handleSearchTextChange}
            onClear={handleSearchTextClear}
          />
        </ThemeProvider>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {' '}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            marginTop: 2,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <IconButton onClick={handleBagModalOpen}>
              <ShoppingBag sx={{ color: 'text.primary' }} />
            </IconButton>
            <Box
              sx={{
                display: (bagState === 1
                  ? bagListedIds
                  : bagState === 2
                  ? bagUnListedIds
                  : []
                ).length
                  ? 'flex'
                  : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: ' #F3523F',
                color: 'white',
                borderRadius: '100%',
                width: '19px',
                height: '19px',
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            >
              <Typography variant="p-sm">
                {
                  (bagState === 1
                    ? bagListedIds
                    : bagState === 2
                    ? bagUnListedIds
                    : []
                  ).length
                }
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: { sm: 'block', miniMobile: 'none' },
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: {
                lg: '350px',
                md: '200px',
                sm: '150px',
                miniMobile: 'auto',
              },
            }}
          >
            <ThemeProvider theme={searchFieldTheme}>
              <SearchField
                placeholder={`Search for ${type}`}
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
              direction={sort.orderDirection}
              onChange={onSortChange}
            />
            <IconButton onClick={() => switchDataView('thumbnail')}>
              <ViewModule
                sx={{
                  color:
                    activeView === 'thumbnail'
                      ? 'primary.main'
                      : 'text.secondary',
                }}
              />
            </IconButton>
            <IconButton onClick={() => switchDataView('list')}>
              <ViewList
                sx={{
                  color:
                    activeView === 'list' ? 'primary.main' : 'text.secondary',
                }}
              />
            </IconButton>
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
              <FilterListIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ManagerHeader;
