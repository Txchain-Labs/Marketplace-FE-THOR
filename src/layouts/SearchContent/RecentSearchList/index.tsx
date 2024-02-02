import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { List, Box } from '@mui/material';

import { useRecentSearches } from '@/hooks/useRecentSearches';
// import { CommonLoader } from '@/components/common';
import ItemsList from './ItemsList';

interface RecentSearchListProps {
  onClose: () => void;
}

const RecentSearchList: FC<RecentSearchListProps> = ({ onClose }) => {
  const user = useSelector((state: any) => state?.auth.user);

  const { data, isLoading } = useRecentSearches(true, user?.id);

  const recentSearches = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.records) ?? [];
  }, [data]);

  return (
    <Box>
      {isLoading || recentSearches.length === 0 ? null : (
        <List
          sx={{
            'width': '100%',
            'bgcolor': 'background.paper',
            'position': 'relative',
            '& ul': { padding: 0 },
          }}
          subheader={<li />}
        >
          <li>
            <ItemsList
              category={'RECENT'}
              items={recentSearches}
              isLoadingItems={isLoading}
              onClose={onClose}
            />
          </li>
        </List>
      )}
    </Box>
  );
};

export default RecentSearchList;
