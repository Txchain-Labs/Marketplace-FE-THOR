import { useEffect, useMemo } from 'react';
import Tab from '@mui/material/Tab';

import { Box, Typography, useMediaQuery } from '@mui/material';

import NodesTab from './Nodes';
import KeycardsTab from './Keycards';
import CapsulesTab from './Capsules';
import PerksTab from './Perks';

import {
  useGetGameloopAssets,
  useGetNodesV2,
  useGetStakedDriftNodesByTokenIds,
} from '@/hooks/useNodes';
import { formatGameloopAssets, formatNodes } from './Helper';
import {
  ThorfiNFTType_ext,
  assetsType_ext,
  userAssetsInitialState,
} from '@/utils/constants';
import { useGetNFTsFavrt } from '@/hooks/useNFTDetail';
import { useSelector } from '@/redux/store';
import { useChain } from '@/utils/web3Utils';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { NextLinkComposed } from '@/components/common/Link';
import {
  useGetStakedDriftNodes,
  useThorGamificationContract,
} from '@/hooks/useGameloop';
import { isDataRefetching } from '@/redux/slices/managerBagSlice';

interface ThorfiNFTsProps {
  assetType?: ThorfiNFTType_ext;
}

const ManagerPage = ({ assetType = 'origin' }: ThorfiNFTsProps) => {
  // const dataRefetching = useSelector(isDataRefetching);
  const matches = useMediaQuery('(max-width:600px)');
  const dataRefetching = useSelector(isDataRefetching);
  const user = useSelector((state: any) => state?.auth?.user);

  const { data: userNodes, refetch: refetchNodes } = useGetNodesV2();
  // console.log(userNodes, 'nodes all');

  const { data: userAssets, refetch: refetchGameloopAssets } =
    useGetGameloopAssets(user?.address);
  const assets = useMemo(() => {
    return typeof userAssets !== 'undefined'
      ? userAssets
      : userAssetsInitialState;
  }, [userAssets]);
  const gameloopAddress = useThorGamificationContract();
  // console.log(userAssets, 'keys all');
  const { data: stakedDriftNodes, refetch: refetchStakedDriftNodes } =
    useGetStakedDriftNodes(user?.address);
  const chain = useChain();
  const { data: allFavs, refetch: refetchFavrt } = useGetNFTsFavrt(user?.id);
  const filterFavs = allFavs?.filter(
    (fav: any) => fav?.collection_address !== '' || fav?.token_id !== 0
  );
  const stakedDriftOdin = useMemo(() => {
    // console.log(stakedDriftNodes,'nodes')
    if (stakedDriftNodes) {
      const result = stakedDriftNodes
        ?.filter((item: any) => item?.odin === true)
        ?.map((item: any) => Number(item?.tokenId));
      return result ? result : [];
    } else {
      return [];
    }
  }, [stakedDriftNodes]);
  const stakedDriftThor = useMemo(() => {
    if (stakedDriftNodes) {
      const result = stakedDriftNodes
        ?.filter((item: any) => item?.odin === false)
        ?.map((item: any) => Number(item?.tokenId));
      return result ? result : [];
    } else {
      return [];
    }
  }, [stakedDriftNodes]);
  const {
    data: stakedDataFromDappQuery,
    refetch: refetchStakedDriftNodesByTokenIds,
  } = useGetStakedDriftNodesByTokenIds([stakedDriftOdin, stakedDriftThor]);
  const allNodes = useMemo(() => {
    const nodes = formatNodes(
      userNodes,
      filterFavs,
      chain?.id,
      gameloopAddress
    );
    const stakedNodes = formatNodes(
      stakedDataFromDappQuery,
      filterFavs,
      chain?.id,
      gameloopAddress
    );
    return nodes.concat(stakedNodes);
  }, [
    stakedDataFromDappQuery,
    userNodes,
    chain?.id,
    filterFavs,
    gameloopAddress,
  ]);

  const allOriginNodes = useMemo(() => {
    return allNodes?.filter((value: any) => value.nodeType === 'ORIGIN');
  }, [allNodes]);
  const allDriftNodes = useMemo(() => {
    return allNodes?.filter((value: any) => value.nodeType === 'DRIFT');
  }, [allNodes]);

  useEffect(() => {
    const delay = 3000; // Delay in milliseconds (2 seconds)
    const timer = setTimeout(() => {
      refetchNodes();
      refetchGameloopAssets();
      refetchStakedDriftNodes();
      refetchStakedDriftNodesByTokenIds();
    }, delay);
    return () => clearTimeout(timer);
  }, [
    dataRefetching,
    refetchNodes,
    refetchGameloopAssets,
    refetchStakedDriftNodes,
    refetchStakedDriftNodesByTokenIds,
  ]);

  return (
    <Box>
      <Box>
        <Box ml={2}>
          <Typography
            sx={{
              typography: {
                md: 'h1',
                miniMobile: 'h3',
              },
              lineHeight: { md: '85px', miniMobile: '60px' },
              pt: 1.5,
            }}
          >
            Manager
          </Typography>
        </Box>

        <TabContext value={assetType}>
          <TabList
            aria-label={'Buyassets tabs'}
            sx={(theme) => ({
              mb: '20px',
              borderBottom: `3px solid ${theme.palette.divider}`,
              ml: '15px',
              mr: '15px',
            })}
          >
            {assetsType_ext?.slice(1)?.map((assetType) => (
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
                      {assetType === 'origin'
                        ? allOriginNodes?.length || 0
                        : assetType === 'drift'
                        ? allDriftNodes?.length || 0
                        : assetType === 'keycards'
                        ? assets[4]?.length || 0
                        : assetType === 'capsules'
                        ? assets[0]?.length || 0
                        : assetType === 'perks'
                        ? assets[2]?.length || 0
                        : 0}
                    </Typography>
                    <Typography variant={matches ? 'lbl-md' : 'sub-h-bk'}>
                      {assetType}
                    </Typography>
                  </Box>
                }
                value={assetType}
                to={{
                  pathname: `/manager/${assetType}`,
                }}
                component={NextLinkComposed}
              />
            ))}
          </TabList>

          <TabPanel value={'origin'}>
            <NodesTab
              nodes={allOriginNodes}
              refetchFavrt={refetchFavrt}
              isOGorDrift={'origin'}
            />
          </TabPanel>
          <TabPanel value={'drift'}>
            <NodesTab
              nodes={allDriftNodes}
              refetchFavrt={refetchFavrt}
              isOGorDrift={'drift'}
            />
          </TabPanel>
          <TabPanel value={'keycards'}>
            <KeycardsTab
              keycards={formatGameloopAssets(
                'keycard',
                assets[4],
                assets[5],
                filterFavs,
                chain?.id
              )}
              refetchFavrt={refetchFavrt}
            />
          </TabPanel>
          <TabPanel value={'capsules'}>
            <CapsulesTab
              capsules={formatGameloopAssets(
                'capsule',
                assets[0],
                assets[1],
                filterFavs,
                chain?.id
              )}
              refetchFavrt={refetchFavrt}
            />
          </TabPanel>
          <TabPanel value={'perks'}>
            <PerksTab
              perks={formatGameloopAssets(
                'perk',
                assets[2],
                assets[3],
                filterFavs,
                chain?.id
              )}
              refetchFavrt={refetchFavrt}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default ManagerPage;
