import React, { FC } from 'react';
import { useRouter } from 'next/router';

import CollectionDetail from '@/modules/collection/CollectionDetail';

const CollectionDetailPage: FC = () => {
  const router = useRouter();

  const { address } = router.query;

  return <CollectionDetail address={address as string} />;
};

export default CollectionDetailPage;
