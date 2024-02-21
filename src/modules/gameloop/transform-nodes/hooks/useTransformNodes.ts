import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useAccount,
  usePrepareContractWrite,
} from 'wagmi';
import {
  tokensMainnet,
  tokensFuji,
  getGamificationContractByChain,
  getDappQueryContractByChain,
  getDriftNodeContractByChain,
  getOGNodeContractByChain,
  getSubgraphUrl4Gameloop,
} from '@/utils/constants';

import { BigNumberish } from 'ethers';
import { useState } from 'react';
import { useDispatch } from '@/redux/store';
import ThorGamificationAbi from '@/../public/abi/ThorGamification.json';
import nftAbi from '@/../public/abi/IERC721Enumerable.json';
import usdceAbi from '@/../public/abi/USDC.e.json';
import ThorNodeDappQueryV2 from '@/../public/abi/ThorNodeDappQueryV2.json';
import { setTxnStatus, STATUS } from '@/redux/slices/transactionSlice';
import { showToast, ToastSeverity } from '@/redux/slices/toastSlice';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { NodeType } from '@/utils/types';
import { getKeycardTokenAddress } from '@/modules/manager/Helper';
import { fetchStakedDriftNodes } from '@/utils/graphqlQueries';
import axios from 'axios';
import { useChain } from '@/utils/web3Utils';

export const TransformType = {
  OdinKey: 'odinKey',
  ThorKey: 'thorKey',
  Drift: 'driftNode',
};

export const useGetAllNodes = () => {
  const { address } = useAccount();
  const chain = useChain();

  return useContractRead({
    address: getDappQueryContractByChain(chain),
    abi: ThorNodeDappQueryV2,
    functionName: 'getNodes',
    args: [address],
    enabled: !!address,
    // watch: true,
  }) as unknown as UseQueryResult<NodeType[], Error>;
};

export function useTransformNode() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const chain = useChain();
  const dispatch = useDispatch();
  const contractAddress = getGamificationContractByChain(chain);

  const burnOGNodes = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contractAddress,
    abi: ThorGamificationAbi,
    functionName: 'burnOGNodes',
  });

  const burnDriftNodes = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contractAddress,
    abi: ThorGamificationAbi,
    functionName: 'burnDriftNodes',
  });

  const convertOGNodesToDriftNodes = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contractAddress,
    abi: ThorGamificationAbi,
    functionName: 'convertOGNodesToDriftNodes',
  });

  const handleUseTransform = async (
    args: [BigNumberish[], BigNumberish[], string]
  ) => {
    setIsLoading(true);
    try {
      dispatch(setTxnStatus(STATUS.PENDING));
      let tx = null;
      if (args[2] === TransformType.OdinKey) {
        console.log('selected transaction', args);
        tx = await burnOGNodes.writeAsync({
          recklesslySetUnpreparedArgs: args.slice(0, 2),
        });
      }
      if (args[2] === TransformType.ThorKey) {
        console.log('selected transaction', args);
        tx = await burnDriftNodes.writeAsync({
          recklesslySetUnpreparedArgs: args.slice(0, 2),
        });
      }
      if (args[2] === TransformType.Drift) {
        console.log('selected transaction', args);
        tx = await convertOGNodesToDriftNodes.writeAsync({
          recklesslySetUnpreparedArgs: args.slice(0, 2),
        });
      }
      await tx.wait();
      setIsSuccess(true);
      dispatch(setTxnStatus(STATUS.SUCCESS));
      dispatch(
        showToast({
          message: 'Nodes Transform successfully!',
          severity: ToastSeverity.SUCCESS,
          itemCount:
            args[0]?.length > 0
              ? args[0]?.length
              : args[1]?.length > 0
              ? args[1]?.length
              : 0,
          image:
            args[0]?.length > 0
              ? '/images/odinOrigin.gif'
              : args[1]?.length > 0
              ? '/images/thorOrigin.gif'
              : '/images/nft-placeholder.png',
        })
      );
    } catch (e) {
      setIsError(true);
      dispatch(setTxnStatus(STATUS.ERROR));
      dispatch(
        showToast({
          message: 'An error occurred while transforming the nodes',
          severity: ToastSeverity.ERROR,
          itemCount:
            args[0]?.length > 0
              ? args[0]?.length
              : args[1]?.length > 0
              ? args[1]?.length
              : 0,
          image:
            args[0]?.length > 0
              ? '/images/odinOrigin.gif'
              : args[1]?.length > 0
              ? '/images/thorOrigin.gif'
              : '/images/nft-placeholder.png',
        })
      );
    }
    setIsLoading(false);
  };

  return {
    transformNodes: handleUseTransform,
    isLoading,
    isSuccess,
    isError,
  };
}

