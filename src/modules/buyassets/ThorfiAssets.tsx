import React, { FC } from 'react';
import { Box, Typography, Tab, useMediaQuery } from '@mui/material';
import { ThorfiNFTType_ext, assetsType_ext } from '@/utils/constants';

import PageContainer from '../../layouts/PageContainer';
import NodesTab from './Nodes';
import KeycardsTab from './Keycards';
import CapsulesTab from './Capsules';
import PerksTab from './Perks';
import { NextLinkComposed } from '@/components/common/Link';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useListingsCount } from '@/hooks/listings';

interface ThorfiNFTsProps {
  type?: ThorfiNFTType_ext;
}
const ThorfiAssets: FC<ThorfiNFTsProps> = ({ type = 'origin' }) => {
  const matches = useMediaQuery('(max-width:600px)');
  const { data: listingsCount, isLoading: isCountLoading } = useListingsCount();

  return (
    <Box>
      <PageContainer
        sx={{
          padding: '0 1em',
          minHeight: matches ? `calc(100vh - 54px)` : `calc(100vh - 50px)`,
        }}
      >
        <Box sx={{ padding: '1em 0' }}>
          <Typography
            variant={matches ? 'h3' : 'h1'}
            sx={{ lineHeight: '150%' }}
          >
            Buy assets
          </Typography>
        </Box>
        <TabContext value={type}>
          <TabList
            aria-label={'Buyassets tabs'}
            variant={'scrollable'}
            sx={(theme) => ({
              mb: '20px',
              borderBottom: `3px solid ${theme.palette.divider}`,
            })}
          >
            {assetsType_ext.slice(1).map((assetType) => (
              <Tab
                key={assetType}
                label={
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      textTransform: 'capitalize',
                    }}
                  >
                    <Typography variant={matches ? 'sub-h' : 'h3'}>
                      {!isCountLoading &&
                        listingsCount &&
                        listingsCount[assetType]}
                    </Typography>
                    <Typography variant={matches ? 'lbl-md' : 'sub-h-bk'}>
                      {assetType}
                    </Typography>
                  </Box>
                }
                value={assetType}
                to={{
                  pathname: `/buyassets/${assetType}`,
                }}
                component={NextLinkComposed}
              />
            ))}
          </TabList>

          <Box
            sx={(theme) => ({
              '& .sticky-header-active .sticky-header': {
                boxShadow: theme.shadows[1],
              },
            })}
          >
            <TabPanel value={'origin'}>
              <NodesTab assetsType={'origin'} />
            </TabPanel>
            <TabPanel value={'drift'}>
              <NodesTab assetsType={'drift'} />
            </TabPanel>
            <TabPanel value={'keycards'}>
              <KeycardsTab assetsType={'keycards'} />
            </TabPanel>
            <TabPanel value={'capsules'}>
              <CapsulesTab assetsType={'capsules'} />
            </TabPanel>
            <TabPanel value={'perks'}>
              <PerksTab assetsType={'perks'} />
            </TabPanel>
          </Box>
        </TabContext>
      </PageContainer>
    </Box>
  );
};

export default ThorfiAssets;
