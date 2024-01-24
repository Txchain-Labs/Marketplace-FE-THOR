import React, { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Grid, Box, Divider } from '@mui/material';
import { ThorfiNFTType } from '../../../src/utils/constants';
import { setTier } from '../../redux/slices/nodesSlice';

import PageContainer from '../../layouts/PageContainer';
import ThorfiCategoriesSlide from './ThorfiCategoriesSlide';
import ThorfiNftsList from './ThorfiNftsList';

interface ThorfiNFTsProps {
  type?: ThorfiNFTType;
}

const ThorfiNFTs: FC<ThorfiNFTsProps> = ({ type = 'nodes' }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = router.query;
    if (params.tier) {
      dispatch(setTier(params.tier));
    }
  }, [router, dispatch]);

  return (
    <PageContainer>
      <Grid container>
        <Grid item lg={5} md={6} xs={12} width={'100%'}>
          <ThorfiCategoriesSlide thorfiNFTType={type} />
        </Grid>
        <Grid item lg={7} md={6} xs={12} display={'flex'}>
          <Divider
            orientation={'vertical'}
            flexItem
            sx={(theme) => ({
              m: '80px 0',
              [theme.breakpoints.down('md')]: {
                display: 'none',
              },
            })}
          />
          <Box
            flexGrow={1}
            sx={(theme) => ({
              px: 6,
              pt: 4,
              pb: 1,
              [theme.breakpoints.down('md')]: {
                pt: 1,
                px: 1,
              },
              height: 'calc(100vh - 48px)',
              [theme.breakpoints.down('sm')]: {
                height: 'calc(100vh - 72px)',
              },
            })}
          >
            <ThorfiNftsList thorfiNFTType={type} />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default ThorfiNFTs;
