import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Typography,
  Grid,
  Box,
  Button,
  Link,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Tooltip,
  Tab,
} from '@mui/material';
import {
  ArrowBackIos,
  RemoveCircle as RemoveCircleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

import {
  useGetAllNodes,
  useTransformNode,
  TransformType,
  useGamificationAllowance,
  useApproveGamification,
  useGetDriftKeycardCap,
  useGetDriftKeycardTotalSupply,
} from './hooks/useTransformNodes';
import { formatNumber } from '@/utils/common';
import { useSetAttribute } from '@/hooks/uiHooks';

import BaseAlertModal from '@/components/modals/BaseAlertModal';
import MobileDrawer from './MobileDrawer';
import TransformCard from '../transform-nodes/components/TransformCard';
import { bonusApplied } from '@/utils/helper';
import { TabContext, TabList } from '@mui/lab';

const btn = {
  'width': '250px',
  'height': '40px',
  'alignItems': 'center',
  'fontSize': '12px',
  '&:hover': {
    'clipPath':
      'polygon(0 0, 92.5% 0, 100% 30%, 100% 100%, 7.5% 100%, 0% 70%, 0 0)',
    'transition': ' clip-path 1s',
    'zIndex': 10001,
    '&$btnWrapper': {
      opacity: 1,
    },
  },
  '&:active': {
    boxShadow: 'inset rgba(0, 0, 0, 0.25) 0px 3px 0px',
  },
  '&:disabled': {
    background: '#B3B3B3',
  },
};
const btnBuyNodes = {
  ...btn,

  marginTop: '20px',
  width: '150px',
  height: '35px',
};

const funcFilterNodesData = (allNodes: any) => {
  const filteredData: any = {
    Odin: [],
    Thor: [],
  };

  // let skippedNodes = 0;
  //   iteration = 0;

  if (allNodes && allNodes.length > 0) {
    for (let i = 0; i < allNodes.length; i++) {
      if (
        allNodes?.[i]?.nodeType === 'ORIGIN' &&
        (allNodes?.[i]?.tier === 'THOR' || allNodes?.[i]?.tier === 'ODIN')
      ) {
        const dueDate = allNodes[i].dueDate
          ? BigNumber.from(allNodes[i].dueDate as BigNumberish).toNumber()
          : 0;

        if (
          allNodes[i].isListed ||
          (allNodes[i].nodeType === 'ORIGIN' && dueDate * 1000 < Date.now())
        ) {
          // console.log(
          //   '--------- skkkipping  ' +
          //     skippedNodes +
          //     '  ; ' +
          //     allNodes[i].isListed +
          //     '   , ' +
          //     allNodes[i].dueDate * 1000 +
          //     '    , ' +
          //     Date.now()
          // );

          // skippedNodes++;
          continue; ///// pass if inactive node, or if is listed
        }

        ///// iteration++;
        ///// console.log('--------- pushing  ' + iteration);
        ///// console.log('    ');
        ///// console.log(allNodes[i][2][0] + allNodes[i][2].slice(1).toLowerCase());

        filteredData[
          allNodes[i][2][0] + allNodes[i][2].slice(1).toLowerCase()
        ].push({
          node: {
            nodeType: allNodes[i].nodeType,
            isThorOdin: allNodes[i][2],
            class: allNodes[i][2][0] + allNodes[i][2].slice(1).toLowerCase(),
            tokenId: allNodes[i].tokenId,
            tier: allNodes[i].tier,
            name: allNodes[i].name,
            image: allNodes[i].image,
            creationTime: allNodes[i].creationTime,
            lastClaimTime: allNodes[i].lastClaimTime,
            rewards: Number(
              ethers.utils.formatEther(allNodes[i].rewards as BigNumberish)
            ),
            dueDate: dueDate,
            multiplier: allNodes[i].multiplier,
            rewardsActivatedTime: allNodes[i].rewardsActivatedTime,
            fixedRewardPerNode: allNodes[i].fixedRewardPerNode,
            price: allNodes[i].price
              ? ethers.utils.formatEther(allNodes[i].price as BigNumberish)
              : 0,
            perks: allNodes[i].perks,
            perksEndTime: allNodes[i].perksEndTime,
            vrr: ethers.utils.formatEther(
              allNodes[i].currentVrr as BigNumberish
            ),
          },
          selected: false,
        });
      } else {
        ///// console.log('---------  WHY NOT?  ' + allNodes[i]);
      }
    }
  }

  return filteredData;
};

const Transform2Drift = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const backButtonRef = useSetAttribute([
    { key: 'id', value: 'back-button' },
    { key: 'dusk', value: 'back-button' },
  ]);

  const { data: allNodes } = useGetAllNodes();
  const { isSuccess: isTransformationSuccess, transformNodes } =
    useTransformNode();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(<></>);

  // console.log('allNodes', allNodes);

  const [mainData, setMainData] = useState(funcFilterNodesData(allNodes));
  const [selectedNodeType, setSelectedNodeType] = useState('Thor');

  const [totalSelected, setTotalSelected] = useState(0);
  const [selectedNodes, setSelectedNodes] = useState([]);

  const [isTransformationLimitReached /* setIsTransformationLimitReached */] =
    useState(false);

  const { data: isAllowedOriginThor, refetch: refetchAllowanceOriginThor } =
    useGamificationAllowance('Origin Thor');
  const { data: isAllowedOriginOdin, refetch: refetchAllowanceOriginOdin } =
    useGamificationAllowance('Origin Odin');
  const { approve: approveOriginThor, isSuccess: isSuccessApprovedOriginThor } =
    useApproveGamification('Origin Thor');
  const { approve: approveOriginOdin, isSuccess: isSuccessApprovedOriginOdin } =
    useApproveGamification('Origin Odin');

  useEffect(() => {
    if (isSuccessApprovedOriginThor && refetchAllowanceOriginThor) {
      refetchAllowanceOriginThor();
    }
    if (isSuccessApprovedOriginOdin && refetchAllowanceOriginOdin) {
      refetchAllowanceOriginOdin();
    }
  }, [
    refetchAllowanceOriginThor,
    refetchAllowanceOriginOdin,
    isSuccessApprovedOriginThor,
    isSuccessApprovedOriginOdin,
  ]);

  const { data: odinDriftCap } = useGetDriftKeycardCap('Drift Odin');
  const { data: thorDriftCap } = useGetDriftKeycardCap('Drift Thor');
  const { data: odinDriftTotalSupply } =
    useGetDriftKeycardTotalSupply('Drift Odin');
  const { data: thorDriftTotalSupply } =
    useGetDriftKeycardTotalSupply('Drift Thor');

  const isAllApproved = useMemo(() => {
    return (
      (selectedNodeType === 'Odin' && isAllowedOriginOdin) ||
      (selectedNodeType === 'Thor' && isAllowedOriginThor)
    );
  }, [selectedNodeType, isAllowedOriginOdin, isAllowedOriginThor]);

  const handleTransform2Drift = () => {
    if (selectedNodes.length > 0) {
      const nodesToTransform = selectedNodes.map((each) => {
        return {
          isThorOdin: each.node.isThorOdin,
          tokenId: each.node.tokenId,
        };
      });

      if (
        (selectedNodeType === 'Odin' && isAllowedOriginOdin) ||
        (selectedNodeType === 'Thor' && isAllowedOriginThor)
      ) {
        transformNodes([
          nodesToTransform
            .filter((value) => value.isThorOdin === 'ODIN')
            .map((each) => each.tokenId),
          nodesToTransform
            .filter((value) => value.isThorOdin === 'THOR')
            .map((each) => each.tokenId),
          TransformType.Drift,
        ]);
      } else {
        (selectedNodeType === 'Odin' && approveOriginOdin()) ||
          (selectedNodeType === 'Thor' && approveOriginThor());
      }
    }
  };

  const selectNode = (nodeType: string, index: number) => {
    const mixed =
      selectedNodes.length &&
      selectedNodes.filter(
        (node) => node.node.tier && node.node.tier !== nodeType.toUpperCase()
      );
    if (mixed.length) {
      setAlertMessage(<>You can not mix odins & thors for transformation</>);
      setShowAlert(true);
      return;
    }

    mainData[nodeType][index] = {
      node: mainData[nodeType][index].node,
      selected: !mainData[nodeType][index].selected,
    };

    setTotalSelected(
      mainData[nodeType][index].selected ? totalSelected + 1 : totalSelected - 1
    );

    setMainData({
      ...mainData,
    });

    const lambda = (each: any) => each.selected;
    setSelectedNodes(
      mainData['Thor'].filter(lambda).concat(mainData['Odin'].filter(lambda))
    );

    if (
      mainData[nodeType][index].selected &&
      mainData[nodeType][index].node.perks &&
      mainData[nodeType][index].node.perks.length > 0
    ) {
      if (
        bonusApplied(
          mainData[nodeType][index].node.lastClaimTime,
          mainData[nodeType][index].node.perksEndTime
        )
      ) {
        setAlertMessage(
          <>
            The current selection(s) have bonus perks applied. <br />
            If you wish to proceed to transform, your perk(s) will disappear.
          </>
        );
        setShowAlert(true);
      } else {
        setAlertMessage(
          <>
            The current selection(s) have perks already in use. <br />
            If you wish to proceed to transform, your perk(s) will disappear.
          </>
        );
        setShowAlert(true);
      }
    }
  };

  const deselectNode = (nodeType: string, name: string) => {
    for (let i = 0; i < mainData[nodeType].length; i++) {
      if (mainData[nodeType][i].node.name === name)
        mainData[nodeType][i] = {
          node: mainData[nodeType][i].node,
          selected: false,
        };
    }

    setTotalSelected(totalSelected - 1);

    setMainData({
      ...mainData,
    });

    const lambda = (each: any) => each.selected;
    setSelectedNodes(
      mainData['Thor'].filter(lambda).concat(mainData['Odin'].filter(lambda))
    );
  };

  const handleClose = () => {
    setShowAlert(false);
  };

  const [multiplierGif, setMultiplierGif] = useState(false);

  useEffect(() => {
    if (isTransformationSuccess === true) {
      setMultiplierGif(true);
      const timer = setTimeout(() => {
        router.push('/gameloop/activate-drift-nodes-indirect');
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [router, isTransformationSuccess]);
  const [open, setOpen] = useState(false);
  // Handler to open the Drawer
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // Handler to close the Drawer
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={(theme) => ({ backgroundColor: theme.palette.background.paper })}>
      <BaseAlertModal
        open={showAlert}
        handleClose={handleClose}
        title={''}
        message={alertMessage}
      />
      <Grid
        container
        spacing={2}
        sx={{
          bgcolor: 'background.default',
        }}
      >
        <Grid
          item
          md={6}
          miniMobile={12}
          sx={{
            paddingLeft: '3px',
            paddingRight: '6px',
          }}
        >
          <Box
            sx={{
              padding: '5px 20px',
            }}
          >
            <Button
              startIcon={<ArrowBackIos />}
              size={'small'}
              sx={{ color: 'text.secondary' }}
              onClick={() => router.back()}
              ref={backButtonRef}
            >
              Back
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              overflow: 'auto',
              margin: '20px',
            }}
          >
            <TabContext value={selectedNodeType}>
              <TabList
                aria-label={'Gameloop tabs'}
                sx={{
                  'minHeight': 'unset',
                  '& .MuiTabs-indicator': { display: 'none' },
                }}
                onChange={(_event, value) => setSelectedNodeType(value)}
              >
                {Object.keys(mainData).map(
                  (eachNodeType: string, index: number) => (
                    <Tab
                      key={eachNodeType + index}
                      label={`${eachNodeType} ${mainData[eachNodeType].length}`}
                      value={eachNodeType}
                      sx={{
                        'textTransform': 'capitalize',
                        'fontSize': '16px',
                        'lineHeight': '24px',
                        'fontWeight': 700,
                        'p': '1.5px 16px',
                        'minHeight': 'unset',
                        '&.Mui-selected': {
                          bgcolor: 'text.primary',
                          color: 'background.default',
                          borderRadius: '27px',
                        },
                      }}
                    />
                  )
                )}
              </TabList>
            </TabContext>
          </Box>

          <Box
            // container
            sx={{
              padding: 1,
              overflowY: 'scroll',
              height: {
                miniMobile: `calc(100vh - 190px)`,
                sm: `calc(100vh - 166px)`,
              },
              display: 'flex',
              width: '100%',
              flexWrap: 'wrap',
            }}
          >
            <Grid container spacing={0}>
              {allNodes && allNodes.length > 0 ? (
                mainData[selectedNodeType].map(
                  (eachNode: any, index: number) => {
                    return (
                      <Grid
                        key={eachNode.node.tier + eachNode.node.tokenId}
                        item
                        miniMobile={6}
                        xs={6}
                        sm={4}
                        md={6}
                        lg={4}
                      >
                        <TransformCard
                          pageType="node"
                          tier={eachNode.node.tier}
                          type={eachNode.node.nodeType.toUpperCase()}
                          name={eachNode.node.name}
                          vrr={eachNode.node.vrr}
                          pendingReward={formatNumber(eachNode.node.rewards)}
                          perks={eachNode.node.perks}
                          isSelected={eachNode.selected}
                          onClick={() =>
                            !isTransformationLimitReached &&
                            selectNode(selectedNodeType, index)
                          }
                        />
                      </Grid>
                    );
                  }
                )
              ) : (
                <Grid item md={12} xs={12} sx={{ textAlign: 'center' }}>
                  <svg
                    style={{ marginTop: '30px' }}
                    width="49"
                    height="36"
                    viewBox="0 0 49 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.1825 21.6855C16.1221 21.6855 14.4464 20.0208 14.4464 17.974C14.4464 15.9272 16.1221 14.2624 18.1825 14.2624H40.5692V9.89587H18.1825C13.715 9.89587 10.0799 13.5201 10.0799 17.974C10.0799 22.4278 13.715 26.0521 18.1825 26.0521H48.1834V21.6855H18.1825Z"
                      fill="#808080"
                    />
                    <path
                      d="M18.1519 0C8.24258 0 0.183594 8.0317 0.183594 17.9028C0.183594 27.7739 8.24258 35.8056 18.1519 35.8056H48.1118V31.4391H18.1519C10.6524 31.4391 4.55013 25.3669 4.55013 17.9028C4.55013 10.4388 10.6524 4.36654 18.1519 4.36654H48.1118V0H18.1519Z"
                      fill="#808080"
                    />
                    <path
                      d="M45.5894 9.89587C44.3025 9.89587 43.2608 10.9375 43.2608 12.2245C43.2608 13.5114 44.3025 14.5531 45.5894 14.5531C46.8764 14.5531 47.918 13.5114 47.918 12.2245C47.918 10.9375 46.8764 9.89587 45.5894 9.89587Z"
                      fill="#808080"
                    />
                  </svg>

                  <Typography sx={{ marginTop: '10px' }}>
                    You have no NFTs
                  </Typography>

                  <Link href="/thorfi/nodes">
                    <Button
                      variant={'contained'}
                      sx={{ ...btnBuyNodes, clipPath: 'none !important' }}
                    >
                      <Typography
                        variant="overline"
                        fontWeight={'700'}
                        lineHeight={'30px'}
                        fontSize={'13px'}
                        textTransform={'initial'}
                      >
                        Buy NFTs
                      </Typography>
                    </Button>
                  </Link>
                </Grid>
              )}
            </Grid>
            <Box
              sx={{
                height: '160px',
                width: '100%',
                display: smDown ? 'block' : 'none',
              }}
            />
          </Box>
        </Grid>
        <Grid
          item
          md={6}
          sx={{
            paddingLeft: '10px',
            display: {
              md: 'block',
              miniMobile: 'none',
            },
            boxShadow:
              theme.palette.mode === 'light'
                ? 'inset 0px -4.08108px 16.3243px rgba(0, 0, 0, 0.25)'
                : undefined,
          }}
        >
          <Typography
            variant="lbl-md"
            sx={{
              position: 'absolute',
              fontFamily: 'Nexa-Bold',
              fontWeight: '300',
              fontSize: '32px',
              lineHeight: '61px',

              textAlign: {
                md: 'left',
                xs: 'center',
              },
              marginTop: {
                md: '20px',
                xs: '40px',
              },
              marginLeft: {
                md: '10px',
              },
            }}
          >
            Transform to Drift
          </Typography>

          <Typography
            variant="lbl-md"
            sx={{
              color: 'text.secondary',
              position: 'absolute',
              fontFamily: 'Nexa',
              fontWeight: '300',
              fontSize: '15px',
              lineHeight: '56px',

              textAlign: {
                md: 'left',
                xs: 'center',
              },
              marginTop: {
                md: '60px',
                xs: '80px',
              },
              marginLeft: {
                md: '10px',
              },
            }}
          >
            SELECT YOUR NODES
            <IconButton>
              <Tooltip
                title={`Only unlisted active NFTs can participate in GameLoop features.   ${
                  selectedNodeType === 'Odin'
                    ? '' +
                      formatNumber(Number(odinDriftCap)) +
                      ' / ' +
                      formatNumber(Number(odinDriftTotalSupply))
                    : '' +
                      formatNumber(Number(thorDriftCap)) +
                      ' / ' +
                      formatNumber(Number(thorDriftTotalSupply))
                } Batch available`}
                placement={'bottom-start'}
              >
                <InfoIcon sx={{ color: 'text.secondary', marginTop: '-3px' }} />
              </Tooltip>
            </IconButton>
          </Typography>

          {totalSelected > 0 ? (
            <TableContainer
              sx={{
                marginTop: '150px',
                height: 'calc(100vh - 275px)',
                overflowY: 'scroll',
                boxShadow: 'none',
                backgroundImage: 'none',
              }}
            >
              <Table aria-label="simple table">
                <TableBody>
                  {selectedNodes.map((row) => (
                    <TableRow
                      hover
                      key={row.node.tier + row.node.tokenId}
                      sx={{
                        'height': '80px',
                        '&:hover .DeSelectIcon': {
                          display: 'block',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography sx={{ fontWeight: 900, fontSize: '13px' }}>
                          {row.node.name}
                        </Typography>
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: '13px' }}
                        >
                          {row.node.isThorOdin}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          paddingRight: '7.5px',
                        }}
                      >
                        <Typography sx={{ fontWeight: 900, fontSize: '24px' }}>
                          {formatNumber(row.node.vrr, 5)}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingLeft: '7.5px',
                        }}
                      >
                        <Typography
                          sx={{ fontSize: '13px', color: 'text.secondary' }}
                        >
                          VRR
                        </Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: '13px' }}>
                          THOR PER DAY
                        </Typography>
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: '13px' }}
                        >
                          {formatNumber(row.node.rewards, 1)} Pending Rewards
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingLeft: '7.5px',
                        }}
                      >
                        {multiplierGif ? (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '5px',
                              width: '100%',
                            }}
                          >
                            <Typography variant="caption">x</Typography>
                            <img
                              style={{ width: '82px', height: '41px' }}
                              src="/images/multiplier.gif"
                            />
                          </Box>
                        ) : (
                          <svg
                            width="100"
                            height="75"
                            viewBox="0 0 129 86"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M7.84001 39.9383C8.05333 39.725 8.05333 39.3792 7.84001 39.1658C7.62669 38.9525 7.28084 38.9525 7.06752 39.1658L4 42.2334L0.932482 39.1658C0.719164 38.9525 0.373307 38.9525 0.159989 39.1658C-0.0533295 39.3792 -0.0533295 39.725 0.159989 39.9383L3.22751 43.0059L0.159989 46.0734C-0.0533295 46.2867 -0.0533295 46.6326 0.159989 46.8459C0.373307 47.0592 0.719164 47.0592 0.932482 46.8459L4 43.7784L7.06752 46.8459C7.28084 47.0592 7.62669 47.0592 7.84001 46.8459C8.05333 46.6326 8.05333 46.2867 7.84001 46.0734L4.77249 43.0059L7.84001 39.9383Z"
                              fill="currentColor"
                            />
                            <path
                              d="M45.776 43.7459L44.1908 42.5264L44.1808 42.5394L44.1711 42.5525L45.776 43.7459ZM50.928 40.4419L50.3149 38.5381L50.314 38.5384L50.928 40.4419ZM55.632 38.0899L56.9861 39.5617L57.0017 39.5473L57.0171 39.5326L55.632 38.0899ZM54.848 30.3619L53.6616 31.972L53.6853 31.9895L53.7096 32.0062L54.848 30.3619ZM42.752 30.5299L41.5643 28.9207L41.555 28.9276L41.5458 28.9345L42.752 30.5299ZM40.456 34.9539V36.9539H42.456V34.9539H40.456ZM33.904 34.9539H31.904V36.9539H33.904V34.9539ZM35.696 28.6819L34.0371 27.5646L34.0319 27.5725L35.696 28.6819ZM40.904 24.4819L41.6992 26.317L41.7064 26.3139L41.7135 26.3107L40.904 24.4819ZM59.664 26.1619L58.4011 27.7127L58.4132 27.7226L58.4254 27.7322L59.664 26.1619ZM61.456 41.2259L62.9527 42.5525V42.5525L61.456 41.2259ZM54.176 45.4819L53.5125 43.5951L53.5072 43.597L54.176 45.4819ZM51.6 47.2179L50 46.0179L49.9949 46.0246L49.9899 46.0315L51.6 47.2179ZM50.816 51.8099V53.8099H52.816V51.8099H50.816ZM44.152 51.8099H42.152V53.8099H44.152V51.8099ZM44.6 62.0019L43.1858 63.4161L43.223 63.4533L43.2621 63.4884L44.6 62.0019ZM44.6 56.5699L45.9755 58.0218L45.9951 58.0032L46.0142 57.9841L44.6 56.5699ZM50.2 56.5699L48.7858 57.9841L48.8049 58.0032L48.8245 58.0218L50.2 56.5699ZM50.144 62.0019L51.5195 63.4538L51.5215 63.4519L50.144 62.0019ZM46.152 49.4019C46.152 47.3977 46.6179 45.9654 47.3809 44.9393L44.1711 42.5525C42.7688 44.4383 42.152 46.7767 42.152 49.4019H46.152ZM47.3612 44.9653C48.1656 43.9196 49.4897 43.0073 51.542 42.3453L50.314 38.5384C47.7369 39.3698 45.6264 40.6601 44.1908 42.5264L47.3612 44.9653ZM51.5411 42.3456C53.8286 41.6089 55.7301 40.7172 56.9861 39.5617L54.2779 36.618C53.6672 37.1798 52.4327 37.8561 50.3149 38.5381L51.5411 42.3456ZM57.0171 39.5326C58.3719 38.232 59.032 36.5587 59.032 34.6739H55.032C55.032 35.5517 54.7587 36.1558 54.2469 36.6471L57.0171 39.5326ZM59.032 34.6739C59.032 32.193 58.0157 30.1224 55.9864 28.7175L53.7096 32.0062C54.5923 32.6173 55.032 33.4214 55.032 34.6739H59.032ZM56.0344 28.7517C54.1378 27.3543 51.6177 26.7939 48.744 26.7939V30.7939C51.1717 30.7939 52.7208 31.2788 53.6616 31.972L56.0344 28.7517ZM48.744 26.7939C45.9962 26.7939 43.5529 27.4529 41.5643 28.9207L43.9397 32.139C45.0871 31.2921 46.6385 30.7939 48.744 30.7939V26.7939ZM41.5458 28.9345C39.5563 30.4388 38.456 32.4853 38.456 34.9539H42.456C42.456 33.8385 42.8864 32.9356 43.9582 32.1252L41.5458 28.9345ZM40.456 32.9539H33.904V36.9539H40.456V32.9539ZM35.904 34.9539C35.904 32.9145 36.4081 31.2193 37.3601 29.7913L34.0319 27.5725C32.5946 29.7284 31.904 32.2146 31.904 34.9539H35.904ZM37.3549 29.7991C38.351 28.3199 39.771 27.1525 41.6992 26.317L40.1088 22.6467C37.557 23.7525 35.505 25.3851 34.0371 27.5647L37.3549 29.7991ZM41.7135 26.3107C43.6903 25.4357 46.0376 24.9699 48.8 24.9699V20.9699C45.5891 20.9699 42.6724 21.512 40.0945 22.653L41.7135 26.3107ZM48.8 24.9699C53.1399 24.9699 56.2576 25.9673 58.4011 27.7127L60.9269 24.611C57.8437 22.1004 53.7188 20.9699 48.8 20.9699V24.9699ZM58.4254 27.7322C60.5508 29.4086 61.64 31.6807 61.64 34.7859H65.64C65.64 30.5737 64.0785 27.0965 60.9026 24.5915L58.4254 27.7322ZM61.64 34.7859C61.64 37.0541 61.0268 38.6949 59.9593 39.8992L62.9527 42.5525C64.7972 40.4715 65.64 37.8189 65.64 34.7859H61.64ZM59.9593 39.8992C58.8297 41.1736 56.7719 42.4489 53.5125 43.5951L54.8395 47.3686C58.3747 46.1254 61.1703 44.5634 62.9527 42.5525L59.9593 39.8992ZM53.5072 43.597C52.0941 44.0984 50.8603 44.8708 50 46.0179L53.2 48.4179C53.4597 48.0715 53.9432 47.6866 54.8448 47.3667L53.5072 43.597ZM49.9899 46.0315C49.1526 47.1678 48.816 48.5315 48.816 49.9619H52.816C52.816 49.1522 53.0021 48.6866 53.2101 48.4043L49.9899 46.0315ZM48.816 49.9619V51.8099H52.816V49.9619H48.816ZM50.816 49.8099H44.152V53.8099H50.816V49.8099ZM46.152 51.8099V49.4019H42.152V51.8099H46.152ZM47.4 61.0099C46.7129 61.0099 46.2743 60.818 45.9379 60.5153L43.2621 63.4884C44.4191 64.5297 45.8471 65.0099 47.4 65.0099V61.0099ZM46.0142 60.5876C45.7116 60.285 45.536 59.9125 45.536 59.3139H41.536C41.536 60.8805 42.0698 62.3001 43.1858 63.4161L46.0142 60.5876ZM45.536 59.3139C45.536 58.5959 45.7381 58.2467 45.9755 58.0218L43.2245 55.118C42.0432 56.2371 41.536 57.7171 41.536 59.3139H45.536ZM46.0142 57.9841C46.2903 57.708 46.6848 57.5059 47.4 57.5059V53.5059C45.8006 53.5059 44.3283 54.0131 43.1858 55.1556L46.0142 57.9841ZM47.4 57.5059C48.1152 57.5059 48.5097 57.708 48.7858 57.9841L51.6142 55.1556C50.4717 54.0131 48.9994 53.5059 47.4 53.5059V57.5059ZM48.8245 58.0218C49.0619 58.2467 49.264 58.5959 49.264 59.3139H53.264C53.264 57.7171 52.7568 56.2371 51.5755 55.118L48.8245 58.0218ZM49.264 59.3139C49.264 59.8798 49.0934 60.2413 48.7665 60.5519L51.5215 63.4519C52.6879 62.3438 53.264 60.9132 53.264 59.3139H49.264ZM48.7685 60.55C48.4853 60.8183 48.0888 61.0099 47.4 61.0099V65.0099C48.9512 65.0099 50.384 64.5295 51.5195 63.4538L48.7685 60.55ZM77.1688 43.7459L75.5836 42.5264L75.5736 42.5394L75.5639 42.5525L77.1688 43.7459ZM82.3208 40.4419L81.7078 38.5381L81.7068 38.5384L82.3208 40.4419ZM87.0248 38.0899L88.3789 39.5617L88.3946 39.5473L88.4099 39.5326L87.0248 38.0899ZM86.2408 30.3619L85.0544 31.972L85.0782 31.9895L85.1024 32.0062L86.2408 30.3619ZM74.1448 30.5299L72.9571 28.9207L72.9478 28.9276L72.9386 28.9345L74.1448 30.5299ZM71.8488 34.9539V36.9539H73.8488V34.9539H71.8488ZM65.2968 34.9539H63.2968V36.9539H65.2968V34.9539ZM67.0888 28.6819L65.4299 27.5646L65.4247 27.5725L67.0888 28.6819ZM72.2968 24.4819L73.092 26.317L73.0992 26.3139L73.1063 26.3107L72.2968 24.4819ZM91.0568 26.1619L89.794 27.7127L89.806 27.7226L89.8182 27.7322L91.0568 26.1619ZM92.8488 41.2259L94.3455 42.5525V42.5525L92.8488 41.2259ZM85.5688 45.4819L84.9053 43.5951L84.9 43.597L85.5688 45.4819ZM82.9928 47.2179L81.3928 46.0179L81.3877 46.0246L81.3827 46.0315L82.9928 47.2179ZM82.2088 51.8099V53.8099H84.2088V51.8099H82.2088ZM75.5448 51.8099H73.5448V53.8099H75.5448V51.8099ZM75.9928 62.0019L74.5786 63.4161L74.6158 63.4533L74.6549 63.4884L75.9928 62.0019ZM75.9928 56.5699L77.3683 58.0218L77.3879 58.0032L77.407 57.9841L75.9928 56.5699ZM81.5928 56.5699L80.1786 57.9841L80.1977 58.0032L80.2173 58.0218L81.5928 56.5699ZM81.5368 62.0019L82.9123 63.4538L82.9143 63.4519L81.5368 62.0019ZM77.5448 49.4019C77.5448 47.3977 78.0107 45.9654 78.7737 44.9393L75.5639 42.5525C74.1616 44.4383 73.5448 46.7767 73.5448 49.4019H77.5448ZM78.7541 44.9653C79.5584 43.9196 80.8825 43.0073 82.9348 42.3453L81.7068 38.5384C79.1297 39.3698 77.0192 40.6601 75.5836 42.5264L78.7541 44.9653ZM82.9339 42.3456C85.2214 41.6089 87.1229 40.7172 88.3789 39.5617L85.6707 36.618C85.06 37.1798 83.8255 37.8561 81.7078 38.5381L82.9339 42.3456ZM88.4099 39.5326C89.7648 38.232 90.4248 36.5587 90.4248 34.6739H86.4248C86.4248 35.5517 86.1515 36.1558 85.6398 36.6471L88.4099 39.5326ZM90.4248 34.6739C90.4248 32.193 89.4085 30.1224 87.3792 28.7175L85.1024 32.0062C85.9851 32.6173 86.4248 33.4214 86.4248 34.6739H90.4248ZM87.4272 28.7517C85.5306 27.3543 83.0105 26.7939 80.1368 26.7939V30.7939C82.5645 30.7939 84.1137 31.2788 85.0544 31.972L87.4272 28.7517ZM80.1368 26.7939C77.389 26.7939 74.9458 27.4529 72.9571 28.9207L75.3325 32.139C76.4799 31.2921 78.0313 30.7939 80.1368 30.7939V26.7939ZM72.9386 28.9345C70.9491 30.4388 69.8488 32.4853 69.8488 34.9539H73.8488C73.8488 33.8385 74.2792 32.9356 75.351 32.1252L72.9386 28.9345ZM71.8488 32.9539H65.2968V36.9539H71.8488V32.9539ZM67.2968 34.9539C67.2968 32.9145 67.8009 31.2193 68.7529 29.7913L65.4247 27.5725C63.9874 29.7284 63.2968 32.2146 63.2968 34.9539H67.2968ZM68.7477 29.7991C69.7438 28.3199 71.1638 27.1525 73.092 26.317L71.5016 22.6467C68.9498 23.7525 66.8978 25.3851 65.4299 27.5647L68.7477 29.7991ZM73.1063 26.3107C75.0831 25.4357 77.4304 24.9699 80.1928 24.9699V20.9699C76.9819 20.9699 74.0652 21.512 71.4873 22.653L73.1063 26.3107ZM80.1928 24.9699C84.5327 24.9699 87.6504 25.9673 89.794 27.7127L92.3197 24.611C89.2365 22.1004 85.1116 20.9699 80.1928 20.9699V24.9699ZM89.8182 27.7322C91.9436 29.4086 93.0328 31.6807 93.0328 34.7859H97.0328C97.0328 30.5737 95.4713 27.0965 92.2954 24.5915L89.8182 27.7322ZM93.0328 34.7859C93.0328 37.0541 92.4196 38.6949 91.3521 39.8992L94.3455 42.5525C96.19 40.4715 97.0328 37.8189 97.0328 34.7859H93.0328ZM91.3521 39.8992C90.2225 41.1736 88.1648 42.4489 84.9053 43.5951L86.2323 47.3686C89.7675 46.1254 92.5631 44.5634 94.3455 42.5525L91.3521 39.8992ZM84.9 43.597C83.4869 44.0984 82.2531 44.8708 81.3928 46.0179L84.5928 48.4179C84.8525 48.0715 85.336 47.6866 86.2376 47.3667L84.9 43.597ZM81.3827 46.0315C80.5454 47.1678 80.2088 48.5315 80.2088 49.9619H84.2088C84.2088 49.1522 84.3949 48.6866 84.6029 48.4043L81.3827 46.0315ZM80.2088 49.9619V51.8099H84.2088V49.9619H80.2088ZM82.2088 49.8099H75.5448V53.8099H82.2088V49.8099ZM77.5448 51.8099V49.4019H73.5448V51.8099H77.5448ZM78.7928 61.0099C78.1057 61.0099 77.6671 60.818 77.3307 60.5153L74.6549 63.4884C75.8119 64.5297 77.2399 65.0099 78.7928 65.0099V61.0099ZM77.407 60.5876C77.1044 60.285 76.9288 59.9125 76.9288 59.3139H72.9288C72.9288 60.8805 73.4626 62.3001 74.5786 63.4161L77.407 60.5876ZM76.9288 59.3139C76.9288 58.5959 77.1309 58.2467 77.3683 58.0218L74.6173 55.118C73.4361 56.2371 72.9288 57.7171 72.9288 59.3139H76.9288ZM77.407 57.9841C77.6831 57.708 78.0776 57.5059 78.7928 57.5059V53.5059C77.1934 53.5059 75.7212 54.0131 74.5786 55.1556L77.407 57.9841ZM78.7928 57.5059C79.508 57.5059 79.9025 57.708 80.1786 57.9841L83.007 55.1556C81.8645 54.0131 80.3923 53.5059 78.7928 53.5059V57.5059ZM80.2173 58.0218C80.4547 58.2467 80.6568 58.5959 80.6568 59.3139H84.6568C84.6568 57.7171 84.1496 56.2371 82.9683 55.118L80.2173 58.0218ZM80.6568 59.3139C80.6568 59.8798 80.4862 60.2413 80.1593 60.5519L82.9143 63.4519C84.0807 62.3438 84.6568 60.9132 84.6568 59.3139H80.6568ZM80.1613 60.55C79.8781 60.8183 79.4816 61.0099 78.7928 61.0099V65.0099C80.344 65.0099 81.7768 64.5295 82.9123 63.4538L80.1613 60.55ZM108.562 43.7459L106.976 42.5264L106.966 42.5394L106.957 42.5525L108.562 43.7459ZM113.714 40.4419L113.101 38.5381L113.1 38.5384L113.714 40.4419ZM118.418 38.0899L119.772 39.5617L119.787 39.5473L119.803 39.5326L118.418 38.0899ZM117.634 30.3619L116.447 31.972L116.471 31.9895L116.495 32.0062L117.634 30.3619ZM105.538 30.5299L104.35 28.9207L104.341 28.9276L104.331 28.9345L105.538 30.5299ZM103.242 34.9539V36.9539H105.242V34.9539H103.242ZM96.6896 34.9539H94.6896V36.9539H96.6896V34.9539ZM98.4816 28.6819L96.8227 27.5646L96.8175 27.5725L98.4816 28.6819ZM103.69 24.4819L104.485 26.317L104.492 26.3139L104.499 26.3107L103.69 24.4819ZM122.45 26.1619L121.187 27.7127L121.199 27.7226L121.211 27.7322L122.45 26.1619ZM124.242 41.2259L125.738 42.5525V42.5525L124.242 41.2259ZM116.962 45.4819L116.298 43.5951L116.293 43.597L116.962 45.4819ZM114.386 47.2179L112.786 46.0179L112.781 46.0246L112.776 46.0315L114.386 47.2179ZM113.602 51.8099V53.8099H115.602V51.8099H113.602ZM106.938 51.8099H104.938V53.8099H106.938V51.8099ZM107.386 62.0019L105.971 63.4161L106.009 63.4533L106.048 63.4884L107.386 62.0019ZM107.386 56.5699L108.761 58.0218L108.781 58.0032L108.8 57.9841L107.386 56.5699ZM112.986 56.5699L111.571 57.9841L111.591 58.0032L111.61 58.0218L112.986 56.5699ZM112.93 62.0019L114.305 63.4538L114.307 63.4519L112.93 62.0019ZM108.938 49.4019C108.938 47.3977 109.404 45.9654 110.167 44.9393L106.957 42.5525C105.554 44.4383 104.938 46.7767 104.938 49.4019H108.938ZM110.147 44.9653C110.951 43.9196 112.275 43.0073 114.328 42.3453L113.1 38.5384C110.523 39.3698 108.412 40.6601 106.976 42.5264L110.147 44.9653ZM114.327 42.3456C116.614 41.6089 118.516 40.7172 119.772 39.5617L117.064 36.618C116.453 37.1798 115.218 37.8561 113.101 38.5381L114.327 42.3456ZM119.803 39.5326C121.158 38.232 121.818 36.5587 121.818 34.6739H117.818C117.818 35.5517 117.544 36.1558 117.033 36.6471L119.803 39.5326ZM121.818 34.6739C121.818 32.193 120.801 30.1224 118.772 28.7175L116.495 32.0062C117.378 32.6173 117.818 33.4214 117.818 34.6739H121.818ZM118.82 28.7517C116.923 27.3543 114.403 26.7939 111.53 26.7939V30.7939C113.957 30.7939 115.506 31.2788 116.447 31.972L118.82 28.7517ZM111.53 26.7939C108.782 26.7939 106.339 27.4529 104.35 28.9207L106.725 32.139C107.873 31.2921 109.424 30.7939 111.53 30.7939V26.7939ZM104.331 28.9345C102.342 30.4388 101.242 32.4853 101.242 34.9539H105.242C105.242 33.8385 105.672 32.9356 106.744 32.1252L104.331 28.9345ZM103.242 32.9539H96.6896V36.9539H103.242V32.9539ZM98.6896 34.9539C98.6896 32.9145 99.1937 31.2193 100.146 29.7913L96.8175 27.5725C95.3802 29.7284 94.6896 32.2146 94.6896 34.9539H98.6896ZM100.141 29.7991C101.137 28.3199 102.557 27.1525 104.485 26.317L102.894 22.6467C100.343 23.7525 98.2906 25.3851 96.8228 27.5647L100.141 29.7991ZM104.499 26.3107C106.476 25.4357 108.823 24.9699 111.586 24.9699V20.9699C108.375 20.9699 105.458 21.512 102.88 22.653L104.499 26.3107ZM111.586 24.9699C115.926 24.9699 119.043 25.9673 121.187 27.7127L123.712 24.611C120.629 22.1004 116.504 20.9699 111.586 20.9699V24.9699ZM121.211 27.7322C123.336 29.4086 124.426 31.6807 124.426 34.7859H128.426C128.426 30.5737 126.864 27.0965 123.688 24.5915L121.211 27.7322ZM124.426 34.7859C124.426 37.0541 123.812 38.6949 122.745 39.8992L125.738 42.5525C127.583 40.4715 128.426 37.8189 128.426 34.7859H124.426ZM122.745 39.8992C121.615 41.1736 119.558 42.4489 116.298 43.5951L117.625 47.3686C121.16 46.1254 123.956 44.5634 125.738 42.5525L122.745 39.8992ZM116.293 43.597C114.88 44.0984 113.646 44.8708 112.786 46.0179L115.986 48.4179C116.245 48.0715 116.729 47.6866 117.63 47.3667L116.293 43.597ZM112.776 46.0315C111.938 47.1678 111.602 48.5315 111.602 49.9619H115.602C115.602 49.1522 115.788 48.6866 115.996 48.4043L112.776 46.0315ZM111.602 49.9619V51.8099H115.602V49.9619H111.602ZM113.602 49.8099H106.938V53.8099H113.602V49.8099ZM108.938 51.8099V49.4019H104.938V51.8099H108.938ZM110.186 61.0099C109.499 61.0099 109.06 60.818 108.724 60.5153L106.048 63.4884C107.205 64.5297 108.633 65.0099 110.186 65.0099V61.0099ZM108.8 60.5876C108.497 60.285 108.322 59.9125 108.322 59.3139H104.322C104.322 60.8805 104.855 62.3001 105.971 63.4161L108.8 60.5876ZM108.322 59.3139C108.322 58.5959 108.524 58.2467 108.761 58.0218L106.01 55.118C104.829 56.2371 104.322 57.7171 104.322 59.3139H108.322ZM108.8 57.9841C109.076 57.708 109.47 57.5059 110.186 57.5059V53.5059C108.586 53.5059 107.114 54.0131 105.971 55.1556L108.8 57.9841ZM110.186 57.5059C110.901 57.5059 111.295 57.708 111.571 57.9841L114.4 55.1556C113.257 54.0131 111.785 53.5059 110.186 53.5059V57.5059ZM111.61 58.0218C111.848 58.2467 112.05 58.5959 112.05 59.3139H116.05C116.05 57.7171 115.542 56.2371 114.361 55.118L111.61 58.0218ZM112.05 59.3139C112.05 59.8798 111.879 60.2413 111.552 60.5519L114.307 63.4519C115.474 62.3438 116.05 60.9132 116.05 59.3139H112.05ZM111.554 60.55C111.271 60.8183 110.874 61.0099 110.186 61.0099V65.0099C111.737 65.0099 113.17 64.5295 114.305 63.4538L111.554 60.55Z"
                              fill="#F3523F"
                            />
                          </svg>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: '100px',
                        }}
                      >
                        <Box sx={{ display: 'none' }} className="DeSelectIcon">
                          <IconButton
                            onClick={() =>
                              !isTransformationLimitReached &&
                              deselectNode(row.node.class, row.node.name)
                            }
                          >
                            <RemoveCircleIcon color="primary" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={(theme) => ({
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '35px',
                border: `2px dashed ${theme.palette.text.secondary}`,
                marginLeft: '15px',
                marginRight: '30px',
                marginTop: {
                  md: '200px',
                  xs: '220px',
                },
              })}
            >
              {isTransformationLimitReached ? (
                <Typography
                  variant="lbl-md"
                  sx={{
                    color: '#D90368',
                    fontFamily: 'Nexa',
                    fontWeight: '300',
                    fontSize: '15px',
                    lineHeight: '23px',
                  }}
                >
                  The maximum monthly amount of node transformation has reached
                  its limit. <br />
                  The capacity will be reestablished in X Days.
                </Typography>
              ) : (
                <Typography
                  variant="lbl-md"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: 'Nexa',
                    fontWeight: '300',
                    fontSize: '15px',
                    lineHeight: '56px',
                  }}
                >
                  Select NFTs to Transform
                </Typography>
              )}
            </Box>
          )}

          <Box
            sx={{
              textAlign: 'right',
              alignItems: 'right',
              position: 'absolute',
              right: '30px',
              bottom: '20px',
              display: 'flex',
            }}
          >
            <Typography
              variant="lbl-md"
              sx={{
                color: 'text.secondary',
                fontFamily: 'Nexa',
                fontWeight: '300',
                fontSize: '15px',
                lineHeight: '45px',
                marginRight: '20px',
              }}
            >
              Transform to reveal multipliers
            </Typography>

            <Button
              variant={'contained'}
              sx={{ width: '311px' }}
              onClick={handleTransform2Drift}
              disabled={totalSelected === 0 || isTransformationLimitReached}
            >
              <Typography
                variant="overline"
                fontWeight={'700'}
                lineHeight={'30px'}
                fontSize={'13px'}
                textTransform={'initial'}
              >
                {isAllApproved ? 'Transform' : 'Approve'}
              </Typography>
            </Button>
          </Box>
        </Grid>

        <Grid
          item
          md={6}
          sx={{
            paddingLeft: '10px',
            display: { md: 'none', miniMobile: 'block' },
            boxShadow:
              theme.palette.mode === 'light'
                ? 'inset 0px -4.08108px 16.3243px rgba(0, 0, 0, 0.25)'
                : undefined,
          }}
        >
          <Box
            sx={{
              // textAlign: 'right',
              // alignItems: 'right',
              p: 2,
              position: 'absolute',
              width: '100%',
              // right: '30px',
              bottom: '0px',
              // display: 'flex',
              bgcolor: 'background.paper',
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Button
                fullWidth
                variant={'contained'}
                sx={{
                  // backgroundColor: '#F3523F',

                  'maxWidth': '100%!important',
                  '&:active': {
                    boxShadow: 'inset rgba(0, 0, 0, 0.25) 0px 3px 0px',
                  },

                  '&:disabled': {
                    background: '#B3B3B3',
                  },
                  'clipPath': 'none !important',
                }}
                onClick={handleTransform2Drift}
                disabled={totalSelected === 0 || isTransformationLimitReached}
              >
                <Typography
                  variant="overline"
                  fontWeight={'700'}
                  lineHeight={'30px'}
                  fontSize={'13px'}
                  textTransform={'initial'}
                >
                  {isAllApproved ? 'Transform' : 'Approve'}
                </Typography>
              </Button>

              <Button
                sx={{
                  '&:active': {
                    boxShadow: 'inset rgba(0, 0, 0, 0.25) 0px 3px 0px',
                  },
                }}
                fullWidth
                onClick={handleDrawerOpen}
              >
                <Typography
                  variant="overline"
                  fontWeight={'700'}
                  lineHeight={'30px'}
                  fontSize={'13px'}
                  textTransform={'initial'}
                >
                  View Selection
                </Typography>
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <MobileDrawer
        open={open}
        onClose={handleDrawerClose}
        totalSelected={totalSelected}
        selectedNodes={selectedNodes}
        deselectNode={deselectNode}
      />
    </Box>
  );
};

export default Transform2Drift;
