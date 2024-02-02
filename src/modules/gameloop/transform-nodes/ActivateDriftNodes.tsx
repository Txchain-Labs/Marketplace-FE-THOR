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
  Tooltip,
  Stack,
} from '@mui/material';
import OdinThorSwitch from '../../../components/common/OdinThorSwitch';
import ActiveInactiveSwitch from '../../../components/common/ActiveInactiveSwitch';
import React, { FC, useState, useMemo, useEffect } from 'react';
// import TransformNodeTile from '../transform-nodes/components/transformNodeTile';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import {
  useGetAllNodes,
  useGetStakedDriftNodes,
  useStakeUnstakeDriftNodes,
  useGamificationAllowance,
  useApproveGamification,
  useGetStakedDriftNodesByTokenIds,
  useGetUSDCeApproval,
  useSetApprovalUSDCe,
} from './hooks/useTransformNodes';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { formatNumber } from '../../../../src/utils/common';
import { ArrowBackIos } from '@mui/icons-material';
import { useSetAttribute } from '../../../hooks/uiHooks';

import { useRouter } from 'next/router';
import { useSelector } from '../../../redux/store';
import { getDriftDueDate } from '@/utils/helper';
import { useThorGamificationContract } from '@/hooks/useGameloop';
import { formatWei, useChain } from '@/utils/web3Utils';
import Image from 'next/image';

import { getGamificationContractByChain } from '@/utils/constants';

type ActivationStatus = {
  [id: string]: boolean;
};

// const arrActivationStatus: ActivationStatus = {};

const funcFilterNodesData = (
  allNodes_Unstaked: any,
  stakedDriftNodes4User: any,
  currentOwner: any,
  gameloopAddress: string
) => {
  ///// console.log('---------3 ' + JSON.stringify(arrDriftStakers));

  const filteredData = [];

  ///// console.log('--------- allNodes[i]' + JSON.stringify(allNodes));

  const allNodes = allNodes_Unstaked?.concat(stakedDriftNodes4User);
  if (allNodes && allNodes.length > 0) {
    for (let i = 0; i < allNodes.length; i++) {
      if (
        allNodes?.[i]?.[0] === 'DRIFT' &&
        (allNodes?.[i]?.[2] === 'THOR' || allNodes?.[i]?.[2] === 'ODIN')
      ) {
        const dueDate = allNodes[i].dueDate
          ? BigNumber.from(allNodes[i].dueDate as BigNumberish).toNumber()
          : 0;

        if (allNodes[i].isListed) continue; ///// pass if is listed

        filteredData.push({
          nodeType: allNodes[i].nodeType,
          isThorOdin: allNodes[i][2],
          class: allNodes[i][2][0] + allNodes[i][2].slice(1).toLowerCase(),
          tokenId: allNodes[i].tokenId,
          tier: allNodes[i].tier,
          name: allNodes[i].name,
          image: allNodes[i].image,
          creationTime: allNodes[i].creationTime,
          lastClaimTime: allNodes[i].lastClaimTime,
          rewards: allNodes[i].rewards.toString(),
          // Number(ethers.utils.formatEther(allNodes[i].rewards as BigNumberish)),
          dueDate: dueDate,
          multiplier: allNodes[i].multiplier,
          currentVrr: ethers.utils.formatEther(
            allNodes[i].currentVrr as BigNumberish
          ),
          rewardsActivatedTime: allNodes[i].rewardsActivatedTime,
          minter: allNodes[i].minter,
          currentOwner: allNodes[i].currentOwner,
          isSecondHandNode:
            allNodes[i].minter !== ethers.constants.AddressZero &&
            currentOwner &&
            currentOwner.toLowerCase() !== allNodes[i].minter.toLowerCase(),
          vestedDays: allNodes[i].vestedDays,
          driftDueDate: allNodes[i]?.isRewardsActivated
            ? getDriftDueDate(
                allNodes[i].rewardsActivatedTime,
                allNodes[i].vestedDays
              )
            : '90',
          fixedRewardPerNode: ethers.utils.formatEther(
            allNodes[i].fixedRewardPerNode as BigNumberish
          ),
          price: allNodes[i].price
            ? ethers.utils.formatEther(allNodes[i].price as BigNumberish)
            : 0,
          activationStatus: i >= allNodes_Unstaked.length,
          condition:
            gameloopAddress?.toLowerCase() ===
            allNodes[i].currentOwner?.toLowerCase()
              ? 'active'
              : 'inactive',
        });
      }
    }
  }
  ///// console.log('---------- filteredData' + JSON.stringify(filteredData));
  return filteredData;
};

