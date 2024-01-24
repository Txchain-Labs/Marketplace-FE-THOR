import React from 'react';
import { useRouter } from 'next/router';
import Collections from '../../src/modules/collections/Collections';

const CollectionDetailPage = () => {
  const router = useRouter();

  const { id } = router.query;

  return <Collections collectionAddress={id as string} />;
};

export default CollectionDetailPage;
