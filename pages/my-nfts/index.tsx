import React from 'react';

import PageContainer from '@/layouts/PageContainer';
import MyNFTs from '@/modules/myNFTs';

const MyNFTsIndexPage = () => (
  <PageContainer requireWalletConnect sx={{ p: '24px 16px' }}>
    <MyNFTs />
  </PageContainer>
);
export default MyNFTsIndexPage;