interface ActivateDriftNodesProps {
  indirect?: boolean;
}

const ActivateDriftNodes: FC<ActivateDriftNodesProps> = ({ indirect }) => {
  if (!indirect) indirect = false;
  const gameloopAddress = useThorGamificationContract();

  const router = useRouter();
  const user = useSelector((state: any) => state?.auth?.user);

  const backButtonRef = useSetAttribute([
    { key: 'id', value: 'back-button' },
    { key: 'dusk', value: 'back-button' },
  ]);

  const {
    data: allNodes,
    isFetched: isNodesFetched,
    refetch: refetchNodes,
    isRefetching: isRefetchingNodes,
  } = useGetAllNodes();
  const { data: stakedDriftNodes4UserFromSubgraph } = useGetStakedDriftNodes(
    user?.address
  );
  const [showMore, setShowMore] = useState<boolean>(false);

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
  };

  const { data: stakedDriftNodes4User } = useGetStakedDriftNodesByTokenIds([
    stakedDriftNodes4UserFromSubgraph &&
    stakedDriftNodes4UserFromSubgraph.data &&
    stakedDriftNodes4UserFromSubgraph.data.data.stakedNFTs
      ? stakedDriftNodes4UserFromSubgraph.data.data.stakedNFTs
          .filter((each: any) => each.odin === true)
          .map((each: any) => Number(each.tokenId))
      : [],
    stakedDriftNodes4UserFromSubgraph &&
    stakedDriftNodes4UserFromSubgraph.data &&
    stakedDriftNodes4UserFromSubgraph.data.data.stakedNFTs
      ? stakedDriftNodes4UserFromSubgraph.data.data.stakedNFTs
          .filter((each: any) => each.odin === false)
          .map((each: any) => BigNumber.from(Number(each.tokenId)))
      : [],
  ]);
  useEffect(() => {
    if (isNodesFetched) {
      const result = allNodes?.find(
        (row) =>
          (row as any)?.multiplier?.toString() === '1' ||
          Number((row as any)?.multiplier?.toString()) / 10 === 1
      );
      if (result) {
        refetchNodes();
      }
    }
  }, [isNodesFetched, isRefetchingNodes, refetchNodes, allNodes]);

  const { isSuccess: isDriftStakingUnstakingSuccess, stakeUnstakeDriftNodes } =
    useStakeUnstakeDriftNodes();

  const mainData = useMemo(
    () =>
      funcFilterNodesData(
        allNodes,
        stakedDriftNodes4User,
        user?.address,
        gameloopAddress
      ),
    [allNodes, stakedDriftNodes4User, user?.address, gameloopAddress]
  );

  const arrActivationStatus2 = useMemo(() => {
    const _statuses: ActivationStatus = {};
    mainData.forEach((d) => {
      _statuses[`drift_${d.tier}_${d.tokenId}`] = d.activationStatus;
    });
    return _statuses;
  }, [mainData]);

  const [activationStatusArr, setActivationStatusArr] =
    useState<ActivationStatus>({});

  useEffect(() => {
    setActivationStatusArr({ ...arrActivationStatus2 });
  }, [arrActivationStatus2]);

  const [driftODINorTHOR, setDriftODINorTHOR] = useState('ODIN');

  const mainDataOnlyOdinORThor = useMemo(() => {
    return mainData.filter((value) => value.isThorOdin === driftODINorTHOR);
  }, [mainData, driftODINorTHOR]);

  const cntToActivate = useMemo(() => {
    let cnt = 0;

    Object.keys(arrActivationStatus2).forEach((key: string) => {
      if (
        arrActivationStatus2[key] !== activationStatusArr[key] &&
        activationStatusArr[key] === true
      ) {
        const splitKey = key.split('_');

        if (splitKey[1] === driftODINorTHOR) cnt++;
      }
    });

    return cnt;
  }, [activationStatusArr, arrActivationStatus2, driftODINorTHOR]);

  const cntKeepInactivate = useMemo(() => {
    let cnt = 0;

    Object.keys(arrActivationStatus2).forEach((key: string) => {
      if (
        arrActivationStatus2[key] === activationStatusArr[key] &&
        activationStatusArr[key] === false
      ) {
        const splitKey = key.split('_');

        if (splitKey[1] === driftODINorTHOR) cnt++;
      }
    });

    return cnt;
  }, [activationStatusArr, arrActivationStatus2, driftODINorTHOR]);

  const { data: isAllowedDriftThor, refetch: refetchAllowanceDriftThor } =
    useGamificationAllowance('Drift Thor');
  const { data: isAllowedDriftOdin, refetch: refetchAllowanceDriftOdin } =
    useGamificationAllowance('Drift Odin');
  const { approve: approveDriftThor, isSuccess: isSuccessApprovedDriftThor } =
    useApproveGamification('Drift Thor');
  const { approve: approveDriftOdin, isSuccess: isSuccessApprovedDriftOdin } =
    useApproveGamification('Drift Odin');

  const { write: approveUSDCe, isSuccess: isSuccessApprovedUSDCe } =
    useSetApprovalUSDCe();

  const { data: allowedUSDCe, refetch: refetchGetUSDCeApproval } =
    useGetUSDCeApproval(user?.address);

  useEffect(() => {
    if (isSuccessApprovedDriftThor && refetchAllowanceDriftThor) {
      refetchAllowanceDriftThor();
    }
    if (isSuccessApprovedDriftOdin && refetchAllowanceDriftOdin) {
      refetchAllowanceDriftOdin();
    }
    if (isSuccessApprovedUSDCe && refetchGetUSDCeApproval) {
      refetchGetUSDCeApproval();
    }
  }, [
    refetchAllowanceDriftThor,
    refetchAllowanceDriftOdin,
    isSuccessApprovedDriftThor,
    isSuccessApprovedDriftOdin,
    refetchGetUSDCeApproval,
    isSuccessApprovedUSDCe,
  ]);

  const chain = useChain();
  const contractAddress = getGamificationContractByChain(chain);

  const handleDriftActivation = () => {
    if (mainDataOnlyOdinORThor.length > 0) {
      const cntSecondHand = mainDataOnlyOdinORThor.filter(
        (row: any) =>
          row.isSecondHandNode &&
          activationStatusArr[`drift_${row.isThorOdin}_${row.tokenId}`]
      ).length;

      if (
        ((driftODINorTHOR === 'ODIN' && isAllowedDriftOdin) ||
          (driftODINorTHOR === 'THOR' && isAllowedDriftThor)) &&
        (cntSecondHand === 0 ||
          (allowedUSDCe && cntSecondHand * 1_000_000 <= Number(allowedUSDCe)))
      ) {
        // console.log(
        //   '-----------arrActivationStatus: ' +
        //     JSON.stringify(arrActivationStatus)
        // );
        // console.log(
        //   '-----------activationStatusArr: ' +
        //     JSON.stringify(activationStatusArr)
        // );

        const nodeIdsToStake: any[] = [],
          nodeIdsToUnstake: any[] = [];

        Object.keys(arrActivationStatus2).forEach((key: string) => {
          if (arrActivationStatus2[key] !== activationStatusArr[key]) {
            const splitKey = key.split('_');
            if (splitKey[1] === driftODINorTHOR) {
              if (activationStatusArr[key] === true)
                nodeIdsToStake.push(Number(splitKey[2]));
              else nodeIdsToUnstake.push(Number(splitKey[2]));
            }
          }
        });

        console.log('final list ', [
          nodeIdsToStake,
          nodeIdsToUnstake,
          driftODINorTHOR,
        ]);
        stakeUnstakeDriftNodes([
          nodeIdsToStake,
          nodeIdsToUnstake,
          driftODINorTHOR,
        ]);
      } else {
        (driftODINorTHOR === 'ODIN' && approveDriftOdin()) ||
          (driftODINorTHOR === 'THOR' && approveDriftThor());

        cntSecondHand > 0 &&
          (!allowedUSDCe || cntSecondHand * 1_000_000 > Number(allowedUSDCe)) &&
          approveUSDCe({
            recklesslySetUnpreparedArgs: [
              contractAddress,
              cntSecondHand * 1_000_000,
            ],
          });
      }
    }
  };
  useEffect(() => {
    ///// refresh page
  }, [isDriftStakingUnstakingSuccess]);
  return (
    <Box sx={(theme) => ({ backgroundColor: theme.palette.background.paper })}>
      <Grid
        container
        sx={{
          bgcolor: 'background.default',
        }}
      >
        <Grid
          item
          md={5}
          miniMobile={12}
          sx={{
            paddingLeft: '3px',
            paddingRight: '6px',
          }}
        >
          <Box
            sx={{
              overflowY: 'scroll',
              // marginTop: '30px',
              height: 'calc(100vh - 90px)',
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

            {/* {mainDataOnlyOdinORThor && mainDataOnlyOdinORThor.length > 0 ? (
              mainDataOnlyOdinORThor.map((eachNode: any, index: number) => {
                return (
                  <Grid item key={'node_' + index} md={4} xs={12} spacing={2}>
                    <TransformNodeTile
                      type={eachNode.nodeType}
                      price={eachNode.price}
                      name={eachNode.name}
                      pendingReward={formatNumber(eachNode.rewards)}
                      isSelected={false}
                    ></TransformNodeTile>
                  </Grid>
                );
              })
            ) : (
              <></>
            )} */}
            <img
              src={`/images/${driftODINorTHOR.toLowerCase()}Drift.gif`}
              style={{
                width: '60%',
                height: '50%',
                marginTop: '15%',
                marginLeft: '20%',
              }}
            />
            <Typography
              variant="lbl-md"
              sx={{
                fontWeight: 900,
                fontSize: '24px',
                textAlign: 'center',
                width: '100%',
                // marginTop: '-15%',
              }}
            >
              {driftODINorTHOR.slice(0, 1) +
                driftODINorTHOR.slice(1).toLowerCase()}{' '}
              Drift NFT
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          md={7}
          miniMobile={12}
          sx={(theme) => ({
            padding: '10px',
            position: 'relative !important',

            overflowY: 'scroll',
            // marginTop: '30px',
            height: 'calc(100vh - 90px)',
            boxShadow:
              theme.palette.mode === 'light'
                ? 'inset 0px -4.08108px 16.3243px rgba(0, 0, 0, 0.25)'
                : undefined,
          })}
        >
          <Typography
            variant="lbl-md"
            sx={{
              // position: 'absolute',
              fontFamily: 'Nexa-Bold',
              fontWeight: '300',
              fontSize: '32px',
              lineHeight: '61px',

              textAlign: {
                md: 'left',
                miniMobile: 'center',
              },
              // marginTop: {
              //   md: '20px',
              //   xs: '40px',
              // },
              // marginLeft: {
              //   md: '10px',
              // },
            }}
          >
            {indirect ? 'Transform to Drift' : 'Activate Drift NFTs'}
          </Typography>

          <Typography
            variant="lbl-md"
            sx={{
              color: 'text.secondary',
              // position: 'absolute',
              fontFamily: 'Nexa',
              fontWeight: '300',
              fontSize: '15px',
              lineHeight: '56px',

              textAlign: {
                md: 'left',
                xs: 'center',
              },
              // marginTop: {
              //   md: '60px',
              //   xs: '80px',
              // },
              // marginLeft: {
              //   md: '10px',
              // },
            }}
          >
            SELECT WHICH NFT TO ACTIVATE
          </Typography>
          <Box
            sx={{
              // position: 'absolute',
              textAlign: {
                md: 'left',
                xs: 'center',
              },
              // marginTop: {
              //   md: '120px',
              //   xs: '140px',
              // },
              // marginLeft: {
              //   md: '10px',
              // },
            }}
          >
            <Typography
              variant="lbl-md"
              sx={{
                // position: 'absolute',
                fontFamily: 'Nexa-Bold',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '25px',
              }}
            >
              Activate your Drift NFTs and get rewards for 90 days, then your
              NFTs will be transformed into NFT Keycard. <br />
              {showMore && (
                <>
                  The activation of second hand Drift NFTs has additional fees
                  (1 USDC.e)
                </>
              )}
            </Typography>
            <Button
              size={'small'}
              sx={{
                borderRadius: 0,
                textTransform: 'none',
              }}
              endIcon={
                showMore ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
              }
              onClick={handleShowMoreClick}
            >
              <Typography
                sx={{
                  fontFamily: 'Nexa-Bold',
                  fontWeight: 500,
                  fontSize: '13px',
                  lineHeight: '25px',
                }}
              >
                {showMore ? 'See less' : 'See more'}
              </Typography>
            </Button>
          </Box>
          {/* </Box> */}

          <OdinThorSwitch
            driftODINorTHOR={driftODINorTHOR}
            setDriftODINorTHOR={setDriftODINorTHOR}
          />

          {mainDataOnlyOdinORThor && mainDataOnlyOdinORThor.length > 0 ? (
            <TableContainer
              sx={{
                backgroundImage: 'none',
                marginTop: '20px',
                height: 'calc(100vh - 370px)',
                overflowY: 'scroll',
                boxShadow: 'none',
                paddingBottom: '50px',
                zIndex: 1,
              }}
            >
              <Table aria-label="simple table">
                <TableBody>
                  {mainDataOnlyOdinORThor.map((row: any) => (
                    <TableRow
                      hover
                      key={row.name}
                      sx={{
                        height: '80px',
                      }}
                    >
                      <TableCell>
                        <Typography sx={{ fontWeight: 900, fontSize: '13px' }}>
                          {row.name}
                        </Typography>
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: '13px' }}
                        >
                          {row.driftDueDate}
                          (Days) Due Date
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {row.isSecondHandNode &&
                        row?.condition === 'inactive' ? (
                          <Tooltip
                            title={`Second-hand`}
                            placement={'bottom-start'}
                          >
                            <svg
                              width="17"
                              height="21"
                              viewBox="0 0 17 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.709 0.165039H0.718985L0.708984 20.165H16.709V6.16504L10.709 0.165039ZM11.709 9.16504H7.70898V10.165H11.709V15.165H9.70898V16.165H7.70898V15.165H5.70898V13.165H9.70898V12.165H5.70898V7.16504H7.70898V6.16504H9.70898V7.16504H11.709V9.16504Z"
                                fill="#4C4C4C"
                              />
                            </svg>
                          </Tooltip>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          paddingRight: '7.5px',
                        }}
                      >
                        {row?.multiplier?.toString() === '1' ||
                        Number(row?.multiplier?.toString()) / 10 === 1 ? (
                          <Image
                            width={95}
                            height={45}
                            src="/images/multiplier.gif"
                          />
                        ) : (
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: '50px',
                              lineHeight: '60px',
                              color: 'white',
                              marginTop: '10px',
                            }}
                            className={'css-stroked-text'}
                          >
                            {/* {formatMultiplier(row.multiplier, 1)}X */}
                            {`${
                              Number(row?.multiplier?.toString() || '0') / 10
                            }X`}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          paddingLeft: '7.5px',
                        }}
                      >
                        <Typography sx={{ fontSize: '13px' }}>VRR</Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: '13px' }}>
                          MULTIPLIER
                        </Typography>
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: '13px' }}
                        >
                          {formatNumber(row.fixedRewardPerNode, 5)} THOR PER DAY
                        </Typography>
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: '13px' }}
                        >
                          {row?.rewards && Number(row?.rewards) > 0
                            ? `${formatWei(row?.rewards as string)}`
                            : '0'}{' '}
                          Pending Rewards
                        </Typography>
                      </TableCell>

                      <TableCell
                        sx={{
                          width: '100px',
                        }}
                      >
                        <ActiveInactiveSwitch
                          isActivated={
                            activationStatusArr[
                              `drift_${row.isThorOdin}_${row.tokenId}`
                            ]
                          }
                          tokenId={row.tokenId}
                          activateNodeHandler={(tokenId: number) => {
                            setActivationStatusArr({
                              ...activationStatusArr,
                              [`drift_${row.isThorOdin}_${tokenId}`]:
                                !activationStatusArr[
                                  `drift_${row.isThorOdin}_${tokenId}`
                                ],
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            // <Box
            //   sx={{
            //     textAlign: 'center',
            //     alignItems: 'center',
            //     justifyContent: 'space-around',
            //     padding: '35px',
            //     border: '2px dashed rgba(0, 0, 0, 0.4)',
            //     marginLeft: '15px',
            //     marginRight: '30px',
            //     marginTop: {
            //       md: '200px',
            //       xs: '220px',
            //     },
            //   }}
            // >
            //   <Typography
            //     variant="lbl-md"
            //     sx={{
            //       color: 'rgba(0, 0, 0, 0.6)',
            //       fontFamily: 'Nexa',
            //       fontWeight: '300',
            //       fontSize: '15px',
            //       lineHeight: '56px',
            //     }}
            //   >
            //     Select NFTs to sell
            //   </Typography>
            // </Box>
            <Grid
              // item
              md={12}
              miniMobile={12}
              sx={{ textAlign: 'center' }}
            >
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

              <Typography
                sx={{
                  marginTop: '10px',
                  fontSize: '16px',
                  fontFamily: 'Nexa-Bold',
                  color: 'text.secondary',
                }}
              >
                You have no{' '}
                {driftODINorTHOR.slice(0, 1) +
                  driftODINorTHOR.slice(1).toLowerCase()}{' '}
                Drift to activate
              </Typography>

              <Typography
                sx={{
                  marginTop: '5px',
                  fontSize: '13px',
                  color: 'text.secondary',
                }}
              >
                Get them at Transform or Buy them
              </Typography>

              <Stack
                gap={'16px'}
                direction={'row'}
                justifyContent={'center'}
                pt={'24px'}
              >
                <Link
                  href="/gameloop/transform2drift"
                  sx={{ textDecoration: 'none' }}
                >
                  <Button variant={'contained'} color={'secondary'}>
                    <Typography
                      variant="overline"
                      fontWeight={'700'}
                      lineHeight={'30px'}
                      fontSize={'13px'}
                      textTransform={'initial'}
                    >
                      Go to Transform
                    </Typography>
                  </Button>
                </Link>
                <Link href="/buyassets" sx={{ textDecoration: 'none' }}>
                  <Button variant={'contained'}>
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
              </Stack>
            </Grid>
          )}

          <Grid
            // md={11.8}
            // miniMobile={12}
            container
            // spacing={2}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'background.default',
              zIndex: 2,
            }}
          >
            <Grid item md={6} miniMobile={12}>
              <Box sx={{ px: '20px' }}>
                {cntToActivate > 0 ? (
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    fontFamily={'Nexa-Bold'}
                    lineHeight={'20px'}
                    fontSize={'13px'}
                    textTransform={'initial'}
                  >
                    Activate: {cntToActivate}{' '}
                    {driftODINorTHOR.slice(0, 1) +
                      driftODINorTHOR.slice(1).toLowerCase()}{' '}
                    Drift NFT(s)
                  </Typography>
                ) : (
                  <></>
                )}
              </Box>
              <Box sx={{ padding: '13px 20px' }}>
                {cntKeepInactivate > 0 ? (
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    fontFamily={'Nexa-Bold'}
                    lineHeight={'20px'}
                    fontSize={'13px'}
                    textTransform={'initial'}
                  >
                    Keep inactive: {cntKeepInactivate}{' '}
                    {driftODINorTHOR.slice(0, 1) +
                      driftODINorTHOR.slice(1).toLowerCase()}{' '}
                    Drift NFT(s)
                  </Typography>
                ) : (
                  <></>
                )}
              </Box>
            </Grid>
            <Grid item md={6} miniMobile={12}>
              <Box
                sx={{
                  textAlign: 'right',
                  alignItems: 'center',
                  // width: '100%',
                  padding: '3px 0px',

                  display: 'flex',
                  justifyContent: { sm: 'end', miniMobile: 'center' },
                }}
              >
                <Button
                  variant={'contained'}
                  sx={{ width: '311px' }}
                  onClick={handleDriftActivation}
                  disabled={
                    !mainDataOnlyOdinORThor ||
                    mainDataOnlyOdinORThor.length === 0
                  }
                >
                  <Typography
                    variant="overline"
                    fontWeight={'700'}
                    lineHeight={'30px'}
                    fontSize={'13px'}
                    textTransform={'initial'}
                  >
                    Confirm selection
                  </Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActivateDriftNodes;
