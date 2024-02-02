import React, { FC } from 'react';
import Sticky from 'react-stickynode';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import PageContainer from '@/layouts/PageContainer';
import ScrollToTop from '@/components/common/ScrollToTop';
import { NextLinkComposed } from '@/components/common/Link';

import PromoteSlider from './PromoteSlider';
import CollectionsHeader from './headers/CollectionsHeader';
import NFTsHeader from './headers/NFTsHeader';
import CollectionsTab from './tabs/CollectionsTab';
import NFTsTab from './tabs/NFTsTab';
import ThorfiCollections from './ThorfiCollections';
import RecentlyAddedCollections from './RecentlyAddedCollections';
import Footer from '@/layouts/Footer';
import { ActivityPanel } from '@/modules/activity';

interface ExploreProps {
  activeTab?: string;
}
const Explore: FC<ExploreProps> = ({ activeTab = 'collections' }) => {
  return (
    <PageContainer>
      <Box>
        <PromoteSlider />
      </Box>

      <Box
        sx={(theme) => ({
          'p': '16px',
          '& .sticky-header-active .sticky-header': {
            boxShadow: theme.shadows[1],
            mx: '-16px',
            px: '16px',
          },
        })}
      >
        <TabContext value={activeTab}>
          <TabList aria-label={'Explore tabs'} sx={{ mb: '24px' }}>
            <Tab
              sx={{ fontFamily: 'Nexa-Bold' }}
              label={'Collections'}
              value={'collections'}
              to={{
                pathname: '/explore/collections',
              }}
              component={NextLinkComposed}
            />
            <Tab
              sx={{ fontFamily: 'Nexa-Bold' }}
              label={'NFTs'}
              value={'nfts'}
              to={{
                pathname: '/explore/nfts',
              }}
              component={NextLinkComposed}
            />
          </TabList>

          <TabPanel value={'collections'}>
            <CollectionsHeader />
            <CollectionsTab />
            <ThorfiCollections />
            <RecentlyAddedCollections />
            <ActivityPanel />
          </TabPanel>
          <TabPanel value={'nfts'}>
            <Sticky
              top={48}
              innerZ={3}
              innerActiveClass={'sticky-header-active'}
            >
              <Box
                sx={(theme) => ({
                  background: theme.palette.background.default,
                  py: '24px',
                  [theme.breakpoints.down('sm')]: {
                    pt: '16px',
                    pb: 0,
                  },
                })}
                className={'sticky-header'}
              >
                <NFTsHeader />
              </Box>
            </Sticky>
            <NFTsTab />
            <ScrollToTop offset={580} />
          </TabPanel>
        </TabContext>
      </Box>

      <Footer />
    </PageContainer>
  );
};

export default Explore;
