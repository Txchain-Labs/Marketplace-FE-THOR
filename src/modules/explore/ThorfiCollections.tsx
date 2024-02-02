import React, { FC } from 'react';
import { Box } from '@mui/material';

import { useThorfiCollections } from '@/hooks/useCollections';

import { Loader } from '@/components/common';
import SubTitle from './SubTitle';
import CollectionsSlider from './CollectionsSlider';

import { Collection } from '@/models/Collection';

const ThorfiCollections: FC = () => {
  const { data: collections, isLoading } = useThorfiCollections();

  return (
    <Box mb={'32px'}>
      <SubTitle title={'Thorfi Collections'} />
      {isLoading ? (
        <Loader colSpan={2} height={278} size={undefined} />
      ) : (
        <CollectionsSlider collections={collections as Collection[]} />
      )}
    </Box>
  );
};

export default ThorfiCollections;
