import React from 'react';
import { useRouter } from 'next/router';

import Explore from '@/modules/explore/Explore';

const ExplorePage = () => {
  const router = useRouter();

  return <Explore activeTab={router.query.activeTab as string} />;
};

export default ExplorePage;
