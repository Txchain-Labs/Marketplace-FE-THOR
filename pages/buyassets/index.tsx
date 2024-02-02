import React from 'react';
import { ThorfiNFTType_ext } from '@/utils/constants';

import ThorfiAssets from '@/modules/buyassets/ThorfiAssets';

const BuyAssetsPage = () => {
  const type = 'origin';

  return <ThorfiAssets type={type as ThorfiNFTType_ext} />;
};

export default BuyAssetsPage;
