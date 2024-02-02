import React, { FC } from 'react';
import { Box } from '@mui/material';

import { useCollection } from '@/hooks/useCollections';

import PageContainer from '@/layouts/PageContainer';
import Header from './Header';
import SubHeader from './SubHeader';
import QueryHeader from './QueryHeader';
import NFTsList from './NFTsList';

interface CollectionDetailProps {
  address?: string;
}

const CollectionDetail: FC<CollectionDetailProps> = ({ address }) => {
  const { data: collection } = useCollection(address);

  if (!collection) return null;

  return (
    <PageContainer>
      <Header collection={collection} />
      <Box
        sx={(theme) => ({
          px: '108px',
          [theme.breakpoints.down('sm')]: { px: '16px' },
        })}
      >
        <SubHeader collection={collection} />
        <QueryHeader collection={collection} />
        <NFTsList collection={collection} />
      </Box>
    </PageContainer>
  );
};

export default CollectionDetail;