export function useStakeUnstakeDriftNodes() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { chain } = useAccount();
  const dispatch = useDispatch();
  const contractAddress = getGamificationContractByChain(chain);

  const writeTxStakeUnstakeDriftNodes = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contractAddress,
    abi: ThorGamificationAbi,
    functionName: 'stakeUnstakeDriftNodes',
  });

  const stakeUnstakeDriftNodes = async (
    args: [BigNumberish[], BigNumberish[], string]
  ) => {
    setIsLoading(true);

    try {
      dispatch(setTxnStatus(STATUS.PENDING));
      let tx = null;

      tx = await writeTxStakeUnstakeDriftNodes.writeAsync({
        recklesslySetUnpreparedArgs: [
          args[2] === 'THOR'
            ? getDriftNodeContractByChain(chain).THOR
            : getDriftNodeContractByChain(chain).ODIN,
          args[0],
          args[1],
        ],
      });

      await tx.wait();
      setIsSuccess(true);
      dispatch(setTxnStatus(STATUS.SUCCESS));
      dispatch(
        showToast({
          message: 'Activation/deactivation success!',
          severity: ToastSeverity.SUCCESS,
          itemCount:
            args[0]?.length > 0
              ? args[0]?.length
              : args[1]?.length > 0
              ? args[1]?.length
              : 0,
          image:
            args[0]?.length > 0
              ? '/images/odinDrift.gif'
              : args[1]?.length > 0
              ? '/images/thorDrift.gif'
              : '/images/nft-placeholder.png',
        })
      );
    } catch (e) {
      setIsError(true);
      dispatch(setTxnStatus(STATUS.ERROR));
      dispatch(
        showToast({
          message: 'An error occurred while activating/deactivating',
          severity: ToastSeverity.ERROR,
          itemCount:
            args[0]?.length > 0
              ? args[0]?.length
              : args[1]?.length > 0
              ? args[1]?.length
              : 0,
          image:
            args[0]?.length > 0
              ? '/images/odinDrift.gif'
              : args[1]?.length > 0
              ? '/images/thorDrift.gif'
              : '/images/nft-placeholder.png',
        })
      );
    }
    setIsLoading(false);
  };

  return {
    stakeUnstakeDriftNodes,
    isLoading,
    isSuccess,
    isError,
  };
}

export function useGamificationAllowance(nodeType: any) {
  const { chain } = useAccount();
  const gamificationContractAddress = getGamificationContractByChain(chain);
  const { address } = useAccount();
  const nftAddress =
    nodeType === 'Origin Thor'
      ? getOGNodeContractByChain(chain).THOR
      : nodeType === 'Origin Odin'
      ? getOGNodeContractByChain(chain).ODIN
      : nodeType === 'Drift Odin'
      ? getDriftNodeContractByChain(chain).ODIN
      : nodeType === 'Drift Thor'
      ? getDriftNodeContractByChain(chain).THOR
      : '';

  return useContractRead({
    address: nftAddress,
    abi: nftAbi,
    functionName: 'isApprovedForAll',
    args: [address, gamificationContractAddress],
  });
}

export function useApproveGamification(nodeType: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useDispatch();
  const { chain } = useAccount();
  const gamificationContractAddress = getGamificationContractByChain(chain);

  const args = [gamificationContractAddress, true];

  const nftAddress =
    nodeType === 'Origin Thor'
      ? getOGNodeContractByChain(chain).THOR
      : nodeType === 'Origin Odin'
      ? getOGNodeContractByChain(chain).ODIN
      : nodeType === 'Drift Odin'
      ? getDriftNodeContractByChain(chain).ODIN
      : nodeType === 'Drift Thor'
      ? getDriftNodeContractByChain(chain).THOR
      : '';

  const writeBaseConfig = {
    abi: nftAbi,
    functionName: 'setApprovalForAll',
    args,
  };

  const { config } = usePrepareContractWrite({
    ...writeBaseConfig,
    address: nftAddress,
  });

  const approve = useContractWrite(config);

  const handleApproveKeys = async () => {
    setIsLoading(true);
    try {
      dispatch(setTxnStatus(STATUS.PENDING));
      const tx = await approve.writeAsync();
      await tx.wait();
      setIsSuccess(true);
      dispatch(setTxnStatus(STATUS.SUCCESS));
      dispatch(
        showToast({
          message: 'Approved',
          severity: ToastSeverity.SUCCESS,
        })
      );
    } catch (e) {
      setIsError(true);
      dispatch(setTxnStatus(STATUS.ERROR));
      dispatch(
        showToast({
          message: 'An error occured while approving',
          severity: ToastSeverity.ERROR,
        })
      );
    }

    setIsLoading(false);

    // reset state
    setTimeout(() => {
      setIsSuccess(false);
      setIsError(false);
      setIsLoading(false);
    }, 3000);
  };

  return {
    approve: handleApproveKeys,
    isLoading,
    isSuccess,
    isError,
  };
}

