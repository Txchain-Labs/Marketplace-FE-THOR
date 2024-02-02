import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useNetwork,
} from 'wagmi';
import { getGamificationContractByChain, thorfiNfts } from '@/utils/constants';
import ThorCapsuleNFTAbi from '@/../public/abi/ThorCapsuleNFT.json';
import { BigNumber, BigNumberish } from 'ethers';
import { CapsuleItem, GamificationItem } from '../types';
import { useState } from 'react';
import { useDispatch } from '@/redux/store';
import ThorGamificationAbi from '@/../public/abi/ThorGamification.json';
import { setTxnStatus, STATUS } from '@/redux/slices/transactionSlice';
import { showToast, ToastSeverity } from '@/redux/slices/toastSlice';

export function useCreateCapsules() {
  // For some reason, wagmi useContractWrite hook doesn't wait for the tx to be completed and the following
  // properties (isLoading, isError, isSuccess) are immediately mutated, so we can't rely on it
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { chain } = useNetwork();
  const dispatch = useDispatch();
  const contractAddress = getGamificationContractByChain(chain);

  const createCapsules = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contractAddress,
    abi: ThorGamificationAbi,
    functionName: 'createCapsules',
  });

  const handleCreateCapsules = async (
    args: [BigNumberish[], BigNumberish[]]
  ) => {
    setIsLoading(true);
    let tx;
    try {
      dispatch(setTxnStatus(STATUS.PENDING));
      tx = await createCapsules.writeAsync({
        recklesslySetUnpreparedArgs: args,
      });
      await tx.wait();
      setIsSuccess(true);
      const itemCount = args[0].length;
      dispatch(
        showToast({
          message: itemCount > 1 ? 'Capsules created !' : 'Capsule created !',
          severity: ToastSeverity.SUCCESS,
          itemCount: itemCount > 1 ? itemCount : undefined,
        })
      );
      dispatch(setTxnStatus(STATUS.SUCCESS));
    } catch (e) {
      setIsError(true);
      dispatch(
        showToast({
          message: 'An error occured while creating the capsule',
          severity: ToastSeverity.ERROR,
        })
      );
      dispatch(setTxnStatus(STATUS.ERROR));
    }

    setIsLoading(false);

    return tx?.wait();
  };

  return {
    createCapsules: handleCreateCapsules,
    isLoading,
    isSuccess,
    isError,
  };
}

export function useGetCapsule(capsuleTokenId: BigNumber) {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const baseContractRead = {
    address: thorfiNfts('capsules', chain)[0].contract,
    abi: ThorCapsuleNFTAbi,
  };

  return useContractRead({
    ...baseContractRead,
    functionName: 'isOriginCapsule',
    args: [capsuleTokenId],
    select: (isOriginCapsule): GamificationItem<CapsuleItem> => ({
      contractAddress: baseContractRead.address,
      id: capsuleTokenId,
      type: 'capsules',
      isOriginCapsule: isOriginCapsule as boolean,
      isDriftCapsule: !(isOriginCapsule as boolean),
      isOrigin: isOriginCapsule as boolean,
    }),
    enabled: !!address && capsuleTokenId.gt(0),
  });
}

export function useGetCapsules() {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const baseContractRead = {
    address: thorfiNfts('capsules', chain)[0].contract,
    abi: ThorCapsuleNFTAbi,
    args: [address],
    enabled: !!address,
    watch: true,
  };

  const { data: userBalance }: { data: BigNumber[] } = useContractRead({
    ...baseContractRead,
    functionName: 'balanceOf',
  });

  const { data: userTokenIds }: { data: BigNumber[] } = useContractReads({
    contracts: Array.from({ length: +userBalance || 0 }).map((_, i) => ({
      ...baseContractRead,
      functionName: 'tokenOfOwnerByIndex',
      args: [address, i],
    })),
  });

  return useContractReads({
    contracts: userTokenIds?.map((tokenId) => ({
      ...baseContractRead,
      functionName: 'isOriginCapsule',
      args: [tokenId],
    })),
    select: (data): GamificationItem<CapsuleItem>[] => {
      return data.map((isOriginCapsule, i) => ({
        contractAddress: baseContractRead.address,
        id: userTokenIds[i],
        type: 'capsules',
        isOriginCapsule: isOriginCapsule as boolean,
        isDriftCapsule: !isOriginCapsule as boolean,
        isOrigin: isOriginCapsule as boolean,
      }));
    },
    enabled: !!userTokenIds,
  });
}

export function useOpenCapsules() {
  // For some reason, wagmi useContractWrite hook doesn't wait for the tx to be completed and the following
  // properties (isLoading, isError, isSuccess) are immediately mutated, so we can't rely on it
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { chain } = useNetwork();
  const dispatch = useDispatch();
  const contractAddress = thorfiNfts('capsules', chain)[0].contract;

  const openCapsules = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contractAddress,
    abi: ThorCapsuleNFTAbi,
    functionName: 'openCapsules',
  });

  const handleOpenCapsules = async (args: BigNumberish[]) => {
    setIsLoading(true);
    try {
      dispatch(setTxnStatus(STATUS.PENDING));
      const tx = await openCapsules.writeAsync({
        recklesslySetUnpreparedArgs: [args],
      });
      await tx.wait();
      setIsSuccess(true);
      dispatch(
        showToast({
          message: 'Capsules opened !',
          severity: ToastSeverity.SUCCESS,
          itemCount: args.length,
        })
      );
      dispatch(setTxnStatus(STATUS.SUCCESS));
    } catch (e) {
      setIsError(true);
      dispatch(
        showToast({
          message: 'An error occurred while opening the capsule',
          severity: ToastSeverity.ERROR,
        })
      );
      dispatch(setTxnStatus(STATUS.ERROR));
    }

    setIsLoading(false);
  };

  return {
    openCapsules: handleOpenCapsules,
    isLoading,
    isSuccess,
    isError,
  };
}
