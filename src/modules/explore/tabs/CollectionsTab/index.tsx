import React, { FC, useState } from 'react';
import { Box, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import CollectionsTable from './CollectionsTable';

const CollectionsTab: FC = () => {
  const [showMore, setShowMore] = useState<boolean>(false);

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
  };

  return (
    <Box>
      <CollectionsTable isShowFullData={showMore} />
      <Box display={'flex'} justifyContent={'center'} mt={'8px'} mb={'16px'}>
        <Button
          sx={{
            borderRadius: 0,
            textTransform: 'none',
            fontWeight: 700,
          }}
          startIcon={
            showMore ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
          }
          onClick={handleShowMoreClick}
        >
          {showMore ? 'Show less' : 'Show more'}
        </Button>
      </Box>
    </Box>
  );
};

export default CollectionsTab;
