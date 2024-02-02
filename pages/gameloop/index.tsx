import React from 'react';
import { GameLoop } from '../../src/modules/gameloop';

import PageContainer from '@/layouts/PageContainer';

const gameloop = () => {
  return (
    <PageContainer requireWalletConnect>
      <GameLoop />
    </PageContainer>
  );
};

export default gameloop;
