import React, { FC, useEffect } from 'react';
// eslint-disable-next-line import/named
import { animateScroll } from 'react-scroll';
import { useTheme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

import PageContainer from '../../layouts/PageContainer';
import CollectionsList from './CollectionsList';
import CollectionView from './CollectionView';

interface CollectionsProps {
  collections?: any[];
  collectionAddress?: string;
}

const Collections: FC<CollectionsProps> = ({ collectionAddress }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    animateScroll.scrollToTop({
      containerId: 'collectionViewContainer',
      duration: 1500,
      smooth: true,
    });
  }, [collectionAddress]);

  return (
    <PageContainer fullHeight={true}>
      {((isMobile && !collectionAddress) || !isMobile) && (
        <Box
          sx={{
            width: { lg: '360px', md: '360px', sm: '100%', xs: '100%' },
            height: '100%',
            float: isMobile ? undefined : 'left',
          }}
        >
          <CollectionsList collectionAddress={collectionAddress} />
        </Box>
      )}
      {((isMobile && !!collectionAddress) || !isMobile) && (
        <Box
          sx={{
            // marginLeft: { lg: '360px', md: '360px', sm: '100%', xs: '100%' },
            height: '100%',
            overflow: 'auto',
          }}
          id={'collectionViewContainer'}
        >
          <CollectionView collectionAddress={collectionAddress} />
        </Box>
      )}
    </PageContainer>
  );
};

export default Collections;
