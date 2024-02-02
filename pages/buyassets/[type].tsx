import React from 'react';
import { useRouter } from 'next/router';
import { ThorfiNFTType_ext } from '@/utils/constants';

import ThorfiAssets from '@/modules/buyassets/ThorfiAssets';

const BuyAssetsPage = () => {
  const router = useRouter();

  const { type } = router.query;

  return <ThorfiAssets type={type as ThorfiNFTType_ext} />;
};

export default BuyAssetsPage;
