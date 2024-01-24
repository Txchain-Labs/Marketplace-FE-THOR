import React from 'react';
import { useRouter } from 'next/router';
import { ThorfiNFTType } from '../../src/utils/constants';

import ThorfiNFTs from '../../src/modules/thorfi/ThorfiNFTs';

const ThorfisPage = () => {
  const router = useRouter();

  const { type } = router.query;

  return <ThorfiNFTs type={type as ThorfiNFTType} />;
};

export default ThorfisPage;
