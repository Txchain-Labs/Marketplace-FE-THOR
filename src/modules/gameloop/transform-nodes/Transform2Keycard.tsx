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

import { useSetAttribute } from '@/hooks/uiHooks';
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
    'Origin Thor': [],
    'Origin Odin': [],
    'Drift Thor': [],
    'Drift Odin': [],
  };

  // console.log('allNodes------',allNodes);
  if (allNodes && allNodes.length > 0) {
    for (let i = 0; i < allNodes.length; i++) {
      if (
        (allNodes[i][0] === 'ORIGIN' || allNodes[i][0] === 'DRIFT') &&
        (allNodes[i][2] === 'THOR' || allNodes[i][2] === 'ODIN')
      ) {
        // console.log(
        //   'vrrOrigin[allNodes[i][2]' +
        //     ethers.utils.formatEther(
        //       vrrOrigin[allNodes[i][2] === 'ODIN' ? 0 : 1][
        //         vrrOrigin[allNodes[i][2] === 'ODIN' ? 0 : 1].length - 1
        //       ] as BigNumberish
        //     )
        // );

        const dueDate = allNodes[i].dueDate
          ? BigNumber.from(allNodes[i].dueDate as BigNumberish).toNumber()
          : 0;

        // console.log('------  dueDate * 1000  ------   ' + dueDate * 1000);
        // console.log('------  Date.now()  ------   ' + Date.now());

        if (
          allNodes[i].isListed ||
          (allNodes[i].nodeType === 'ORIGIN' && dueDate * 1000 < Date.now())
        )
          continue; ///// pass if is listed, or if is inactive OG node

        filteredData[
          `${allNodes[i][0][0] + allNodes[i][0].slice(1).toLowerCase()} ${
            allNodes[i][2][0] + allNodes[i][2].slice(1).toLowerCase()
          }`
        ].push({
          node: {
            nodeType: allNodes[i].nodeType,
            isThorOdin: allNodes[i][2],
            class: `${
              allNodes[i][0][0] + allNodes[i][0].slice(1).toLowerCase()
            } ${allNodes[i][2][0] + allNodes[i][2].slice(1).toLowerCase()}`,
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
            vrr: ethers.utils.formatEther(
              allNodes[i][0] === 'ORIGIN'
                ? (allNodes[i].currentVrr as BigNumberish)
                : (allNodes[i].fixedRewardPerNode as BigNumberish)
            ),
            perks: allNodes[i].perks,
            perksEndTime: allNodes[i].perksEndTime,
          },
          selected: false,
        });
      }
    }
  }

  // console.log('allNodes filtered', filteredData);
  return filteredData;
};

