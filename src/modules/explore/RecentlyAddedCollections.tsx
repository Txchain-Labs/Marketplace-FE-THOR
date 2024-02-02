import React, { FC } from 'react';
import { Box } from '@mui/material';

import { useRecentlyAddedCollections } from '@/hooks/useCollections';

import { Collection } from '@/models/Collection';

import SubTitle from './SubTitle';
import CollectionsSlider from './CollectionsSlider';
import { Loader } from '@/components/common';

const RecentlyAddedCollections: FC = () => {
  const { data: collections, isLoading } = useRecentlyAddedCollections();

  return (
    <Box mb={'32px'}>
      <SubTitle title={'Recently added'} />
      {isLoading ? (
        <Loader colSpan={2} height={278} size={undefined} />
      ) : (
        <CollectionsSlider collections={collections as Collection[]} />
      )}
    </Box>
  );
};

export default RecentlyAddedCollections;
