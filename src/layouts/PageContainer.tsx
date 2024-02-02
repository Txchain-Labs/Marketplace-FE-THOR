import React, { FC } from 'react';
import { useAccount } from 'wagmi';
import { useSelector } from '@/redux/store';
import { Box } from '@mui/material';

import { NAVBAR_HEIGHT } from '@/utils/constants';

import {
  ConnectWalletPage,
  ConnectWalletPageProps,
} from '@/components/common/ConnectWalletPage';

interface ContainerProps {
  children?: any;
  fullHeight?: boolean;
  sx?: any;
  requireWalletConnect?: boolean;
  walletConnectProps?: ConnectWalletPageProps;
}

const PageContainer: FC<ContainerProps> = ({
  fullHeight = false,
  children,
  sx = {},
  requireWalletConnect = false,
  walletConnectProps,
}) => {
  const { address } = useAccount();
  const user = useSelector((state: any) => state.auth.user);

  return (
    <Box
      className={'page-container'}
      sx={(theme) => ({
        background: theme.palette.background.default,
        height: fullHeight
          ? {
              miniMobile: `calc(100vh - ${NAVBAR_HEIGHT.miniMobile})`,
              sm: `calc(100vh - ${NAVBAR_HEIGHT.sm})`,
            }
          : undefined,
        ...sx,
      })}
    >
      {requireWalletConnect && (!address || !user?.address) ? (
        <ConnectWalletPage {...walletConnectProps} />
      ) : (
        children
      )}
    </Box>
  );
};

export default PageContainer;