const Transform2Keycard = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const backButtonRef = useSetAttribute([
    { key: 'id', value: 'back-button' },
    { key: 'dusk', value: 'back-button' },
  ]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(<></>);

  const handleClose = () => {
    setAlertMessage(<></>);
    setShowAlert(false);
  };

  const { data: allNodes } = useGetAllNodes();
  ///// console.log('raw allNodes---------' + JSON.stringify(allNodes));
  const { transformNodes, isSuccess: isTransformationSuccess } =
    useTransformNode();
  // const { data: vrrOrigin } = useGetVRR4Origin();
  ///// console.log('vrrOrigin------------' + JSON.stringify(vrrOrigin));

  const [mainData, setMainData] = useState(funcFilterNodesData(allNodes));
  const [selectedNodeType, setSelectedNodeType] = useState('Origin Thor');

  const [totalSelected, setTotalSelected] = useState(0);
  const [cntPerksInUse, setCntPerksInUse] = useState(0);
  // const [selectedNodes, setSelectedNodes] = useState([]);
  // const [selectedNodesMap, setSelectedNodesMap] = useState({});

  const { data: isAllowedOriginThor, refetch: refetchAllowanceOriginThor } =
    useGamificationAllowance('Origin Thor');
  const { data: isAllowedOriginOdin, refetch: refetchAllowanceOriginOdin } =
    useGamificationAllowance('Origin Odin');
  const { data: isAllowedDriftThor, refetch: refetchAllowanceDriftThor } =
    useGamificationAllowance('Drift Thor');
  const { data: isAllowedDriftOdin, refetch: refetchAllowanceDriftOdin } =
    useGamificationAllowance('Drift Odin');

  const { approve: approveOriginThor, isSuccess: isSuccessApprovedOriginThor } =
    useApproveGamification('Origin Thor');
  const { approve: approveOriginOdin, isSuccess: isSuccessApprovedOriginOdin } =
    useApproveGamification('Origin Odin');
  const { approve: approveDriftThor, isSuccess: isSuccessApprovedDriftThor } =
    useApproveGamification('Drift Thor');
  const { approve: approveDriftOdin, isSuccess: isSuccessApprovedDriftOdin } =
    useApproveGamification('Drift Odin');

  useEffect(() => {
    if (isSuccessApprovedOriginThor && refetchAllowanceOriginThor) {
      refetchAllowanceOriginThor();
    }
    if (isSuccessApprovedOriginOdin && refetchAllowanceOriginOdin) {
      refetchAllowanceOriginOdin();
    }
    if (isSuccessApprovedDriftThor && refetchAllowanceDriftThor) {
      refetchAllowanceDriftThor();
    }
    if (isSuccessApprovedDriftOdin && refetchAllowanceDriftOdin) {
      refetchAllowanceDriftOdin();
    }
  }, [
    refetchAllowanceOriginThor,
    refetchAllowanceOriginOdin,
    refetchAllowanceDriftThor,
    refetchAllowanceDriftOdin,
    isSuccessApprovedOriginThor,
    isSuccessApprovedOriginOdin,
    isSuccessApprovedDriftThor,
    isSuccessApprovedDriftOdin,
  ]);

  const { data: ogKeyCardCap } = useGetDriftKeycardCap('OGKeycard');
  const { data: ogKeyCardTotalSupply } =
    useGetDriftKeycardTotalSupply('OGKeycard');

  const selectedNodes = useMemo(() => {
    const lambda = (each: any) => each.selected;
    return mainData['Origin Thor']
      .filter(lambda)
      .concat(mainData['Origin Odin'].filter(lambda))
      .concat(mainData['Drift Thor'].filter(lambda))
      .concat(mainData['Drift Odin'].filter(lambda));
  }, [mainData]);

  function handleTransform2Keycard() {
    if (selectedNodes.length > 0) {
      const transformType =
        selectedNodeType === 'Origin Odin' || selectedNodeType === 'Origin Thor'
          ? TransformType.OdinKey
          : TransformType.ThorKey;

      // console.log('------- selectedNodeType -----' + selectedNodeType);
      // console.log(
      //   '------- selectedNodes -----' + JSON.stringify(selectedNodes)
      // );

      const nodeIdsToTransform = selectedNodes
        .filter((value: any) => value.node.class === selectedNodeType)
        .map((each: any) => each.node.tokenId);

      // console.log('------- nodeIdsToTransform -----' + nodeIdsToTransform);

      if (nodeIdsToTransform.length > 0) {
        // console.log('----- isAllowedOriginOdin ----' + isAllowedOriginOdin);
        // console.log('----- isAllowedOriginThor ----' + isAllowedOriginThor);
        // console.log('----- isAllowedDriftOdin ----' + isAllowedDriftOdin);
        // console.log('----- isAllowedDriftThor ----' + isAllowedDriftThor);

        // console.log('----   nodeIdsToTransform ------' + JSON.stringify(nodeIdsToTransform));

        if (
          (selectedNodeType === 'Origin Odin' && isAllowedOriginOdin) ||
          (selectedNodeType === 'Origin Thor' && isAllowedOriginThor) ||
          (selectedNodeType === 'Drift Odin' && isAllowedDriftOdin) ||
          (selectedNodeType === 'Drift Thor' && isAllowedDriftThor)
        ) {
          transformNodes([
            selectedNodeType === 'Origin Odin' ||
            selectedNodeType === 'Drift Odin'
              ? nodeIdsToTransform
              : [],
            selectedNodeType === 'Origin Odin' ||
            selectedNodeType === 'Drift Odin'
              ? []
              : nodeIdsToTransform,
            transformType,
          ]);
        } else {
          (selectedNodeType === 'Origin Odin' && approveOriginOdin()) ||
            (selectedNodeType === 'Origin Thor' && approveOriginThor()) ||
            (selectedNodeType === 'Drift Odin' && approveDriftOdin()) ||
            (selectedNodeType === 'Drift Thor' && approveDriftThor());
        }
      }
    }
  }

  ///// const showAlertPopup = () => {
  /////   setPerksAlert(true);
  ///// };

  const selectNode = (nodeType: string, index: number) => {
    // const nodeTypeWit
    // console.log('nodeType actual', mainData[nodeType][index].node.nodeType.toUpperCase());
    // console.log('nodeType: selected nodes', selectedNodes);
    const mixed =
      selectedNodes.length &&
      selectedNodes.filter(
        (node: any) =>
          node.node.nodeType &&
          node.node.nodeType !==
            mainData[nodeType][index].node.nodeType.toUpperCase()
      );
    if (mixed.length) {
      setAlertMessage(
        <>You can not mix Origin & Drift Nodes for transformation</>
      );
      setShowAlert(true);
      console.log('nodeType: cannot mix Drift and OG');
      return;
    }
    // console.log('nodeType', nodeType);

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

    if (
      mainData[nodeType][index].node.perks &&
      mainData[nodeType][index].node.perks.length > 0
    ) {
      if (mainData[nodeType][index].selected) {
        setCntPerksInUse(
          cntPerksInUse + mainData[nodeType][index].node.perks.length
        );
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
      } else {
        setCntPerksInUse(
          cntPerksInUse - mainData[nodeType][index].node.perks.length
        );
      }
    }
  };

  const deselectNode = (nodeType: string, name: string) => {
    let i = 0;
    for (i = 0; i < mainData[nodeType].length; i++) {
      if (mainData[nodeType][i].node.name === name) {
        mainData[nodeType][i] = {
          node: mainData[nodeType][i].node,
          selected: false,
        };
        if (
          mainData[nodeType][i].node.perks &&
          mainData[nodeType][i].node.perks.length > 0
        ) {
          setCntPerksInUse(
            cntPerksInUse - mainData[nodeType][i].node.perks.length
          );
        }

        break;
      }
    }

    setTotalSelected(totalSelected - 1);

    setMainData({
      ...mainData,
    });

    // const lambda = (each: any) => each.selected;
    // setSelectedNodes(
    //   mainData['Origin Thor']
    //     .filter(lambda)
    //     .concat(mainData['Origin Odin'].filter(lambda))
    //     .concat(mainData['Drift Thor'].filter(lambda))
    //     .concat(mainData['Drift Odin'].filter(lambda))
    // );
  };

  useEffect(() => {
    if (isTransformationSuccess === true) {
      router.push('/gameloop/gamification/keycards');
    }
  }, [router, isTransformationSuccess]);

  // useEffect(() => {
  //   console.log('selectedNodes', selectedNodes);
  // }, [selectedNodes]);
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
          <Box sx={{}}>
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
                  variant={'scrollable'}
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
          </Box>
          <Box
            // container
            sx={{
              padding: 2,
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
                          onClick={() => selectNode(selectedNodeType, index)}
                        />
                        {/*<TransformNodeTile*/}
                        {/*  pageType="node"*/}
                        {/*  tier={eachNode.node.tier}*/}
                        {/*  type={eachNode.node.nodeType.toUpperCase()}*/}
                        {/*  price={eachNode.node.price}*/}
                        {/*  name={eachNode.node.name}*/}
                        {/*  pendingReward={formatNumber(eachNode.node.rewards)}*/}
                        {/*  isSelected={eachNode.selected}*/}
                        {/*  onClick={() => selectNode(selectedNodeType, index)}*/}
                        {/*></TransformNodeTile>*/}
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
          sx={(theme) => ({
            paddingLeft: '10px',
            display: { md: 'block', miniMobile: 'none' },
            boxShadow:
              theme.palette.mode === 'light'
                ? 'inset 0px -4.08108px 16.3243px rgba(0, 0, 0, 0.25)'
                : undefined,
          })}
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
            Transform to Keycard
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
            SELECT YOUR NFTs
            <IconButton>
              <Tooltip
                title={`Only unlisted NFTs can participate in GameLoop features. ${formatNumber(
                  Number(ogKeyCardCap)
                )} / ${formatNumber(
                  Number(ogKeyCardTotalSupply)
                )} Batch available`}
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
                  {selectedNodes.map((row: any) => (
                    <TableRow
                      hover
                      key={row.node.name}
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
                          width: '100px',
                        }}
                      >
                        <Box sx={{ display: 'none' }} className="DeSelectIcon">
                          <IconButton
                            onClick={() =>
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
                border: `2px dashed ${theme.palette.divider}`,
                marginLeft: '15px',
                marginRight: '30px',
                marginTop: {
                  md: '200px',
                  xs: '220px',
                },
              })}
            >
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
            <Box>
              <Typography
                variant="lbl-md"
                sx={{
                  color: 'text.secondary',
                  fontFamily: totalSelected > 0 ? 'Nexa-Bold' : 'Nexa',
                  fontWeight: '400',
                  fontSize: '15px',
                  lineHeight: cntPerksInUse > 0 ? '25px' : '45px',
                  marginRight: '20px',
                }}
              >
                {totalSelected} Selected
              </Typography>

              {cntPerksInUse > 0 ? (
                <Typography
                  variant="lbl-md"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: '400',
                    fontSize: '13px',
                    lineHeight: '15px',
                    marginRight: '20px',
                  }}
                >
                  {cntPerksInUse} perks in use
                </Typography>
              ) : (
                <></>
              )}
            </Box>

            <Button
              variant={'contained'}
              sx={{ width: '311px' }}
              onClick={handleTransform2Keycard}
              disabled={totalSelected === 0}
            >
              <Typography
                variant="overline"
                fontWeight={'700'}
                lineHeight={'30px'}
                fontSize={'13px'}
                textTransform={'initial'}
              >
                Transform
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
              backgroundColor: 'background.paper',
              zIndex: 2,
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="lbl-md"
                sx={{
                  color: 'text.secondary',
                  fontFamily: totalSelected > 0 ? 'Nexa-Bold' : 'Nexa',
                  fontWeight: '400',
                  fontSize: '15px',
                  lineHeight: cntPerksInUse > 0 ? '25px' : '45px',
                  marginRight: '20px',
                }}
              >
                {totalSelected} Selected
              </Typography>

              {cntPerksInUse > 0 ? (
                <Typography
                  variant="lbl-md"
                  sx={{
                    color: 'rgba(0, 0, 0, 0.6)',
                    fontWeight: '400',
                    fontSize: '13px',
                    lineHeight: '15px',
                    marginRight: '20px',
                  }}
                >
                  {cntPerksInUse} perks in use
                </Typography>
              ) : (
                <></>
              )}
            </Box>
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
                onClick={handleTransform2Keycard}
                disabled={totalSelected === 0}
              >
                <Typography
                  variant="overline"
                  fontWeight={'700'}
                  lineHeight={'30px'}
                  fontSize={'13px'}
                  textTransform={'initial'}
                >
                  Transform
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

export default Transform2Keycard;
