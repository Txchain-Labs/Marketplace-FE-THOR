import React from 'react';
import ManagerPage from '@/modules/manager/Manager';
import { ThorfiNFTType_ext } from '@/utils/constants';

import PageContainer from '@/layouts/PageContainer';

const Manager = () => {
  const assetType = 'origin';

  return (
    <PageContainer
      requireWalletConnect
      walletConnectProps={{ withFooter: true }}
    >
      <ManagerPage assetType={assetType as ThorfiNFTType_ext} />
    </PageContainer>
  );
};

export default Manager;
