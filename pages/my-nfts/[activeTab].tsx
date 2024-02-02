import React from 'react';
import { useRouter } from 'next/router';

import PageContainer from '@/layouts/PageContainer';
import MyNFTs from '@/modules/myNFTs';

const MyNFTsPage = () => {
  const router = useRouter();

  return (
    <PageContainer requireWalletConnect sx={{ p: '24px 16px' }}>
      <MyNFTs activeTab={router.query.activeTab as string} />
    </PageContainer>
  );
};

export default MyNFTsPage;