export const useGetDriftKeycardCap = (nodeType: any) => {
  const { chain } = useAccount();

  return useContractRead({
    address: getGamificationContractByChain(chain),
    abi: ThorGamificationAbi,
    functionName:
      nodeType === 'Drift Odin'
        ? 'odinDriftCap'
        : nodeType === 'Drift Thor'
        ? 'thorDriftCap'
        : 'ogKeyCardCap',
    args: [],
    enabled: !!nodeType,
  }) as unknown as UseQueryResult<NodeType[], Error>;
};

export const useGetDriftKeycardTotalSupply = (nodeType: any) => {
  const chain = useChain();
  const nftAddress =
    nodeType === 'Drift Odin'
      ? getDriftNodeContractByChain(chain).ODIN
      : nodeType === 'Drift Thor'
      ? getDriftNodeContractByChain(chain).THOR
      : getKeycardTokenAddress(chain.id);

  return useContractRead({
    address: nftAddress,
    abi: nftAbi,
    functionName: 'totalSupply',
    args: [],
    enabled: !!nftAddress,
  }) as unknown as UseQueryResult<NodeType[], Error>;
};

export const useGetDriftStakers = (allNodes: any) => {
  const chain = useChain();
  const contractAddress = getGamificationContractByChain(chain);

  let contracts;

  if (allNodes && allNodes.length > 0) {
    contracts = allNodes.map((each: any) => ({
      address: contractAddress,
      abi: ThorGamificationAbi,
      functionName: 'getStaker',
      args: [
        each.tier === 'ODIN'
          ? getDriftNodeContractByChain(chain).ODIN
          : getDriftNodeContractByChain(chain).THOR,
        each.tokenId,
      ],
      cacheTime: 60_000,
    }));
  } else {
    contracts = [];
  }

  return useContractReads({
    contracts,
  });
};

export const useGetStakedDriftNodes = (ownerAddress: string) => {
  const chain = useChain();
  const subgraphUrl = getSubgraphUrl4Gameloop(chain?.id);
  const stakedDriftsQuery = fetchStakedDriftNodes(ownerAddress);

  function getStakedDriftNodes() {
    return axios({
      url: subgraphUrl,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: {
        query: stakedDriftsQuery,
      },
    });
  }

  return useQuery(
    ['getStakedDriftNodes', chain, ownerAddress],
    getStakedDriftNodes,
    {
      refetchInterval: 30_000,
      enabled: !!ownerAddress,
    }
  );
};

export const useGetStakedDriftNodesByTokenIds = (
  args: [BigNumberish[], BigNumberish[]]
) => {
  const chain = useChain();

  return useContractRead({
    address: getDappQueryContractByChain(chain),
    abi: ThorNodeDappQueryV2,
    functionName: 'getDriftsByIds',
    args,
  }) as unknown as UseQueryResult<any[], Error>;
};

export const useGetUSDCeApproval = (ownerAddress: string) => {
  const chain = useChain();
  const contractAddress = getGamificationContractByChain(chain);
  const tokens = chain.id === 43113 ? tokensFuji : tokensMainnet;

  return useContractRead({
    address: tokens.USDCE,
    abi: usdceAbi,
    functionName: 'allowance',
    args: [ownerAddress, contractAddress],
    watch: true,
    cacheTime: 60_000,
    enabled: Boolean(contractAddress && ownerAddress),
  });
};

export const useSetApprovalUSDCe = () => {
  const chain = useChain();
  const tokens = chain.id === 43113 ? tokensFuji : tokensMainnet;

  return useContractWrite({
    address: tokens.USDCE,
    abi: usdceAbi,
    functionName: 'approve',
    mode: 'recklesslyUnprepared',
  });
};
