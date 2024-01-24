import React, { FC } from 'react';
import { Box, useMediaQuery } from '@mui/material';

interface ContainerProps {
  children?: any;
  fullHeight?: boolean;
  sx?: any;
}

const PageContainer: FC<ContainerProps> = ({
  fullHeight = false,
  children,
  sx = {},
}) => {
  const matches = useMediaQuery('(max-width:600px)');
  return (
    <Box
      className={'page-container'}
      sx={{
        background: '#FFF',
        height: fullHeight
          ? matches
            ? 'calc(100vh - 72px)'
            : 'calc(100vh - 48px)'
          : undefined,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;
